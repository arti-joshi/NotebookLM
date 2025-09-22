/**
 * Enhanced RAG Service with Hybrid Search and Query Expansion
 */

import { PrismaClient } from '../../generated/prisma';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { generateQueryVariants, extractWeightedKeywords } from './searchUtils';

interface RetrievalResult {
  chunk: string;
  source: string;
  chunkIndex?: number | null;
  score: number;
  method: 'vector' | 'keyword' | 'hybrid' | 'context';
}

interface RAGConfig {
  maxResults: number;
  similarityThreshold: number;
  enableKeywordSearch: boolean;
  enableQueryExpansion: boolean;
  enableHybridSearch: boolean;
  includeSourceContext: boolean;
  contextWindowSize: number;
}

export interface RAGServiceConfig extends Partial<RAGConfig> {
  apiKey?: string;
}

export class RAGService {
  private prisma: PrismaClient;
  private embeddings: GoogleGenerativeAIEmbeddings | null = null;
  private config: Required<RAGConfig>;

  constructor(prisma: PrismaClient, config: RAGServiceConfig = {}) {
    this.prisma = prisma;
    this.config = {
      maxResults: config.maxResults ?? 5,
      similarityThreshold: config.similarityThreshold ?? 0.35,
      enableKeywordSearch: config.enableKeywordSearch ?? true,
      enableQueryExpansion: config.enableQueryExpansion ?? true,
      enableHybridSearch: config.enableHybridSearch ?? true,
      includeSourceContext: config.includeSourceContext ?? true,
      contextWindowSize: config.contextWindowSize ?? 2
    };

    if (config.apiKey) {
      this.embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: config.apiKey,
        modelName: "embedding-001"
      });
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const minLen = Math.min(a.length, b.length);
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < minLen; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private async vectorSearch(query: string, userId: string): Promise<RetrievalResult[]> {
    if (!this.embeddings) {
      return [];
    }

    try {
      const queryEmbedding = await this.embeddings.embedQuery(query);
      
      const embeddings = await this.prisma.embedding.findMany({
        where: { userId }
      });

      const results = embeddings
        .map(doc => ({
          chunk: doc.chunk,
          source: doc.source || '',
          chunkIndex: doc.chunkIndex,
          score: this.cosineSimilarity(queryEmbedding, doc.embedding as number[]),
          method: 'vector' as const
        }))
        .filter(result => result.score >= this.config.similarityThreshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, this.config.maxResults);

      return results;
    } catch (error) {
      console.warn('Vector search failed:', error);
      return [];
    }
  }

  private async keywordSearch(keywords: string[], userId: string): Promise<RetrievalResult[]> {
    const searchResults = await this.prisma.embedding.findMany({
      where: {
        userId,
        OR: keywords.map(keyword => ({
          chunk: { contains: keyword, mode: 'insensitive' }
        }))
      }
    });

    return searchResults.map(doc => ({
      chunk: doc.chunk,
      source: doc.source || '',
      chunkIndex: doc.chunkIndex,
      score: 0.5,
      method: 'keyword' as const
    }));
  }

  async retrieveContext(query: string, userId: string): Promise<{
    results: RetrievalResult[];
    context: string;
    debug: {
      originalQuery: string;
      expandedQueries: string[];
      keywords: string[];
      vectorResults: number;
      keywordResults: number;
      totalResults: number;
    };
  }> {
    const allResults: RetrievalResult[] = [];
    
    const expandedQueries = this.config.enableQueryExpansion 
      ? await generateQueryVariants(query)
      : [{text: query, weight: 1.0}];
    
    const keywordMap = await extractWeightedKeywords(query);
    const keywords = Array.from(keywordMap.keys());

    let vectorResultCount = 0;
    let keywordResultCount = 0;

    if (this.embeddings) {
      for (const {text, weight} of expandedQueries) {
        const vectorResults = await this.vectorSearch(text, userId);
        vectorResults.forEach(r => r.score *= weight);
        allResults.push(...vectorResults);
        vectorResultCount += vectorResults.length;
      }
    }

    if (this.config.enableKeywordSearch) {
      const keywordResults = await this.keywordSearch(keywords, userId);
      allResults.push(...keywordResults);
      keywordResultCount = keywordResults.length;
    }

    // Combine and deduplicate results
    const resultMap = new Map<string, RetrievalResult>();
    
    for (const result of allResults) {
      const key = `${result.source}-${result.chunkIndex}`;
      if (!resultMap.has(key) || resultMap.get(key)!.score < result.score) {
        resultMap.set(key, result);
      }
    }
    
    const finalResults = Array.from(resultMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, this.config.maxResults);

    const context = finalResults
      .map(r => `[${r.source}]\n${r.chunk}`)
      .join('\n\n');

    return {
      results: finalResults,
      context,
      debug: {
        originalQuery: query,
        expandedQueries: expandedQueries.map(q => q.text),
        keywords,
        vectorResults: vectorResultCount,
        keywordResults: keywordResultCount,
        totalResults: finalResults.length
      }
    };
  }
}
