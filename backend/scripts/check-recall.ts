// backend/scripts/check-recall.ts
import { PrismaClient } from '../generated/prisma'
const prisma = new PrismaClient()

async function main() {
  const argv = process.argv.slice(2)
  const search = argv[0] ?? 'modern features'
  const filename = argv[1] ?? 'postgresql-17-A4.pdf'

  console.log(`🔎 Checking DB for chunks containing: "${search}" in file: ${filename}`)

  // Count matches
  const [{ total }] = await prisma.$queryRawUnsafe<any[]>(
    `
    SELECT COUNT(*)::int AS total
    FROM "Embedding" e
    JOIN "Document" d ON d.id = e."documentId"
    WHERE d."filename" = $1
      AND e."chunk" ILIKE '%' || $2 || '%'
  `,
    filename,
    search
  )

  console.log(`Total matching chunks: ${total}`)

  if (total > 0) {
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `
      SELECT e."id", e."chunkIndex", e."pageStart", LEFT(e."chunk", 400) AS preview
      FROM "Embedding" e
      JOIN "Document" d ON d.id = e."documentId"
      WHERE d."filename" = $1
        AND e."chunk" ILIKE '%' || $2 || '%'
      ORDER BY e."pageStart", e."chunkIndex"
      LIMIT 20
    `,
      filename,
      search
    )

    console.log('\n--- First 20 previews ---')
    rows.forEach((r: any) => {
      console.log(`p.${r.pageStart} idx=${r.chunkIndex}`)
      console.log(String(r.preview || '').replace(/\n/g, ' '))
      console.log('-------------------------')
    })
  }

  await prisma.$disconnect()
}

main().catch(async (err) => {
  console.error('Error:', err)
  try { await prisma.$disconnect() } catch {}
  process.exit(1)
})


