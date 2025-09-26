// backend/scripts/print-chunks-by-page.ts
import { PrismaClient } from '../generated/prisma'
const prisma = new PrismaClient()

async function main() {
  const [startArg, endArg, filenameArg] = process.argv.slice(2)
  const start = Number(startArg || 1)
  const end = Number(endArg || start)
  const filename = filenameArg ?? 'postgresql-17-A4.pdf'

  console.log(`Printing chunks for pages ${start}..${end} from ${filename}`)

  const rows = await prisma.$queryRawUnsafe<any[]>(
    `
    SELECT e."chunkIndex", e."pageStart", LEFT(e."chunk", 800) AS preview
    FROM "Embedding" e
    JOIN "Document" d ON d.id = e."documentId"
    WHERE d."filename" = $1
      AND e."pageStart" BETWEEN $2 AND $3
    ORDER BY e."pageStart", e."chunkIndex"
  `,
    filename,
    start,
    end
  )

  for (const r of rows as any[]) {
    console.log(`--- p.${r.pageStart} idx=${r.chunkIndex} ---`)
    console.log(String(r.preview || '').replace(/\n/g, ' '))
    console.log('')
  }

  await prisma.$disconnect()
}

main().catch(async (err) => {
  console.error('Error:', err)
  try { await prisma.$disconnect() } catch {}
  process.exit(1)
})


