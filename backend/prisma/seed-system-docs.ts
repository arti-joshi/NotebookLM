import { PrismaClient } from '../generated/prisma'
import crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'

const prisma = new PrismaClient()

// Legacy PDFParser removed; rely on LangChain PDFLoader

// Enhanced content type detection for PostgreSQL documentation
function detectContentType(text: string): 'sql_example' | 'table' | 'warning' | 'text' {
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

interface SystemDocumentInput {
  userId: string
  filename: string
  originalName: string
  contentHash: string
  fileSize: number
  mimeType: string
  content: string
}

async function seedSystemDocuments(): Promise<void> {
  console.log('🌱 Seeding system documents...')

  try {
    const user = await prisma.user.findFirst({ 
      where: { email: 'demo@admin.com' } 
    })

    if (!user) {
      throw new Error('Demo admin user not found')
    }

    // Read PostgreSQL documentation
    const pgDocPath = path.join(process.cwd(), 'system-documents', 'postgresql', 'postgresql-17-A4.pdf')
    if (!fs.existsSync(pgDocPath)) {
      console.error(`File not found at path: ${pgDocPath}`)
      throw new Error('PostgreSQL documentation not found')
    }

    console.log('📚 Reading PostgreSQL documentation...')
    const dataBuffer = fs.readFileSync(pgDocPath)
    const contentHash = crypto.createHash('sha256').update(dataBuffer).digest('hex')

    // Parsing will be handled by LangChain below

    // Create document record
    const document = await prisma.document.upsert({
      where: { contentHash },
      update: {
        status: 'PROCESSING',
        startedAt: new Date(),
        completedAt: null
      },
      create: {
        userId: user.id,
        filename: 'postgresql-17-A4.pdf',
        originalName: 'PostgreSQL 17 Documentation.pdf',
        contentHash,
        fileSize: dataBuffer.length,
        mimeType: 'application/pdf',
        status: 'PROCESSING',
        isSystemDocument: true,
        totalChunks: 0,
        processedChunks: 0,
        startedAt: new Date()
      }
    })

    console.log('📄 Processing with LangChain enhanced chunking...')
    
    // Initialize embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY!,
      modelName: "text-embedding-004"
    })
    
    // Load PDF with LangChain
    const loader = new PDFLoader(pgDocPath)
    const docs = await loader.load()
    console.log(`✅ Loaded ${docs.length} pages from PDF`)
    
    // Use LangChain text splitter
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", ". ", " ", ""],
      keepSeparator: false
    })
    
    const chunks = await splitter.splitDocuments(docs)
    const totalChunks = Math.min(chunks.length, 100) // Limit to 100 for testing
    const limitedChunks = chunks.slice(0, totalChunks)

    console.log(`🔄 Processing ${totalChunks} chunks with enhanced metadata...`)
    let processedCount = 0

    // Process chunks in batches of 3 with delay
    for (let i = 0; i < limitedChunks.length; i += 3) {
      const batch = limitedChunks.slice(i, i + 3)
      const promises = batch.map(async (chunk, idx) => {
        const chunkText = chunk.pageContent.trim()
        const contentType = detectContentType(chunkText)
        const pageNumber = chunk.metadata?.loc?.pageNumber || chunk.metadata?.pageNumber || undefined
        
        // Generate embedding
        const embedding = await embeddings.embedQuery(chunkText)
        
        return prisma.embedding.create({
          data: {
            documentId: document.id,
            source: document.filename,
            chunk: chunkText,
            chunkIndex: i + idx,
            totalChunks,
            embedding,
            documentType: 'SYSTEM_DOCUMENT',
            wordCount: chunkText.split(/\s+/).length,
            pageStart: pageNumber,
            hasTable: contentType === 'table',
            hasImage: /!\[.*?\]\(.*?\)/.test(chunkText),
            chunkingConfig: {
              contentType,
              pageNumber,
              source: document.filename,
              processingDate: new Date().toISOString()
            }
          }
        })
      })

      await Promise.all(promises)
      processedCount += batch.length

      // Update document progress
      await prisma.document.update({
        where: { id: document.id },
        data: {
          processedChunks: processedCount,
          totalChunks,
          completedAt: processedCount === totalChunks ? new Date() : null,
          status: processedCount === totalChunks ? 'COMPLETED' : 'PROCESSING'
        }
      })

      // Progress update
      console.log(`✅ Processed chunks ${processedCount}/${totalChunks}`)

      // Small delay between batches
      if (i + 3 < limitedChunks.length) {
        await new Promise(resolve => setTimeout(resolve, 1500))
      }
    }

    console.log('✅ System documents seeded successfully')

  } catch (error) {
    console.error('Error seeding system documents:', error instanceof Error ? error.message : error)
    throw error
  }
}

// Self-executing async function with proper error handling
;(async () => {
  try {
    await seedSystemDocuments()
    process.exit(0)
  } catch (error) {
    console.error('Fatal error during seeding:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
})()