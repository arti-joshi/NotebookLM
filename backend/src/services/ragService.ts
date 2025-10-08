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
      definition: /(what\s+is|define|explain)/.test(q),
      undo: /(undo|rollback|accidentally|mistake|revert)/.test(q)
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

      // 3) Position (content-aware weighting)
      const positionScore = this.calculatePositionScore(result.chunkIndex ?? null, totalChunks);
      const docType = ((result.metadata as any)?.documentType || '').toString().toLowerCase();
      const effectivePositionWeight = docType.includes('reference') ? Math.min(this.config.positionWeight, 0.03) : (this.config.positionWeight ?? 0);
      rerankScore += positionScore * effectivePositionWeight;

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

      // 5b) Intent-specific keyword boosts inside chunk text
      if (intent.performance) {
        if (/\b(CREATE\s+INDEX|EXPLAIN|query\s+plan|VACUUM)\b/i.test(result.chunk)) {
          rerankScore += 0.25;
        }
      }
      if (intent.undo) {
        if (/(autocommit|BEGIN|COMMIT|ROLLBACK|transaction)/i.test(result.chunk)) {
          rerankScore += 0.20;
        }
      }

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
      maxResults: serviceConfig.maxResults ?? 30, // widened recall default
      similarityThreshold: serviceConfig.similarityThreshold ?? 0.20, // lower threshold default
      enableKeywordSearch: serviceConfig.enableKeywordSearch ?? true,
      enableQueryExpansion: serviceConfig.enableQueryExpansion ?? true,
      enableHybridSearch: serviceConfig.enableHybridSearch ?? true,
      includeSourceContext: serviceConfig.includeSourceContext ?? true,
      contextWindowSize: serviceConfig.contextWindowSize ?? 2,
      tocPenalty: serviceConfig.tocPenalty ?? 0.05,
      narrativeBoost: serviceConfig.narrativeBoost ?? 0.05,
      debugRetrieval: serviceConfig.debugRetrieval ?? false,
      // Reranking and boosting defaults
      enableReranking: serviceConfig.enableReranking ?? true,
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
        section: string | null;
        chunkingConfig: any;
        distance: number;
      }>>`
        SELECT 
          e.id,
          e.chunk,
          e.source,
          e."chunkIndex",
          e."pageStart",
          e.section,
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
        metadata: {
          ...(r.chunkingConfig || {}),
          section: (r.chunkingConfig?.section ?? r.section) || undefined
        },
        // Hybrid weighting: 0.6 vector + 0.4 BM25 (BM25 part added in full-text search)
        score: (1 - r.distance) * 0.6,
        method: 'vector' as const
      }));
    } catch (error) {
      console.warn('Vector search failed:', error);
      return [];
    }
  }

  // Cosine similarity calculation moved to SQL using pgvector

  private async bm25Search(keywords: string[], userId: string): Promise<RetrievalResult[]> {
    if (!keywords.length) return [];
    const queryText = keywords.join(' ');
    try {
      const rows = await this.prisma.$queryRaw<Array<{
        chunk: string;
        source: string | null;
        chunkIndex: number | null;
        pageStart: number | null;
        section: string | null;
        chunkingConfig: any;
        rank: number;
      }>>`
        SELECT 
          e.chunk,
          e.source,
          e."chunkIndex",
          e."pageStart",
          e.section,
          e."chunkingConfig",
          ts_rank(to_tsvector('english', e.chunk), plainto_tsquery('english', ${queryText})) AS rank
        FROM "Embedding" e
        LEFT JOIN "Document" d ON d.id = e."documentId"
        WHERE (e."userId" = ${userId} OR d."isSystemDocument" = true)
          AND to_tsvector('english', e.chunk) @@ plainto_tsquery('english', ${queryText})
        ORDER BY rank DESC
        LIMIT ${this.config.maxResults}
      `;
      const maxRank = rows[0]?.rank || 1;
      return rows.map(r => ({
        chunk: r.chunk,
        source: r.source || '',
        chunkIndex: r.chunkIndex ?? undefined,
        pageNumber: r.pageStart ?? undefined,
        metadata: {
          ...(r.chunkingConfig || {}),
          section: (r.chunkingConfig?.section ?? r.section) || undefined
        },
        // Normalize BM25 rank and weight at 0.4 of hybrid
        score: Math.max(0, (r.rank / maxRank)) * 0.4,
        method: 'keyword' as const
      }));
    } catch (e) {
      console.warn('BM25 search failed:', e);
      return [];
    }
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
      confidence: 'high' | 'medium' | 'low';
      topScore: number;
      secondScore: number;
      topScoreGap: number;
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
        const keywordResults = await this.bm25Search(keywords, userId);
        allResults.push(...keywordResults);
        keywordResultCount = keywordResults.length;
      }

    // Multi-hop retrieval: if complex query, expand with entities from top preliminary results
    const looksComplex = query.length > 80 || /relat(e|ionship)|depend|interaction/i.test(query);
    if (looksComplex) {
      const prelimTop = [...allResults].sort((a,b)=> (b.score||0)-(a.score||0)).slice(0,3);
      const extraTerms = new Set<string>();
      for (const r of prelimTop) {
        const meta: any = r.metadata || {};
        (meta.sqlKeywords || []).slice(0,5).forEach((k: string)=> extraTerms.add(k));
        const m = r.chunk.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g);
        (m||[]).slice(0,5).forEach(t=> extraTerms.add(t));
      }
      const extra = Array.from(extraTerms).filter(Boolean);
      if (extra.length) {
        const hopQuery = `${query} ${extra.slice(0,8).join(' ')}`;
        const hopVec = await this.vectorSearch(hopQuery, userId);
        hopVec.forEach(r=> r.score = (r.score||0));
        const hopBm25 = await this.bm25Search(extra.slice(0,8), userId);
        allResults.push(...hopVec, ...hopBm25);
      }
    }

    // Combine and deduplicate results (structural + semantic)
    const resultMap = new Map<string, RetrievalResult>();
    for (const result of allResults) {
      const key = `${result.source}-${result.chunkIndex}`;
      if (!resultMap.has(key) || (resultMap.get(key)!.score < result.score)) {
        resultMap.set(key, result);
      }
    }
    let dedupedResults = Array.from(resultMap.values());
    // Semantic deduplication by cosine similarity on embeddings is expensive; use text proxy
    // Simple Jaccard-like proxy: if two chunks share >92% of tokens, drop the lower-scored one
    const seen: RetrievalResult[] = [];
    const isNearDuplicate = (a: string, b: string): boolean => {
      const ta = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
      const tb = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
      const inter = [...ta].filter(t => tb.has(t)).length;
      const denom = Math.max(ta.size, tb.size) || 1;
      return inter / denom >= 0.92;
    };
    const semFiltered: RetrievalResult[] = [];
    for (const r of dedupedResults.sort((a,b)=> (b.score||0)-(a.score||0))) {
      if (seen.some(s => isNearDuplicate(s.chunk, r.chunk))) continue;
      seen.push(r);
      semFiltered.push(r);
    }
    dedupedResults = semFiltered;
    
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
      console.table(adjustedResults.slice(0, Math.min(15, adjustedResults.length)).map(r => {
        const meta: any = r.metadata || {};
        const section = meta.section || meta.Header_1 || meta.Header_2 || meta.Header_3 || 'n/a';
        return {
          source: r.source,
          pageNumber: (r as any).pageNumber ?? 'n/a',
          section,
          chunkIndex: r.chunkIndex ?? 'n/a',
          score: (r.score ?? 0).toFixed(4),
          rerankScore: (r.rerankScore ?? r.score ?? 0).toFixed(4),
          finalScore: (r.finalScore ?? 0).toFixed(4),
          keywordDensity: (r.keywordDensity ?? 0).toFixed(3),
          exactMatch: (r.exactMatchBoost ?? 0).toFixed(3),
          position: (r.positionScore ?? 0).toFixed(3),
          sectionScore: (r.sectionScore ?? 0).toFixed(3),
          isTOC: r.isTOC,
          isNarrative: r.isNarrative,
          preview: (r.preview ?? '').slice(0, 120)
        };
      }));
    }
    
    const finalResults = diversified.slice(0, this.config.maxResults);

    // If results are too few, relax retrieval once (broader net)
    if (finalResults.length < 5) {
      if (this.config.debugRetrieval) console.log('🔁 Relaxing retrieval: low result count, expanding search');
      // Retry with lower threshold and larger cap; force expansion
      const relaxed = new RAGService(this.prisma, {
        ...this.config,
        similarityThreshold: Math.max(0.15, this.config.similarityThreshold - 0.05),
        maxResults: Math.max(40, this.config.maxResults),
        enableQueryExpansion: true,
        enableKeywordSearch: true,
        enableHybridSearch: true,
        enableReranking: true,
        apiKey: undefined
      });
      const retry = await relaxed.retrieveContext(query, userId);
      if (retry.results.length > finalResults.length) {
        return retry; // Use relaxed results entirely (includes context/debug)
      }
    }

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

    // Build formatted context with source headers and page/section info
      context = Object.entries(sourceGroups)
        .map(([source, results]) => {
          const sourceHeader = `📄 ${source}`;
          const chunks = results.map(r => {
            let pageInfo = '';
            
            // Try to get actual page number from metadata first
            const metadata = r.metadata as { pageNumber?: number; loc?: { pageNumber?: number } } | undefined;
            const pageNumber = metadata?.pageNumber || metadata?.loc?.pageNumber;
            const section = (metadata as any)?.section;
            
            if (pageNumber !== undefined) {
              // Use actual page number from metadata
              pageInfo = ` [Page ${pageNumber}]`;
            } else if (section) {
              // Prefer section-only when page unknown to avoid false precision
              pageInfo = ` [Section: ${section}]`;
            }
            
            return `${pageInfo}\n${r.chunk}`;
          });
          return `${sourceHeader}\n${chunks.join('\n---\n')}`;
        })
        .join('\n\n================\n\n');
    }

    // Simple confidence scoring based on top gaps and volume
    const top = finalResults[0]?.finalScore ?? 0;
    const second = finalResults[1]?.finalScore ?? 0;
    const gap = Math.max(0, top - second);
    const volume = finalResults.length;
    const confidence = (top >= 0.7 && gap >= 0.1 && volume >= 5) ? 'high' : (top >= 0.5 && volume >= 3) ? 'medium' : 'low';

    // Compute simple retrieval metrics (heuristics, placeholders for now)
    const metrics = {
      ndcg: Number((top + second) / 2).toFixed(3),
      mrr: Number(top > 0 ? 1 : 0).toFixed(3),
      recallAtK: Number(finalResults.length >= 5 ? 1 : finalResults.length / 5).toFixed(3)
    } as any;

    // Fire-and-forget DB log (do not block request on failure)
    (this.prisma as any).retrievalLog?.create?.({
      data: {
        query,
        results: finalResults.map(r => ({ source: r.source, chunkIndex: r.chunkIndex, score: r.finalScore })),
        metrics,
      }
    }).catch(()=>{});

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
        confidence,
        topScore: top,
        secondScore: second,
        topScoreGap: gap
      }
    };
  }
}
