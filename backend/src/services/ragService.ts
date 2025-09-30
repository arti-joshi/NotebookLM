/**
 * Enhanced RAG Service with Hybrid Search and Query Expansion
 */

import { PrismaClient } from '../../generated/prisma';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { generateQueryVariants, extractWeightedKeywords } from './searchUtils';
import { getEmbedding } from './embeddingService';
import { config } from '../config/index.js';

interface RetrievalResult {
  chunk: string;
  source: string;
  chunkIndex?: number | null;
  score: number;
  method: 'vector' | 'keyword' | 'hybrid' | 'context';
  metadata?: {
    pageNumber?: number;
    loc?: {
      pageNumber?: number;
    };
  };
  // Reranking fields
  rerankScore?: number;
  keywordDensity?: number;
  exactMatchBoost?: number;
  positionScore?: number;
  sectionScore?: number;
  finalScore?: number;
  preview?: string;
  isTOC?: boolean;
  isNarrative?: boolean;
}

interface RAGConfig {
  maxResults: number;
  similarityThreshold: number;
  enableKeywordSearch: boolean;
  enableQueryExpansion: boolean;
  enableHybridSearch: boolean;
  includeSourceContext: boolean;
  contextWindowSize: number;
  tocPenalty: number;
  narrativeBoost: number;
  debugRetrieval: boolean;
  // Reranking and boosting parameters
  enableReranking: boolean;
  keywordDensityWeight: number;
  positionWeight: number;
  sectionImportanceWeight: number;
  recencyBoost: number;
  exactMatchBoost: number;
}

export interface RAGServiceConfig extends Partial<RAGConfig> {
  apiKey?: string;
}

export class RAGService {
  private prisma: PrismaClient;
  private embeddings: GoogleGenerativeAIEmbeddings | null = null;
  private config: Required<RAGConfig>;
  private hasLoggedPageWarning = false;  // Track if we've warned about missing page numbers

  /**
   * Normalize query expansion weights to avoid over-penalizing good matches
   * Maps input weights to a range of [0.8, 1.2]
   */
  private normalizeWeight(weight: number): number {
    const MIN_WEIGHT = 0.8;
    const MAX_WEIGHT = 1.2;
    // Map weight (typically 0.1-1.0) to our desired range
    return MIN_WEIGHT + (MAX_WEIGHT - MIN_WEIGHT) * (Math.max(0.1, Math.min(1, weight)) - 0.1) / 0.9;
  }

  /**
   * Detect if a chunk looks like a Table of Contents entry
   */
  private isTOCChunk(text: string): boolean {
    if (!text) return false;
    
    // dotted leader OR short heading with trailing page number OR a lot of dots
    const dots = /\.{3,}/;
    const trailingPage = /\.{2,}\s*\d{1,4}$/;
    if (dots.test(text) || trailingPage.test(text)) return true;
    
    // Short text ending with page number
    if (text.trim().split(/\s+/).length < 20 && /[0-9]{1,4}$/.test(text.trim())) return true;
    
    return false;
  }

  /**
   * Detect if a chunk contains narrative content
   */
  private isNarrativeChunk(text: string): boolean {
    if (!text) return false;
    
    const wordCount = text.trim().split(/\s+/).length;
    const hasSentence = /\.\s+/.test(text) || /[.!?]$/.test(text.trim());
    
    return wordCount >= 40 && hasSentence;
  }

  /**
   * Calculate keyword density score for reranking
   */
  private calculateKeywordDensity(chunk: string, query: string): number {
    if (!chunk || !query) return 0;
    
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const chunkWords = chunk.toLowerCase().split(/\s+/);
    const chunkWordCount = chunkWords.length;
    
    if (chunkWordCount === 0) return 0;
    
    let keywordMatches = 0;
    queryWords.forEach(keyword => {
      chunkWords.forEach(chunkWord => {
        if (chunkWord.includes(keyword) || keyword.includes(chunkWord)) {
          keywordMatches++;
        }
      });
    });
    
    return keywordMatches / chunkWordCount;
  }

  /**
   * Calculate exact match boost
   */
  private calculateExactMatchBoost(chunk: string, query: string): number {
    if (!chunk || !query) return 0;
    
    const queryLower = query.toLowerCase();
    const chunkLower = chunk.toLowerCase();
    
    // Check for exact phrase match
    if (chunkLower.includes(queryLower)) {
      return this.config.exactMatchBoost;
    }
    
    // Check for individual word matches
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
    let exactMatches = 0;
    
    queryWords.forEach(word => {
      if (chunkLower.includes(word)) {
        exactMatches++;
      }
    });
    
    return (exactMatches / queryWords.length) * (this.config.exactMatchBoost * 0.5);
  }

  /**
   * Calculate position-based score (later chunks get slight boost)
   */
  private calculatePositionScore(chunkIndex: number | null, totalChunks: number): number {
    if (chunkIndex === null || totalChunks === 0) return 0;
    
    // Normalize position (0 = first chunk, 1 = last chunk)
    const normalizedPosition = chunkIndex / Math.max(totalChunks - 1, 1);
    
    // Slight boost for later chunks (assumes more recent/relevant content)
    return normalizedPosition * this.config.recencyBoost;
  }

  /**
   * Calculate section importance score based on metadata
   */
  private calculateSectionImportance(result: RetrievalResult): number {
    let score = 0;
    
    // Boost for specific section types if metadata available
    if (result.metadata) {
      const section = (result.metadata as any).section;
      if (section) {
        const sectionLower = section.toLowerCase();
        
        // Important sections get higher scores
        if (sectionLower.includes('introduction') || sectionLower.includes('overview')) {
          score += this.config.sectionImportanceWeight * 1.5;
        } else if (sectionLower.includes('features') || sectionLower.includes('capabilities')) {
          score += this.config.sectionImportanceWeight * 2.0;
        } else if (sectionLower.includes('examples') || sectionLower.includes('tutorial')) {
          score += this.config.sectionImportanceWeight * 1.2;
        } else {
          score += this.config.sectionImportanceWeight * 0.5;
        }
      }
    }
    
    return score;
  }

  /**
   * Apply comprehensive reranking with multiple scoring factors
   */
  private applyReranking(results: RetrievalResult[], query: string, totalChunks: number): RetrievalResult[] {
    if (!this.config.enableReranking) {
      return results;
    }
    // Lightweight query intent classification
    const q = query.toLowerCase();
    const intent = {
      howTo: /(how\s+to|example|syntax|code)/.test(q),
      warning: /(warning|caution|deprecated|permission|privilege|access)/.test(q),
      performance: /(performance|optimi[sz]e|faster|speed)/.test(q),
      definition: /(what\s+is|define|explain)/.test(q)
    };

    // Extract keywords from query for overlap with chunk metadata
    const weightedKeywords = extractWeightedKeywords(query);
    const querySqlTerms = new Set(
      Array.from(weightedKeywords.keys()).map(k => k.toLowerCase())
    );

    return results.map(result => {
      let rerankScore = result.score || 0;

      // 1) Keyword density
      const keywordDensity = this.calculateKeywordDensity(result.chunk, query);
      rerankScore += keywordDensity * this.config.keywordDensityWeight;

      // 2) Exact match boost
      const exactMatchBoost = this.calculateExactMatchBoost(result.chunk, query);
      rerankScore += exactMatchBoost;

      // 3) Position
      const positionScore = this.calculatePositionScore(result.chunkIndex, totalChunks);
      rerankScore += positionScore * (this.config.positionWeight ?? 0);

      // 4) Section importance
      const sectionScore = this.calculateSectionImportance(result);
      rerankScore += sectionScore;

      // 5) Content-type & intent mapped boosts
      const cfg: any = result.metadata || {};
      const contentType = (cfg?.contentType || '').toString();
      let contentTypeBoost = 0;
      if (intent.howTo && contentType === 'sql_example') contentTypeBoost += 0.15;
      if (intent.definition && contentType === 'text') contentTypeBoost += 0.06;
      if (intent.warning && contentType === 'warning') contentTypeBoost += 0.10;
      if (intent.performance && contentType === 'table') contentTypeBoost += 0.08; // catalog/tables often relevant
      rerankScore += contentTypeBoost;

      // 6) SQL keyword overlap boost
      let sqlOverlapBoost = 0;
      const sqlKeywords: string[] | undefined = cfg?.sqlKeywords;
      if (Array.isArray(sqlKeywords) && sqlKeywords.length) {
        const overlap = sqlKeywords.reduce((acc, k) => acc + (querySqlTerms.has(k.toLowerCase()) ? 1 : 0), 0);
        if (overlap > 0) sqlOverlapBoost += Math.min(0.15, 0.05 * overlap); // up to +0.15
      }
      rerankScore += sqlOverlapBoost;

      // 7) Function and command matches
      let functionBoost = 0;
      const fnName: string | undefined = cfg?.functionName;
      if (fnName) {
        if (q.includes(`${fnName.toLowerCase()}(`)) functionBoost += 0.2;
        else if (q.includes(fnName.toLowerCase())) functionBoost += 0.1;
      }
      const cmd: string | undefined = cfg?.commandType;
      if (cmd && q.includes(cmd.toLowerCase())) functionBoost += 0.15;
      rerankScore += functionBoost;

      // 8) Method diversity multiplier (hybrid gets a small lift)
      const diversityMultiplier = result.method === 'hybrid' ? 1.1 : 1.0;
      rerankScore *= diversityMultiplier;

      return {
        ...result,
        rerankScore: Math.max(0, rerankScore),
        keywordDensity,
        exactMatchBoost,
        positionScore,
        sectionScore,
        // Expose diagnostics
        contentTypeBoost,
        sqlOverlapBoost,
        functionBoost
      };
    }).sort((a, b) => (b.rerankScore || 0) - (a.rerankScore || 0));
  }

  constructor(prisma: PrismaClient, serviceConfig: RAGServiceConfig = {}) {
    this.prisma = prisma;
    this.config = {
      maxResults: serviceConfig.maxResults ?? config.retrieval.maxResults,
      similarityThreshold: serviceConfig.similarityThreshold ?? config.retrieval.similarityThreshold,
      enableKeywordSearch: serviceConfig.enableKeywordSearch ?? true,
      enableQueryExpansion: serviceConfig.enableQueryExpansion ?? true,
      enableHybridSearch: serviceConfig.enableHybridSearch ?? true,
      includeSourceContext: serviceConfig.includeSourceContext ?? true,
      contextWindowSize: serviceConfig.contextWindowSize ?? 2,
      tocPenalty: serviceConfig.tocPenalty ?? 0.05,
      narrativeBoost: serviceConfig.narrativeBoost ?? 0.05,
      debugRetrieval: serviceConfig.debugRetrieval ?? false,
      // Reranking and boosting defaults
      enableReranking: serviceConfig.enableReranking ?? config.retrieval.rerankingEnabled,
      keywordDensityWeight: serviceConfig.keywordDensityWeight ?? 0.1,
      positionWeight: serviceConfig.positionWeight ?? 0.05,
      sectionImportanceWeight: serviceConfig.sectionImportanceWeight ?? 0.08,
      recencyBoost: serviceConfig.recencyBoost ?? 0.03,
      exactMatchBoost: serviceConfig.exactMatchBoost ?? 0.15
    };

    if (serviceConfig.apiKey) {
      this.embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: serviceConfig.apiKey,
        modelName: "text-embedding-004"  // Match model used in other services
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
    let queryEmbedding: number[];
    try {
      queryEmbedding = await getEmbedding(query);
      if (!queryEmbedding || !Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
        console.warn('[RAGService] Skipping vector search: embedding is empty or invalid.');
        return [];
      }
    } catch (embedErr) {
      console.error('[RAGService] Query embedding failed:', embedErr);
      return [];
    }
    const vec = `[${queryEmbedding.join(',')}]`;

    try {
      // Use pgvector's cosine similarity operator (<=>)
      const results = await this.prisma.$queryRaw<Array<{
        id: string;
        chunk: string;
        source: string;
        chunkIndex: number;
        pageStart: number | null;
        chunkingConfig: any;
        distance: number;
      }>>`
        SELECT 
          e.id,
          e.chunk,
          e.source,
          e."chunkIndex",
          e."pageStart",
          e."chunkingConfig",
          e.embedding_vec <=> ${vec}::vector as distance
        FROM "Embedding" e
        LEFT JOIN "Document" d ON d.id = e."documentId"
        WHERE 
          (e."userId" = ${userId} OR d."isSystemDocument" = true)
          AND (e.embedding_vec <=> ${vec}::vector) < ${1 - this.config.similarityThreshold}
        ORDER BY distance ASC
        LIMIT ${this.config.maxResults}
      `;

      return results.map(r => ({
        chunk: r.chunk,
        source: r.source || '',
        chunkIndex: r.chunkIndex,
        pageNumber: r.pageStart ?? undefined,
        metadata: r.chunkingConfig,
        score: 1 - r.distance,  // Convert distance to similarity score
        method: 'vector' as const
      }));
    } catch (error) {
      console.warn('Vector search failed:', error);
      return [];
    }
  }

  // Cosine similarity calculation moved to SQL using pgvector

  private async keywordSearch(keywords: string[], userId: string): Promise<RetrievalResult[]> {
    const searchResults = await this.prisma.embedding.findMany({
      where: {
        OR: [
          { userId },
          { document: { isSystemDocument: true } }
        ],
        OR: keywords.map(keyword => ({
          chunk: { contains: keyword, mode: 'insensitive' }
        }))
      },
      select: {
        chunk: true,
        source: true,
        chunkIndex: true,
        pageStart: true,
        chunkingConfig: true
      }
    });

    return searchResults.map(doc => ({
      chunk: doc.chunk,
      source: doc.source || '',
      chunkIndex: doc.chunkIndex,
      pageNumber: doc.pageStart ?? undefined,
      metadata: doc.chunkingConfig as any,
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
      sourceCounts: Record<string, number>;
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

      // Always run vector search (uses fallback embedding internally)
      for (const {text, weight} of expandedQueries) {
        const vectorResults = await this.vectorSearch(text, userId);
        // Apply normalized weights to avoid over-penalizing
        vectorResults.forEach(r => r.score *= this.normalizeWeight(weight));
        allResults.push(...vectorResults);
        vectorResultCount += vectorResults.length;
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
    
    const dedupedResults = Array.from(resultMap.values());
    
    // Get total chunks count for position scoring
    const totalChunks = Math.max(...dedupedResults.map(r => r.chunkIndex || 0));
    
    // Apply comprehensive reranking first
    const rerankedResults = this.applyReranking(dedupedResults, query, totalChunks);
    
    // Apply finalScore adjustments with TOC penalty and narrative boost
    const adjustedResults = rerankedResults.map(r => {
      const preview = (r.chunk || '').slice(0, 200).replace(/\s+/g, ' ');
      const tocFlag = this.isTOCChunk(r.chunk);
      const narrativeFlag = this.isNarrativeChunk(r.chunk);
      const penalty = tocFlag ? this.config.tocPenalty : 0;
      const boost = narrativeFlag ? this.config.narrativeBoost : 0;
      
      // Use rerankScore if available, otherwise use original score
      const baseScore = r.rerankScore ?? r.score ?? 0;
      const finalScore = Math.max(0, baseScore + boost - penalty);
      
      return {
        ...r,
        finalScore,
        preview,
        isTOC: tocFlag,
        isNarrative: narrativeFlag
      };
    });
    
    // Sort by finalScore descending
    adjustedResults.sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));

    // Per-source cap to diversify results (dynamically derived from maxResults)
    const maxPerSource = Math.ceil(this.config.maxResults * 0.75); // Allow 75% of maxResults per source
    const perSourceCount = new Map<string, number>();
    const diversified: RetrievalResult[] = [];
    for (const r of adjustedResults) {
      const src = r.source || 'unknown';
      const n = perSourceCount.get(src) || 0;
      if (n < maxPerSource) {
        diversified.push(r);
        perSourceCount.set(src, n + 1);
      }
    }
    
    // Debug logging for diversification
    if (this.config.debugRetrieval) {
      console.log(`🔄 Diversification: maxPerSource=${maxPerSource}, totalCandidates=${adjustedResults.length}, diversified=${diversified.length}`);
      console.log(`📊 Per-source counts:`, Object.fromEntries(perSourceCount));
    }
    
    // Debug logging
    if (this.config.debugRetrieval) {
      console.log('🔍 Retrieval debug for query:', query);
      console.log('🎯 Reranking enabled:', this.config.enableReranking);
      console.table(adjustedResults.slice(0, Math.min(15, adjustedResults.length)).map(r => ({
        source: r.source,
        pageNumber: (r as any).pageNumber ?? 'n/a',
        chunkIndex: r.chunkIndex ?? 'n/a',
        score: (r.score ?? 0).toFixed(4),
        rerankScore: (r.rerankScore ?? r.score ?? 0).toFixed(4),
        finalScore: (r.finalScore ?? 0).toFixed(4),
        keywordDensity: (r.keywordDensity ?? 0).toFixed(3),
        exactMatch: (r.exactMatchBoost ?? 0).toFixed(3),
        position: (r.positionScore ?? 0).toFixed(3),
        section: (r.sectionScore ?? 0).toFixed(3),
        isTOC: r.isTOC,
        isNarrative: r.isNarrative,
        preview: (r.preview ?? '').slice(0, 120)
      })));
    }
    
    const finalResults = diversified.slice(0, this.config.maxResults);

    // Build sourceGroups for debug and context reporting
    const sourceGroups = finalResults.reduce((groups, result) => {
      const source = result.source || 'unknown';
      if (!groups[source]) {
        groups[source] = [] as RetrievalResult[];
      }
      groups[source].push(result);
      return groups;
    }, {} as Record<string, RetrievalResult[]>);

    // Fallback for empty context
    let context = '';
    if (finalResults.length === 0) {
      context = 'No relevant context found for your query.';
    } else {
      // Group results by source
      const sourceGroups = finalResults.reduce((groups, result) => {
        const source = result.source || 'unknown';
        if (!groups[source]) {
          groups[source] = [];
        }
        groups[source].push(result);
        return groups;
      }, {} as Record<string, RetrievalResult[]>);

      // Sort chunks within each source by chunkIndex
      Object.values(sourceGroups).forEach(group => {
        group.sort((a, b) => {
          const indexA = a.chunkIndex ?? Infinity;
          const indexB = b.chunkIndex ?? Infinity;
          return indexA - indexB;
        });
      });

      // Build formatted context with source headers and page numbers
      context = Object.entries(sourceGroups)
        .map(([source, results]) => {
          const sourceHeader = `📄 ${source}`;
          const chunks = results.map(r => {
            let pageInfo = '';
            
            // Try to get actual page number from metadata first
            const metadata = r.metadata as { pageNumber?: number; loc?: { pageNumber?: number } } | undefined;
            const pageNumber = metadata?.pageNumber || metadata?.loc?.pageNumber;
            
            if (pageNumber !== undefined) {
              // Use actual page number from metadata
              pageInfo = ` [Page ${pageNumber}]`;
            } else if (r.chunkIndex !== undefined && r.chunkIndex !== null) {
              // Fall back to estimation if needed, with a warning first time
              if (!this.hasLoggedPageWarning) {
                console.warn('⚠️ Some chunks missing page metadata, falling back to estimation');
                this.hasLoggedPageWarning = true;
              }
              pageInfo = ` [Page ~${Math.floor(r.chunkIndex / 2) + 1}]`;  // Estimated
            }
            
            return `${pageInfo}\n${r.chunk}`;
          });
          return `${sourceHeader}\n${chunks.join('\n---\n')}`;
        })
        .join('\n\n================\n\n');
    }

    return {
      results: finalResults,
      context,
      debug: {
        originalQuery: query,
        expandedQueries: expandedQueries.map(q => q.text),
        keywords,
        vectorResults: vectorResultCount,
        keywordResults: keywordResultCount,
        totalResults: finalResults.length,
        sourceCounts: Object.fromEntries(
          Object.entries(sourceGroups).map(([source, results]) => [source, results.length])
        ),
        topCandidates: adjustedResults.slice(0, 10).map(r => ({
          source: r.source,
          chunkIndex: r.chunkIndex,
          pageNumber: (r as any).pageNumber,
          score: r.score,
          finalScore: r.finalScore
        }))
      }
    };
  }
}
