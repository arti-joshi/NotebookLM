/**
 * Metadata Enhancement System
 * Adds comprehensive metadata to chunks for better RAG retrieval
 */

import { Chunk } from './chunkingStrategies';

export interface EnhancedMetadata {
  // Basic metadata
  chunkIndex: number;
  totalChunks: number;
  source?: string;
  section?: string;
  
  // Content analysis
  contentType: 'narrative' | 'table' | 'list' | 'policy' | 'code' | 'mixed';
  complexityScore: number; // 0-1 scale
  topicTags: string[];
  wordCount: number;
  sentenceCount: number;
  
  // Relationships
  followsFrom?: number; // Previous chunk index
  relatedTo?: number[]; // Related chunk indices
  parentChunk?: number; // Parent section chunk
  childChunks?: number[]; // Child subsection chunks
  
  // Quality indicators
  isSelfContained: boolean;
  hasIncompleteContext: boolean;
  containsAcronyms: boolean;
  containsReferences: boolean;
  
  // RAG optimization
  retrievalScore: number; // 0-1 scale for retrieval priority
  contextDependencies: string[]; // What context this chunk needs
  providesContext: string[]; // What context this chunk provides
}

export interface MetadataEnhancementResult {
  enhancedChunks: Chunk[];
  metadataAdded: number;
  relationshipsFound: number;
  qualityIssues: string[];
}

/**
 * Enhance chunks with comprehensive metadata
 */
export function enhanceChunkMetadata(chunks: Chunk[]): MetadataEnhancementResult {
  console.log('📊 [METADATA ENHANCEMENT] Enhancing metadata for', chunks.length, 'chunks');
  
  const result: MetadataEnhancementResult = {
    enhancedChunks: [],
    metadataAdded: 0,
    relationshipsFound: 0,
    qualityIssues: []
  };
  
  // Step 1: Analyze each chunk
  const analyzedChunks = chunks.map((chunk, index) => {
    const enhancedMetadata = analyzeChunkContent(chunk, index, chunks);
    return {
      ...chunk,
      metadata: {
        ...chunk.metadata,
        ...enhancedMetadata
      }
    };
  });
  
  // Step 2: Find relationships between chunks
  const chunksWithRelationships = findChunkRelationships(analyzedChunks);
  result.relationshipsFound = chunksWithRelationships.filter(c => 
    c.metadata.followsFrom !== undefined || 
    (c.metadata.relatedTo && c.metadata.relatedTo.length > 0)
  ).length;
  
  // Step 3: Calculate retrieval scores
  const chunksWithScores = calculateRetrievalScores(chunksWithRelationships);
  
  // Step 4: Validate quality
  result.qualityIssues = validateEnhancedChunks(chunksWithScores);
  
  result.enhancedChunks = chunksWithScores;
  result.metadataAdded = chunksWithScores.length;
  
  console.log(`📊 [METADATA ENHANCEMENT] Complete: ${result.metadataAdded} chunks enhanced, ${result.relationshipsFound} relationships found`);
  return result;
}

/**
 * Analyze chunk content and extract metadata
 */
function analyzeChunkContent(chunk: Chunk, index: number, allChunks: Chunk[]): Partial<EnhancedMetadata> {
  const content = chunk.content;
  const lines = content.split('\n');
  
  // Determine content type
  const contentType = determineContentType(content);
  
  // Calculate complexity score
  const complexityScore = calculateComplexityScore(content);
  
  // Extract topic tags
  const topicTags = extractTopicTags(content);
  
  // Count words and sentences
  const wordCount = content.split(/\s+/).length;
  const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  
  // Quality indicators
  const isSelfContained = checkSelfContained(content);
  const hasIncompleteContext = checkIncompleteContext(content);
  const containsAcronyms = checkContainsAcronyms(content);
  const containsReferences = checkContainsReferences(content);
  
  // Context analysis
  const contextDependencies = extractContextDependencies(content);
  const providesContext = extractProvidesContext(content);
  
  return {
    contentType,
    complexityScore,
    topicTags,
    wordCount,
    sentenceCount,
    isSelfContained,
    hasIncompleteContext,
    containsAcronyms,
    containsReferences,
    contextDependencies,
    providesContext
  };
}

/**
 * Determine content type based on content analysis
 */
function determineContentType(content: string): EnhancedMetadata['contentType'] {
  const lines = content.split('\n');
  
  // Check for tables
  if (content.includes('|') && content.split('|').length > 6) {
    return 'table';
  }
  
  // Check for lists
  if (lines.some(line => /^\s*[-*+]\s/.test(line) || /^\s*\d+\.\s/.test(line))) {
    return 'list';
  }
  
  // Check for code
  if (content.includes('```') || content.includes('function') || content.includes('class')) {
    return 'code';
  }
  
  // Check for policy statements
  if (content.includes('shall') || content.includes('must') || content.includes('required') || 
      content.includes('policy') || content.includes('procedure')) {
    return 'policy';
  }
  
  // Check for academic matrices
  if (/^(CO|PO|LO)\d*\s+[\d\s\-]+$/.test(content)) {
    return 'table';
  }
  
  // Default to narrative
  return 'narrative';
}

/**
 * Calculate complexity score (0-1)
 */
function calculateComplexityScore(content: string): number {
  let score = 0;
  
  // Length factor
  const wordCount = content.split(/\s+/).length;
  score += Math.min(wordCount / 500, 0.3); // Max 0.3 for length
  
  // Technical terms
  const technicalTerms = content.match(/\b(algorithm|implementation|architecture|framework|methodology)\b/gi);
  score += (technicalTerms?.length || 0) * 0.1;
  
  // Acronyms
  const acronyms = content.match(/\b[A-Z]{2,}\b/g);
  score += Math.min((acronyms?.length || 0) * 0.05, 0.2);
  
  // Numbers and data
  const numbers = content.match(/\d+/g);
  score += Math.min((numbers?.length || 0) * 0.02, 0.1);
  
  // Lists and structures
  const lists = content.match(/^\s*[-*+]\s/gm);
  score += Math.min((lists?.length || 0) * 0.03, 0.1);
  
  // Tables
  if (content.includes('|')) {
    score += 0.2;
  }
  
  return Math.min(score, 1.0);
}

/**
 * Extract topic tags from content
 */
function extractTopicTags(content: string): string[] {
  const tags: string[] = [];
  const lowerContent = content.toLowerCase();
  
  // Academic topics
  if (lowerContent.includes('course') || lowerContent.includes('curriculum')) tags.push('academic');
  if (lowerContent.includes('assessment') || lowerContent.includes('grading')) tags.push('assessment');
  if (lowerContent.includes('outcome') || lowerContent.includes('objective')) tags.push('learning-outcomes');
  
  // Technical topics
  if (lowerContent.includes('programming') || lowerContent.includes('code')) tags.push('programming');
  if (lowerContent.includes('database') || lowerContent.includes('sql')) tags.push('database');
  if (lowerContent.includes('algorithm') || lowerContent.includes('data structure')) tags.push('algorithms');
  
  // Policy topics
  if (lowerContent.includes('policy') || lowerContent.includes('procedure')) tags.push('policy');
  if (lowerContent.includes('requirement') || lowerContent.includes('standard')) tags.push('requirements');
  
  // Extract key terms (simple approach)
  const words = content.split(/\s+/)
    .filter(word => word.length > 4)
    .filter(word => /^[a-zA-Z]+$/.test(word))
    .map(word => word.toLowerCase());
  
  // Find frequently occurring words
  const wordCounts: { [key: string]: number } = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  
  // Add top words as tags
  const topWords = Object.entries(wordCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([word]) => word);
  
  tags.push(...topWords);
  
  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Check if chunk is self-contained
 */
function checkSelfContained(content: string): boolean {
  // Check for incomplete sentences
  if (content.includes('However,') && !content.includes('but')) return false;
  if (content.includes('Therefore,') && !content.includes('so')) return false;
  if (content.includes('In addition,') && content.split('\n').length < 3) return false;
  
  // Check for orphaned references
  if (content.includes('see above') || content.includes('as mentioned')) return false;
  
  return true;
}

/**
 * Check for incomplete context
 */
function checkIncompleteContext(content: string): boolean {
  const incompleteIndicators = [
    'However,', 'But', 'Although', 'Despite', 'Nevertheless',
    'In contrast,', 'On the other hand,', 'Meanwhile,'
  ];
  
  return incompleteIndicators.some(indicator => 
    content.includes(indicator) && content.split('\n').length < 5
  );
}

/**
 * Check if content contains acronyms
 */
function checkContainsAcronyms(content: string): boolean {
  const acronyms = content.match(/\b[A-Z]{2,}\b/g);
  return (acronyms?.length || 0) > 2;
}

/**
 * Check if content contains references
 */
function checkContainsReferences(content: string): boolean {
  const referencePatterns = [
    /see\s+(above|below|section|chapter)/i,
    /as\s+mentioned\s+(above|below|earlier)/i,
    /refer\s+to/i,
    /see\s+also/i
  ];
  
  return referencePatterns.some(pattern => pattern.test(content));
}

/**
 * Extract context dependencies
 */
function extractContextDependencies(content: string): string[] {
  const dependencies: string[] = [];
  
  if (content.includes('see above')) dependencies.push('previous-content');
  if (content.includes('as mentioned')) dependencies.push('previous-mention');
  if (content.includes('However,')) dependencies.push('contrasting-context');
  if (content.includes('Therefore,')) dependencies.push('conclusion-context');
  
  return dependencies;
}

/**
 * Extract context that this chunk provides
 */
function extractProvidesContext(content: string): string[] {
  const provides: string[] = [];
  
  if (content.includes('definition') || content.includes('means')) provides.push('definition');
  if (content.includes('example') || content.includes('for instance')) provides.push('example');
  if (content.includes('procedure') || content.includes('steps')) provides.push('procedure');
  if (content.includes('requirement') || content.includes('must')) provides.push('requirement');
  
  return provides;
}

/**
 * Find relationships between chunks
 */
function findChunkRelationships(chunks: Chunk[]): Chunk[] {
  return chunks.map((chunk, index) => {
    const relationships: Partial<EnhancedMetadata> = {};
    
    // Find follows-from relationship
    if (index > 0) {
      const prevChunk = chunks[index - 1];
      if (chunk.metadata.section === prevChunk.metadata.section) {
        relationships.followsFrom = prevChunk.metadata.chunkIndex;
      }
    }
    
    // Find related chunks (same topic tags)
    const relatedIndices: number[] = [];
    chunks.forEach((otherChunk, otherIndex) => {
      if (otherIndex !== index) {
        const commonTags = chunk.metadata.topicTags?.filter((tag: string) => 
          otherChunk.metadata.topicTags?.includes(tag)
        ) || [];
        
        if (commonTags.length > 0) {
          relatedIndices.push(otherChunk.metadata.chunkIndex);
        }
      }
    });
    
    if (relatedIndices.length > 0) {
      relationships.relatedTo = relatedIndices.slice(0, 3); // Limit to 3 related chunks
    }
    
    return {
      ...chunk,
      metadata: {
        ...chunk.metadata,
        ...relationships
      }
    };
  });
}

/**
 * Calculate retrieval scores for RAG optimization
 */
function calculateRetrievalScores(chunks: Chunk[]): Chunk[] {
  return chunks.map(chunk => {
    let score = 0.5; // Base score
    
    // Higher score for self-contained chunks
    if (chunk.metadata.isSelfContained) {
      score += 0.2;
    }
    
    // Higher score for chunks with definitions
    if (chunk.metadata.providesContext?.includes('definition')) {
      score += 0.15;
    }
    
    // Lower score for chunks with incomplete context
    if (chunk.metadata.hasIncompleteContext) {
      score -= 0.1;
    }
    
    // Higher score for policy and requirement chunks
    if (chunk.metadata.contentType === 'policy') {
      score += 0.1;
    }
    
    // Higher score for chunks with many topic tags
    if (chunk.metadata.topicTags && chunk.metadata.topicTags.length > 3) {
      score += 0.05;
    }
    
    return {
      ...chunk,
      metadata: {
        ...chunk.metadata,
        retrievalScore: Math.max(0, Math.min(1, score))
      }
    };
  });
}

/**
 * Validate enhanced chunks
 */
function validateEnhancedChunks(chunks: Chunk[]): string[] {
  const issues: string[] = [];
  
  chunks.forEach((chunk, index) => {
    // Check for missing metadata
    if (!chunk.metadata.contentType) {
      issues.push(`Chunk ${index}: Missing content type`);
    }
    
    if (!chunk.metadata.complexityScore) {
      issues.push(`Chunk ${index}: Missing complexity score`);
    }
    
    if (!chunk.metadata.topicTags || chunk.metadata.topicTags.length === 0) {
      issues.push(`Chunk ${index}: No topic tags found`);
    }
    
    // Check for quality issues
    if (chunk.metadata.hasIncompleteContext) {
      issues.push(`Chunk ${index}: Has incomplete context`);
    }
    
    if (chunk.metadata.containsReferences && !chunk.metadata.relatedTo) {
      issues.push(`Chunk ${index}: Contains references but no relationships found`);
    }
  });
  
  return issues;
}

/**
 * Generate metadata summary for analysis
 */
export function generateMetadataSummary(chunks: Chunk[]): {
  totalChunks: number;
  contentTypeDistribution: { [key: string]: number };
  averageComplexity: number;
  totalTopicTags: number;
  qualityIssues: number;
  relationshipsFound: number;
} {
  const contentTypeDistribution: { [key: string]: number } = {};
  let totalComplexity = 0;
  let totalTopicTags = 0;
  let qualityIssues = 0;
  let relationshipsFound = 0;
  
  chunks.forEach(chunk => {
    // Content type distribution
    const contentType = chunk.metadata.contentType || 'unknown';
    contentTypeDistribution[contentType] = (contentTypeDistribution[contentType] || 0) + 1;
    
    // Complexity
    totalComplexity += chunk.metadata.complexityScore || 0;
    
    // Topic tags
    totalTopicTags += chunk.metadata.topicTags?.length || 0;
    
    // Quality issues
    if (chunk.metadata.hasIncompleteContext) qualityIssues++;
    
    // Relationships
    if (chunk.metadata.followsFrom !== undefined) relationshipsFound++;
    if (chunk.metadata.relatedTo && chunk.metadata.relatedTo.length > 0) relationshipsFound++;
  });
  
  return {
    totalChunks: chunks.length,
    contentTypeDistribution,
    averageComplexity: totalComplexity / chunks.length,
    totalTopicTags,
    qualityIssues,
    relationshipsFound
  };
}
