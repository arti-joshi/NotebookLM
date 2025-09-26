import { PrismaClient } from '../generated/prisma'

async function main() {
  const prisma = new PrismaClient()
  try {
    const filename = 'postgresql-17-A4.pdf'
    const docs = await prisma.document.findMany({
      where: { isSystemDocument: true, filename },
      orderBy: { createdAt: 'desc' },
      select: { id: true }
    })

    if (docs.length <= 1) {
      console.log('No older docs to delete.')
      return
    }

    const oldIds = docs.slice(1).map(d => d.id)
    const delEmb = await prisma.embedding.deleteMany({ where: { documentId: { in: oldIds } } })
    const delDocs = await prisma.document.deleteMany({ where: { id: { in: oldIds } } })
    console.log(`Deleted older docs: ${delDocs.count}, removed embeddings: ${delEmb.count}`)
  } catch (e: any) {
    console.error('Cleanup failed:', e?.message || e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()


