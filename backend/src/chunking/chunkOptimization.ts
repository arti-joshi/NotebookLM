/**
 * Chunk Optimization System
 * Implements intelligent chunk merging, overlap, and quality validation
 */

import { Chunk } from './chunkingStrategies';

export interface ChunkOptimizationConfig {
  minLinesPerChunk: number;        // Minimum lines to avoid tiny chunks
  maxLinesPerChunk: number;        // Maximum lines to avoid huge chunks
  overlapSentences: number;        // Number of sentences to overlap
  preserveSemanticBoundaries: boolean; // Keep section boundaries intact
  enableQualityValidation: boolean;    // Enable chunk quality checks
}

export const DEFAULT_OPTIMIZATION_CONFIG: ChunkOptimizationConfig = {
  minLinesPerChunk: 15,            // Merge chunks smaller than 15 lines
  maxLinesPerChunk: 80,            // Split chunks larger than 80 lines
  overlapSentences: 2,             // 2 sentences overlap for context
  preserveSemanticBoundaries: true,
  enableQualityValidation: true
};

export interface OptimizationResult {
  optimizedChunks: Chunk[];
  mergedChunks: number;
  splitChunks: number;
  addedOverlaps: number;
  qualityIssues: string[];
  metrics: {
    averageChunkSize: number;
    sizeDistribution: { [key: string]: number };
    contentTypeBreakdown: { [key: string]: number };
  };
}

/**
 * Main optimization function
 */
export function optimizeChunks(
  chunks: Chunk[], 
  config: ChunkOptimizationConfig = DEFAULT_OPTIMIZATION_CONFIG
): OptimizationResult {
  console.log('🔧 [CHUNK OPTIMIZATION] Starting optimization of', chunks.length, 'chunks');
  
  const result: OptimizationResult = {
    optimizedChunks: [],
    mergedChunks: 0,
    splitChunks: 0,
    addedOverlaps: 0,
    qualityIssues: [],
    metrics: {
      averageChunkSize: 0,
      sizeDistribution: {},
      contentTypeBreakdown: {}
    }
  };
  
  // Step 1: Merge small chunks with adjacent chunks
  const mergedChunks = mergeSmallChunks(chunks, config);
  result.mergedChunks = chunks.length - mergedChunks.length;
  console.log(`🔗 [CHUNK OPTIMIZATION] Merged ${result.mergedChunks} small chunks`);
  
  // Step 2: Split oversized chunks
  const sizedChunks = splitOversizedChunks(mergedChunks, config);
  result.splitChunks = mergedChunks.length - sizedChunks.length;
  console.log(`✂️ [CHUNK OPTIMIZATION] Split ${result.splitChunks} oversized chunks`);
  
  // Step 3: Add intelligent overlap
  const overlappedChunks = addIntelligentOverlap(sizedChunks, config);
  result.addedOverlaps = overlappedChunks.length;
  console.log(`🔄 [CHUNK OPTIMIZATION] Added overlap to ${result.addedOverlaps} chunks`);
  
  // Step 4: Quality validation
  if (config.enableQualityValidation) {
    result.qualityIssues = validateChunkQuality(overlappedChunks);
    console.log(`✅ [CHUNK OPTIMIZATION] Found ${result.qualityIssues.length} quality issues`);
  }
  
  // Step 5: Calculate metrics
  result.metrics = calculateChunkMetrics(overlappedChunks);
  result.optimizedChunks = overlappedChunks;
  
  console.log(`🎉 [CHUNK OPTIMIZATION] Complete: ${chunks.length} → ${result.optimizedChunks.length} chunks`);
  return result;
}

/**
 * Merge chunks smaller than minimum size with adjacent chunks
 */
function mergeSmallChunks(chunks: Chunk[], config: ChunkOptimizationConfig): Chunk[] {
  const optimized: Chunk[] = [];
  let i = 0;
  
  while (i < chunks.length) {
    const currentChunk = chunks[i];
    const currentLines = currentChunk.content.split('\n').length;
    
    // Check if chunk is too small
    if (currentLines < config.minLinesPerChunk) {
      console.log(`🔗 [MERGE SMALL CHUNKS] Chunk ${currentChunk.metadata.chunkIndex} has only ${currentLines} lines, merging...`);
      
      // Find the best adjacent chunk to merge with
      const mergeTarget = findBestMergeTarget(chunks, i, config);
      
      if (mergeTarget !== -1) {
        // Merge with target chunk
        const targetChunk = chunks[mergeTarget];
        const mergedContent = mergeTarget > i 
          ? `${currentChunk.content}\n\n${targetChunk.content}`
          : `${targetChunk.content}\n\n${currentChunk.content}`;
        
        const mergedChunk: Chunk = {
          content: mergedContent,
          metadata: {
            ...targetChunk.metadata,
            mergedFrom: [currentChunk.metadata.chunkIndex, targetChunk.metadata.chunkIndex],
            originalChunkCount: 2,
            mergedAt: Date.now()
          }
        };
        
        optimized.push(mergedChunk);
        
        // Skip the merged chunks
        if (mergeTarget > i) {
          i = mergeTarget + 1;
        } else {
          i++;
        }
        
        console.log(`✅ [MERGE SMALL CHUNKS] Merged chunks ${currentChunk.metadata.chunkIndex} and ${targetChunk.metadata.chunkIndex}`);
      } else {
        // No suitable merge target, keep as is
        optimized.push(currentChunk);
        i++;
      }
    } else {
      // Chunk is large enough, keep as is
      optimized.push(currentChunk);
      i++;
    }
  }
  
  return optimized;
}

/**
 * Find the best adjacent chunk to merge with
 */
function findBestMergeTarget(chunks: Chunk[], currentIndex: number, config: ChunkOptimizationConfig): number {
  const currentChunk = chunks[currentIndex];
  const currentLines = currentChunk.content.split('\n').length;
  
  // Check next chunk
  if (currentIndex + 1 < chunks.length) {
    const nextChunk = chunks[currentIndex + 1];
    const nextLines = nextChunk.content.split('\n').length;
    
    // Prefer merging with next chunk if it won't exceed max size
    if (currentLines + nextLines <= config.maxLinesPerChunk) {
      // Check if they're in the same section (semantic boundary)
      if (config.preserveSemanticBoundaries) {
        const sameSection = currentChunk.metadata.section === nextChunk.metadata.section;
        if (sameSection) {
          return currentIndex + 1;
        }
      } else {
        return currentIndex + 1;
      }
    }
  }
  
  // Check previous chunk
  if (currentIndex - 1 >= 0) {
    const prevChunk = chunks[currentIndex - 1];
    const prevLines = prevChunk.content.split('\n').length;
    
    if (currentLines + prevLines <= config.maxLinesPerChunk) {
      if (config.preserveSemanticBoundaries) {
        const sameSection = currentChunk.metadata.section === prevChunk.metadata.section;
        if (sameSection) {
          return currentIndex - 1;
        }
      } else {
        return currentIndex - 1;
      }
    }
  }
  
  return -1; // No suitable merge target found
}

/**
 * Split chunks that are too large
 */
function splitOversizedChunks(chunks: Chunk[], config: ChunkOptimizationConfig): Chunk[] {
  const optimized: Chunk[] = [];
  
  for (const chunk of chunks) {
    const lines = chunk.content.split('\n');
    
    if (lines.length > config.maxLinesPerChunk) {
      console.log(`✂️ [SPLIT OVERSIZED] Chunk ${chunk.metadata.chunkIndex} has ${lines.length} lines, splitting...`);
      
      // Split at logical boundaries (paragraph breaks, section headers)
      const splitPoints = findLogicalSplitPoints(lines);
      const splits = splitAtPoints(lines, splitPoints, config.maxLinesPerChunk);
      
      splits.forEach((splitContent, index) => {
        const splitChunk: Chunk = {
          content: splitContent.join('\n'),
          metadata: {
            ...chunk.metadata,
            chunkIndex: chunk.metadata.chunkIndex + index,
            splitFrom: chunk.metadata.chunkIndex,
            splitIndex: index,
            totalSplits: splits.length
          }
        };
        optimized.push(splitChunk);
      });
      
      console.log(`✅ [SPLIT OVERSIZED] Split chunk ${chunk.metadata.chunkIndex} into ${splits.length} parts`);
    } else {
      optimized.push(chunk);
    }
  }
  
  return optimized;
}

/**
 * Find logical split points in content
 */
function findLogicalSplitPoints(lines: string[]): number[] {
  const splitPoints: number[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Split at paragraph breaks (empty lines)
    if (line === '') {
      splitPoints.push(i);
    }
    
    // Split at section headers
    if (/^#{1,6}\s/.test(line) || /^[A-Z][A-Z\s]+$/.test(line)) {
      splitPoints.push(i);
    }
    
    // Split at list boundaries
    if (/^\s*[-*+]\s/.test(line) && i > 0 && !/^\s*[-*+]\s/.test(lines[i-1])) {
      splitPoints.push(i);
    }
  }
  
  return splitPoints;
}

/**
 * Split content at specified points
 */
function splitAtPoints(lines: string[], splitPoints: number[], maxSize: number): string[][] {
  const splits: string[][] = [];
  let currentSplit: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    currentSplit.push(lines[i]);
    
    // Check if we should split here
    if (splitPoints.includes(i) && currentSplit.length >= maxSize * 0.5) {
      splits.push([...currentSplit]);
      currentSplit = [];
    }
    
    // Force split if getting too large
    if (currentSplit.length >= maxSize) {
      splits.push([...currentSplit]);
      currentSplit = [];
    }
  }
  
  // Add remaining content
  if (currentSplit.length > 0) {
    splits.push(currentSplit);
  }
  
  return splits;
}

/**
 * Add intelligent overlap between chunks
 */
function addIntelligentOverlap(chunks: Chunk[], config: ChunkOptimizationConfig): Chunk[] {
  if (config.overlapSentences === 0) {
    return chunks;
  }
  
  const optimized: Chunk[] = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    let enhancedContent = chunk.content;
    
    // Add overlap from previous chunk
    if (i > 0) {
      const prevChunk = chunks[i - 1];
      const prevSentences = extractSentences(prevChunk.content);
      const overlapSentences = prevSentences.slice(-config.overlapSentences);
      
      if (overlapSentences.length > 0) {
        enhancedContent = `${overlapSentences.join(' ')}\n\n${enhancedContent}`;
        console.log(`🔄 [ADD OVERLAP] Added ${overlapSentences.length} sentences from previous chunk to chunk ${chunk.metadata.chunkIndex}`);
      }
    }
    
    // Add overlap to next chunk
    if (i < chunks.length - 1) {
      const nextChunk = chunks[i + 1];
      const currentSentences = extractSentences(chunk.content);
      const overlapSentences = currentSentences.slice(-config.overlapSentences);
      
      if (overlapSentences.length > 0) {
        enhancedContent = `${enhancedContent}\n\n${overlapSentences.join(' ')}`;
        console.log(`🔄 [ADD OVERLAP] Added ${overlapSentences.length} sentences to next chunk from chunk ${chunk.metadata.chunkIndex}`);
      }
    }
    
    const enhancedChunk: Chunk = {
      content: enhancedContent,
      metadata: {
        ...chunk.metadata,
        hasOverlap: true,
        overlapSentences: config.overlapSentences
      }
    };
    
    optimized.push(enhancedChunk);
  }
  
  return optimized;
}

/**
 * Extract sentences from text
 */
function extractSentences(text: string): string[] {
  // Simple sentence extraction - can be enhanced with NLP libraries
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  return sentences;
}

/**
 * Validate chunk quality
 */
function validateChunkQuality(chunks: Chunk[]): string[] {
  const issues: string[] = [];
  
  chunks.forEach((chunk, index) => {
    const content = chunk.content;
    const lines = content.split('\n');
    
    // Check for orphaned references
    if (content.includes('see above') || content.includes('as mentioned')) {
      issues.push(`Chunk ${index}: Contains orphaned reference`);
    }
    
    // Check for incomplete contexts
    if (content.includes('However,') && !content.includes('but')) {
      issues.push(`Chunk ${index}: May have incomplete context`);
    }
    
    // Check for acronyms without definitions
    const acronyms = content.match(/\b[A-Z]{2,}\b/g);
    if (acronyms && acronyms.length > 3) {
      issues.push(`Chunk ${index}: Contains many acronyms without definitions`);
    }
    
    // Check for very short chunks
    if (lines.length < 5) {
      issues.push(`Chunk ${index}: Very short chunk (${lines.length} lines)`);
    }
    
    // Check for very long chunks
    if (lines.length > 100) {
      issues.push(`Chunk ${index}: Very long chunk (${lines.length} lines)`);
    }
  });
  
  return issues;
}

/**
 * Calculate chunk metrics
 */
function calculateChunkMetrics(chunks: Chunk[]): OptimizationResult['metrics'] {
  const lineCounts = chunks.map(chunk => chunk.content.split('\n').length);
  const averageChunkSize = lineCounts.reduce((sum, count) => sum + count, 0) / chunks.length;
  
  // Size distribution
  const sizeDistribution = {
    '1-10 lines': lineCounts.filter(count => count <= 10).length,
    '11-25 lines': lineCounts.filter(count => count > 10 && count <= 25).length,
    '26-50 lines': lineCounts.filter(count => count > 25 && count <= 50).length,
    '51-100 lines': lineCounts.filter(count => count > 50 && count <= 100).length,
    '100+ lines': lineCounts.filter(count => count > 100).length
  };
  
  // Content type breakdown
  const contentTypeBreakdown = {
    'narrative': chunks.filter(chunk => chunk.metadata.type === 'plain_text').length,
    'table': chunks.filter(chunk => chunk.metadata.type === 'table_csv_sql').length,
    'code': chunks.filter(chunk => chunk.metadata.type === 'code').length,
    'research': chunks.filter(chunk => chunk.metadata.type === 'research_technical').length,
    'mixed': chunks.filter(chunk => chunk.metadata.type === 'mixed').length
  };
  
  return {
    averageChunkSize,
    sizeDistribution,
    contentTypeBreakdown
  };
}

/**
 * Analyze chunking results and provide recommendations
 */
export function analyzeChunkingResults(chunks: Chunk[]): {
  recommendations: string[];
  metrics: OptimizationResult['metrics'];
  issues: string[];
} {
  const metrics = calculateChunkMetrics(chunks);
  const issues = validateChunkQuality(chunks);
  const recommendations: string[] = [];
  
  // Analyze average chunk size
  if (metrics.averageChunkSize < 10) {
    recommendations.push('Consider merging small chunks for better context');
  } else if (metrics.averageChunkSize > 50) {
    recommendations.push('Consider splitting large chunks for better precision');
  }
  
  // Analyze size distribution
  if (metrics.sizeDistribution['1-10 lines'] > chunks.length * 0.3) {
    recommendations.push('Too many tiny chunks - implement minimum size enforcement');
  }
  
  if (metrics.sizeDistribution['100+ lines'] > chunks.length * 0.2) {
    recommendations.push('Too many large chunks - implement maximum size limits');
  }
  
  // Analyze content types
  if (metrics.contentTypeBreakdown.table === 0 && chunks.some(c => c.content.includes('|'))) {
    recommendations.push('Consider implementing table detection for structured data');
  }
  
  return {
    recommendations,
    metrics,
    issues
  };
}
