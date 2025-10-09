import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'
import { DocumentService } from '../src/services/documentService'

// Simple CLI arg parsing for --limit=N
function parseLimitArg(): number | undefined {
  const arg = process.argv.find(a => a.startsWith('--limit='))
  if (!arg) return undefined
  const value = Number(arg.split('=')[1])
  return Number.isFinite(value) && value > 0 ? value : undefined
}

async function main() {
  const prisma = new PrismaClient({ log: ['warn', 'error'] })
  const documentService = new DocumentService(prisma)
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  try {
    const limit = parseLimitArg()
    const sysDocPath = path.join(path.dirname(__dirname), 'system-documents', 'postgresql', 'postgresql-17-A4.pdf')
    if (!fs.existsSync(sysDocPath)) {
      console.error('File not found:', sysDocPath)
      process.exit(1)
    }

    const dataBuffer = fs.readFileSync(sysDocPath)
    const crypto = await import('crypto')
    const contentHash = crypto.createHash('sha256').update(dataBuffer).digest('hex')

    // Ensure a demo/system user exists; fallback to existing doc owner if present
    let ownerId: string | null = null
    const existingDoc = await prisma.document.findUnique({ where: { contentHash } })
    if (existingDoc) ownerId = existingDoc.userId
    if (!ownerId) {
      const user = await prisma.user.findFirst({ where: { email: 'demo@admin.com' } })
      if (!user) {
        console.error('Demo admin not found. Seed or create a user first.')
        process.exit(1)
      }
      ownerId = user.id
    }

    // Clear old embeddings for this document if it exists
    if (existingDoc) {
      console.log('Clearing existing embeddings for document:', existingDoc.id)
      await prisma.embedding.deleteMany({ where: { documentId: existingDoc.id } })
      await prisma.document.delete({ where: { id: existingDoc.id } })
    }

    console.log(`Processing PostgreSQL 17 A4 with ${limit ? limit : 'all'} chunks`)

    // Use DocumentService method with chunk limit
    const result = await documentService.uploadDocumentFromFileWithLimit(
      ownerId!,
      sysDocPath,
      'postgresql-17-A4.pdf',
      'application/pdf',
      limit,
      true
    )

    // Wait for processing to finish by polling status
    let attempts = 0
    let storedCount = 0
    while (attempts < 120) { // up to ~120s
      const status = await documentService.getDocumentStatus(result.documentId)
      if (status?.status === 'COMPLETED') {
        storedCount = status.processedChunks || 0
        break
      }
      await new Promise(r => setTimeout(r, 1000))
      attempts++
    }

    console.log(`Successfully stored ${storedCount} chunks in DB`)
  } catch (e: any) {
    console.error('Reprocess failed:', e?.message || e)
    process.exit(1)
  } finally {
    await (await import('timers/promises')).setTimeout(50)
    await prisma.$disconnect().catch(() => {})
  }
}

main()

