import { type RetrievalResult } from '../types/prisma';

/**
 * Calculate cosine similarity between two vectors
 */
export function calculateCosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let aMagnitude = 0;
  let bMagnitude = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    aMagnitude += a[i] * a[i];
    bMagnitude += b[i] * b[i];
  }
  
  aMagnitude = Math.sqrt(aMagnitude);
  bMagnitude = Math.sqrt(bMagnitude);
  
  return dotProduct / (aMagnitude * bMagnitude);
}

/**
 * Calculate keyword-based relevance score
 */
export function calculateKeywordScore(query: string, text: string): number {
  const queryWords = new Set(query.toLowerCase().split(/\W+/));
  const textWords = text.toLowerCase().split(/\W+/);
  let matches = 0;
  
  for (const word of textWords) {
    if (queryWords.has(word)) matches++;
  }
  
  return matches / Math.sqrt(textWords.length);
}

/**
 * Convert embedding array to Postgres vector literal
 */
export function toVectorLiteral(embedding: number[]): string {
  const nums = embedding.map((n) => Number.isFinite(n) ? n : 0).join(',');
  return `[${nums}]`;
}

/**
 * Merge and rank search results from multiple sources
 */
export function mergeAndRankResults(
  results: RetrievalResult[],
  options: {
    postgresBoost?: number;
    similarityWeight?: number;
    keywordWeight?: number;
    maxResults?: number;
  } = {}
): RetrievalResult[] {
  const {
    postgresBoost = 0.1,
    similarityWeight = 0.65,
    keywordWeight = 0.35,
    maxResults = 10
  } = options;

  // Normalize scores within each source
  const bySource = results.reduce<Record<string, RetrievalResult[]>>((acc, r) => {
    (acc[r.source] ||= []).push(r);
    return acc;
  }, {});
  
  for (const chunks of Object.values(bySource)) {
    const maxSim = Math.max(...chunks.map(c => c.similarity));
    const maxKey = Math.max(...chunks.map(c => c.keywordScore));
    
    for (const chunk of chunks) {
      chunk.similarity = chunk.similarity / (maxSim || 1);
      chunk.keywordScore = chunk.keywordScore / (maxKey || 1);
    }
  }

  // Calculate combined score with postgres boost
  const scored = results.map(chunk => ({
    ...chunk,
    combinedScore: 
      similarityWeight * chunk.similarity + 
      keywordWeight * chunk.keywordScore +
      (chunk.source === 'postgres-official' ? postgresBoost : 0)
  }));

  // Sort by score, prefer postgres on ties
  return scored
    .sort((a, b) => {
      const scoreDiff = b.combinedScore - a.combinedScore;
      if (Math.abs(scoreDiff) > 0.01) return scoreDiff;
      return a.source === 'postgres-official' ? -1 : 1;
    })
    .slice(0, maxResults);
}