import { PrismaClient } from '../generated/prisma'
import path from 'path'

const prisma = new PrismaClient()

async function fail(msg: string, code = 1) {
  console.error(`❌ ${msg}`)
  await prisma.$disconnect().catch(() => {})
  process.exit(code)
}

async function main() {
  const filename = 'postgresql-17-A4.pdf'

  // 1) Find system document row
  const doc = await prisma.document.findFirst({
    where: { isSystemDocument: true, filename },
    select: { id: true, status: true }
  })

  if (!doc) {
    return fail(`system document not found: ${filename}`)
  }

  // 2) Verify embeddings exist
  const total = await prisma.embedding.count({ where: { documentId: doc.id } })
  if (total === 0) {
    return fail('document uploaded but not embedded.')
  }

  // 3) Sample a few embeddings to verify metadata and vector length
  const samples = await prisma.embedding.findMany({
    where: { documentId: doc.id },
    orderBy: { chunkIndex: 'asc' },
    take: 3,
    select: {
      chunkIndex: true,
      pageStart: true,
      chunk: true,
      embedding: true,
      chunkingConfig: true
    }
  })

  if (samples.length === 0) {
    return fail('no sample embeddings found despite count > 0')
  }

  // 4) Validate each sample
  for (const s of samples) {
    // Embedding length
    const embArray = Array.isArray(s.embedding) ? (s.embedding as unknown as number[]) : []
    if (embArray.length === 0) {
      return fail('embeddings missing.')
    }

    // Required metadata
    if (s.chunkIndex === null || s.chunkIndex === undefined) {
      return fail('metadata missing (chunkIndex).')
    }
    if (s.pageStart === null || s.pageStart === undefined) {
      return fail('metadata missing (pageStart).')
    }
  }

  // 5) Print confirmation summary
  console.log('✅ PostgreSQL 17 A4 verified')
  console.log(`Total Chunks: ${total}`)

  const example = samples[0]
  const exampleText = (example.chunk || '').slice(0, 150).replace(/\s+/g, ' ').trim()
  console.log('Example Chunk:')
  console.log(`p.${example.pageStart} idx=${example.chunkIndex} → "${exampleText}"`)

  const embLen = Array.isArray(samples[0].embedding) ? (samples[0].embedding as unknown as number[]).length : 0
  console.log(`Embedding length: ${embLen}`)

  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error('❌ Verification failed:', e?.message || e)
  await prisma.$disconnect().catch(() => {})
  process.exit(1)
})


