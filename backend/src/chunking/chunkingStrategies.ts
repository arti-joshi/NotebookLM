/**
 * Chunking Strategies for Different Document Types
 * Each strategy is optimized for specific content types to improve RAG accuracy
 */

import { DocumentType } from './documentDetector';

export interface Chunk {
  content: string;
  metadata: {
    type: DocumentType;
    chunkIndex: number;
    totalChunks: number;
    source?: string;
    section?: string;
    startLine?: number;
    endLine?: number;
    [key: string]: any;
  };
}

export interface ChunkingConfig {
  chunkSize: number;
  overlap: number;
  minChunkSize: number;
  maxChunkSize: number;
  preserveStructure: boolean;
}

/**
 * Base chunking configuration
 */
export const DEFAULT_CONFIG: ChunkingConfig = {
  chunkSize: 1000,
  overlap: 200,
  minChunkSize: 100,
  maxChunkSize: 2000,
  preserveStructure: true
};

/**
 * Plain text chunking strategy
 * Uses simple character-based splitting with overlap
 */
export function chunkPlainText(content: string, config: ChunkingConfig = DEFAULT_CONFIG): Chunk[] {
  const clean = content.replace(/\s+/g, ' ').trim();
  const chunks: Chunk[] = [];
  let i = 0;
  let chunkIndex = 0;

  while (i < clean.length) {
    const end = Math.min(i + config.chunkSize, clean.length);
    const chunkContent = clean.slice(i, end);
    
    if (chunkContent.length >= config.minChunkSize) {
      chunks.push({
        content: chunkContent,
        metadata: {
          type: DocumentType.PLAIN_TEXT,
          chunkIndex,
          totalChunks: 0, // Will be updated later
          startLine: Math.floor(i / 50), // Rough estimate
          endLine: Math.floor(end / 50)
        }
      });
      chunkIndex++;
    }
    
    i += config.chunkSize - config.overlap;
  }

  // Update total chunks count
  chunks.forEach(chunk => {
    chunk.metadata.totalChunks = chunks.length;
  });

  return chunks;
}

/**
 * Research/Technical document chunking strategy
 * Splits by headings and paragraphs to maintain semantic coherence
 */
export function chunkResearchTechnical(content: string, config: ChunkingConfig = DEFAULT_CONFIG): Chunk[] {
  const chunks: Chunk[] = [];
  const lines = content.split('\n');
  
  // Split into sections based on headings
  const sections = splitIntoSections(lines);
  
  let chunkIndex = 0;
  
  for (const section of sections) {
    const sectionContent = section.content.join('\n');
    
    if (sectionContent.length <= config.maxChunkSize) {
      // Section fits in one chunk
      chunks.push({
        content: sectionContent,
        metadata: {
          type: DocumentType.RESEARCH_TECHNICAL,
          chunkIndex,
          totalChunks: 0, // Will be updated later
          section: section.title,
          startLine: section.startLine,
          endLine: section.endLine
        }
      });
      chunkIndex++;
    } else {
      // Split large sections into smaller chunks
      const subChunks = chunkPlainText(sectionContent, config);
      subChunks.forEach((chunk, i) => {
        chunk.metadata.type = DocumentType.RESEARCH_TECHNICAL;
        chunk.metadata.chunkIndex = chunkIndex;
        chunk.metadata.section = section.title;
        chunk.metadata.startLine = section.startLine + (i * 20); // Rough estimate
        chunk.metadata.endLine = section.startLine + ((i + 1) * 20);
        chunks.push(chunk);
        chunkIndex++;
      });
    }
  }

  // Update total chunks count
  chunks.forEach(chunk => {
    chunk.metadata.totalChunks = chunks.length;
  });

  return chunks;
}

/**
 * Code document chunking strategy
 * Preserves code blocks and functions intact
 */
export function chunkCode(content: string, config: ChunkingConfig = DEFAULT_CONFIG): Chunk[] {
  const chunks: Chunk[] = [];
  const lines = content.split('\n');
  
  // First, extract code blocks (``` blocks)
  const codeBlocks = extractCodeBlocks(content);
  
  let chunkIndex = 0;
  let currentChunk = '';
  let currentStartLine = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if we're in a code block
    const inCodeBlock = codeBlocks.some(block => 
      i >= block.startLine && i <= block.endLine
    );
    
    if (inCodeBlock) {
      // Find the complete code block
      const codeBlock = codeBlocks.find(block => 
        i >= block.startLine && i <= block.endLine
      );
      
      if (codeBlock) {
        // Add any accumulated content first
        if (currentChunk.trim()) {
          chunks.push({
            content: currentChunk.trim(),
            metadata: {
              type: DocumentType.CODE,
              chunkIndex,
              totalChunks: 0,
              startLine: currentStartLine,
              endLine: i - 1
            }
          });
          chunkIndex++;
        }
        
        // Add the complete code block
        const codeContent = lines.slice(codeBlock.startLine, codeBlock.endLine + 1).join('\n');
        chunks.push({
          content: codeContent,
          metadata: {
            type: DocumentType.CODE,
            chunkIndex,
            totalChunks: 0,
            section: `Code Block (${codeBlock.language || 'unknown'})`,
            startLine: codeBlock.startLine,
            endLine: codeBlock.endLine
          }
        });
        chunkIndex++;
        
        // Skip to end of code block
        i = codeBlock.endLine;
        currentChunk = '';
        currentStartLine = i + 1;
        continue;
      }
    }
    
    // Regular line processing
    currentChunk += line + '\n';
    
    // Check if we need to create a chunk
    if (currentChunk.length >= config.chunkSize) {
      chunks.push({
        content: currentChunk.trim(),
        metadata: {
          type: DocumentType.CODE,
          chunkIndex,
          totalChunks: 0,
          startLine: currentStartLine,
          endLine: i
        }
      });
      chunkIndex++;
      currentChunk = '';
      currentStartLine = i + 1;
    }
  }
  
  // Add remaining content
  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      metadata: {
        type: DocumentType.CODE,
        chunkIndex,
        totalChunks: 0,
        startLine: currentStartLine,
        endLine: lines.length - 1
      }
    });
    chunkIndex++;
  }

  // Update total chunks count
  chunks.forEach(chunk => {
    chunk.metadata.totalChunks = chunks.length;
  });

  return chunks;
}

/**
 * Table/CSV/SQL chunking strategy
 * Keeps entire tables and schemas together
 */
export function chunkTableCSVSQL(content: string, config: ChunkingConfig = DEFAULT_CONFIG): Chunk[] {
  const chunks: Chunk[] = [];
  const lines = content.split('\n');
  
  // Detect table boundaries
  const tables = extractTables(lines);
  
  let chunkIndex = 0;
  let currentChunk = '';
  let currentStartLine = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if we're in a table
    const inTable = tables.some(table => 
      i >= table.startLine && i <= table.endLine
    );
    
    if (inTable) {
      // Find the complete table
      const table = tables.find(t => 
        i >= t.startLine && i <= t.endLine
      );
      
      if (table) {
        console.log(`🔒 [TABLE PROCESSING] Processing table at lines ${table.startLine}-${table.endLine}, type: ${table.type}`);
        
        // Add any accumulated content first
        if (currentChunk.trim()) {
          console.log(`📦 [TABLE PROCESSING] Adding accumulated content before table (${currentChunk.length} chars)`);
          chunks.push({
            content: currentChunk.trim(),
            metadata: {
              type: DocumentType.TABLE_CSV_SQL,
              chunkIndex,
              totalChunks: 0,
              startLine: currentStartLine,
              endLine: i - 1
            }
          });
          chunkIndex++;
        }
        
        // Add the complete table
        const tableContent = lines.slice(table.startLine, table.endLine + 1).join('\n');
        console.log(`📊 [TABLE PROCESSING] Creating table chunk with ${table.endLine - table.startLine + 1} lines, ${tableContent.length} chars`);
        console.log(`📊 [TABLE PROCESSING] Table content preview: "${tableContent.substring(0, 100)}..."`);
        
        chunks.push({
          content: tableContent,
          metadata: {
            type: DocumentType.TABLE_CSV_SQL,
            chunkIndex,
            totalChunks: 0,
            section: 'Table/Data Structure',
            startLine: table.startLine,
            endLine: table.endLine,
            tableType: table.type
          }
        });
        chunkIndex++;
        
        // Skip to end of table
        console.log(`⏭️ [TABLE PROCESSING] Skipping to end of table at line ${table.endLine}`);
        i = table.endLine;
        currentChunk = '';
        currentStartLine = i + 1;
        continue;
      }
    }
    
    // Regular line processing
    currentChunk += line + '\n';
    
    // Check if we need to create a chunk
    if (currentChunk.length >= config.chunkSize) {
      chunks.push({
        content: currentChunk.trim(),
        metadata: {
          type: DocumentType.TABLE_CSV_SQL,
          chunkIndex,
          totalChunks: 0,
          startLine: currentStartLine,
          endLine: i
        }
      });
      chunkIndex++;
      currentChunk = '';
      currentStartLine = i + 1;
    }
  }
  
  // Add remaining content
  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      metadata: {
        type: DocumentType.TABLE_CSV_SQL,
        chunkIndex,
        totalChunks: 0,
        startLine: currentStartLine,
        endLine: lines.length - 1
      }
    });
    chunkIndex++;
  }

  // Update total chunks count
  chunks.forEach(chunk => {
    chunk.metadata.totalChunks = chunks.length;
  });

  return chunks;
}

/**
 * Mixed document chunking strategy
 * Combines multiple strategies based on content sections
 */
export function chunkMixed(content: string, config: ChunkingConfig = DEFAULT_CONFIG): Chunk[] {
  const chunks: Chunk[] = [];
  const lines = content.split('\n');
  
  // Identify different sections
  const sections = identifyMixedSections(lines);
  
  let chunkIndex = 0;
  
  for (const section of sections) {
    const sectionContent = lines.slice(section.startLine, section.endLine + 1).join('\n');
    
    // Apply appropriate chunking strategy based on section type
    let sectionChunks: Chunk[];
    
    switch (section.type) {
      case DocumentType.RESEARCH_TECHNICAL:
        sectionChunks = chunkResearchTechnical(sectionContent, config);
        break;
      case DocumentType.CODE:
        sectionChunks = chunkCode(sectionContent, config);
        break;
      case DocumentType.TABLE_CSV_SQL:
        sectionChunks = chunkTableCSVSQL(sectionContent, config);
        break;
      default:
        sectionChunks = chunkPlainText(sectionContent, config);
    }
    
    // Update metadata for section chunks
    sectionChunks.forEach((chunk, i) => {
      chunk.metadata.chunkIndex = chunkIndex;
      chunk.metadata.section = section.title;
      chunk.metadata.startLine = section.startLine + (chunk.metadata.startLine || 0);
      chunk.metadata.endLine = section.startLine + (chunk.metadata.endLine || 0);
      chunks.push(chunk);
      chunkIndex++;
    });
  }

  // Update total chunks count
  chunks.forEach(chunk => {
    chunk.metadata.totalChunks = chunks.length;
  });

  return chunks;
}

/**
 * Helper function to split content into sections based on headings
 */
function splitIntoSections(lines: string[]): Array<{
  title: string;
  content: string[];
  startLine: number;
  endLine: number;
}> {
  const sections: Array<{
    title: string;
    content: string[];
    startLine: number;
    endLine: number;
  }> = [];
  
  let currentSection: {
    title: string;
    content: string[];
    startLine: number;
    endLine: number;
  } | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for heading patterns
    if (/^(#{1,6}\s+|^\d+\.\s+|^[A-Z][A-Z\s]+$)/.test(line)) {
      // Save previous section
      if (currentSection) {
        currentSection.endLine = i - 1;
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        title: line.trim(),
        content: [line],
        startLine: i,
        endLine: i
      };
    } else if (currentSection) {
      currentSection.content.push(line);
    } else {
      // No current section, create a default one
      currentSection = {
        title: 'Introduction',
        content: [line],
        startLine: i,
        endLine: i
      };
    }
  }
  
  // Add final section
  if (currentSection) {
    currentSection.endLine = lines.length - 1;
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Helper function to extract code blocks
 */
function extractCodeBlocks(content: string): Array<{
  startLine: number;
  endLine: number;
  language?: string;
}> {
  const blocks: Array<{
    startLine: number;
    endLine: number;
    language?: string;
  }> = [];
  
  const lines = content.split('\n');
  let inCodeBlock = false;
  let blockStart = 0;
  let language = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true;
        blockStart = i;
        language = line.trim().slice(3).trim();
      } else {
        // End of code block
        inCodeBlock = false;
        blocks.push({
          startLine: blockStart,
          endLine: i,
          language: language || undefined
        });
      }
    }
  }
  
  return blocks;
}

/**
 * Enhanced table detection for academic and structured content
 * Detects multiple table patterns including course matrices, grading tables, etc.
 */
function extractTables(lines: string[]): Array<{
  startLine: number;
  endLine: number;
  type: 'markdown' | 'academic_matrix' | 'structured_data' | 'csv_like';
}> {
  const tables: Array<{
    startLine: number;
    endLine: number;
    type: 'markdown' | 'academic_matrix' | 'structured_data' | 'csv_like';
  }> = [];
  
  let inTable = false;
  let tableStart = 0;
  let tableType: 'markdown' | 'academic_matrix' | 'structured_data' | 'csv_like' = 'markdown';
  
  console.log('🔍 [TABLE DETECTION] Starting table extraction for', lines.length, 'lines');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Enhanced table detection patterns
    const isMarkdownTable = /\|.*\|.*\|/.test(line) || /^\s*\|.*\|.*$/.test(line);
    const isAcademicMatrix = detectAcademicMatrix(trimmed);
    const isStructuredData = detectStructuredData(trimmed);
    const isCSVLike = detectCSVLike(trimmed);
    
    const isTableLine = isMarkdownTable || isAcademicMatrix || isStructuredData || isCSVLike;
    
    if (isTableLine && !inTable) {
      // Start of table
      inTable = true;
      tableStart = i;
      
      // Determine table type
      if (isMarkdownTable) tableType = 'markdown';
      else if (isAcademicMatrix) tableType = 'academic_matrix';
      else if (isStructuredData) tableType = 'structured_data';
      else if (isCSVLike) tableType = 'csv_like';
      
      console.log(`📊 [TABLE DETECTION] Table START at line ${i}, type: ${tableType}, content: "${trimmed.substring(0, 50)}..."`);
    } else if (!isTableLine && inTable) {
      // End of table
      inTable = false;
      tables.push({
        startLine: tableStart,
        endLine: i - 1,
        type: tableType
      });
      
      console.log(`📊 [TABLE DETECTION] Table END at line ${i-1}, type: ${tableType}, lines: ${tableStart}-${i-1}`);
    }
  }
  
  // Handle table that goes to end of file
  if (inTable) {
    tables.push({
      startLine: tableStart,
      endLine: lines.length - 1,
      type: tableType
    });
    
    console.log(`📊 [TABLE DETECTION] Table END at EOF, type: ${tableType}, lines: ${tableStart}-${lines.length - 1}`);
  }
  
  console.log(`📊 [TABLE DETECTION] Found ${tables.length} tables total`);
  return tables;
}

/**
 * Detect academic matrices like "CO4 3 3 3 1 1 - - 2 1"
 */
function detectAcademicMatrix(line: string): boolean {
  // Pattern for course outcome matrices: CO/PO followed by numbers and dashes
  const academicMatrixPattern = /^(CO|PO|LO)\d*\s+[\d\s\-]+$/;
  
  // Pattern for grading tables with consistent spacing
  const gradingPattern = /^\s*\w+\s+[\d\s\-\.]+$/;
  
  // Pattern for assessment criteria tables
  const assessmentPattern = /^\s*\w+\s+[\d\s\-]+$/;
  
  const isMatrix = academicMatrixPattern.test(line) || 
                   gradingPattern.test(line) || 
                   assessmentPattern.test(line);
  
  if (isMatrix) {
    console.log(`🎓 [ACADEMIC MATRIX] Detected: "${line}"`);
  }
  
  return isMatrix;
}

/**
 * Detect structured data with consistent spacing
 */
function detectStructuredData(line: string): boolean {
  // Pattern for data with consistent spacing (at least 3 columns)
  const words = line.trim().split(/\s+/);
  
  if (words.length < 3) return false;
  
  // Check if it has numeric patterns
  const hasNumbers = words.some(word => /^\d+$/.test(word) || /^\-$/.test(word));
  
  // Check for consistent spacing (not too dense, not too sparse)
  const avgLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  const isStructured = hasNumbers && avgLength > 0 && avgLength < 10;
  
  if (isStructured) {
    console.log(`📋 [STRUCTURED DATA] Detected: "${line}"`);
  }
  
  return isStructured;
}

/**
 * Detect CSV-like data
 */
function detectCSVLike(line: string): boolean {
  // Pattern for comma-separated or tab-separated data
  const csvPattern = /^[^,]+,[^,]+,[^,]+/;
  const tsvPattern = /^[^\t]+\t[^\t]+\t[^\t]+/;
  
  const isCSV = csvPattern.test(line) || tsvPattern.test(line);
  
  if (isCSV) {
    console.log(`📄 [CSV LIKE] Detected: "${line}"`);
  }
  
  return isCSV;
}

/**
 * Helper function to identify sections in mixed documents
 */
function identifyMixedSections(lines: string[]): Array<{
  type: DocumentType;
  title: string;
  startLine: number;
  endLine: number;
}> {
  const sections: Array<{
    type: DocumentType;
    title: string;
    startLine: number;
    endLine: number;
  }> = [];
  
  let currentSection: {
    type: DocumentType;
    title: string;
    startLine: number;
    endLine: number;
  } | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Determine section type based on content
    let sectionType = DocumentType.PLAIN_TEXT;
    let sectionTitle = 'Content';
    
    if (/^(#{1,6}\s+|^\d+\.\s+|^[A-Z][A-Z\s]+$)/.test(line)) {
      sectionType = DocumentType.RESEARCH_TECHNICAL;
      sectionTitle = line.trim();
    } else if (/```[\s\S]*?```|^\s{4,}.*$/.test(line)) {
      sectionType = DocumentType.CODE;
      sectionTitle = 'Code Section';
    } else if (/\|.*\|.*\|/.test(line)) {
      sectionType = DocumentType.TABLE_CSV_SQL;
      sectionTitle = 'Table/Data';
    }
    
    // Start new section if type changed
    if (!currentSection || currentSection.type !== sectionType) {
      if (currentSection) {
        currentSection.endLine = i - 1;
        sections.push(currentSection);
      }
      
      currentSection = {
        type: sectionType,
        title: sectionTitle,
        startLine: i,
        endLine: i
      };
    } else {
      currentSection.endLine = i;
    }
  }
  
  // Add final section
  if (currentSection) {
    currentSection.endLine = lines.length - 1;
    sections.push(currentSection);
  }
  
  return sections;
}
