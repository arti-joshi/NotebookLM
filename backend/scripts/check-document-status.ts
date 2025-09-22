import { PrismaClient } from '../generated/prisma'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const prisma = new PrismaClient()

async function checkDocumentStatus(filename: string) {
  try {
    const document = await prisma.document.findFirst({
      where: {
        OR: [
          { filename },
          { originalName: filename }
        ]
      },
      include: {
        _count: {
          select: { 
            embeddings: true 
          }
        }
      }
    })

    if (!document) {
      console.log(`❌ Document "${filename}" not found in database`)
      return
    }

    console.log(`
Document Status:
--------------
ID: ${document.id}
Filename: ${document.filename}
Status: ${document.status}
Total Chunks: ${document.totalChunks || 'N/A'}
Processed Chunks: ${document.processedChunks || 'N/A'}
Embeddings Count: ${document._count.embeddings}
Started At: ${document.startedAt ? new Date(document.startedAt).toLocaleString() : 'N/A'}
Completed At: ${document.completedAt ? new Date(document.completedAt).toLocaleString() : 'N/A'}
${document.processingError ? `\nError: ${document.processingError}` : ''}
    `)
  } catch (error) {
    console.error('Error checking document status:', error)
  } finally {
    await prisma.$disconnect()
  }
}

const filename = process.argv[2]
if (!filename) {
  console.error('Please provide a filename as an argument')
  process.exit(1)
}

checkDocumentStatus(filename)
