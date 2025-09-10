/**
 * Smart Chunking System - Main Export
 * 
 * This module provides intelligent document chunking for RAG applications.
 * It automatically detects document types and applies appropriate chunking strategies.
 */

// Main chunking function
export { default as chunkDocument, chunkDocument as chunkDocumentSmart } from './chunkingPipeline';

// Document type detection
export { detectDocumentType, DocumentType } from './documentDetector';
export type { DocumentMetadata } from './documentDetector';

// Chunking strategies
export {
  chunkPlainText,
  chunkResearchTechnical,
  chunkCode,
  chunkTableCSVSQL,
  chunkMixed
} from './chunkingStrategies';
export type { Chunk, ChunkingConfig } from './chunkingStrategies';
export { DEFAULT_CONFIG } from './chunkingStrategies';
export { CHUNKING_PRESETS } from './chunkingPipeline';

// Database integration
export {
  processDocumentWithSmartChunking,
  getSmartChunks,
  getDocumentStats,
  deleteDocumentChunks,
  updateChunkingConfig,
  getChunkingPreset
} from './databaseIntegration';

// Pipeline utilities
export {
  chunkDocuments,
  getChunkingStats,
  validateConfig,
  createCustomStrategy
} from './chunkingPipeline';
export type { ChunkingResult, ChunkingOptions } from './chunkingPipeline';

// Re-export types for convenience
export type { ChunkingDatabaseOptions } from './databaseIntegration';
