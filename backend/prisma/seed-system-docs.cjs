const { PrismaClient } = require('../generated/prisma')
const crypto = require('crypto')

const prisma = new PrismaClient()

async function seedSystemDocuments() {
  console.log('🌱 Seeding system documents...')

  try {
    // Example system document
    const demoContent = `Welcome to NotebookLM!
    
This is a system document that introduces the system features.

Key Features:
- Upload and process PDFs and other documents
- Smart document chunking
- AI-powered search and retrieval
- Note-taking capabilities
    `
    const contentHash = crypto
      .createHash('sha256')
      .update(demoContent)
      .digest('hex')

    const userId = (await prisma.user.findFirst({ where: { email: 'demo@admin.com' } })).id

    // Create or update system welcome document
    await prisma.document.upsert({
      where: { contentHash },
      update: {},
      create: {
        userId,
        filename: 'welcome.txt',
        originalName: 'Welcome to NotebookLM.txt',
        contentHash,
        fileSize: demoContent.length,
        mimeType: 'text/plain',
        status: 'COMPLETED',
        isSystemDocument: true,
        totalChunks: 1,
        processedChunks: 1,
        startedAt: new Date(),
        completedAt: new Date()
      }
    })

    console.log('✅ System documents seeded successfully')

  } catch (error) {
    console.error('Error seeding system documents:', error)
    throw error
  }
}

seedSystemDocuments()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })