import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Find the document ID for postgresql-17-A4.pdf
  const doc = await prisma.document.findFirst({
    where: { filename: 'postgresql-17-A4.pdf' },
  });
  if (!doc) {
    console.error('Document not found: postgresql-17-A4.pdf');
    process.exit(1);
  }

  // Get a sample of chunks from different sections
  const chunks = await prisma.embedding.findMany({
    where: { documentId: doc.id },
    orderBy: { chunkIndex: 'asc' },
    take: 2000, // get a large sample
  });

  // Group by section/contentType if available
  const samples: any[] = [];
  const seenSections = new Set();
  for (const chunk of chunks) {
    const meta = chunk.chunkingConfig || {};
    const section = meta.section || meta.contentType || 'unknown';
    if (!seenSections.has(section) && chunk.chunk) {
      samples.push({
        section,
        pageStart: chunk.pageStart,
        chunkIndex: chunk.chunkIndex,
        text: chunk.chunk.slice(0, 200).replace(/\s+/g, ' '),
      });
      seenSections.add(section);
    }
    if (samples.length >= 15) break;
  }

  console.log('Sampled Chunks for postgresql-17-A4.pdf:');
  for (const s of samples) {
    console.log(`\nSection: ${s.section}`);
    console.log(`Page: ${s.pageStart}, Chunk: ${s.chunkIndex}`);
    console.log(`Text: ${s.text}`);
  }
}

main().then(() => prisma.$disconnect());
