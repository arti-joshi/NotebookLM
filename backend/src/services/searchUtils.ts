/**
 * Search Utilities for RAG Service
 * Provides enhanced query expansion and search capabilities
 */

import { correctSpelling } from './spellCorrectionService.js';
import { config } from '../config/index.js';

interface QueryVariant {
  text: string;
  weight: number;  // Higher weight = more important in final scoring
}

/**
 * Generates semantic variations of the query to improve recall
 */
export function generateQueryVariants(query: string): QueryVariant[] {
  // Apply spell correction first if enabled
  const correctedQuery = config.rag.enableSpellCorrection 
    ? correctSpelling(query) 
    : query;
  
  const variants: QueryVariant[] = [
    { text: correctedQuery, weight: 1.0 } // Corrected query gets full weight
  ];
  
  // If spell correction was applied, also include original for fallback
  if (correctedQuery !== query) {
    variants.push({ text: query, weight: 0.9 });
  }

  // Remove question words and common prefixes from corrected query
  const cleaned = correctedQuery
    .replace(/^(what|who|where|when|why|how|tell me|show me|find|search for)/i, '')
    .trim();
  if (cleaned !== correctedQuery) {
    variants.push({ text: cleaned, weight: 0.9 });
  }

  // Extract and combine key entities from corrected query
  const dates = correctedQuery.match(/\d+\s*(?:CE|AD|BCE|BC)/gi) || [];
  const locations = correctedQuery.match(/(?:at|in|near)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g) || [];
  const names = correctedQuery.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) || [];

  const entities = [...dates, ...locations, ...names];
  if (entities.length > 1) {
    variants.push({ 
      text: entities.join(' '), 
      weight: 0.85 
    });
  }

  // Handle birth/date queries from corrected query
  const birthMatch = correctedQuery.match(/(?:born|birth)\s+(?:in|at|near)\s+(.+)/i);
  if (birthMatch) {
    variants.push({ 
      text: birthMatch[1],
      weight: 0.8 
    });
    
    // Add variations without date/location
    const withoutDate = birthMatch[1].replace(/\d+\s*(?:CE|AD|BCE|BC)/i, '').trim();
    if (withoutDate !== birthMatch[1]) {
      variants.push({ 
        text: withoutDate,
        weight: 0.75 
      });
    }
  }

  // Extract person queries from corrected query
  const personMatch = correctedQuery.match(/(?:who|about)\s+(?:is|was)\s+([^?]+)/i);
  if (personMatch) {
    variants.push({ 
      text: personMatch[1].trim(),
      weight: 0.95 
    });
  }

  return variants;
}

/**
 * Extracts keywords for hybrid search, with weights
 */
export function extractWeightedKeywords(query: string): Map<string, number> {
  // Apply spell correction first if enabled
  const correctedQuery = config.rag.enableSpellCorrection 
    ? correctSpelling(query) 
    : query;
  
  const keywords = new Map<string, number>();
  
  // Extract dates (highest priority) from corrected query
  const dates = correctedQuery.match(/\d+\s*(?:CE|AD|BCE|BC)/gi) || [];
  dates.forEach(date => {
    const normalized = date.replace(/\s+/g, '').toUpperCase();
    keywords.set(normalized, 1.0);
  });

  // Extract locations (high priority) from corrected query
  const locations = correctedQuery.match(/(?:at|in|near)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g) || [];
  locations.forEach(loc => {
    const normalized = loc.replace(/(?:at|in|near)\s+/i, '').trim();
    keywords.set(normalized, 0.9);
  });

  // Extract proper nouns (medium-high priority) from corrected query
  const names = correctedQuery.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) || [];
  names.forEach(name => {
    if (!keywords.has(name)) { // Don't override dates/locations
      keywords.set(name, 0.8);
    }
  });

  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'is', 'was', 'are', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'what', 'where', 'when', 'who', 'how', 'why'
  ]);

  // Extract remaining meaningful words (lower priority) from corrected query
  const words = correctedQuery
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  words.forEach(word => {
    if (!Array.from(keywords.keys()).some(k => k.toLowerCase().includes(word))) {
      keywords.set(word, 0.6);
    }
  });

  return keywords;
}

/**
 * Combines and deduplicates search results with smart scoring
 */
export function combineSearchResults<T>(
  results: Array<{ item: T; score: number; method: string }>,
  scoreAccessor: (item: T) => number,
  uniqueKeyAccessor: (item: T) => string
): T[] {
  const scored = new Map<string, { item: T; score: number; methods: Set<string> }>();

  // Process each result
  for (const { item, score, method } of results) {
    const key = uniqueKeyAccessor(item);
    
    if (!scored.has(key)) {
      scored.set(key, { 
        item, 
        score: score * scoreAccessor(item),
        methods: new Set([method])
      });
    } else {
      const existing = scored.get(key)!;
      existing.methods.add(method);
      
      // Boost score if found by multiple methods
      const methodBoost = existing.methods.size * 0.1; // 10% boost per method
      const combinedScore = Math.max(
        existing.score,
        score * scoreAccessor(item)
      ) * (1 + methodBoost);
      
      existing.score = combinedScore;
    }
  }

  // Sort by final score
  return Array.from(scored.values())
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.item);
}
