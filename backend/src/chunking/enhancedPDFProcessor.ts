/**
 * Enhanced PDF Processor - Integration layer for adaptive chunking
 * Connects Python PDF service with adaptive chunking pipeline
 */

import axios from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { processWithAdaptiveChunking, DEFAULT_ADAPTIVE_CONFIG, SemanticChunk, AdaptiveChunkingConfig } from './adaptivePDFChunking';

const PYTHON_PDF_SERVICE_URL = process.env.PYTHON_PDF_SERVICE_URL || 'http://localhost:8001';

export interface EnhancedPDFResult {
  success: boolean;
  chunks: SemanticChunk[];
  metadata: {
    totalPages: number;
    totalBlocks: number;
    totalSections: number;
    processingTime: number;
    documentType: string;
  };
  error?: string;
}

/**
 * Enhanced PDF parsing with adaptive chunking
 * Replaces the old parsePdfWithPython function
 */
export async function parseAndChunkPDF(
  filePath: string,
  config: AdaptiveChunkingConfig = DEFAULT_ADAPTIVE_CONFIG
): Promise<EnhancedPDFResult> {
  const startTime = Date.now();
  
  try {
    console.log(`[EnhancedPDF] Processing ${filePath} with adaptive chunking`);
    
    // Step 1: Get structured blocks from Python service
    const form = new FormData();
    form.append('file', createReadStream(filePath));
    
    const response = await axios.post(`${PYTHON_PDF_SERVICE_URL}/parse-pdf`, form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 120000, // 2 minutes timeout
      maxContentLength: 100 * 1024 * 1024, // 100MB max response
    });
    
    const pythonResult = response.data;
    
    if (!pythonResult.success) {
      throw new Error(pythonResult.error || 'Python PDF service failed');
    }
    
    console.log(`[EnhancedPDF] Python service extracted ${pythonResult.blocks.length} blocks from ${pythonResult.page_count} pages`);
    
    // Step 2: Apply adaptive chunking
    const chunks = await processWithAdaptiveChunking(pythonResult, config);
    
    const processingTime = Date.now() - startTime;
    
    // Step 3: Calculate sections count
    const uniqueSections = new Set(chunks.map(c => c.section)).size;
    
    console.log(`[EnhancedPDF] Created ${chunks.length} semantic chunks across ${uniqueSections} sections in ${processingTime}ms`);
    
    return {
      success: true,
      chunks,
      metadata: {
        totalPages: pythonResult.page_count,
        totalBlocks: pythonResult.blocks.length,
        totalSections: uniqueSections,
        processingTime,
        documentType: 'PDF'
      }
    };
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        return {
          success: false,
          chunks: [],
          metadata: { totalPages: 0, totalBlocks: 0, totalSections: 0, processingTime, documentType: 'PDF' },
          error: 'Python PDF service is not running. Please start it with: cd pdf-parser && uvicorn app:app --port 8001'
        };
      } else if (error.response) {
        return {
          success: false,
          chunks: [],
          metadata: { totalPages: 0, totalBlocks: 0, totalSections: 0, processingTime, documentType: 'PDF' },
          error: `Python PDF service error: ${error.response.status} ${error.response.statusText} - ${error.response.data?.error || 'Unknown error'}`
        };
      } else if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          chunks: [],
          metadata: { totalPages: 0, totalBlocks: 0, totalSections: 0, processingTime, documentType: 'PDF' },
          error: 'PDF processing timed out. The file may be too large or complex.'
        };
      }
    }
    
    return {
      success: false,
      chunks: [],
      metadata: { totalPages: 0, totalBlocks: 0, totalSections: 0, processingTime, documentType: 'PDF' },
      error: `Enhanced PDF processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Convert semantic chunks to database format
 */
export function convertChunksForDatabase(
  chunks: SemanticChunk[],
  options: {
    userId: string;
    source: string;
    documentId?: string;
  }
) {
  return chunks.map((chunk, index) => {
    const baseData = {
      userId: options.userId,
      source: options.source,
      chunk: chunk.content,
      embedding: [], // Will be filled by embedding generation
      documentType: chunk.metadata.type,
      chunkIndex: chunk.chunkIndex,
      totalChunks: chunk.totalChunks,
      section: chunk.section,
      startLine: chunk.blockStart,
      endLine: chunk.blockEnd,
      
      // Enhanced metadata for adaptive chunking
      sectionLevel: chunk.sectionLevel,
      pageStart: chunk.pageStart,
      pageEnd: chunk.pageEnd,
      hasTable: chunk.hasTable,
      hasImage: chunk.hasImage,
      wordCount: chunk.wordCount,
      
      chunkingConfig: {
        type: 'adaptive',
        respectsSectionBoundaries: true,
        preservesTableIntegrity: chunk.hasTable,
        semanticAware: true
      }
    };
    
    // Add documentId if provided
    if (options.documentId) {
      return { ...baseData, documentId: options.documentId };
    }
    
    return baseData;
  });
}

/**
 * Fallback to simple text extraction if adaptive chunking fails
 */
export async function fallbackTextExtraction(filePath: string): Promise<string> {
  try {
    const form = new FormData();
    form.append('file', createReadStream(filePath));
    
    const response = await axios.post(`${PYTHON_PDF_SERVICE_URL}/parse-pdf`, form, {
      headers: { ...form.getHeaders() },
      timeout: 60000
    });
    
    if (response.data.success) {
      return response.data.full_text;
    }
    
    throw new Error('Python service failed');
  } catch (error) {
    console.error('[EnhancedPDF] Fallback extraction failed:', error);
    throw new Error('Both adaptive and fallback PDF processing failed');
  }
}
