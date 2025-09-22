import { PrismaClient } from '../generated/prisma'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { DocumentService } from '../src/services/documentService'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const prisma = new PrismaClient()

async function processSystemDocument(filename: string) {
  try {
    // Get demo admin user
    const user = await prisma.user.findFirst({
      where: { email: 'demo@admin.com' }
    })

    if (!user) {
      throw new Error('Demo admin user not found')
    }

    const filePath = join(__dirname, '..', 'system-documents', 'postgresql', filename)
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    const fileContent = fs.readFileSync(filePath)
    const fileSize = fs.statSync(filePath).size
    const contentHash = crypto
      .createHash('sha256')
      .update(fileContent)
      .digest('hex')

    // Create or update document record
    const document = await prisma.document.upsert({
      where: { contentHash },
      update: {
        status: 'PENDING',
        startedAt: new Date()
      },
      create: {
        userId: user.id,
        filename,
        originalName: filename,
        contentHash,
        fileSize,
        mimeType: 'application/pdf',
        status: 'PENDING',
        isSystemDocument: true,
        startedAt: new Date()
      }
    })

    console.log(`Processing document: ${filename}`)
    
    const documentService = new DocumentService(prisma)
    const content = fs.readFileSync(filePath)
    const result = await documentService.uploadDocument(
      document.userId,
      filename,
      filename,
      content.toString('base64'),
      'application/pdf'
    )

    // Wait for processing to complete
    let processedDoc = await prisma.document.findUnique({
      where: { id: result.documentId },
      include: {
        _count: {
          select: { embeddings: true }
        }
      }
    })

    // Poll for completion
    while (processedDoc?.status === 'PROCESSING' || processedDoc?.status === 'PENDING') {
      console.log(`Status: ${processedDoc.status}... (${processedDoc._count.embeddings} embeddings created)`)
      await new Promise(resolve => setTimeout(resolve, 1000))
      processedDoc = await prisma.document.findUnique({
        where: { id: result.documentId },
        include: {
          _count: {
            select: { embeddings: true }
          }
        }
      })
    }

    if (processedDoc?.status === 'COMPLETED') {
      console.log(`✅ Document processed successfully
Document ID: ${processedDoc.id}
Total chunks: ${processedDoc._count.embeddings}
Processing time: ${processedDoc.completedAt && processedDoc.startedAt ? 
        new Date(processedDoc.completedAt).getTime() - new Date(processedDoc.startedAt).getTime() 
        : 'unknown'}ms`)
    } else {
      console.error(`❌ Document processing failed
Status: ${processedDoc?.status}
Error: ${processedDoc?.processingError || 'Unknown error'}`)
    }

    console.log(`✅ Document processed successfully
Document ID: ${result.documentId}
Status: ${result.status}
${result.message}`)

  } catch (error) {
    console.error('Error processing document:', error)
  } finally {
    await prisma.$disconnect()
  }
}

const filename = process.argv[2]
if (!filename) {
  console.error('Please provide a filename as an argument')
  process.exit(1)
}

processSystemDocument(filename)