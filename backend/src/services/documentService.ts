/**
 * Document Service - Handles document processing with proper job queue and duplicate prevention
 */

import { PrismaClient } from '../../generated/prisma';
import crypto from 'crypto';
import { processDocumentWithSmartChunking } from '../chunking/databaseIntegration';
import { CHUNKING_PRESETS } from '../chunking/chunkingPipeline';

export interface DocumentUploadResult {
  documentId: string;
  isDuplicate: boolean;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  message: string;
}

export class DocumentService {
  private prisma: PrismaClient;
  private processingQueue = new Map<string, Promise<void>>();

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Generate content hash for duplicate detection
   */
  private generateContentHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Check if document already exists and handle accordingly
   */
  async uploadDocument(
    userId: string,
    filename: string,
    originalName: string,
    content: string,
    mimeType?: string
  ): Promise<DocumentUploadResult> {
    const contentHash = this.generateContentHash(content);
    const fileSize = Buffer.byteLength(content, 'utf8');

    // Check if document already exists
    const existingDoc = await this.prisma.document.findUnique({
      where: { contentHash }
    });

    if (existingDoc) {
      // Document already exists
      if (existingDoc.status === 'COMPLETED') {
        // Verify embeddings actually exist in database
        const embeddingCount = await this.prisma.embedding.count({
          where: { documentId: existingDoc.id }
        });
        
        if (embeddingCount > 0) {
          return {
            documentId: existingDoc.id,
            isDuplicate: true,
            status: 'COMPLETED',
            message: `Document already processed and available for search (${embeddingCount} chunks)`
          };
        } else {
          // Document marked as completed but no embeddings exist - reprocess
          console.log(`[DocumentService] Document ${existingDoc.id} marked as completed but no embeddings found. Reprocessing...`);
          await this.prisma.document.update({
            where: { id: existingDoc.id },
            data: { 
              status: 'PENDING',
              processingError: null,
              processedChunks: 0
            }
          });
          
          // Start processing
          this.startProcessing(existingDoc.id, content);
          
          return {
            documentId: existingDoc.id,
            isDuplicate: true,
            status: 'PENDING',
            message: 'Document found but no embeddings exist. Reprocessing...'
          };
        }
      } else if (existingDoc.status === 'PROCESSING') {
        return {
          documentId: existingDoc.id,
          isDuplicate: true,
          status: 'PROCESSING',
          message: 'Document is currently being processed'
        };
      } else if (existingDoc.status === 'FAILED') {
        // Retry failed document
        await this.prisma.document.update({
          where: { id: existingDoc.id },
          data: { 
            status: 'PENDING',
            processingError: null,
            processedChunks: 0
          }
        });
        
        // Start processing
        this.startProcessing(existingDoc.id, content);
        
        return {
          documentId: existingDoc.id,
          isDuplicate: true,
          status: 'PENDING',
          message: 'Retrying failed document processing'
        };
      }
    }

    // Create new document record
    const document = await this.prisma.document.create({
      data: {
        userId,
        filename,
        originalName,
        contentHash,
        fileSize,
        mimeType,
        status: 'PENDING'
      }
    });

    // Start processing in background
    this.startProcessing(document.id, content);

    return {
      documentId: document.id,
      isDuplicate: false,
      status: 'PENDING',
      message: 'Document uploaded and processing started'
    };
  }

  /**
   * Start document processing with proper job queue management
   */
  private startProcessing(documentId: string, content: string): void {
    // Prevent duplicate processing
    if (this.processingQueue.has(documentId)) {
      console.log(`[DocumentService] Document ${documentId} already in processing queue`);
      return;
    }

    const processingPromise = this.processDocument(documentId, content);
    this.processingQueue.set(documentId, processingPromise);

    // Clean up when done
    processingPromise.finally(() => {
      this.processingQueue.delete(documentId);
    });
  }

  /**
   * Process document with proper status tracking
   */
  private async processDocument(documentId: string, content: string): Promise<void> {
    try {
      console.log(`[DocumentService] Starting processing for document ${documentId}`);

      // Update status to processing
      const document = await this.prisma.document.update({
        where: { id: documentId },
        data: { 
          status: 'PROCESSING',
          startedAt: new Date()
        }
      });

      // Process with smart chunking
      const result = await processDocumentWithSmartChunking(this.prisma, content, {
        userId: document.userId,
        documentId: document.id,
        source: document.filename,
        config: CHUNKING_PRESETS.GENERAL
      });

      if (result.success) {
        // Update document as completed
        await this.prisma.document.update({
          where: { id: documentId },
          data: {
            status: 'COMPLETED',
            totalChunks: result.totalChunks,
            processedChunks: result.processedChunks,
            completedAt: new Date()
          }
        });

        console.log(`[DocumentService] Completed processing document ${documentId}: ${result.processedChunks}/${result.totalChunks} chunks`);
      } else {
        // Mark as failed
        await this.prisma.document.update({
          where: { id: documentId },
          data: {
            status: 'FAILED',
            processingError: result.errors.join('; '),
            totalChunks: result.totalChunks,
            processedChunks: result.processedChunks
          }
        });

        console.error(`[DocumentService] Failed to process document ${documentId}:`, result.errors);
      }

    } catch (error) {
      console.error(`[DocumentService] Error processing document ${documentId}:`, error);

      // Mark as failed
      await this.prisma.document.update({
        where: { id: documentId },
        data: {
          status: 'FAILED',
          processingError: error instanceof Error ? error.message : String(error)
        }
      });
    }
  }

  /**
   * Get document processing status
   */
  async getDocumentStatus(documentId: string) {
    return await this.prisma.document.findUnique({
      where: { id: documentId },
      include: {
        _count: {
          select: { embeddings: true }
        }
      }
    });
  }

  /**
   * Get all documents for a user
   */
  async getUserDocuments(userId: string) {
    return await this.prisma.document.findMany({
      where: { userId },
      include: {
        _count: {
          select: { embeddings: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Cancel document processing
   */
  async cancelProcessing(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      throw new Error('Document not found');
    }

    if (document.status === 'PROCESSING') {
      await this.prisma.document.update({
        where: { id: documentId },
        data: { status: 'CANCELLED' }
      });

      // Note: We can't actually stop the processing promise, but we mark it as cancelled
      console.log(`[DocumentService] Cancelled processing for document ${documentId}`);
    }

    return document;
  }

  /**
   * Upload document that's already been chunked by adaptive processor
   * Uses transactional approach - only creates document entry after successful processing
   */
  async uploadPreChunkedDocument(
    userId: string,
    filename: string,
    originalName: string,
    chunkData: any[],
    mimeType?: string
  ): Promise<DocumentUploadResult> {
    // Generate content hash from all chunks combined
    const combinedContent = chunkData.map(c => c.chunk).join(' ');
    const contentHash = this.generateContentHash(combinedContent);
    const fileSize = Buffer.byteLength(combinedContent, 'utf8');

    // Check for existing document with embeddings
    const existingDoc = await this.prisma.document.findUnique({
      where: { contentHash },
      include: {
        _count: {
          select: { embeddings: true }
        }
      }
    });

    if (existingDoc) {
      const embeddingCount = existingDoc._count.embeddings;
      
      // Only consider it a duplicate if it has actual embeddings
      if (existingDoc.status === 'COMPLETED' && embeddingCount > 0) {
        return {
          documentId: existingDoc.id,
          isDuplicate: true,
          status: 'COMPLETED',
          message: `Document already processed and available for search (${embeddingCount} chunks)`
        };
      }
      
      // For any document without embeddings (FAILED, PENDING, PROCESSING, or COMPLETED without embeddings)
      // Clean it up and allow fresh processing
      console.log(`[DocumentService] Found existing document ${existingDoc.id} with status ${existingDoc.status} but ${embeddingCount} embeddings - cleaning up for retry`);
      
      // Clean up any partial embeddings
      if (embeddingCount > 0) {
        await this.prisma.embedding.deleteMany({
          where: { documentId: existingDoc.id }
        });
      }
      
      // Delete the document entry
      await this.prisma.document.delete({
        where: { id: existingDoc.id }
      });
      
      console.log(`[DocumentService] Cleaned up document ${existingDoc.id}, proceeding with fresh upload`);
    }

    // Process chunks first, then create document entry only if successful
    try {
      console.log(`[DocumentService] Starting transactional processing for ${filename} with ${chunkData.length} chunks`);
      
      // Generate embeddings first
      const { generateEmbeddingsForChunks, batchInsertChunks } = await import('../chunking/databaseIntegration');
      
      console.log(`[DocumentService] Generating embeddings for ${chunkData.length} pre-chunked segments`);
      const chunksWithEmbeddings = await generateEmbeddingsForChunks(chunkData);
      
      console.log(`[DocumentService] Generated ${chunksWithEmbeddings.length} embeddings, creating document entry`);
      
      // Create document entry only after successful embedding generation
      const document = await this.prisma.document.create({
        data: {
          userId,
          filename,
          originalName,
          contentHash,
          fileSize,
          mimeType: mimeType || 'application/pdf',
          status: 'PROCESSING'
        }
      });
      
      // Add documentId to chunks
      const chunksWithDocId = chunksWithEmbeddings.map(chunk => ({
        ...chunk,
        documentId: document.id
      }));
      
      // Insert chunks to database
      await batchInsertChunks(this.prisma, chunksWithDocId);
      
      // Mark document as completed
      await this.prisma.document.update({
        where: { id: document.id },
        data: { status: 'COMPLETED' }
      });
      
      console.log(`[DocumentService] ✅ Transactional processing completed for ${filename} - ${chunksWithEmbeddings.length} chunks stored`);
      
      return {
        documentId: document.id,
        isDuplicate: false,
        status: 'COMPLETED',
        message: `Document processed successfully with ${chunksWithEmbeddings.length} chunks`
      };
      
    } catch (error) {
      console.error(`[DocumentService] ❌ Transactional processing failed for ${filename}:`, error);
      
      // No document entry was created, so no cleanup needed
      // This prevents ghost documents
      
      return {
        documentId: '',
        isDuplicate: false,
        status: 'FAILED',
        message: `Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}. You can try uploading again.`
      };
    }
  }


  /**
   * Resume processing for pending/failed documents on startup
   */
  async resumePendingProcessing() {
    const pendingDocs = await this.prisma.document.findMany({
      where: {
        status: { in: ['PENDING', 'PROCESSING'] }
      }
    });

    console.log(`[DocumentService] Found ${pendingDocs.length} documents to resume processing`);

    for (const doc of pendingDocs) {
      // Reset processing status for stuck documents
      await this.prisma.document.update({
        where: { id: doc.id },
        data: { status: 'PENDING' }
      });

      // Note: We don't have the original content here, so we'd need to store it
      // or re-extract it from the file system if we implement file storage
      console.log(`[DocumentService] Document ${doc.id} (${doc.originalName}) needs manual restart`);
    }
  }
}
