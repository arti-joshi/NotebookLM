/**
 * Document Service - Advanced LangChain-based document processing
 * Handles document processing with proper job queue and duplicate prevention
 */

import { PrismaClient } from '@prisma/client';
import { Document } from 'langchain/document';
import { 
  RecursiveCharacterTextSplitter,
  MarkdownTextSplitter,
  CharacterTextSplitter
} from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { getEmbedding } from './embeddingService';

// Define ChunkContentType locally since it's not exported
type ChunkContentType = 'sql_example' | 'table' | 'warning' | 'text';

export interface DocumentUploadResult {
  documentId: string;
  isDuplicate: boolean;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  message: string;
}

export class DocumentService {
  private prisma: PrismaClient;
  private processingQueue = new Map<string, Promise<void>>();
  private embeddings: GoogleGenerativeAIEmbeddings;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY!,
      modelName: "text-embedding-004"
    });
  }

  /**
   * Enhanced content type detection with PostgreSQL-aware classification
   */
  private detectContentType(text: string): ChunkContentType {
    const lowerText = text.toLowerCase();
    
    // Enhanced SQL pattern detection
    const sqlPatterns = [
      /\b(create|insert|select|update|delete|alter|drop|grant|revoke)\s+/i,
      /\b(explain|analyze|vacuum|reindex|cluster)\s+/i,
      /\b(begin|commit|rollback|savepoint)\s+/i,
      /\b(declare|fetch|open|close|cursor)\s+/i,
      /\b(function|procedure|trigger|view|index)\s+/i,
      /\b(union|intersect|except|with)\s+/i,
      /\b(inner|left|right|full|outer)\s+join/i,
      /\b(group\s+by|order\s+by|having|where)\s+/i,
      /\b(limit|offset|distinct|all)\s+/i
    ];
    
    const hasSqlPattern = sqlPatterns.some(pattern => pattern.test(text));
    if (hasSqlPattern) return "sql_example";
    
    // Enhanced table detection
    const tablePattern = /\|.*\|.*\n.*---/;
    if (tablePattern.test(text)) return "table";
    
    // Enhanced warning detection
    const warningPatterns = [
      /\b(note|caution|warning|important|tip|hint):/i,
      /\b(be\s+aware|remember|notice|attention):/i,
      /\b(deprecated|obsolete|removed|changed):/i,
      /\b(security|permission|privilege|access):/i
    ];
    
    const hasWarningPattern = warningPatterns.some(pattern => pattern.test(text));
    if (hasWarningPattern) return "warning";
    
    return "text";
  }

  /**
   * Extract PostgreSQL-specific metadata from content
   */
  private extractPostgreSQLMetadata(content: string): Record<string, any> {
    const metadata: Record<string, any> = {};
    
    // Extract SQL keywords
    const sqlKeywords = content.match(/\b(create|insert|select|update|delete|alter|drop|grant|revoke|explain|analyze|vacuum|reindex|cluster|begin|commit|rollback|savepoint|declare|fetch|open|close|cursor|function|procedure|trigger|view|index|union|intersect|except|with|inner|left|right|full|outer|group|order|having|where|limit|offset|distinct|all)\b/gi);
    if (sqlKeywords) {
      metadata.sqlKeywords = [...new Set(sqlKeywords.map(k => k.toLowerCase()))];
    }
    
    // Extract table names
    const tableNameMatch = content.match(/\b(from|join|into)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi);
    if (tableNameMatch) {
      const tableNames = tableNameMatch.map(match => {
        const parts = match.split(/\s+/);
        return parts[parts.length - 1];
      });
      metadata.tableName = tableNames[0];
    }
    
    // Extract function names
    const functionMatch = content.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g);
    if (functionMatch) {
      const functionNames = functionMatch.map(match => match.replace(/\s*\($/, ''));
      metadata.functionName = functionNames[0];
    }
    
    // Extract command type
    const commandMatch = content.match(/\b(create|insert|select|update|delete|alter|drop|grant|revoke|explain|analyze|vacuum|reindex|cluster|begin|commit|rollback|savepoint|declare|fetch|open|close|cursor|function|procedure|trigger|view|index|union|intersect|except|with|inner|left|right|full|outer|group|order|having|where|limit|offset|distinct|all)\b/i);
    if (commandMatch) {
      metadata.commandType = commandMatch[0].toLowerCase();
    }
    
    return metadata;
  }

  /**
   * Detect if content contains table data
   */
  private detectTable(content: string): boolean {
    const tablePatterns = [
      /\|.*\|.*\n.*---/,  // Markdown table
      /\+\s*[-+]+\s*\+/,  // ASCII table
      /\b\w+\s+\w+\s+\w+.*\n.*[-=]+/,  // Space-separated table
    ];
    
    return tablePatterns.some(pattern => pattern.test(content));
  }

  /**
   * Detect if content contains image references
   */
  private detectImage(content: string): boolean {
    const imagePatterns = [
      /!\[.*?\]\(.*?\)/,  // Markdown images
      /<img[^>]*>/i,      // HTML images
      /\.(png|jpg|jpeg|gif|svg|webp)/i,  // Image file extensions
    ];
    
    return imagePatterns.some(pattern => pattern.test(content));
  }

  /**
   * Extract section/heading from content
   */
  private extractSection(content: string): string | undefined {
    // 1) Markdown headers
    const md = content.match(/^#+\s*(.+)$/m);
    if (md) return md[1].trim();

    // 2) HTML headers
    const html = content.match(/<h[1-6][^>]*>(.+?)<\/h[1-6]>/i);
    if (html) return html[1].replace(/<[^>]*>/g, '').trim();

    // 3) Early-line numeric section patterns (e.g., "5.5.4. Primary Keys")
    const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean).slice(0, 12);
    for (const raw of lines) {
      // Remove dotted leaders and trailing page numbers
      const noDots = raw.replace(/\.{2,}\s*\d{1,4}\s*$/, '').trim();
      // Match leading numeric outline
      const m = noDots.match(/^\d+(?:\.\d+){0,4}\.?\s+(.{3,120})$/);
      if (m) {
        const title = m[1].trim();
        if (title && /[A-Za-z]/.test(title)) return title;
      }
      // Title-case heuristic (likely a heading)
      if (noDots.length <= 120) {
        const words = noDots.split(/\s+/);
        const capWords = words.filter(w => /^[A-Z][a-zA-Z0-9_\-()]*$/.test(w)).length;
        if (capWords >= Math.ceil(words.length * 0.5) && capWords >= 2) {
          return noDots;
        }
      }
    }

    // 4) Bold inline fallback
    const bold = content.match(/\*\*(.+?)\*\*/);
    if (bold) return bold[1].trim();

    return undefined;
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
  private startProcessing(documentId: string, content: string, maxChunks?: number): void {
    // Prevent duplicate processing
    if (this.processingQueue.has(documentId)) {
      console.log(`[DocumentService] Document ${documentId} already in processing queue`);
      return;
    }

    const processingPromise = this.processDocument(documentId, content, maxChunks);
    this.processingQueue.set(documentId, processingPromise);

    // Clean up when done
    processingPromise.finally(() => {
      this.processingQueue.delete(documentId);
    });
  }

  /**
   * Create advanced chunks using LangChain splitters based on content type
   */
  private async createAdvancedChunks(
    documents: Document[], 
    mimeType: string,
    maxChunks?: number
  ): Promise<Document[]> {
    let chunks: Document[] = [];

    console.log(`[DocumentService] Creating chunks for mimeType: ${mimeType}`);

    // Choose splitter based on content type
    if (mimeType === 'application/pdf') {
      chunks = await this.chunkPDF(documents);
    } else if (mimeType?.includes('markdown') || mimeType?.includes('text/markdown')) {
      chunks = await this.chunkMarkdown(documents);
    } else if (mimeType?.includes('html')) {
      chunks = await this.chunkHTML(documents);
    } else if (this.isCodeFile(mimeType)) {
      chunks = await this.chunkCode(documents);
    } else {
      chunks = await this.chunkGeneric(documents);
    }

    // Apply chunk limit if specified
    if (maxChunks && chunks.length > maxChunks) {
      console.log(`[DocumentService] Limiting chunks from ${chunks.length} to ${maxChunks}`);
      chunks = chunks.slice(0, maxChunks);
    }

    console.log(`[DocumentService] Created ${chunks.length} chunks using advanced LangChain splitters`);
    return chunks;
  }

  /**
   * Chunk PDF documents with optimized settings
   */
  private async chunkPDF(documents: Document[]): Promise<Document[]> {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1200,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", ". ", " ", ""],
      keepSeparator: false
    });
    
    const chunks = await splitter.splitDocuments(documents);
    
    // Inspect metadata from LangChain chunks
    console.log('\n🔍 LangChain PDF Chunking Metadata Inspection:');
    console.log('=' .repeat(60));
    
    if (chunks.length > 0) {
      console.log('📄 First chunk metadata:');
      console.log(JSON.stringify(chunks[0].metadata, null, 2));
      
      if (chunks.length > 1) {
        console.log('\n📄 Second chunk metadata:');
        console.log(JSON.stringify(chunks[1].metadata, null, 2));
      }
      
      if (chunks.length > 2) {
        console.log('\n📄 Third chunk metadata:');
        console.log(JSON.stringify(chunks[2].metadata, null, 2));
      }
    }
    
    console.log('=' .repeat(60));
    console.log(`📊 Total chunks created: ${chunks.length}`);
    console.log('=' .repeat(60) + '\n');
    
    return chunks;
  }

  /**
   * Chunk Markdown documents using markdown-aware splitter
   */
  private async chunkMarkdown(documents: Document[]): Promise<Document[]> {
    const markdownSplitter = new MarkdownTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 150
    });
    
    return await markdownSplitter.splitDocuments(documents);
  }

  /**
   * Chunk HTML documents using recursive character splitter
   */
  private async chunkHTML(documents: Document[]): Promise<Document[]> {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 150,
      separators: ["\n\n", "\n", " ", ""]
    });
    
    return await textSplitter.splitDocuments(documents);
  }

  /**
   * Chunk code files preserving syntax
   */
  private async chunkCode(documents: Document[]): Promise<Document[]> {
    const splitter = new CharacterTextSplitter({
      chunkSize: 1500,
      chunkOverlap: 100,
      separator: "\n\n"
    });
    
    return await splitter.splitDocuments(documents);
  }

  /**
   * Chunk generic text documents
   */
  private async chunkGeneric(documents: Document[]): Promise<Document[]> {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", ". ", " ", ""]
    });
    
    return await splitter.splitDocuments(documents);
  }

  /**
   * Check if file is a code file based on mime type
   */
  private isCodeFile(mimeType: string): boolean {
    const codeTypes = [
      'text/javascript', 'text/typescript', 'text/python',
      'text/java', 'text/cpp', 'text/c', 'text/csharp',
      'text/rust', 'text/go', 'text/php', 'text/ruby',
      'text/x-java-source', 'text/x-c', 'text/x-c++',
      'application/javascript', 'application/typescript'
    ];
    return codeTypes.includes(mimeType);
  }

  /**
   * Create appropriate document loader based on file type
   */
  private createDocumentLoader(filePath: string, mimeType?: string) {
    if (mimeType === 'application/pdf') {
      return new PDFLoader(filePath);
    } else if (mimeType?.includes('text/') || mimeType?.includes('application/json')) {
      return new TextLoader(filePath);
    }
    // Default fallback to Text loader to avoid mis-parsing non-PDFs
    return new TextLoader(filePath);
  }

  /**
   * Process document with advanced LangChain chunking
   */
  private async processDocument(documentId: string, content: string, maxChunks?: number): Promise<void> {
    try {
      console.log(`[DocumentService] Starting advanced processing for document ${documentId}`);

      // Update status to processing
      const document = await this.prisma.document.update({
        where: { id: documentId },
        data: { 
          status: 'PROCESSING',
          startedAt: new Date()
        }
      });

      // Create temporary file
      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'notebooklm-'));
      const tempFile = path.join(tempDir, document.filename);
      await fs.writeFile(tempFile, content);

      try {
        // Load document with appropriate loader
        const loader = this.createDocumentLoader(tempFile, document.mimeType ?? undefined);
        const rawDocs = await loader.load();

        // Use advanced chunking
        const splitDocs = await this.createAdvancedChunks(rawDocs, document.mimeType || 'text/plain', maxChunks);

        // Process chunks with embeddings
        console.log(`[DocumentService] Processing ${splitDocs.length} chunks with embeddings...`);
        let processedCount = 0;

        for (let i = 0; i < splitDocs.length; i++) {
          const doc = splitDocs[i];
          
          // Create embedding
          const embedding = await getEmbedding(doc.pageContent);
          
          if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
            console.warn(`[DocumentService] Skipping chunk ${i}: embedding is empty or invalid.`);
            continue;
          }

          // Extract page number from LangChain metadata
          const pageNumber = doc.metadata?.loc?.pageNumber || doc.metadata?.pageNumber || undefined;
          const startLine = doc.metadata?.loc?.lines?.from || undefined;
          const endLine = doc.metadata?.loc?.lines?.to || undefined;
          
          // Enhanced content analysis
          const contentType = this.detectContentType(doc.pageContent);
          const hasTable = this.detectTable(doc.pageContent);
          const hasImage = this.detectImage(doc.pageContent);
          const section = this.extractSection(doc.pageContent);
          const wordCount = doc.pageContent.split(/\s+/).length;
          const postgresMetadata = this.extractPostgreSQLMetadata(doc.pageContent);
          
        // Create comprehensive metadata
        const metadata = {
          pageNumber: pageNumber || undefined,
          startLine: startLine || undefined,
          endLine: endLine || undefined,
          contentType,
          hasTable,
          hasImage,
          section,
          wordCount,
          chunkIndex: i,
          totalChunks: splitDocs.length,
          source: document.filename,
          processingDate: new Date().toISOString(),
          ...postgresMetadata, // PostgreSQL-specific metadata
          ...doc.metadata // Include original LangChain metadata
        };

          // Save to database with pgvector support and enhanced metadata
          const created = await this.prisma.embedding.create({
            data: {
              documentId: document.id,
              userId: document.userId,
              source: document.filename,
              chunk: doc.pageContent,
              embedding: embedding,
              // embedding_vec: `[${embedding.join(',')}]`, // This field is handled by Prisma triggers
              chunkIndex: i,
              totalChunks: splitDocs.length,
              wordCount,
              pageStart: pageNumber,
              startLine,
              endLine,
              hasTable,
              hasImage,
              section,
              chunkingConfig: {
                ...metadata,
                contentType // Store contentType in chunkingConfig JSON
              }
            }
          });

          // Populate pgvector column for similarity search
          try {
            const vec = `[${embedding.join(',')}]`;
            await (this.prisma as any).$executeRawUnsafe(
              'UPDATE "Embedding" SET embedding_vec = $1::vector WHERE id = $2',
              vec,
              created.id
            );
          } catch (vecErr) {
            console.warn('[DocumentService] Failed to set embedding_vec for chunk', i, vecErr);
          }

          processedCount++;
          
          // Update progress every 10 chunks
          if (processedCount % 10 === 0) {
            await this.prisma.document.update({
              where: { id: documentId },
              data: {
                processedChunks: processedCount,
                totalChunks: splitDocs.length
              }
            });
            console.log(`[DocumentService] Processed ${processedCount}/${splitDocs.length} chunks...`);
          }
        }

        // Debug: print total and previews of first 3 chunks
        try {
          const examples = splitDocs.slice(0, 3).map((d, idx) => {
            const pg = (d as any).metadata?.loc?.pageNumber || (d as any).metadata?.pageNumber;
            const preview = (d.pageContent || '').slice(0, 160).replace(/\s+/g, ' ').trim();
            return `#${idx} [page ${pg ?? 'n/a'}] index ${idx}: ${preview}`;
          });
          console.log(`[DocumentService] Debug: processed ${processedCount}/${splitDocs.length} chunks. Examples:\n- ${examples.join('\n- ')}`);
        } catch {}

        // Mark as completed
        await this.prisma.document.update({
          where: { id: documentId },
          data: {
            status: 'COMPLETED',
            totalChunks: splitDocs.length,
            processedChunks: processedCount,
            completedAt: new Date()
          }
        });

        console.log(`[DocumentService] ✅ Completed processing document ${documentId}: ${processedCount} chunks using LangChain splitters`);

      } finally {
        // Clean up temp file
        try {
          await fs.unlink(tempFile);
          await fs.rmdir(tempDir);
        } catch (cleanupError) {
          console.warn(`[DocumentService] Failed to clean up temp files:`, cleanupError);
        }
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
   * Start document processing directly from an existing file path
   */
  private startProcessingFromPath(documentId: string, filePath: string, mimeType?: string, maxChunks?: number): void {
    if (this.processingQueue.has(documentId)) {
      console.log(`[DocumentService] Document ${documentId} already in processing queue`);
      return;
    }

    const processingPromise = (async () => {
      try {
        console.log(`[DocumentService] Starting file-path processing for document ${documentId}`);

        // Update status to processing
        const document = await this.prisma.document.update({
          where: { id: documentId },
          data: {
            status: 'PROCESSING',
            startedAt: new Date()
          }
        });

        // Load document with appropriate loader
        const loader = this.createDocumentLoader(filePath, mimeType ?? document.mimeType ?? undefined);
        const rawDocs = await loader.load();

        // Use advanced chunking
        const splitDocs = await this.createAdvancedChunks(rawDocs, mimeType || document.mimeType || 'text/plain', maxChunks);

        console.log(`[DocumentService] Processing ${splitDocs.length} chunks with embeddings (path)...`);
        let processedCount = 0;

        for (let i = 0; i < splitDocs.length; i++) {
          const doc = splitDocs[i];

          const embedding = await getEmbedding(doc.pageContent);
          if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
            console.warn(`[DocumentService] Skipping chunk ${i}: embedding is empty or invalid.`);
            continue;
          }

          const pageNumber = (doc as any).metadata?.loc?.pageNumber || (doc as any).metadata?.pageNumber || undefined;
          const startLine = (doc as any).metadata?.loc?.lines?.from || undefined;
          const endLine = (doc as any).metadata?.loc?.lines?.to || undefined;

          const contentType = this.detectContentType(doc.pageContent);
          const hasTable = this.detectTable(doc.pageContent);
          const hasImage = this.detectImage(doc.pageContent);
          const section = this.extractSection(doc.pageContent);
          const wordCount = doc.pageContent.split(/\s+/).length;
          const postgresMetadata = this.extractPostgreSQLMetadata(doc.pageContent);

          const metadata = {
            pageNumber: pageNumber || undefined,
            startLine: startLine || undefined,
            endLine: endLine || undefined,
            contentType,
            hasTable,
            hasImage,
            section,
            wordCount,
            chunkIndex: i,
            totalChunks: splitDocs.length,
            source: document.filename,
            processingDate: new Date().toISOString(),
            ...postgresMetadata,
            ...(doc as any).metadata
          } as any;

          const created = await this.prisma.embedding.create({
            data: {
              documentId: document.id,
              userId: document.userId,
              source: document.filename,
              chunk: doc.pageContent,
              embedding: embedding,
              chunkIndex: i,
              totalChunks: splitDocs.length,
              wordCount,
              pageStart: pageNumber,
              startLine,
              endLine,
              hasTable,
              hasImage,
              section,
              chunkingConfig: {
                ...metadata,
                contentType
              }
            }
          });

          try {
            const vec = `[${embedding.join(',')}]`;
            await (this.prisma as any).$executeRawUnsafe(
              'UPDATE "Embedding" SET embedding_vec = $1::vector WHERE id = $2',
              vec,
              created.id
            );
          } catch (vecErr) {
            console.warn('[DocumentService] Failed to set embedding_vec for chunk', i, vecErr);
          }

          processedCount++;

          if (processedCount % 10 === 0) {
            await this.prisma.document.update({
              where: { id: documentId },
              data: {
                processedChunks: processedCount,
                totalChunks: splitDocs.length
              }
            });
            console.log(`[DocumentService] Processed ${processedCount}/${splitDocs.length} chunks...`);
          }
        }

        // Debug: print total and previews of first 3 chunks
        try {
          const examples = splitDocs.slice(0, 3).map((d, idx) => {
            const pg = (d as any).metadata?.loc?.pageNumber || (d as any).metadata?.pageNumber;
            const preview = (d.pageContent || '').slice(0, 160).replace(/\s+/g, ' ').trim();
            return `#${idx} [page ${pg ?? 'n/a'}] index ${idx}: ${preview}`;
          });
          console.log(`[DocumentService] Debug: processed ${processedCount}/${splitDocs.length} chunks. Examples:\n- ${examples.join('\n- ')}`);
        } catch {}

        await this.prisma.document.update({
          where: { id: documentId },
          data: {
            status: 'COMPLETED',
            totalChunks: splitDocs.length,
            processedChunks: processedCount,
            completedAt: new Date()
          }
        });
        console.log(`[DocumentService] ✅ Completed processing document ${documentId}: ${processedCount} chunks using LangChain splitters (path)`);
      } catch (error) {
        console.error(`[DocumentService] Error processing (path) document ${documentId}:`, error);
        await this.prisma.document.update({
          where: { id: documentId },
          data: {
            status: 'FAILED',
            processingError: error instanceof Error ? error.message : String(error)
          }
        });
      }
    })();

    this.processingQueue.set(documentId, processingPromise);
    processingPromise.finally(() => this.processingQueue.delete(documentId));
  }

  /**
   * Public: Upload document from an existing file on disk
   */
  async uploadDocumentFromFile(
    userId: string,
    filePath: string,
    originalName: string,
    mimeType?: string,
    maxChunks?: number,
    isSystemDocument?: boolean
  ): Promise<DocumentUploadResult> {
    // Use file bytes for hash to avoid text transcoding issues
    const data = await (await import('fs')).promises.readFile(filePath);
    const contentHash = crypto.createHash('sha256').update(data).digest('hex');
    const fileSize = data.length;

    const existingDoc = await this.prisma.document.findUnique({ where: { contentHash } });
    if (existingDoc) {
      return {
        documentId: existingDoc.id,
        isDuplicate: true,
        status: existingDoc.status as any,
        message: 'Document already exists'
      };
    }

    const document = await this.prisma.document.create({
      data: {
        userId,
        filename: originalName,
        originalName,
        contentHash,
        fileSize,
        mimeType,
        status: 'PENDING',
        isSystemDocument: !!isSystemDocument
      }
    });

    this.startProcessingFromPath(document.id, filePath, mimeType, maxChunks);

    return {
      documentId: document.id,
      isDuplicate: false,
      status: 'PENDING',
      message: 'Document uploaded and processing started'
    };
  }

  /**
   * Public: Upload document from file path with optional chunk limit
   */
  async uploadDocumentFromFileWithLimit(
    userId: string,
    filePath: string,
    originalName: string,
    mimeType: string | undefined,
    maxChunks: number | undefined,
    isSystemDocument?: boolean
  ): Promise<DocumentUploadResult> {
    const data = await (await import('fs')).promises.readFile(filePath);
    const contentHash = crypto.createHash('sha256').update(data).digest('hex');
    const fileSize = data.length;

    const existingDoc = await this.prisma.document.findUnique({ where: { contentHash } });
    if (existingDoc) {
      return {
        documentId: existingDoc.id,
        isDuplicate: true,
        status: existingDoc.status as any,
        message: 'Document already exists'
      };
    }

    const document = await this.prisma.document.create({
      data: {
        userId,
        filename: originalName,
        originalName,
        contentHash,
        fileSize,
        mimeType,
        status: 'PENDING',
        isSystemDocument: !!isSystemDocument
      }
    });

    this.startProcessingFromPath(document.id, filePath, mimeType, maxChunks);

    return {
      documentId: document.id,
      isDuplicate: false,
      status: 'PENDING',
      message: `Document uploaded and processing started${maxChunks ? ` (limited to ${maxChunks} chunks)` : ''}`
    };
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
   * Upload document with chunk limit (for system documents)
   */
  async uploadDocumentWithLimit(
    userId: string,
    filename: string,
    originalName: string,
    content: string,
    mimeType?: string,
    maxChunks?: number
  ): Promise<DocumentUploadResult> {
    const contentHash = this.generateContentHash(content);
    const fileSize = Buffer.byteLength(content, 'utf8');

    // Check if document already exists
    const existingDoc = await this.prisma.document.findUnique({
      where: { contentHash }
    });

    if (existingDoc) {
      if (existingDoc.status === 'COMPLETED') {
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
        }
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

    // Start processing with chunk limit
    this.startProcessing(document.id, content, maxChunks);

    return {
      documentId: document.id,
      isDuplicate: false,
      status: 'PENDING',
      message: `Document uploaded and processing started${maxChunks ? ` (limited to ${maxChunks} chunks)` : ''}`
    };
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

      console.log(`[DocumentService] Cancelled processing for document ${documentId}`);
    }

    return document;
  }

  /**
   * Resume processing for pending documents on startup
   */
  async resumePendingProcessing() {
    const pendingDocs = await this.prisma.document.findMany({
      where: {
        status: { in: ['PENDING', 'PROCESSING'] }
      }
    });

    console.log(`[DocumentService] Found ${pendingDocs.length} documents to resume processing`);

    for (const doc of pendingDocs) {
      // Reset processing status
      await this.prisma.document.update({
        where: { id: doc.id },
        data: { 
          status: 'PENDING',
          processingError: null,
          processedChunks: 0,
          startedAt: null,
          completedAt: null
        }
      });

      console.log(`[DocumentService] Reset status for document ${doc.id} (${doc.originalName})`);

      // Attempt resume for known system documents from filesystem
      try {
        if ((doc as any).isSystemDocument) {
          const sysPath = path.join(process.cwd(), 'system-documents', 'postgresql', doc.filename);
          await (await import('fs')).promises.access(sysPath).then(() => {
            this.startProcessingFromPath(doc.id, sysPath, doc.mimeType || 'application/pdf');
          }).catch(() => {
            console.warn(`[DocumentService] System document path not found for ${doc.filename}`);
          });
        } else {
          console.warn(`[DocumentService] Cannot resume ${doc.id} automatically (original content not stored).`);
        }
      } catch (e) {
        console.warn(`[DocumentService] Resume attempt failed for ${doc.id}:`, (e as Error)?.message);
      }
    }
  }

  /**
   * Get chunk statistics for a document
   */
  async getChunkStatistics(documentId: string): Promise<{
    totalChunks: number;
    contentTypeDistribution: Record<ChunkContentType, number>;
    averageWordCount: number;
    chunksWithTables: number;
    chunksWithImages: number;
  }> {
    const chunks = await this.prisma.embedding.findMany({
      where: { documentId },
      select: {
        wordCount: true,
        hasTable: true,
        hasImage: true,
        chunkingConfig: true
      }
    });

    const totalChunks = chunks.length;
    const contentTypeDistribution = chunks.reduce((acc, chunk) => {
      const config = chunk.chunkingConfig as any;
      const type = config?.contentType as ChunkContentType || 'text';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<ChunkContentType, number>);

    const averageWordCount = chunks.reduce((sum, chunk) => sum + (chunk.wordCount || 0), 0) / totalChunks;
    const chunksWithTables = chunks.filter(chunk => chunk.hasTable).length;
    const chunksWithImages = chunks.filter(chunk => chunk.hasImage).length;

    return {
      totalChunks,
      contentTypeDistribution,
      averageWordCount,
      chunksWithTables,
      chunksWithImages
    };
  }

  /**
   * Search chunks by content type
   */
  async searchChunksByContentType(
    documentId: string,
    contentType: ChunkContentType,
    limit: number = 10
  ) {
    return await this.prisma.embedding.findMany({
      where: {
        documentId,
        chunkingConfig: {
          path: ['contentType'],
          equals: contentType
        }
      },
      select: {
        id: true,
        chunk: true,
        pageStart: true,
        section: true,
        wordCount: true,
        chunkingConfig: true
      },
      take: limit
    });
  }
}