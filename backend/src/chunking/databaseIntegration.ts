/**
 * Database Integration for Smart Chunking
 * Helper functions to integrate smart chunking with Prisma and PostgreSQL
 */

import { PrismaClient } from '../../generated/prisma';
import { chunkDocument, ChunkingResult, CHUNKING_PRESETS } from './chunkingPipeline';
import { DocumentType } from './documentDetector';

// Timeout wrapper function
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true
        reject(new Error('timeout'))
      }
    }, ms)

    promise.then(value => {
      if (!settled) {
        settled = true
        clearTimeout(timeout)
        resolve(value)
      }
    }).catch(error => {
      if (!settled) {
        settled = true
        clearTimeout(timeout)
        reject(error)
      }
    })
  })
}

export interface ChunkingDatabaseOptions {
  userId: string;
  source: string;
  config?: any;
  forceType?: DocumentType;
  documentId?: string; // Link to Document table
}

/**
 * Processes a document with smart chunking and saves to database
 * OPTIMIZED VERSION: Batch processing with parallel embeddings
 */
export async function processDocumentWithSmartChunking(
  prisma: PrismaClient,
  content: string,
  options: ChunkingDatabaseOptions
): Promise<{
  success: boolean;
  totalChunks: number;
  processedChunks: number;
  documentType: DocumentType;
  processingTime: number;
  errors: string[];
}> {
  const errors: string[] = [];
  const startTime = Date.now();
  
  try {
    // Apply smart chunking
    const chunkingResult = await chunkDocument(content, {
      filename: options.source,
      forceType: options.forceType,
      config: options.config
    });
    
    console.log(`[Chunking] Created ${chunkingResult.chunks.length} chunks for ${options.source}`);
    
    // 🚀 OPTIMIZATION 1: Batch embedding generation with concurrency control and rate limiting
    const BATCH_SIZE = 3; // Further reduced batch size for stability
    const BATCH_DELAY_MS = 1500; // Increased delay to respect API limits
    const embeddings: (number[] | null)[] = [];
    
    console.log(`[Embeddings] Processing ${chunkingResult.chunks.length} chunks in batches of ${BATCH_SIZE}`);
    
    for (let i = 0; i < chunkingResult.chunks.length; i += BATCH_SIZE) {
      const batch = chunkingResult.chunks.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i/BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(chunkingResult.chunks.length/BATCH_SIZE);
      
      console.log(`[Embeddings] Processing batch ${batchNum}/${totalBatches} (chunks ${i+1}-${Math.min(i+BATCH_SIZE, chunkingResult.chunks.length)})`);
      
      // Generate embeddings in parallel for this batch with individual timeouts
      const batchEmbeddings = await Promise.allSettled(
        batch.map(chunk => withTimeout(
          generateEmbedding(chunk.content),
          10000 // 10 second timeout per embedding
        ))
      );
      
      // Collect results
      for (const result of batchEmbeddings) {
        if (result.status === 'fulfilled') {
          embeddings.push(result.value);
        } else {
          console.error('Embedding generation failed:', result.reason);
          embeddings.push(null);
          errors.push(`Embedding generation failed: ${result.reason}`);
        }
      }
      
      // Rate limiting: delay between batches (except for the last batch)
      if (batchNum < totalBatches) {
        console.log(`[Embeddings] Waiting ${BATCH_DELAY_MS}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
      }
    }
    
    // 🚀 OPTIMIZATION 2: Chunked database insert for large documents
    console.log(`[Database] Starting database insertion phase...`);
    console.log(`[Database] Embeddings generated: ${embeddings.length}, Chunks: ${chunkingResult.chunks.length}`);
    
    const embeddingData = chunkingResult.chunks.map((chunk, index) => {
      const baseData = {
        userId: options.userId,
        source: options.source,
        chunk: chunk.content,
        embedding: embeddings[index] || [],
        documentType: chunk.metadata.type,
        chunkIndex: chunk.metadata.chunkIndex || index,
        totalChunks: chunkingResult.chunks.length,
        section: chunk.metadata.section,
        startLine: chunk.metadata.startLine,
        endLine: chunk.metadata.endLine,
        chunkingConfig: options.config || CHUNKING_PRESETS.GENERAL
      };
      
      // Only add documentId if it exists
      if (options.documentId) {
        return { ...baseData, documentId: options.documentId };
      }
      
      return baseData;
    });
    
    console.log(`[Database] Prepared ${embeddingData.length} records for insertion`);
    console.log(`[Database] Sample record structure:`, {
      userId: embeddingData[0]?.userId,
      source: embeddingData[0]?.source,
      chunkLength: embeddingData[0]?.chunk?.length,
      embeddingLength: Array.isArray(embeddingData[0]?.embedding) ? embeddingData[0].embedding.length : 'not array',
      documentType: embeddingData[0]?.documentType
    });
    
    // Use transaction with timeout for bulk insert, split into smaller batches for large documents
    const DB_BATCH_SIZE = 100; // Insert 100 records at a time
    let totalInserted = 0;
    
    // First, delete existing chunks for this document
    console.log(`[Database] Deleting existing chunks for source: ${options.source}`);
    const deleteWhere = options.documentId 
      ? { documentId: options.documentId }
      : { userId: options.userId, source: options.source };
    
    const deleteResult = await prisma.embedding.deleteMany({
      where: deleteWhere
    });
    console.log(`[Database] Deleted ${deleteResult.count} existing chunks`);
    
    // Insert in batches to avoid transaction timeouts
    for (let i = 0; i < embeddingData.length; i += DB_BATCH_SIZE) {
      const batch = embeddingData.slice(i, i + DB_BATCH_SIZE);
      
      try {
        const result = await prisma.$transaction(async (tx) => {
          return await tx.embedding.createMany({
            data: batch,
            skipDuplicates: true
          });
        }, {
          timeout: 30000 // 30 second timeout per batch
        });
        
        totalInserted += result.count;
        console.log(`[Database] Inserted batch ${Math.floor(i/DB_BATCH_SIZE) + 1}/${Math.ceil(embeddingData.length/DB_BATCH_SIZE)} (${result.count} records)`);
      } catch (dbError: any) {
        console.error(`[Database] Failed to insert batch ${Math.floor(i/DB_BATCH_SIZE) + 1}:`, {
          error: dbError.message,
          code: dbError.code,
          meta: dbError.meta,
          batchSize: batch.length,
          sampleRecord: batch[0] ? {
            userId: batch[0].userId,
            source: batch[0].source,
            chunkLength: batch[0].chunk?.length,
            embeddingType: typeof batch[0].embedding,
            embeddingLength: Array.isArray(batch[0].embedding) ? batch[0].embedding.length : 'not array'
          } : 'no records'
        });
        errors.push(`Database insert failed for batch ${Math.floor(i/DB_BATCH_SIZE) + 1}: ${dbError.message}`);
      }
    }
    
    const insertedChunks = { count: totalInserted };
    
    // 🚀 OPTIMIZATION 3: Optimized pgvector update with error handling
    if (insertedChunks.count > 0) {
      console.log(`[pgvector] Updating vector columns for ${insertedChunks.count} chunks`);
      
      try {
        // Get the inserted records to update pgvector
        const insertedRecords = await prisma.embedding.findMany({
          where: {
            userId: options.userId,
            source: options.source
          },
          orderBy: { chunkIndex: 'asc' },
          select: { id: true, embedding: true } // Only select needed fields
        });
        
        // Update pgvector columns in smaller batches with error handling
        const VECTOR_BATCH_SIZE = 25; // Reduced batch size for stability
        let vectorsUpdated = 0;
        
        for (let i = 0; i < insertedRecords.length; i += VECTOR_BATCH_SIZE) {
          const batch = insertedRecords.slice(i, i + VECTOR_BATCH_SIZE);
          
          const updatePromises = batch.map(async ({ id, embedding }: { id: string; embedding: unknown }) => {
            try {
              const embeddingArray = embedding as number[];
              if (embeddingArray && Array.isArray(embeddingArray) && embeddingArray.length > 0) {
                const vec = `[${embeddingArray.join(',')}]`;
                await prisma.$executeRaw`
                  UPDATE "Embedding" 
                  SET embedding_vec = ${vec}::vector 
                  WHERE id = ${id}
                `;
                return true;
              }
              return false;
            } catch (vecError) {
              console.error(`[pgvector] Failed to update vector for record ${id}:`, vecError);
              return false;
            }
          });
          
          const results = await Promise.allSettled(updatePromises);
          const batchSuccess = results.filter((r: PromiseSettledResult<boolean>) => r.status === 'fulfilled' && r.value).length;
          vectorsUpdated += batchSuccess;
          
          console.log(`[pgvector] Updated batch ${Math.floor(i/VECTOR_BATCH_SIZE) + 1}/${Math.ceil(insertedRecords.length/VECTOR_BATCH_SIZE)} (${batchSuccess}/${batch.length} successful)`);
        }
        
        console.log(`[pgvector] Successfully updated ${vectorsUpdated}/${insertedRecords.length} vector columns`);
      } catch (vectorError) {
        console.error('[pgvector] Vector update failed:', vectorError);
        errors.push(`Vector update failed: ${vectorError}`);
      }
    }
    
    const processingTime = Date.now() - startTime;
    console.log(`[Complete] Processed ${options.source} in ${processingTime}ms`);
    
    return {
      success: insertedChunks.count > 0,
      totalChunks: chunkingResult.chunks.length,
      processedChunks: insertedChunks.count,
      documentType: chunkingResult.metadata.type,
      processingTime,
      errors
    };
    
  } catch (error) {
    const errorMsg = `Failed to process document: ${error}`;
    console.error(errorMsg);
    errors.push(errorMsg);
    
    return {
      success: false,
      totalChunks: 0,
      processedChunks: 0,
      documentType: DocumentType.PLAIN_TEXT,
      processingTime: Date.now() - startTime,
      errors
    };
  }
}

/**
 * Retrieves chunks with smart filtering based on document type and metadata
 */
export async function getSmartChunks(
  prisma: PrismaClient,
  userId: string,
  options: {
    documentType?: DocumentType;
    source?: string;
    section?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  const where: any = { userId };
  
  if (options.documentType) {
    where.documentType = options.documentType;
  }
  
  if (options.source) {
    where.source = options.source;
  }
  
  if (options.section) {
    where.section = options.section;
  }
  
  return await prisma.embedding.findMany({
    where,
    orderBy: [
      { source: 'asc' },
      { chunkIndex: 'asc' }
    ],
    take: options.limit || 100,
    skip: options.offset || 0,
    select: {
      id: true,
      source: true,
      chunk: true,
      documentType: true,
      chunkIndex: true,
      totalChunks: true,
      section: true,
      startLine: true,
      endLine: true,
      chunkingConfig: true,
      createdAt: true
    }
  });
}

/**
 * Gets document statistics for a user
 */
export async function getDocumentStats(
  prisma: PrismaClient,
  userId: string
) {
  const stats = await prisma.embedding.groupBy({
    by: ['source', 'documentType'],
    where: { userId },
    _count: {
      id: true
    },
    _avg: {
      chunkIndex: true
    }
  });
  
  return stats.map((stat: any) => ({
    source: stat.source,
    documentType: stat.documentType,
    chunkCount: stat._count.id,
    averageChunkIndex: stat._avg.chunkIndex
  }));
}

/**
 * Deletes all chunks for a specific document
 */
export async function deleteDocumentChunks(
  prisma: PrismaClient,
  userId: string,
  source: string
) {
  return await prisma.embedding.deleteMany({
    where: {
      userId,
      source
    }
  });
}

/**
 * Updates chunking configuration for existing chunks
 */
export async function updateChunkingConfig(
  prisma: PrismaClient,
  userId: string,
  source: string,
  newConfig: any
) {
  return await prisma.embedding.updateMany({
    where: {
      userId,
      source
    },
    data: {
      chunkingConfig: newConfig
    }
  });
}

/**
 * Generate embedding using Google Generative AI with retry logic
 * This integrates with your existing embedding setup
 */
async function generateEmbedding(text: string): Promise<number[]> {
  // Import here to avoid circular dependencies
  const { GoogleGenerativeAIEmbeddings } = await import('@langchain/google-genai');
  
  if (!process.env.GOOGLE_API_KEY) {
    console.warn('GOOGLE_API_KEY not set - returning empty embedding');
    return [];
  }
  
  // Truncate text if too long (Google has limits)
  const maxLength = 20000; // Conservative limit
  const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  
  const maxRetries = 3;
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        modelName: 'text-embedding-004'
      });
      
      const result = await embeddings.embedQuery(truncatedText);
      
      if (attempt > 1) {
        console.log(`[Embedding] Success on attempt ${attempt}`);
      }
      
      return result;
    } catch (error: any) {
      lastError = error;
      console.warn(`[Embedding] Attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      // If it's a rate limit error, wait longer before retrying
      if (error.message?.includes('rate') || error.message?.includes('quota')) {
        const delay = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
        console.log(`[Embedding] Rate limited, waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else if (attempt < maxRetries) {
        // For other errors, wait a shorter time
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  console.error(`[Embedding] Failed after ${maxRetries} attempts:`, lastError?.message);
  return [];
}

/**
 * Generate embeddings for pre-chunked data (adaptive chunking)
 */
export async function generateEmbeddingsForChunks(chunks: any[]): Promise<any[]> {
  console.log(`[DatabaseIntegration] Generating embeddings for ${chunks.length} pre-chunked segments`);
  
  const chunksWithEmbeddings = [];
  const batchSize = 5; // Process in small batches to avoid rate limits
  
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (chunk) => {
      try {
        const embedding = await generateEmbedding(chunk.chunk);
        return {
          ...chunk,
          embedding
        };
      } catch (error) {
        console.error(`[DatabaseIntegration] Failed to generate embedding for chunk ${chunk.chunkIndex}:`, error);
        return {
          ...chunk,
          embedding: [] // Empty embedding as fallback
        };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    chunksWithEmbeddings.push(...batchResults);
    
    // Rate limiting delay between batches
    if (i + batchSize < chunks.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`[DatabaseIntegration] Processed batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(chunks.length/batchSize)}`);
  }
  
  return chunksWithEmbeddings;
}

/**
 * Batch insert pre-chunked data with embeddings
 */
export async function batchInsertChunks(prisma: PrismaClient, chunks: any[]): Promise<void> {
  console.log(`[DatabaseIntegration] Batch inserting ${chunks.length} chunks to database`);
  
  const batchSize = 50; // Database batch size
  
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    
    try {
      await prisma.embedding.createMany({
        data: batch.map(chunk => ({
          userId: chunk.userId,
          source: chunk.source,
          chunk: chunk.chunk,
          embedding: chunk.embedding,
          documentType: chunk.documentType || 'PDF',
          chunkIndex: chunk.chunkIndex,
          totalChunks: chunk.totalChunks,
          section: chunk.section,
          startLine: chunk.startLine,
          endLine: chunk.endLine,
          sectionLevel: chunk.sectionLevel,
          pageStart: chunk.pageStart,
          pageEnd: chunk.pageEnd,
          hasTable: chunk.hasTable || false,
          hasImage: chunk.hasImage || false,
          wordCount: chunk.wordCount,
          documentId: chunk.documentId
        }))
      });
      
      console.log(`[DatabaseIntegration] Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(chunks.length/batchSize)}`);
      
    } catch (error) {
      console.error(`[DatabaseIntegration] Failed to insert batch starting at index ${i}:`, error);
      throw error;
    }
  }
  
  console.log(`[DatabaseIntegration] Successfully inserted all ${chunks.length} chunks`);
}

/**
 * Helper function to get chunking preset based on document type
 */
export function getChunkingPreset(documentType: DocumentType) {
  switch (documentType) {
    case DocumentType.CODE:
      return CHUNKING_PRESETS.CODE;
    case DocumentType.RESEARCH_TECHNICAL:
      return CHUNKING_PRESETS.RESEARCH;
    case DocumentType.TABLE_CSV_SQL:
      return CHUNKING_PRESETS.TABULAR;
    case DocumentType.PLAIN_TEXT:
    default:
      return CHUNKING_PRESETS.GENERAL;
  }
}
