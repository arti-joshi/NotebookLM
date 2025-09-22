import { PrismaClient } from '../generated/prisma'
import crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import PDFParser from 'pdf2json'

const prisma = new PrismaClient()

interface PDFPage {
  Texts: {
    R: {
      T: string;
    }[];
  }[];
}

interface PDFData {
  Pages: PDFPage[];
}

function parsePDF(pdfPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null)
    
    pdfParser.on("pdfParser_dataReady", (pdfData: PDFData) => {
      try {
        const text = decodeURIComponent(pdfData.Pages.map(page => 
          page.Texts.map(text => text.R.map(r => r.T).join(' ')).join(' ')
        ).join('\n'))
        resolve(text)
      } catch (err) {
        reject(err)
      }
    })
    
    pdfParser.on("pdfParser_dataError", (errData: unknown) => {
      if (errData instanceof Error) {
        reject(errData)
      } else if (typeof errData === 'object' && errData !== null && 'parserError' in errData) {
        reject(errData.parserError)
      } else {
        reject(new Error('Unknown PDF parsing error'))
      }
    })
    
    pdfParser.loadPDF(pdfPath)
  })
}

// Legacy chunking function with limit parameter
function chunkText(text: string, chunkSize = 1000, overlap = 200, limit = 100): string[] {
  const clean = text.replace(/\s+/g, ' ').trim()
  const chunks: string[] = []
  let i = 0
  let count = 0

  while (i < clean.length && count < limit) {
    const end = Math.min(i + chunkSize, clean.length)
    chunks.push(clean.slice(i, end))
    i += chunkSize - overlap
    count++
  }

  return chunks
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

    // Parse PDF content
    console.log('📄 Parsing PDF content...')
    const pgContent = await parsePDF(pgDocPath)

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

    console.log('📄 Processing first 100 chunks...')
    // Process only first 100 chunks for initial testing
    const chunks = chunkText(pgContent.toString(), 1000, 200, 100)
    const totalChunks = chunks.length

    console.log(`🔄 Processing ${totalChunks} chunks...`)
    let processedCount = 0

    // Process chunks in batches of 3 with delay
    for (let i = 0; i < chunks.length; i += 3) {
      const batch = chunks.slice(i, i + 3)
      const promises = batch.map((chunk, idx) => {
        return prisma.embedding.create({
          data: {
            documentId: document.id,
            source: document.filename,
            chunk,
            chunkIndex: i + idx,
            totalChunks,
            embedding: [], // Empty embedding for now
            documentType: 'SYSTEM_DOCUMENT',
            wordCount: chunk.split(/\s+/).length
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
      if (i + 3 < chunks.length) {
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
(async () => {
  try {
    await seedSystemDocuments()
    process.exit(0)
  } catch (error) {
    console.error('Fatal error during seeding:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
})()