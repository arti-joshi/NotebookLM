/**
 * Table Consolidation System
 * Identifies and merges fragmented table chunks back into complete tables
 */

import { Chunk } from './chunkingStrategies';

export interface TableFragment {
  chunkIndex: number;
  content: string;
  metadata: any;
  isTableStart: boolean;
  isTableEnd: boolean;
  tableType: 'academic_matrix' | 'grading' | 'structured_data' | 'markdown' | 'unknown';
}

export interface ConsolidationResult {
  consolidatedChunks: Chunk[];
  fragmentsMerged: number;
  tablesRestored: number;
  report: string[];
}

/**
 * Main consolidation function
 */
export function consolidateTableFragments(chunks: Chunk[]): ConsolidationResult {
  console.log('🔧 [TABLE CONSOLIDATION] Starting consolidation of', chunks.length, 'chunks');
  
  const result: ConsolidationResult = {
    consolidatedChunks: [],
    fragmentsMerged: 0,
    tablesRestored: 0,
    report: []
  };
  
  // Step 1: Identify table fragments
  const fragments = identifyTableFragments(chunks);
  console.log(`🔍 [TABLE CONSOLIDATION] Found ${fragments.length} potential table fragments`);
  
  // Step 2: Group fragments by table
  const tableGroups = groupTableFragments(fragments);
  console.log(`📊 [TABLE CONSOLIDATION] Grouped into ${tableGroups.length} table groups`);
  
  // Step 3: Process each chunk
  let i = 0;
  while (i < chunks.length) {
    const chunk = chunks[i];
    
    // Check if this chunk is part of a table group
    const tableGroup = tableGroups.find(group => 
      group.some(fragment => fragment.chunkIndex === i)
    );
    
    if (tableGroup) {
      // Consolidate the table group
      const consolidatedChunk = consolidateTableGroup(tableGroup, chunks);
      result.consolidatedChunks.push(consolidatedChunk);
      result.fragmentsMerged += tableGroup.length;
      result.tablesRestored++;
      
      // Skip to end of table group
      i += tableGroup.length;
      
      result.report.push(`✅ Consolidated table from chunks ${tableGroup[0].chunkIndex}-${tableGroup[tableGroup.length - 1].chunkIndex}`);
    } else {
      // Keep regular chunk as-is
      result.consolidatedChunks.push(chunk);
      i++;
    }
  }
  
  console.log(`🎉 [TABLE CONSOLIDATION] Complete: ${result.fragmentsMerged} fragments merged into ${result.tablesRestored} tables`);
  return result;
}

/**
 * Identify chunks that are likely table fragments
 */
function identifyTableFragments(chunks: Chunk[]): TableFragment[] {
  const fragments: TableFragment[] = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const content = chunk.content.trim();
    
    // Check for academic matrix patterns
    if (isAcademicMatrixFragment(content)) {
      fragments.push({
        chunkIndex: i,
        content,
        metadata: chunk.metadata,
        isTableStart: isTableStart(content, i, chunks),
        isTableEnd: isTableEnd(content, i, chunks),
        tableType: 'academic_matrix'
      });
    }
    // Check for grading table patterns
    else if (isGradingTableFragment(content)) {
      fragments.push({
        chunkIndex: i,
        content,
        metadata: chunk.metadata,
        isTableStart: isTableStart(content, i, chunks),
        isTableEnd: isTableEnd(content, i, chunks),
        tableType: 'grading'
      });
    }
    // Check for structured data patterns
    else if (isStructuredDataFragment(content)) {
      fragments.push({
        chunkIndex: i,
        content,
        metadata: chunk.metadata,
        isTableStart: isTableStart(content, i, chunks),
        isTableEnd: isTableEnd(content, i, chunks),
        tableType: 'structured_data'
      });
    }
  }
  
  return fragments;
}

/**
 * Check if content is an academic matrix fragment
 */
function isAcademicMatrixFragment(content: string): boolean {
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // CO/PO pattern: CO4 3 3 3 1 1 - - 2 1
    if (/^(CO|PO|LO)\d*\s+[\d\s\-]+$/.test(trimmed)) {
      return true;
    }
    
    // Assessment pattern with consistent spacing
    if (/^\s*\w+\s+[\d\s\-]+$/.test(trimmed) && trimmed.split(/\s+/).length >= 4) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if content is a grading table fragment
 */
function isGradingTableFragment(content: string): boolean {
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Grading pattern: Student1 85 90 78 92
    if (/^\s*\w+\s+[\d\s\-\.]+$/.test(trimmed)) {
      const words = trimmed.split(/\s+/);
      const numericWords = words.filter(word => /^\d+$/.test(word) || /^\-$/.test(word));
      
      // At least 3 numeric values
      if (numericWords.length >= 3) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check if content is structured data fragment
 */
function isStructuredDataFragment(content: string): boolean {
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    const words = trimmed.split(/\s+/);
    
    // Must have at least 4 columns
    if (words.length >= 4) {
      const numericWords = words.filter(word => /^\d+$/.test(word) || /^\-$/.test(word));
      
      // At least 50% numeric values
      if (numericWords.length >= words.length * 0.5) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check if this is the start of a table
 */
function isTableStart(content: string, index: number, chunks: Chunk[]): boolean {
  // Check if previous chunk doesn't contain table-like content
  if (index > 0) {
    const prevContent = chunks[index - 1].content.trim();
    if (isAcademicMatrixFragment(prevContent) || isGradingTableFragment(prevContent)) {
      return false;
    }
  }
  
  // Check if this chunk starts with table-like content
  const lines = content.split('\n');
  return lines.some(line => 
    /^(CO|PO|LO)\d*\s+[\d\s\-]+$/.test(line.trim()) ||
    /^\s*\w+\s+[\d\s\-\.]+$/.test(line.trim())
  );
}

/**
 * Check if this is the end of a table
 */
function isTableEnd(content: string, index: number, chunks: Chunk[]): boolean {
  // Check if next chunk doesn't contain table-like content
  if (index < chunks.length - 1) {
    const nextContent = chunks[index + 1].content.trim();
    if (isAcademicMatrixFragment(nextContent) || isGradingTableFragment(nextContent)) {
      return false;
    }
  }
  
  // Check if this chunk ends with table-like content
  const lines = content.split('\n');
  const lastLine = lines[lines.length - 1]?.trim();
  
  return Boolean(lastLine) && (
    /^(CO|PO|LO)\d*\s+[\d\s\-]+$/.test(lastLine) ||
    /^\s*\w+\s+[\d\s\-\.]+$/.test(lastLine)
  );
}

/**
 * Group table fragments that belong to the same table
 */
function groupTableFragments(fragments: TableFragment[]): TableFragment[][] {
  const groups: TableFragment[][] = [];
  const processed = new Set<number>();
  
  for (const fragment of fragments) {
    if (processed.has(fragment.chunkIndex)) continue;
    
    const group = [fragment];
    processed.add(fragment.chunkIndex);
    
    // Find consecutive fragments
    let nextIndex = fragment.chunkIndex + 1;
    while (nextIndex < fragments.length) {
      const nextFragment = fragments.find(f => f.chunkIndex === nextIndex);
      if (nextFragment && !processed.has(nextFragment.chunkIndex)) {
        group.push(nextFragment);
        processed.add(nextFragment.chunkIndex);
        nextIndex++;
      } else {
        break;
      }
    }
    
    // Only create groups with multiple fragments
    if (group.length > 1) {
      groups.push(group);
    }
  }
  
  return groups;
}

/**
 * Consolidate a group of table fragments into a single chunk
 */
function consolidateTableGroup(fragments: TableFragment[], allChunks: Chunk[]): Chunk {
  // Sort fragments by chunk index
  fragments.sort((a, b) => a.chunkIndex - b.chunkIndex);
  
  // Combine all content
  const combinedContent = fragments.map(f => f.content).join('\n');
  
  // Use metadata from first fragment
  const firstFragment = fragments[0];
  const metadata = {
    ...firstFragment.metadata,
    consolidatedFrom: fragments.map(f => f.chunkIndex),
    tableType: firstFragment.tableType,
    fragmentCount: fragments.length,
    originalChunkIndices: fragments.map(f => f.chunkIndex)
  };
  
  console.log(`🔗 [TABLE CONSOLIDATION] Merging ${fragments.length} fragments into single chunk`);
  console.log(`🔗 [TABLE CONSOLIDATION] Combined content: "${combinedContent.substring(0, 100)}..."`);
  
  return {
    content: combinedContent,
    metadata
  };
}

/**
 * Analyze chunking results and report table fragmentation
 */
export function analyzeTableFragmentation(chunks: Chunk[]): {
  totalChunks: number;
  tableFragments: number;
  potentialTables: number;
  fragmentationReport: string[];
} {
  const fragments = identifyTableFragments(chunks);
  const tableGroups = groupTableFragments(fragments);
  
  const report: string[] = [];
  report.push(`📊 Table Fragmentation Analysis:`);
  report.push(`   Total chunks: ${chunks.length}`);
  report.push(`   Table fragments: ${fragments.length}`);
  report.push(`   Potential tables: ${tableGroups.length}`);
  
  for (const group of tableGroups) {
    const content = group.map(f => f.content).join(' | ');
    report.push(`   📋 Table group (${group.length} fragments): "${content.substring(0, 80)}..."`);
  }
  
  return {
    totalChunks: chunks.length,
    tableFragments: fragments.length,
    potentialTables: tableGroups.length,
    fragmentationReport: report
  };
}
