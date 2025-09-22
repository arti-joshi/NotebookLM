/**
 * Enhanced RAG Service with Query Expansion and Smart Retrieval
 */

import { PrismaClient } from '../../generated/prisma';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { generateQueryVariants, extractWeightedKeywords, combineSearchResults } from './searchUtils';

interface RetrievalResult {
  chunk: string;
  source: string;
  chunkIndex?: number | null;
  score: number;
  method: 'vector' | 'keyword' | 'hybrid' | 'context';
  matches?: {
    dates?: string[];
    locations?: string[];
    names?: string[];
    keywords?: string[];
  };
}

interface RAGConfig {
  maxResults: number;
  similarityThreshold: number;
  minKeywordScore: number;
  contextWindow: number;
  hybridWeights: {
    vector: number;
    keyword: number;
    context: number;
  };
}

export class EnhancedRAGService {
  private config: RAGConfig;
  private embeddings: GoogleGenerativeAIEmbeddings;

  constructor(
    private prisma: PrismaClient,
    config: Partial<RAGConfig> = {}
  ) {
    this.config = {
      maxResults: 10, // Maximum number of results to return
      similarityThreshold: 0.35, // Balanced threshold for relevance
      minKeywordScore: 0.3,
      contextWindow: 2,
      hybridWeights: {
        vector: 0.6,
        keyword: 0.3,
        context: 0.1
      },
      ...config
    };

    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY!,
      modelName: 'text-embedding-004'
    });
  }

  /**
   * Main retrieval method combining multiple strategies
   */
  async search(query: string, userId: string): Promise<RetrievalResult[]> {
    const variants = generateQueryVariants(query);
    const keywords = extractWeightedKeywords(query);
    
    const results = await Promise.all([
      // Vector search with query variants
      ...variants.map(variant => 
        this.vectorSearch(variant.text, userId, variant.weight)
      ),
      
      // Keyword search
      this.keywordSearch(keywords, userId),
      
      // Hybrid search combining both
      this.hybridSearch(query, userId)
    ]);

    // Flatten and combine results
    const allResults = results.flat();
    
    // Smart deduplication and ranking
    const finalResults = this.rankAndDeduplicate(allResults);
    
    // Add context chunks
    return this.addContextualChunks(finalResults, userId);
  }

  /**
   * Vector similarity search with improved scoring
   */
  private async vectorSearch(
    query: string,
    userId: string,
    weight: number
  ): Promise<RetrievalResult[]> {
    try {
      const queryEmb = await this.embeddings.embedQuery(query);
      const vec = `[${queryEmb.join(',')}]`;

      const results = await this.prisma.$queryRaw<Array<{
        chunk: string;
        source: string;
        chunkIndex: number;
        distance: number;
      }>>`
        SELECT 
          chunk, 
          source, 
          "chunkIndex",
          embedding_vec <=> ${vec}::vector as distance
        FROM "Embedding"
        WHERE 
          "userId" = ${userId}
          AND (embedding_vec <=> ${vec}::vector) < ${1 - (this.config.similarityThreshold * weight)}
        ORDER BY distance ASC
        LIMIT ${this.config.maxResults * 2}
      `;

      return results.map(r => ({
        chunk: r.chunk,
        source: r.source,
        chunkIndex: r.chunkIndex,
        score: (1 - r.distance) * weight,
        method: 'vector'
      }));
    } catch (error) {
      console.error('Vector search failed:', error);
      return [];
    }
  }

  /**
   * Keyword-based search with PostgreSQL full-text search
   */
  private async keywordSearch(
    keywords: Map<string, number>,
    userId: string
  ): Promise<RetrievalResult[]> {
    try {
      const keywordQueries = Array.from(keywords.entries())
        .map(([keyword, weight]) => ({
          query: keyword,
          weight
        }));

      const results = await this.prisma.$queryRaw<Array<{
        chunk: string;
        source: string;
        chunkIndex: number;
        rank: number;
      }>>`
        WITH RankedResults AS (
          SELECT 
            chunk,
            source,
            "chunkIndex",
            ts_rank(
              to_tsvector('english', chunk),
              to_tsquery('english', ${keywordQueries.map(k => k.query).join(' | ')})
            ) as rank
          FROM "Embedding"
          WHERE 
            "userId" = ${userId}
            AND to_tsvector('english', chunk) @@ to_tsquery('english', ${keywordQueries.map(k => k.query).join(' | ')})
        )
        SELECT * FROM RankedResults
        WHERE rank >= ${this.config.minKeywordScore}
        ORDER BY rank DESC
        LIMIT ${this.config.maxResults * 2}
      `;

      return results.map(r => ({
        chunk: r.chunk,
        source: r.source,
        chunkIndex: r.chunkIndex,
        score: r.rank,
        method: 'keyword'
      }));
    } catch (error) {
      console.error('Keyword search failed:', error);
      return [];
    }
  }

  /**
   * Hybrid search combining vector and keyword approaches
   */
  private async hybridSearch(
    query: string,
    userId: string
  ): Promise<RetrievalResult[]> {
    try {
      const queryEmb = await this.embeddings.embedQuery(query);
      const vec = `[${queryEmb.join(',')}]`;

      const results = await this.prisma.$queryRaw<Array<{
        chunk: string;
        source: string;
        chunkIndex: number;
        vector_score: number;
        text_score: number;
      }>>`
        SELECT 
          chunk,
          source,
          "chunkIndex",
          1 - (embedding_vec <=> ${vec}::vector) as vector_score,
          ts_rank(
            to_tsvector('english', chunk),
            plainto_tsquery('english', ${query})
          ) as text_score
        FROM "Embedding"
        WHERE "userId" = ${userId}
        ORDER BY 
          (1 - (embedding_vec <=> ${vec}::vector)) * ${this.config.hybridWeights.vector} +
          COALESCE(
            ts_rank(
              to_tsvector('english', chunk),
              plainto_tsquery('english', ${query})
            ),
            0
          ) * ${this.config.hybridWeights.keyword}
        DESC
        LIMIT ${this.config.maxResults}
      `;

      return results.map(r => ({
        chunk: r.chunk,
        source: r.source,
        chunkIndex: r.chunkIndex,
        score: (
          r.vector_score * this.config.hybridWeights.vector +
          r.text_score * this.config.hybridWeights.keyword
        ),
        method: 'hybrid'
      }));
    } catch (error) {
      console.error('Hybrid search failed:', error);
      return [];
    }
  }

  /**
   * Smart ranking and deduplication of results
   */
  private rankAndDeduplicate(results: RetrievalResult[]): RetrievalResult[] {
    return combineSearchResults(
      results,
      (result) => result.score,
      (result) => `${result.source}-${result.chunkIndex}`
    );
  }

  /**
   * Add surrounding chunks for better context
   */
  private async addContextualChunks(
    results: RetrievalResult[],
    userId: string
  ): Promise<RetrievalResult[]> {
    const contextChunks = new Set<string>();
    const finalResults: RetrievalResult[] = [...results];

    for (const result of results) {
      if (result.chunkIndex === null) continue;

      // Get surrounding chunks
      const surroundingChunks = await this.prisma.embedding.findMany({
        where: {
          userId,
          source: result.source,
          chunkIndex: {
            gte: Math.max(0, result.chunkIndex - this.config.contextWindow),
            lte: result.chunkIndex + this.config.contextWindow
          }
        },
        orderBy: { chunkIndex: 'asc' }
      });

      // Add non-duplicate context chunks
      for (const chunk of surroundingChunks) {
        const key = `${chunk.source}-${chunk.chunkIndex}`;
        if (!contextChunks.has(key) && !results.some(r => 
          r.source === chunk.source && r.chunkIndex === chunk.chunkIndex
        )) {
          contextChunks.add(key);
          finalResults.push({
            chunk: chunk.chunk,
            source: chunk.source,
            chunkIndex: chunk.chunkIndex,
            score: 0.3, // Lower score for context chunks
            method: 'context'
          });
        }
      }
    }

    return finalResults.sort((a, b) => {
      // First by source
      if (a.source !== b.source) {
        return a.source.localeCompare(b.source);
      }
      // Then by chunk index within same source
      return (a.chunkIndex ?? 0) - (b.chunkIndex ?? 0);
    });
  }
}
