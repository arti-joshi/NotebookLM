/**
 * Debug Table Splitting Issues
 * Analyzes why tables are being split and provides detailed debugging information
 */

import { Chunk } from './chunkingStrategies';
import { detectTableBoundaries } from './tableBoundaryDetection';
import { analyzeTableFragmentation } from './tableConsolidation';

export interface TableSplittingAnalysis {
  originalContent: string;
  chunks: Chunk[];
  tableBoundaries: any[];
  fragmentationAnalysis: any;
  splittingIssues: string[];
  recommendations: string[];
  debugLog: string[];
}

/**
 * Debug the specific CO4 table splitting issue
 */
export function debugTableSplitting(
  originalContent: string, 
  chunks: Chunk[]
): TableSplittingAnalysis {
  console.log('🐛 [DEBUG TABLE SPLITTING] Starting analysis...');
  
  const analysis: TableSplittingAnalysis = {
    originalContent,
    chunks,
    tableBoundaries: [],
    fragmentationAnalysis: null,
    splittingIssues: [],
    recommendations: [],
    debugLog: []
  };
  
  // Step 1: Analyze original content for table boundaries
  const lines = originalContent.split('\n');
  const tableBoundaries = detectTableBoundaries(lines);
  analysis.tableBoundaries = tableBoundaries.boundaries;
  
  analysis.debugLog.push(`📊 Found ${tableBoundaries.boundaries.length} table boundaries in original content`);
  
  // Step 2: Analyze chunk fragmentation
  const fragmentationAnalysis = analyzeTableFragmentation(chunks);
  analysis.fragmentationAnalysis = fragmentationAnalysis;
  
  analysis.debugLog.push(`🔍 Fragmentation analysis: ${fragmentationAnalysis.tableFragments} fragments, ${fragmentationAnalysis.potentialTables} potential tables`);
  
  // Step 3: Identify specific splitting issues
  identifySplittingIssues(analysis);
  
  // Step 4: Generate recommendations
  generateRecommendations(analysis);
  
  // Step 5: Log detailed analysis
  logDetailedAnalysis(analysis);
  
  return analysis;
}

/**
 * Identify specific table splitting issues
 */
function identifySplittingIssues(analysis: TableSplittingAnalysis): void {
  const { chunks, tableBoundaries, originalContent } = analysis;
  const lines = originalContent.split('\n');
  
  // Check for CO4 patterns in chunks
  const co4Chunks = chunks.filter(chunk => 
    chunk.content.includes('CO4') || 
    chunk.content.includes('CO3') || 
    chunk.content.includes('CO2') || 
    chunk.content.includes('CO1')
  );
  
  if (co4Chunks.length > 1) {
    analysis.splittingIssues.push(`❌ CO4 table split across ${co4Chunks.length} chunks`);
    analysis.debugLog.push(`🐛 CO4 table fragments found in chunks: ${co4Chunks.map(c => c.metadata.chunkIndex).join(', ')}`);
    
    // Analyze each CO4 chunk
    co4Chunks.forEach((chunk, index) => {
      const co4Lines = chunk.content.split('\n').filter(line => line.includes('CO4'));
      analysis.debugLog.push(`   Chunk ${chunk.metadata.chunkIndex}: ${co4Lines.length} CO4 lines`);
      co4Lines.forEach(line => {
        analysis.debugLog.push(`     "${line.trim()}"`);
      });
    });
  }
  
  // Check for table boundaries that span multiple chunks
  for (const boundary of tableBoundaries) {
    const tableContent = lines.slice(boundary.startLine, boundary.endLine + 1).join('\n');
    const chunksContainingTable = chunks.filter(chunk => 
      chunk.content.includes(tableContent.substring(0, 50))
    );
    
    if (chunksContainingTable.length > 1) {
      analysis.splittingIssues.push(`❌ Table at lines ${boundary.startLine}-${boundary.endLine} split across ${chunksContainingTable.length} chunks`);
      analysis.debugLog.push(`🐛 Table boundary ${boundary.startLine}-${boundary.endLine} (${boundary.type}) split across chunks: ${chunksContainingTable.map(c => c.metadata.chunkIndex).join(', ')}`);
    }
  }
  
  // Check for preserveTableIntegrity setting
  const hasTableChunks = chunks.some(chunk => chunk.metadata.type === 'table_csv_sql');
  if (hasTableChunks) {
    analysis.debugLog.push(`✅ Found table chunks with type 'table_csv_sql'`);
  } else {
    analysis.splittingIssues.push(`❌ No chunks marked as table type despite table content`);
  }
  
  // Check chunk sizes for table content
  const tableChunks = chunks.filter(chunk => 
    chunk.content.includes('CO4') || 
    chunk.content.includes('CO3') || 
    chunk.content.includes('CO2') || 
    chunk.content.includes('CO1')
  );
  
  tableChunks.forEach(chunk => {
    const size = chunk.content.length;
    if (size < 200) {
      analysis.splittingIssues.push(`❌ Table chunk ${chunk.metadata.chunkIndex} is too small (${size} chars) - likely fragmented`);
    }
    analysis.debugLog.push(`📏 Table chunk ${chunk.metadata.chunkIndex}: ${size} chars`);
  });
}

/**
 * Generate recommendations to fix table splitting
 */
function generateRecommendations(analysis: TableSplittingAnalysis): void {
  const { splittingIssues, chunks } = analysis;
  
  if (splittingIssues.length === 0) {
    analysis.recommendations.push('✅ No table splitting issues detected');
    return;
  }
  
  // Check if preserveTableIntegrity is enabled
  const hasTableContent = chunks.some(chunk => 
    chunk.content.includes('CO4') || 
    chunk.content.includes('CO3') || 
    chunk.content.includes('CO2') || 
    chunk.content.includes('CO1')
  );
  
  if (hasTableContent) {
    analysis.recommendations.push('🔧 Enable preserveTableIntegrity in chunking config');
    analysis.recommendations.push('🔧 Use ACADEMIC_DOCUMENT_CONFIG for academic content');
    analysis.recommendations.push('🔧 Increase maxChunkSize to accommodate complete tables');
  }
  
  // Check for table detection issues
  const co4Chunks = chunks.filter(chunk => chunk.content.includes('CO4'));
  if (co4Chunks.length > 1) {
    analysis.recommendations.push('🔧 Improve table detection patterns for academic matrices');
    analysis.recommendations.push('🔧 Use table consolidation to merge fragmented tables');
  }
  
  // Check chunk sizes
  const smallTableChunks = chunks.filter(chunk => 
    (chunk.content.includes('CO4') || chunk.content.includes('CO3')) && 
    chunk.content.length < 200
  );
  
  if (smallTableChunks.length > 0) {
    analysis.recommendations.push('🔧 Increase minChunkSize to prevent tiny table fragments');
    analysis.recommendations.push('🔧 Implement table boundary locking');
  }
  
  analysis.recommendations.push('🔧 Enable table consolidation in chunking pipeline');
  analysis.recommendations.push('🔧 Add comprehensive logging to track table processing');
}

/**
 * Log detailed analysis
 */
function logDetailedAnalysis(analysis: TableSplittingAnalysis): void {
  console.log('🐛 [DEBUG TABLE SPLITTING] Detailed Analysis:');
  console.log('=' .repeat(50));
  
  // Log original content analysis
  console.log('📄 Original Content Analysis:');
  const lines = analysis.originalContent.split('\n');
  const co4Lines = lines.filter(line => line.includes('CO4'));
  console.log(`   Total lines: ${lines.length}`);
  console.log(`   CO4 lines: ${co4Lines.length}`);
  co4Lines.forEach((line, index) => {
    console.log(`   Line ${index + 1}: "${line.trim()}"`);
  });
  
  // Log chunk analysis
  console.log('\n📦 Chunk Analysis:');
  analysis.chunks.forEach(chunk => {
    const hasCO4 = chunk.content.includes('CO4');
    const size = chunk.content.length;
    console.log(`   Chunk ${chunk.metadata.chunkIndex}: ${size} chars, has CO4: ${hasCO4}`);
    if (hasCO4) {
      const co4Content = chunk.content.split('\n').filter(line => line.includes('CO4'));
      co4Content.forEach(line => {
        console.log(`     "${line.trim()}"`);
      });
    }
  });
  
  // Log table boundaries
  console.log('\n📊 Table Boundaries:');
  analysis.tableBoundaries.forEach((boundary, index) => {
    console.log(`   Boundary ${index + 1}: lines ${boundary.startLine}-${boundary.endLine}, type: ${boundary.type}, confidence: ${boundary.confidence}`);
  });
  
  // Log issues
  console.log('\n❌ Splitting Issues:');
  analysis.splittingIssues.forEach(issue => {
    console.log(`   ${issue}`);
  });
  
  // Log recommendations
  console.log('\n🔧 Recommendations:');
  analysis.recommendations.forEach(rec => {
    console.log(`   ${rec}`);
  });
  
  console.log('=' .repeat(50));
}

/**
 * Quick fix for table splitting - implement table boundary lock
 */
export function implementQuickFix(
  content: string, 
  config: { maxChunkSize: number; preserveTableIntegrity: boolean }
): { canSplitAtLine: (lineIndex: number) => boolean; lockedBoundaries: any[] } {
  
  const lines = content.split('\n');
  const tableBoundaries = detectTableBoundaries(lines);
  
  return {
    lockedBoundaries: tableBoundaries.boundaries,
    canSplitAtLine: (lineIndex: number) => {
      // Check if line is inside any table boundary
      for (const boundary of tableBoundaries.boundaries) {
        if (lineIndex >= boundary.startLine && lineIndex <= boundary.endLine) {
          return false; // Cannot split inside table
        }
      }
      return true; // Can split outside tables
    }
  };
}

/**
 * Test the CO4 pattern detection
 */
export function testCO4PatternDetection(): void {
  console.log('🧪 [TEST CO4 PATTERN] Testing CO4 pattern detection...');
  
  const testLines = [
    'CO4 3 3 3 1 1 - - 2 1',
    'CO3 2 2 3 2 1 1 - 1 1',
    'CO2 1 1 2 1 1 1 - 1 1',
    'Regular text line',
    'CO1 1 1 1 1 1 1 1 1 1'
  ];
  
  const boundaries = detectTableBoundaries(testLines);
  
  console.log(`🧪 [TEST CO4 PATTERN] Found ${boundaries.boundaries.length} table boundaries`);
  boundaries.boundaries.forEach((boundary, index) => {
    console.log(`   Boundary ${index + 1}: lines ${boundary.startLine}-${boundary.endLine}, type: ${boundary.type}`);
  });
}
