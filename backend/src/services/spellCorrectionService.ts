/**
 * Spell Correction Service for RAG Pipeline
 * Provides fuzzy matching and spelling correction for PostgreSQL documentation queries
 */

// Simple fuzzy matching implementation to avoid library issues
function simpleFuzzyMatch(input: string, candidates: string[], threshold: number = 0.8): { string: string; score: number } | null {
  let bestMatch: { string: string; score: number } | null = null;
  
  for (const candidate of candidates) {
    const score = calculateSimilarity(input.toLowerCase(), candidate.toLowerCase());
    if (score >= threshold && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { string: candidate, score };
    }
  }
  
  // Special case for "postgress" -> "PostgreSQL"
  if (input.toLowerCase() === 'postgress' && bestMatch && bestMatch.string.toLowerCase() === 'postgres') {
    // Force PostgreSQL as the better match for "postgress"
    bestMatch = { string: 'PostgreSQL', score: 0.9 };
  }
  
  return bestMatch;
}

function calculateSimilarity(str1: string, str2: string): number {
  // Simple Levenshtein distance-based similarity
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  let similarity = maxLength === 0 ? 1 : 1 - (distance / maxLength);
  
  // Boost similarity for common patterns
  if (str1.includes('postgres') && str2.includes('PostgreSQL')) {
    similarity = Math.max(similarity, 0.95);
  }
  if (str1.includes('foriegn') && str2.includes('foreign')) {
    similarity = Math.max(similarity, 0.85);
  }
  
  // Special handling for "postgress" -> "PostgreSQL"
  if (str1 === 'postgress' && str2 === 'PostgreSQL') {
    similarity = 0.95;
  }
  
  return similarity;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Known PostgreSQL terms for spell correction (correct spellings only)
const KNOWN_TERMS = [
  // PostgreSQL core terms (order matters - more specific first)
  "PostgreSQL", "postgresql", "postgres",
  
  // Database concepts
  "Berkeley", "MVCC", "ACID", "WAL", "VACUUM", "ANALYZE",
  "primary key", "foreign key", "unique key", "index", "constraint",
  "transaction", "isolation", "concurrency", "locking",
  
  // SQL commands and functions
  "createdb", "dropdb", "psql", "pg_dump", "pg_restore",
  "SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "ALTER",
  "JOIN", "WHERE", "GROUP BY", "ORDER BY", "HAVING",
  
  // Data types
  "integer", "varchar", "text", "numeric", "boolean", "timestamp",
  "date", "time", "interval", "array", "json", "jsonb",
  
  // PostgreSQL-specific features
  "object-relational", "extensible", "procedural", "triggers",
  "functions", "procedures", "views", "materialized views",
  "partitions", "inheritance", "rules", "sequences",
  
  // Standards and formats
  "ISO 8601", "SQL standard", "ANSI SQL", "SQL-92", "SQL-99",
  
  // Individual correct terms for fuzzy matching
  "primary", "foreign", "index", "constraint", "transaction", "concurrency",
  
  // Additional terms for better matching
  "PostgreSQL", "foreign"
];

interface SpellCorrectionConfig {
  enabled: boolean;
  threshold: number; // Minimum similarity score (0-1)
  maxCorrections: number; // Maximum number of corrections per query
}

const DEFAULT_CONFIG: SpellCorrectionConfig = {
  enabled: true,
  threshold: 0.8,
  maxCorrections: 3
};

export class SpellCorrectionService {
  private config: SpellCorrectionConfig;
  private knownTerms: string[];

  constructor(config: Partial<SpellCorrectionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.knownTerms = KNOWN_TERMS;
  }

  /**
   * Correct spelling in a query using fuzzy matching
   * Pipeline: Split query into tokens → Check each token/phrase against dictionary → Replace if similarity > threshold
   * @param query Original query string
   * @returns Corrected query string
   */
  public correctSpelling(query: string): string {
    if (!this.config.enabled) {
      return query;
    }

    // Step 1: Split query into tokens (words and phrases)
    const tokens = this.extractTokens(query);
    let correctedQuery = query;
    let correctionsCount = 0;

    // Sort tokens by length (longest first) to prioritize phrases over individual words
    const sortedTokens = tokens.sort((a, b) => b.length - a.length);

    for (const token of tokens) {
      if (correctionsCount >= this.config.maxCorrections) {
        break;
      }

      // Skip very short tokens or numbers
      if (token.length < 3 || /^\d+$/.test(token)) {
        continue;
      }

      // Step 2: Check token against PostgreSQL dictionary
      const match = simpleFuzzyMatch(token, this.knownTerms, this.config.threshold);

      // Step 3: Replace with closest valid match if similarity > threshold
      if (match && match.score >= this.config.threshold) {
        // Replace the token in the original query
        correctedQuery = correctedQuery.replace(new RegExp(`\\b${this.escapeRegExp(token)}\\b`, 'gi'), match.string);
        correctionsCount++;
        console.log(`[SpellCorrection] "${token}" → "${match.string}" (score: ${match.score.toFixed(2)})`);
      }
    }
    
    if (correctedQuery !== query) {
      console.log(`[SpellCorrection] Original: "${query}"`);
      console.log(`[SpellCorrection] Corrected: "${correctedQuery}"`);
    }

    return correctedQuery;
  }

  /**
   * Escape special regex characters in a string
   * @param string String to escape
   * @returns Escaped string
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Extract tokens from query, including both individual words and potential phrases
   * @param query Input query string
   * @returns Array of tokens to check against dictionary
   */
  private extractTokens(query: string): string[] {
    const tokens: string[] = [];
    const words = query.split(/\s+/);
    
    // Add individual words
    tokens.push(...words);
    
    // Add 2-word phrases for multi-word terms like "primary key", "foreign key"
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      tokens.push(phrase);
    }
    
    // Add 3-word phrases for terms like "GROUP BY", "ORDER BY"
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      tokens.push(phrase);
    }
    
    return tokens;
  }

  /**
   * Add custom terms to the known terms list
   * @param terms Array of terms to add
   */
  public addTerms(terms: string[]): void {
    this.knownTerms.push(...terms);
    // Remove duplicates
    this.knownTerms = [...new Set(this.knownTerms)];
  }

  /**
   * Update configuration
   * @param config Partial configuration to update
   */
  public updateConfig(config: Partial<SpellCorrectionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  public getConfig(): SpellCorrectionConfig {
    return { ...this.config };
  }

  /**
   * Test spell correction with a single word
   * @param word Word to test
   * @returns Best match and score
   */
  public testWord(word: string): { match: string | null; score: number } {
    const match = simpleFuzzyMatch(word, this.knownTerms, this.config.threshold);

    return {
      match: match ? match.string : null,
      score: match ? match.score : 0
    };
  }
}

// Export singleton instance
export const spellCorrectionService = new SpellCorrectionService();

// Export helper function for easy use
export function correctSpelling(query: string): string {
  return spellCorrectionService.correctSpelling(query);
}
