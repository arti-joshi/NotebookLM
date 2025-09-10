/**
 * Adaptive PDF Chunking Pipeline
 * Semantic-aware chunking that respects document structure and prevents section bleeding
 */

import { PrismaClient } from '../../generated/prisma';
import { DocumentType } from './documentDetector';

// Enhanced interfaces for semantic chunking
export interface PDFBlock {
  text: string;
  page: number;
  blockIndex: number;
  bbox: number[]; // [x0, y0, x1, y1]
  fontSize?: number;
  isBold?: boolean;
  isItalic?: boolean;
  fontName?: string;
  type?: 'paragraph' | 'heading' | 'table' | 'image' | 'list' | 'footer' | 'header';
}

export interface SemanticSection {
  title: string;
  level: number; // 1=main section, 2=subsection, etc.
  startBlock: number;
  endBlock: number;
  startPage: number;
  endPage: number;
  type: 'section' | 'chapter' | 'appendix' | 'references' | 'abstract';
}

export interface SemanticChunk {
  content: string;
  section: string;
  sectionLevel: number;
  pageStart: number;
  pageEnd: number;
  blockStart: number;
  blockEnd: number;
  chunkIndex: number;
  totalChunks: number;
  hasTable: boolean;
  hasImage: boolean;
  wordCount: number;
  metadata: {
    type: DocumentType;
    source?: string;
    documentId?: string;
  };
}

export interface AdaptiveChunkingConfig {
  targetChunkSize: number; // Target tokens per chunk
  maxChunkSize: number; // Maximum tokens per chunk
  minChunkSize: number; // Minimum tokens per chunk
  overlapPercentage: number; // Overlap as percentage of chunk size
  respectSectionBoundaries: boolean;
  preserveTableIntegrity: boolean;
  detectHeadingsByFont: boolean;
  detectHeadingsByPattern: boolean;
}

export const DEFAULT_ADAPTIVE_CONFIG: AdaptiveChunkingConfig = {
  targetChunkSize: 1200, // Increased for academic content
  maxChunkSize: 2000,    // Increased to accommodate complete tables
  minChunkSize: 400,     // Increased minimum to prevent tiny fragments
  overlapPercentage: 0.25, // 25% overlap for better continuity in academic content
  respectSectionBoundaries: true,
  preserveTableIntegrity: true, // CRITICAL: Must be true for table preservation
  detectHeadingsByFont: true,
  detectHeadingsByPattern: true
};

// Academic document specific configuration
export const ACADEMIC_DOCUMENT_CONFIG: AdaptiveChunkingConfig = {
  targetChunkSize: 1500, // Larger chunks for academic content
  maxChunkSize: 2500,    // Much larger to accommodate complete tables
  minChunkSize: 500,     // Higher minimum to prevent fragments
  overlapPercentage: 0.30, // Higher overlap for academic context
  respectSectionBoundaries: true,
  preserveTableIntegrity: true, // ESSENTIAL for academic tables
  detectHeadingsByFont: true,
  detectHeadingsByPattern: true
};

/**
 * Step 1: Parse PDF blocks from Python service response
 */
export function parsePDFBlocks(pythonServiceResponse: any): PDFBlock[] {
  const blocks: PDFBlock[] = [];
  
  if (!pythonServiceResponse.success || !pythonServiceResponse.blocks) {
    return blocks;
  }
  
  pythonServiceResponse.blocks.forEach((block: any, index: number) => {
    blocks.push({
      text: block.text.trim(),
      page: block.page_num,
      blockIndex: index,
      bbox: block.bbox,
      fontSize: block.font_size || 12,
      isBold: (block.font_flags & 16) !== 0, // Bold flag
      isItalic: (block.font_flags & 2) !== 0, // Italic flag
      type: classifyBlockType(block.text, block.font_size, block.font_flags)
    });
  });
  
  return blocks;
}

/**
 * Step 2: Detect semantic boundaries using multiple heuristics
 */
export function detectSemanticSections(blocks: PDFBlock[], config: AdaptiveChunkingConfig): SemanticSection[] {
  const sections: SemanticSection[] = [];
  let currentSection: Partial<SemanticSection> = {
    title: 'Introduction',
    level: 1,
    startBlock: 0,
    startPage: blocks[0]?.page || 1,
    type: 'section'
  };
  
  blocks.forEach((block, index) => {
    const isHeading = detectHeading(block, blocks, index, config);
    
    if (isHeading && index > 0) {
      // Close current section
      if (currentSection.startBlock !== undefined) {
        sections.push({
          title: currentSection.title || 'Untitled',
          level: currentSection.level || 1,
          startBlock: currentSection.startBlock,
          endBlock: index - 1,
          startPage: currentSection.startPage || 1,
          endPage: blocks[index - 1]?.page || 1,
          type: currentSection.type || 'section'
        });
      }
      
      // Start new section
      currentSection = {
        title: cleanHeadingText(block.text),
        level: determineHeadingLevel(block, blocks, index),
        startBlock: index,
        startPage: block.page,
        type: classifySectionType(block.text)
      };
    }
  });
  
  // Close final section
  if (currentSection.startBlock !== undefined && blocks.length > 0) {
    sections.push({
      title: currentSection.title || 'Conclusion',
      level: currentSection.level || 1,
      startBlock: currentSection.startBlock,
      endBlock: blocks.length - 1,
      startPage: currentSection.startPage || 1,
      endPage: blocks[blocks.length - 1]?.page || 1,
      type: currentSection.type || 'section'
    });
  }
  
  return sections;
}

/**
 * Step 3: Chunk within sections with intelligent overlap
 */
export function chunkWithinSections(
  blocks: PDFBlock[], 
  sections: SemanticSection[], 
  config: AdaptiveChunkingConfig
): SemanticChunk[] {
  const chunks: SemanticChunk[] = [];
  let globalChunkIndex = 0;
  
  sections.forEach(section => {
    const sectionBlocks = blocks.slice(section.startBlock, section.endBlock + 1);
    const sectionChunks = chunkSectionBlocks(sectionBlocks, section, config, globalChunkIndex);
    
    chunks.push(...sectionChunks);
    globalChunkIndex += sectionChunks.length;
  });
  
  // Update total chunks count
  chunks.forEach(chunk => {
    chunk.totalChunks = chunks.length;
  });
  
  return chunks;
}

/**
 * Step 4: Chunk blocks within a single section
 */
function chunkSectionBlocks(
  sectionBlocks: PDFBlock[], 
  section: SemanticSection, 
  config: AdaptiveChunkingConfig,
  startingChunkIndex: number
): SemanticChunk[] {
  const chunks: SemanticChunk[] = [];
  const overlapSize = Math.floor(config.targetChunkSize * config.overlapPercentage);
  
  let currentChunk: PDFBlock[] = [];
  let currentTokenCount = 0;
  let chunkIndex = startingChunkIndex;
  
  for (let i = 0; i < sectionBlocks.length; i++) {
    const block = sectionBlocks[i];
    const blockTokens = estimateTokenCount(block.text);
    
    // Handle tables as single chunks
    if (block.type === 'table' && config.preserveTableIntegrity) {
      console.log(`🔒 [TABLE INTEGRITY] Processing table block at index ${i}: "${block.text.substring(0, 50)}..."`);
      
      // Finalize current chunk if it has content
      if (currentChunk.length > 0) {
        console.log(`📦 [TABLE INTEGRITY] Finalizing previous chunk with ${currentChunk.length} blocks before table`);
        chunks.push(createSemanticChunk(currentChunk, section, chunkIndex, 0));
        chunkIndex++;
        currentChunk = [];
        currentTokenCount = 0;
      }
      
      // Create table chunk
      console.log(`📊 [TABLE INTEGRITY] Creating dedicated table chunk at index ${chunkIndex}`);
      const tableChunk = createSemanticChunk([block], section, chunkIndex, 0);
      chunks.push(tableChunk);
      chunkIndex++;
      continue;
    } else if (block.type === 'table' && !config.preserveTableIntegrity) {
      console.log(`⚠️ [TABLE INTEGRITY] Table detected but preserveTableIntegrity is FALSE - will be split!`);
    }
    
    // Check if adding this block would exceed max chunk size
    if (currentTokenCount + blockTokens > config.maxChunkSize && currentChunk.length > 0) {
      // Create chunk from current blocks
      chunks.push(createSemanticChunk(currentChunk, section, chunkIndex, 0));
      chunkIndex++;
      
      // Start new chunk with overlap
      const overlapBlocks = getOverlapBlocks(currentChunk, overlapSize);
      currentChunk = [...overlapBlocks, block];
      currentTokenCount = estimateTokenCount(currentChunk.map(b => b.text).join(' '));
    } else {
      // Add block to current chunk
      currentChunk.push(block);
      currentTokenCount += blockTokens;
    }
    
    // Check if we've reached target size
    if (currentTokenCount >= config.targetChunkSize) {
      chunks.push(createSemanticChunk(currentChunk, section, chunkIndex, 0));
      chunkIndex++;
      
      // Start new chunk with overlap
      const overlapBlocks = getOverlapBlocks(currentChunk, overlapSize);
      currentChunk = overlapBlocks;
      currentTokenCount = estimateTokenCount(currentChunk.map(b => b.text).join(' '));
    }
  }
  
  // Handle remaining blocks
  if (currentChunk.length > 0) {
    const remainingTokens = estimateTokenCount(currentChunk.map(b => b.text).join(' '));
    if (remainingTokens >= config.minChunkSize) {
      chunks.push(createSemanticChunk(currentChunk, section, chunkIndex, 0));
    } else if (chunks.length > 0) {
      // Merge with previous chunk if too small
      const lastChunk = chunks[chunks.length - 1];
      const mergedContent = lastChunk.content + ' ' + currentChunk.map(b => b.text).join(' ');
      chunks[chunks.length - 1] = {
        ...lastChunk,
        content: mergedContent,
        blockEnd: currentChunk[currentChunk.length - 1]?.blockIndex || lastChunk.blockEnd,
        pageEnd: currentChunk[currentChunk.length - 1]?.page || lastChunk.pageEnd,
        wordCount: estimateTokenCount(mergedContent)
      };
    }
  }
  
  return chunks;
}

/**
 * Helper functions
 */
function classifyBlockType(text: string, fontSize?: number, fontFlags?: number): PDFBlock['type'] {
  const trimmed = text.trim();
  
  if (!trimmed) return 'paragraph';
  
  // Enhanced table detection
  if (isTableContent(trimmed)) {
    console.log(`📊 [PDF TABLE DETECTION] Block classified as table: "${trimmed.substring(0, 50)}..."`);
    return 'table';
  }
  
  if (/^\s*\d+\.\s/.test(trimmed) || /^\s*[a-zA-Z]\.\s/.test(trimmed)) return 'list';
  
  // Heading detection by font
  if (fontSize && fontSize > 14) return 'heading';
  if (fontFlags && (fontFlags & 16) !== 0 && trimmed.length < 100) return 'heading';
  
  // Footer/header detection
  if (trimmed.length < 50 && /page\s+\d+/i.test(trimmed)) return 'footer';
  
  return 'paragraph';
}

/**
 * Enhanced table detection for PDF content
 */
function isTableContent(text: string): boolean {
  // Original markdown table detection
  if (text.includes('|') && text.split('|').length > 2) return true;
  
  // Academic matrix detection (CO4 3 3 3 1 1 - - 2 1)
  const academicMatrixPattern = /^(CO|PO|LO)\d*\s+[\d\s\-]+$/;
  if (academicMatrixPattern.test(text)) {
    console.log(`🎓 [PDF ACADEMIC MATRIX] Detected: "${text}"`);
    return true;
  }
  
  // Grading table detection
  const gradingPattern = /^\s*\w+\s+[\d\s\-\.]+$/;
  if (gradingPattern.test(text)) {
    console.log(`📊 [PDF GRADING TABLE] Detected: "${text}"`);
    return true;
  }
  
  // Structured data detection (consistent spacing with numbers)
  const words = text.trim().split(/\s+/);
  if (words.length >= 3) {
    const hasNumbers = words.some(word => /^\d+$/.test(word) || /^\-$/.test(word));
    const avgLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    if (hasNumbers && avgLength > 0 && avgLength < 10) {
      console.log(`📋 [PDF STRUCTURED DATA] Detected: "${text}"`);
      return true;
    }
  }
  
  // CSV-like detection
  const csvPattern = /^[^,]+,[^,]+,[^,]+/;
  const tsvPattern = /^[^\t]+\t[^\t]+\t[^\t]+/;
  if (csvPattern.test(text) || tsvPattern.test(text)) {
    console.log(`📄 [PDF CSV LIKE] Detected: "${text}"`);
    return true;
  }
  
  return false;
}

function detectHeading(block: PDFBlock, blocks: PDFBlock[], index: number, config: AdaptiveChunkingConfig): boolean {
  const text = block.text.trim();
  
  if (!text || text.length > 200) return false;
  
  // Pattern-based detection
  if (config.detectHeadingsByPattern) {
    const headingPatterns = [
      /^(Chapter|Section|Part)\s+\d+/i,
      /^\d+\.\s+[A-Z]/,
      /^[A-Z][A-Z\s]+$/,
      /^(Introduction|Conclusion|Abstract|References|Appendix|Methodology|Results|Discussion)/i
    ];
    
    if (headingPatterns.some(pattern => pattern.test(text))) return true;
  }
  
  // Font-based detection
  if (config.detectHeadingsByFont) {
    const avgFontSize = calculateAverageFontSize(blocks);
    if (block.fontSize && block.fontSize > avgFontSize * 1.2) return true;
    if (block.isBold && text.length < 100) return true;
  }
  
  return false;
}

function determineHeadingLevel(block: PDFBlock, blocks: PDFBlock[], index: number): number {
  const fontSize = block.fontSize || 12;
  const avgFontSize = calculateAverageFontSize(blocks);
  
  if (fontSize > avgFontSize * 1.5) return 1;
  if (fontSize > avgFontSize * 1.2) return 2;
  return 3;
}

function classifySectionType(text: string): SemanticSection['type'] {
  const lower = text.toLowerCase();
  
  if (lower.includes('abstract')) return 'abstract';
  if (lower.includes('reference') || lower.includes('bibliography')) return 'references';
  if (lower.includes('appendix')) return 'appendix';
  if (lower.includes('chapter')) return 'chapter';
  
  return 'section';
}

function cleanHeadingText(text: string): string {
  return text.trim()
    .replace(/^\d+\.\s*/, '') // Remove numbering
    .replace(/^(Chapter|Section|Part)\s+\d+\s*/i, '') // Remove chapter/section prefixes
    .substring(0, 100); // Limit length
}

function calculateAverageFontSize(blocks: PDFBlock[]): number {
  const fontSizes = blocks
    .map(b => b.fontSize)
    .filter((size): size is number => size !== undefined);
  
  return fontSizes.length > 0 ? fontSizes.reduce((a, b) => a + b, 0) / fontSizes.length : 12;
}

function estimateTokenCount(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}

function getOverlapBlocks(blocks: PDFBlock[], targetOverlapTokens: number): PDFBlock[] {
  const overlapBlocks: PDFBlock[] = [];
  let tokenCount = 0;
  
  // Take blocks from the end until we reach target overlap
  for (let i = blocks.length - 1; i >= 0 && tokenCount < targetOverlapTokens; i--) {
    const blockTokens = estimateTokenCount(blocks[i].text);
    if (tokenCount + blockTokens <= targetOverlapTokens * 1.5) { // Allow 50% tolerance
      overlapBlocks.unshift(blocks[i]);
      tokenCount += blockTokens;
    } else {
      break;
    }
  }
  
  return overlapBlocks;
}

function createSemanticChunk(
  blocks: PDFBlock[], 
  section: SemanticSection, 
  chunkIndex: number, 
  totalChunks: number
): SemanticChunk {
  const content = blocks.map(b => b.text).join(' ').trim();
  const hasTable = blocks.some(b => b.type === 'table');
  const hasImage = blocks.some(b => b.type === 'image');
  
  return {
    content,
    section: section.title,
    sectionLevel: section.level,
    pageStart: blocks[0]?.page || 1,
    pageEnd: blocks[blocks.length - 1]?.page || 1,
    blockStart: blocks[0]?.blockIndex || 0,
    blockEnd: blocks[blocks.length - 1]?.blockIndex || 0,
    chunkIndex,
    totalChunks,
    hasTable,
    hasImage,
    wordCount: estimateTokenCount(content),
    metadata: {
      type: DocumentType.RESEARCH_TECHNICAL // Will be determined by document detector
    }
  };
}

/**
 * Main function: Process PDF with adaptive chunking
 */
export async function processWithAdaptiveChunking(
  pythonServiceResponse: any,
  config: AdaptiveChunkingConfig = DEFAULT_ADAPTIVE_CONFIG
): Promise<SemanticChunk[]> {
  // Step 1: Parse PDF blocks
  const blocks = parsePDFBlocks(pythonServiceResponse);
  
  if (blocks.length === 0) {
    throw new Error('No text blocks found in PDF');
  }
  
  // Step 2: Detect semantic sections
  const sections = detectSemanticSections(blocks, config);
  
  // Step 3: Chunk within sections
  const chunks = chunkWithinSections(blocks, sections, config);
  
  console.log(`[AdaptiveChunking] Processed ${blocks.length} blocks into ${sections.length} sections and ${chunks.length} chunks`);
  
  return chunks;
}
