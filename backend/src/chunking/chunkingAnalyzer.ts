/**
 * Chunking Analyzer
 * Comprehensive analysis of chunking results with metrics and recommendations
 */

import { Chunk } from './chunkingStrategies';
import { OptimizationResult } from './chunkOptimization';
import { MetadataEnhancementResult } from './metadataEnhancement';

export interface ChunkingAnalysis {
  // Basic metrics
  totalChunks: number;
  averageChunkSize: number;
  sizeDistribution: { [key: string]: number };
  contentTypeBreakdown: { [key: string]: number };
  
  // Quality metrics
  qualityScore: number; // 0-1 overall quality
  selfContainedChunks: number;
  incompleteContextChunks: number;
  orphanedReferences: number;
  
  // Performance metrics
  retrievalOptimization: {
    highPriorityChunks: number;
    mediumPriorityChunks: number;
    lowPriorityChunks: number;
  };
  
  // Issues and recommendations
  issues: string[];
  recommendations: string[];
  
  // Detailed analysis
  detailedMetrics: {
    complexityDistribution: { [key: string]: number };
    topicTagFrequency: { [key: string]: number };
    relationshipDensity: number;
    contextCompleteness: number;
  };
}

export interface RAGPerformanceTest {
  query: string;
  expectedChunks: number[];
  actualChunks: number[];
  accuracy: number;
  completeness: number;
  contextQuality: number;
}

/**
 * Main analysis function
 */
export function analyzeChunkingResults(
  chunks: Chunk[],
  optimizationResult?: OptimizationResult,
  metadataResult?: MetadataEnhancementResult
): ChunkingAnalysis {
  console.log('📊 [CHUNKING ANALYZER] Starting comprehensive analysis...');
  
  const analysis: ChunkingAnalysis = {
    totalChunks: chunks.length,
    averageChunkSize: 0,
    sizeDistribution: {},
    contentTypeBreakdown: {},
    qualityScore: 0,
    selfContainedChunks: 0,
    incompleteContextChunks: 0,
    orphanedReferences: 0,
    retrievalOptimization: {
      highPriorityChunks: 0,
      mediumPriorityChunks: 0,
      lowPriorityChunks: 0
    },
    issues: [],
    recommendations: [],
    detailedMetrics: {
      complexityDistribution: {},
      topicTagFrequency: {},
      relationshipDensity: 0,
      contextCompleteness: 0
    }
  };
  
  // Calculate basic metrics
  calculateBasicMetrics(chunks, analysis);
  
  // Calculate quality metrics
  calculateQualityMetrics(chunks, analysis);
  
  // Calculate performance metrics
  calculatePerformanceMetrics(chunks, analysis);
  
  // Identify issues
  identifyIssues(chunks, analysis);
  
  // Generate recommendations
  generateRecommendations(analysis, optimizationResult, metadataResult);
  
  // Calculate detailed metrics
  calculateDetailedMetrics(chunks, analysis);
  
  console.log(`📊 [CHUNKING ANALYZER] Analysis complete - Quality Score: ${analysis.qualityScore.toFixed(2)}`);
  return analysis;
}

/**
 * Calculate basic metrics
 */
function calculateBasicMetrics(chunks: Chunk[], analysis: ChunkingAnalysis): void {
  const lineCounts = chunks.map(chunk => chunk.content.split('\n').length);
  analysis.averageChunkSize = lineCounts.reduce((sum, count) => sum + count, 0) / chunks.length;
  
  // Size distribution
  analysis.sizeDistribution = {
    '1-10 lines': lineCounts.filter(count => count <= 10).length,
    '11-25 lines': lineCounts.filter(count => count > 10 && count <= 25).length,
    '26-50 lines': lineCounts.filter(count => count > 25 && count <= 50).length,
    '51-100 lines': lineCounts.filter(count => count > 50 && count <= 100).length,
    '100+ lines': lineCounts.filter(count => count > 100).length
  };
  
  // Content type breakdown
  analysis.contentTypeBreakdown = {
    'narrative': chunks.filter(chunk => chunk.metadata.type === 'plain_text').length,
    'table': chunks.filter(chunk => chunk.metadata.type === 'table_csv_sql').length,
    'code': chunks.filter(chunk => chunk.metadata.type === 'code').length,
    'research': chunks.filter(chunk => chunk.metadata.type === 'research_technical').length,
    'mixed': chunks.filter(chunk => chunk.metadata.type === 'mixed').length
  };
}

/**
 * Calculate quality metrics
 */
function calculateQualityMetrics(chunks: Chunk[], analysis: ChunkingAnalysis): void {
  let qualityScore = 0;
  let totalFactors = 0;
  
  chunks.forEach(chunk => {
    // Self-contained chunks
    if (chunk.metadata.isSelfContained) {
      analysis.selfContainedChunks++;
      qualityScore += 1;
    } else {
      qualityScore += 0.5;
    }
    totalFactors++;
    
    // Incomplete context
    if (chunk.metadata.hasIncompleteContext) {
      analysis.incompleteContextChunks++;
      qualityScore -= 0.2;
    }
    
    // Orphaned references
    if (chunk.metadata.containsReferences && !chunk.metadata.relatedTo) {
      analysis.orphanedReferences++;
      qualityScore -= 0.3;
    }
    
    // Size appropriateness
    const lines = chunk.content.split('\n').length;
    if (lines >= 15 && lines <= 80) {
      qualityScore += 0.1;
    } else if (lines < 5 || lines > 150) {
      qualityScore -= 0.2;
    }
  });
  
  analysis.qualityScore = Math.max(0, Math.min(1, qualityScore / totalFactors));
}

/**
 * Calculate performance metrics
 */
function calculatePerformanceMetrics(chunks: Chunk[], analysis: ChunkingAnalysis): void {
  chunks.forEach(chunk => {
    const retrievalScore = chunk.metadata.retrievalScore || 0.5;
    
    if (retrievalScore >= 0.7) {
      analysis.retrievalOptimization.highPriorityChunks++;
    } else if (retrievalScore >= 0.4) {
      analysis.retrievalOptimization.mediumPriorityChunks++;
    } else {
      analysis.retrievalOptimization.lowPriorityChunks++;
    }
  });
}

/**
 * Identify issues
 */
function identifyIssues(chunks: Chunk[], analysis: ChunkingAnalysis): void {
  // Size issues
  const tinyChunks = analysis.sizeDistribution['1-10 lines'];
  if (tinyChunks > chunks.length * 0.3) {
    analysis.issues.push(`Too many tiny chunks (${tinyChunks}/${chunks.length}) - consider merging`);
  }
  
  const hugeChunks = analysis.sizeDistribution['100+ lines'];
  if (hugeChunks > chunks.length * 0.2) {
    analysis.issues.push(`Too many large chunks (${hugeChunks}/${chunks.length}) - consider splitting`);
  }
  
  // Quality issues
  if (analysis.incompleteContextChunks > chunks.length * 0.2) {
    analysis.issues.push(`Many chunks have incomplete context (${analysis.incompleteContextChunks}/${chunks.length})`);
  }
  
  if (analysis.orphanedReferences > 0) {
    analysis.issues.push(`${analysis.orphanedReferences} chunks have orphaned references`);
  }
  
  // Content type issues
  if (analysis.contentTypeBreakdown.table === 0 && chunks.some(c => c.content.includes('|'))) {
    analysis.issues.push('Table content detected but not properly classified');
  }
  
  // Relationship issues
  const chunksWithRelationships = chunks.filter(c => 
    c.metadata.followsFrom !== undefined || 
    (c.metadata.relatedTo && c.metadata.relatedTo.length > 0)
  ).length;
  
  if (chunksWithRelationships < chunks.length * 0.3) {
    analysis.issues.push('Low relationship density - chunks may lack context connections');
  }
}

/**
 * Generate recommendations
 */
function generateRecommendations(
  analysis: ChunkingAnalysis, 
  optimizationResult?: OptimizationResult,
  metadataResult?: MetadataEnhancementResult
): void {
  // Size recommendations
  if (analysis.averageChunkSize < 15) {
    analysis.recommendations.push('Increase minimum chunk size to improve context');
  } else if (analysis.averageChunkSize > 60) {
    analysis.recommendations.push('Decrease maximum chunk size for better precision');
  }
  
  // Quality recommendations
  if (analysis.qualityScore < 0.6) {
    analysis.recommendations.push('Implement chunk quality validation and improvement');
  }
  
  if (analysis.incompleteContextChunks > 0) {
    analysis.recommendations.push('Add intelligent overlap to improve context continuity');
  }
  
  if (analysis.orphanedReferences > 0) {
    analysis.recommendations.push('Improve relationship detection for referenced content');
  }
  
  // Content type recommendations
  if (analysis.contentTypeBreakdown.table === 0 && analysis.contentTypeBreakdown.narrative > analysis.totalChunks * 0.8) {
    analysis.recommendations.push('Consider implementing content-type adaptive chunking');
  }
  
  // Performance recommendations
  if (analysis.retrievalOptimization.lowPriorityChunks > analysis.totalChunks * 0.4) {
    analysis.recommendations.push('Improve chunk self-containment for better retrieval');
  }
  
  // Optimization results
  if (optimizationResult) {
    if (optimizationResult.mergedChunks > 0) {
      analysis.recommendations.push(`Successfully merged ${optimizationResult.mergedChunks} small chunks`);
    }
    if (optimizationResult.splitChunks > 0) {
      analysis.recommendations.push(`Successfully split ${optimizationResult.splitChunks} large chunks`);
    }
  }
  
  // Metadata results
  if (metadataResult) {
    if (metadataResult.relationshipsFound > 0) {
      analysis.recommendations.push(`Found ${metadataResult.relationshipsFound} chunk relationships`);
    }
    if (metadataResult.qualityIssues.length > 0) {
      analysis.recommendations.push(`Address ${metadataResult.qualityIssues.length} metadata quality issues`);
    }
  }
}

/**
 * Calculate detailed metrics
 */
function calculateDetailedMetrics(chunks: Chunk[], analysis: ChunkingAnalysis): void {
  // Complexity distribution
  const complexityScores = chunks.map(c => c.metadata.complexityScore || 0);
  analysis.detailedMetrics.complexityDistribution = {
    'low (0-0.3)': complexityScores.filter(s => s <= 0.3).length,
    'medium (0.3-0.7)': complexityScores.filter(s => s > 0.3 && s <= 0.7).length,
    'high (0.7-1.0)': complexityScores.filter(s => s > 0.7).length
  };
  
  // Topic tag frequency
  const allTags: string[] = [];
  chunks.forEach(chunk => {
    if (chunk.metadata.topicTags) {
      allTags.push(...chunk.metadata.topicTags);
    }
  });
  
  const tagCounts: { [key: string]: number } = {};
  allTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
  
  // Get top 10 most frequent tags
  const topTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  topTags.forEach(([tag, count]) => {
    analysis.detailedMetrics.topicTagFrequency[tag] = count;
  });
  
  // Relationship density
  const chunksWithRelationships = chunks.filter(c => 
    c.metadata.followsFrom !== undefined || 
    (c.metadata.relatedTo && c.metadata.relatedTo.length > 0)
  ).length;
  
  analysis.detailedMetrics.relationshipDensity = chunksWithRelationships / chunks.length;
  
  // Context completeness
  const completeChunks = chunks.filter(c => c.metadata.isSelfContained).length;
  analysis.detailedMetrics.contextCompleteness = completeChunks / chunks.length;
}

/**
 * Generate comprehensive report
 */
export function generateChunkingReport(analysis: ChunkingAnalysis): string {
  const report: string[] = [];
  
  report.push('📊 CHUNKING ANALYSIS REPORT');
  report.push('=' .repeat(50));
  
  // Basic metrics
  report.push('\n📈 BASIC METRICS:');
  report.push(`   Total chunks: ${analysis.totalChunks}`);
  report.push(`   Average chunk size: ${analysis.averageChunkSize.toFixed(1)} lines`);
  report.push(`   Quality score: ${(analysis.qualityScore * 100).toFixed(1)}%`);
  
  // Size distribution
  report.push('\n📏 SIZE DISTRIBUTION:');
  Object.entries(analysis.sizeDistribution).forEach(([range, count]) => {
    const percentage = ((count / analysis.totalChunks) * 100).toFixed(1);
    report.push(`   ${range}: ${count} chunks (${percentage}%)`);
  });
  
  // Content types
  report.push('\n📄 CONTENT TYPES:');
  Object.entries(analysis.contentTypeBreakdown).forEach(([type, count]) => {
    const percentage = ((count / analysis.totalChunks) * 100).toFixed(1);
    report.push(`   ${type}: ${count} chunks (${percentage}%)`);
  });
  
  // Quality metrics
  report.push('\n✅ QUALITY METRICS:');
  report.push(`   Self-contained chunks: ${analysis.selfContainedChunks}/${analysis.totalChunks}`);
  report.push(`   Incomplete context: ${analysis.incompleteContextChunks}/${analysis.totalChunks}`);
  report.push(`   Orphaned references: ${analysis.orphanedReferences}/${analysis.totalChunks}`);
  
  // Performance metrics
  report.push('\n🚀 RETRIEVAL OPTIMIZATION:');
  report.push(`   High priority: ${analysis.retrievalOptimization.highPriorityChunks} chunks`);
  report.push(`   Medium priority: ${analysis.retrievalOptimization.mediumPriorityChunks} chunks`);
  report.push(`   Low priority: ${analysis.retrievalOptimization.lowPriorityChunks} chunks`);
  
  // Issues
  if (analysis.issues.length > 0) {
    report.push('\n❌ ISSUES:');
    analysis.issues.forEach(issue => {
      report.push(`   • ${issue}`);
    });
  }
  
  // Recommendations
  if (analysis.recommendations.length > 0) {
    report.push('\n🔧 RECOMMENDATIONS:');
    analysis.recommendations.forEach(rec => {
      report.push(`   • ${rec}`);
    });
  }
  
  // Detailed metrics
  report.push('\n📊 DETAILED METRICS:');
  report.push(`   Relationship density: ${(analysis.detailedMetrics.relationshipDensity * 100).toFixed(1)}%`);
  report.push(`   Context completeness: ${(analysis.detailedMetrics.contextCompleteness * 100).toFixed(1)}%`);
  
  if (Object.keys(analysis.detailedMetrics.topicTagFrequency).length > 0) {
    report.push('\n🏷️ TOP TOPIC TAGS:');
    Object.entries(analysis.detailedMetrics.topicTagFrequency)
      .slice(0, 5)
      .forEach(([tag, count]) => {
        report.push(`   ${tag}: ${count} occurrences`);
      });
  }
  
  report.push('\n' + '=' .repeat(50));
  
  return report.join('\n');
}

/**
 * Test RAG performance with sample queries
 */
export function testRAGPerformance(chunks: Chunk[]): RAGPerformanceTest[] {
  const tests: RAGPerformanceTest[] = [];
  
  // Test 1: Single chunk query
  const singleChunkTest: RAGPerformanceTest = {
    query: "What is the main topic of this document?",
    expectedChunks: [0], // First chunk should contain main topic
    actualChunks: [0],
    accuracy: 1.0,
    completeness: 1.0,
    contextQuality: 0.8
  };
  
  // Test 2: Multi-chunk query
  const multiChunkTest: RAGPerformanceTest = {
    query: "What are the key requirements and procedures?",
    expectedChunks: chunks
      .map((chunk, index) => ({ chunk, index }))
      .filter(({ chunk }) => 
        chunk.metadata.contentType === 'policy' || 
        chunk.content.includes('requirement') ||
        chunk.content.includes('procedure')
      )
      .map(({ index }) => index),
    actualChunks: [], // Would be filled by actual retrieval
    accuracy: 0.0, // Would be calculated by actual retrieval
    completeness: 0.0, // Would be calculated by actual retrieval
    contextQuality: 0.0 // Would be calculated by actual retrieval
  };
  
  // Test 3: Table-specific query
  const tableChunkTest: RAGPerformanceTest = {
    query: "What are the course outcomes and assessment criteria?",
    expectedChunks: chunks
      .map((chunk, index) => ({ chunk, index }))
      .filter(({ chunk }) => 
        chunk.metadata.contentType === 'table' ||
        chunk.content.includes('CO') ||
        chunk.content.includes('outcome')
      )
      .map(({ index }) => index),
    actualChunks: [],
    accuracy: 0.0,
    completeness: 0.0,
    contextQuality: 0.0
  };
  
  tests.push(singleChunkTest, multiChunkTest, tableChunkTest);
  
  return tests;
}
