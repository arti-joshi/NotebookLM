import 'dotenv/config'
import { PrismaClient } from '../generated/prisma'

async function main() {
  const prisma = new PrismaClient()
  try {
    const keyword = process.argv[2]
    if (!keyword) {
      console.error('Usage: tsx scripts/check-chunk-exists.ts <keyword>')
      process.exit(1)
    }

    console.log(`Checking for chunks containing: "${keyword}"`)

    const rows = await prisma.$queryRaw<Array<{
      id: string,
      chunk: string,
      source: string,
      pageNumber: number | null,
      chunkIndex: number | null
    }>>`
      SELECT id, chunk, source, "pageStart" as "pageNumber", "chunkIndex"
      FROM "Embedding"
      WHERE chunk ILIKE ${`%${keyword}%`}
      LIMIT 5;
    `

    if (rows.length === 0) {
      console.log('❌ No matching chunks found in DB')
    } else {
      console.log(`✅ Found ${rows.length} matching chunk(s)`) 
      rows.forEach((r, i) => {
        const preview = (r.chunk || '').slice(0, 200).replace(/\s+/g, ' ')
        console.log(`\n#${i + 1} id=${r.id} source=${r.source} page=${r.pageNumber ?? 'n/a'} idx=${r.chunkIndex ?? 'n/a'}`)
        console.log(preview)
      })
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})


