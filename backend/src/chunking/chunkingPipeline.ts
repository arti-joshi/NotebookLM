/**
 * Smart Chunking Pipeline
 * Main entry point for intelligent document chunking with extensible architecture
 */

import { detectDocumentType, DocumentType, DocumentMetadata } from './documentDetector';
import { 
  Chunk, 
  ChunkingConfig, 
  DEFAULT_CONFIG,
  chunkPlainText,
  chunkResearchTechnical,
  chunkCode,
  chunkTableCSVSQL,
  chunkMixed
} from './chunkingStrategies';
import { consolidateTableFragments, analyzeTableFragmentation } from './tableConsolidation';
import { optimizeChunks, DEFAULT_OPTIMIZATION_CONFIG } from './chunkOptimization';
import { enhanceChunkMetadata } from './metadataEnhancement';
import { analyzeChunkingResults, generateChunkingReport } from './chunkingAnalyzer';

export interface ChunkingResult {
  chunks: Chunk[];
  metadata: DocumentMetadata;
  config: ChunkingConfig;
  processingTime: number;
  tableConsolidation?: {
    fragmentsMerged: number;
    tablesRestored: number;
    report: string[];
  };
  optimization?: {
    mergedChunks: number;
    splitChunks: number;
    addedOverlaps: number;
    qualityIssues: string[];
  };
  metadataEnhancement?: {
    metadataAdded: number;
    relationshipsFound: number;
    qualityIssues: string[];
  };
  analysis?: {
    qualityScore: number;
    recommendations: string[];
    report: string;
  };
}

export interface ChunkingOptions {
  config?: Partial<ChunkingConfig>;
  filename?: string;
  forceType?: DocumentType;
  customStrategies?: Map<DocumentType, (content: string, config: ChunkingConfig) => Chunk[]>;
  enableTableConsolidation?: boolean; // Enable table fragment consolidation
  enableOptimization?: boolean; // Enable chunk optimization
  enableMetadataEnhancement?: boolean; // Enable metadata enhancement
  enableAnalysis?: boolean; // Enable comprehensive analysis
  optimizationConfig?: Partial<typeof DEFAULT_OPTIMIZATION_CONFIG>;
}

/**
 * Main chunking function that intelligently processes documents
 * This is the primary function you'll call from your application
 */
export async function chunkDocument(
  content: string, 
  options: ChunkingOptions = {}
): Promise<ChunkingResult> {
  const startTime = Date.now();
  
  // Merge configuration
  const config: ChunkingConfig = {
    ...DEFAULT_CONFIG,
    ...options.config
  };
  
  // Detect document type (unless forced)
  const metadata = options.forceType 
    ? { 
        type: options.forceType, 
        confidence: 1.0, 
        features: {
          hasHeadings: false,
          hasCodeBlocks: false,
          hasTables: false,
          hasMarkdown: false,
          hasSQL: false,
          hasCSV: false,
          averageLineLength: 0,
          totalLines: 0
        }
      }
    : detectDocumentType(content, options.filename);
  
  // Select chunking strategy
  const strategy = selectChunkingStrategy(metadata.type, options.customStrategies);
  
  // Apply chunking strategy
  const chunks = strategy(content, config);
  
  // Post-process chunks (cleanup, validation, etc.)
  const processedChunks = postProcessChunks(chunks, config);
  
  // Table consolidation (if enabled)
  let consolidationResult = null;
  if (options.enableTableConsolidation !== false) {
    console.log('🔧 [CHUNKING PIPELINE] Starting table consolidation...');
    consolidationResult = consolidateTableFragments(processedChunks);
    
    // Update chunks with consolidated versions
    processedChunks.splice(0, processedChunks.length, ...consolidationResult.consolidatedChunks);
    
    // Update total chunks count
    processedChunks.forEach(chunk => {
      chunk.metadata.totalChunks = processedChunks.length;
    });
    
    console.log(`🔧 [CHUNKING PIPELINE] Table consolidation complete: ${consolidationResult.fragmentsMerged} fragments merged into ${consolidationResult.tablesRestored} tables`);
  }
  
  // Chunk optimization (if enabled)
  let optimizationResult = null;
  if (options.enableOptimization !== false) {
    console.log('🔧 [CHUNKING PIPELINE] Starting chunk optimization...');
    const optimizationConfig = { ...DEFAULT_OPTIMIZATION_CONFIG, ...options.optimizationConfig };
    optimizationResult = optimizeChunks(processedChunks, optimizationConfig);
    
    // Update chunks with optimized versions
    processedChunks.splice(0, processedChunks.length, ...optimizationResult.optimizedChunks);
    
    // Update total chunks count
    processedChunks.forEach(chunk => {
      chunk.metadata.totalChunks = processedChunks.length;
    });
    
    console.log(`🔧 [CHUNKING PIPELINE] Chunk optimization complete: ${optimizationResult.mergedChunks} merged, ${optimizationResult.splitChunks} split, ${optimizationResult.addedOverlaps} overlaps added`);
  }
  
  // Metadata enhancement (if enabled)
  let metadataResult = null;
  if (options.enableMetadataEnhancement !== false) {
    console.log('📊 [CHUNKING PIPELINE] Starting metadata enhancement...');
    metadataResult = enhanceChunkMetadata(processedChunks);
    
    // Update chunks with enhanced metadata
    processedChunks.splice(0, processedChunks.length, ...metadataResult.enhancedChunks);
    
    console.log(`📊 [CHUNKING PIPELINE] Metadata enhancement complete: ${metadataResult.metadataAdded} chunks enhanced, ${metadataResult.relationshipsFound} relationships found`);
  }
  
  // Comprehensive analysis (if enabled)
  let analysisResult = null;
  if (options.enableAnalysis !== false) {
    console.log('📊 [CHUNKING PIPELINE] Starting comprehensive analysis...');
    analysisResult = analyzeChunkingResults(processedChunks, optimizationResult || undefined, metadataResult || undefined);
    const analysisReport = generateChunkingReport(analysisResult);
    
    console.log(`📊 [CHUNKING PIPELINE] Analysis complete - Quality Score: ${analysisResult.qualityScore.toFixed(2)}`);
    console.log('📊 [CHUNKING PIPELINE] Analysis Report:');
    console.log(analysisReport);
  }
  
  const processingTime = Date.now() - startTime;
  
  return {
    chunks: processedChunks,
    metadata,
    config,
    processingTime,
    tableConsolidation: consolidationResult ? {
      fragmentsMerged: consolidationResult.fragmentsMerged,
      tablesRestored: consolidationResult.tablesRestored,
      report: consolidationResult.report
    } : undefined,
    optimization: optimizationResult ? {
      mergedChunks: optimizationResult.mergedChunks,
      splitChunks: optimizationResult.splitChunks,
      addedOverlaps: optimizationResult.addedOverlaps,
      qualityIssues: optimizationResult.qualityIssues
    } : undefined,
    metadataEnhancement: metadataResult ? {
      metadataAdded: metadataResult.metadataAdded,
      relationshipsFound: metadataResult.relationshipsFound,
      qualityIssues: metadataResult.qualityIssues
    } : undefined,
    analysis: analysisResult ? {
      qualityScore: analysisResult.qualityScore,
      recommendations: analysisResult.recommendations,
      report: generateChunkingReport(analysisResult)
    } : undefined
  };
}

/**
 * Selects the appropriate chunking strategy based on document type
 */
function selectChunkingStrategy(
  documentType: DocumentType,
  customStrategies?: Map<DocumentType, (content: string, config: ChunkingConfig) => Chunk[]>
): (content: string, config: ChunkingConfig) => Chunk[] {
  
  // Check for custom strategies first
  if (customStrategies && customStrategies.has(documentType)) {
    return customStrategies.get(documentType)!;
  }
  
  // Default strategies
  switch (documentType) {
    case DocumentType.PLAIN_TEXT:
      return chunkPlainText;
    case DocumentType.RESEARCH_TECHNICAL:
      return chunkResearchTechnical;
    case DocumentType.CODE:
      return chunkCode;
    case DocumentType.TABLE_CSV_SQL:
      return chunkTableCSVSQL;
    case DocumentType.MIXED:
      return chunkMixed;
    default:
      return chunkPlainText;
  }
}

/**
 * Post-processes chunks for quality and consistency
 */
function postProcessChunks(chunks: Chunk[], config: ChunkingConfig): Chunk[] {
  return chunks
    .map(chunk => ({
      ...chunk,
      content: chunk.content.trim()
    }))
    .filter(chunk => chunk.content.length >= config.minChunkSize)
    .map((chunk, index) => ({
      ...chunk,
      metadata: {
        ...chunk.metadata,
        chunkIndex: index,
        totalChunks: chunks.length
      }
    }));
}

/**
 * Batch chunking for multiple documents
 */
export async function chunkDocuments(
  documents: Array<{ content: string; filename?: string; options?: ChunkingOptions }>
): Promise<ChunkingResult[]> {
  const results: ChunkingResult[] = [];
  
  for (const doc of documents) {
    try {
      const result = await chunkDocument(doc.content, {
        filename: doc.filename,
        ...doc.options
      });
      results.push(result);
    } catch (error) {
      console.error(`Failed to chunk document ${doc.filename}:`, error);
      // Add empty result to maintain order
      results.push({
        chunks: [],
        metadata: {
          type: DocumentType.PLAIN_TEXT,
          confidence: 0,
          features: {
            hasHeadings: false,
            hasCodeBlocks: false,
            hasTables: false,
            hasMarkdown: false,
            hasSQL: false,
            hasCSV: false,
            averageLineLength: 0,
            totalLines: 0
          }
        },
        config: DEFAULT_CONFIG,
        processingTime: 0
      });
    }
  }
  
  return results;
}

/**
 * Utility function to get chunking statistics
 */
export function getChunkingStats(result: ChunkingResult): {
  totalChunks: number;
  averageChunkSize: number;
  totalContentLength: number;
  documentType: DocumentType;
  confidence: number;
  processingTime: number;
} {
  const totalContentLength = result.chunks.reduce((sum, chunk) => sum + chunk.content.length, 0);
  const averageChunkSize = result.chunks.length > 0 ? totalContentLength / result.chunks.length : 0;
  
  return {
    totalChunks: result.chunks.length,
    averageChunkSize: Math.round(averageChunkSize),
    totalContentLength,
    documentType: result.metadata.type,
    confidence: result.metadata.confidence,
    processingTime: result.processingTime
  };
}

/**
 * Utility function to validate chunking configuration
 */
export function validateConfig(config: Partial<ChunkingConfig>): string[] {
  const errors: string[] = [];
  
  if (config.chunkSize !== undefined && config.chunkSize < 50) {
    errors.push('chunkSize must be at least 50 characters');
  }
  
  if (config.overlap !== undefined && config.overlap < 0) {
    errors.push('overlap must be non-negative');
  }
  
  if (config.minChunkSize !== undefined && config.minChunkSize < 10) {
    errors.push('minChunkSize must be at least 10 characters');
  }
  
  if (config.maxChunkSize !== undefined && config.maxChunkSize < config.chunkSize!) {
    errors.push('maxChunkSize must be greater than or equal to chunkSize');
  }
  
  if (config.overlap !== undefined && config.chunkSize !== undefined && config.overlap >= config.chunkSize) {
    errors.push('overlap must be less than chunkSize');
  }
  
  return errors;
}

/**
 * Predefined configurations for common use cases
 */
export const CHUNKING_PRESETS = {
  // For general text documents
  GENERAL: {
    chunkSize: 1000,
    overlap: 200,
    minChunkSize: 100,
    maxChunkSize: 2000,
    preserveStructure: true
  } as ChunkingConfig,
  
  // For code repositories
  CODE: {
    chunkSize: 1500,
    overlap: 100,
    minChunkSize: 200,
    maxChunkSize: 3000,
    preserveStructure: true
  } as ChunkingConfig,
  
  // For research papers and technical docs
  RESEARCH: {
    chunkSize: 1200,
    overlap: 300,
    minChunkSize: 150,
    maxChunkSize: 2500,
    preserveStructure: true
  } as ChunkingConfig,
  
  // For tables and structured data
  TABULAR: {
    chunkSize: 2000,
    overlap: 0,
    minChunkSize: 500,
    maxChunkSize: 5000,
    preserveStructure: true
  } as ChunkingConfig,
  
  // For small documents (emails, notes)
  SMALL: {
    chunkSize: 500,
    overlap: 50,
    minChunkSize: 50,
    maxChunkSize: 1000,
    preserveStructure: true
  } as ChunkingConfig
};

/**
 * Helper function to create custom chunking strategies
 */
export function createCustomStrategy(
  name: string,
  strategy: (content: string, config: ChunkingConfig) => Chunk[]
): Map<DocumentType, (content: string, config: ChunkingConfig) => Chunk[]> {
  const customStrategies = new Map<DocumentType, (content: string, config: ChunkingConfig) => Chunk[]>();
  
  // You can extend this to support custom document types
  // For now, we'll map to existing types
  customStrategies.set(DocumentType.PLAIN_TEXT, strategy);
  
  return customStrategies;
}

/**
 * Export the main chunking function as the default export
 */
export default chunkDocument;
