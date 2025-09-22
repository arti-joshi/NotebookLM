const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function checkEmbeddings() {
  try {
    // Get a sample of embeddings
    const embeddings = await prisma.embedding.findMany({
      take: 5,
      select: {
        id: true,
        chunk: true,
        embedding: true,
        documentId: true,
        documentType: true
      }
    });

    console.log('Sample embeddings:', JSON.stringify(embeddings, null, 2));
    
    // Get count of embeddings
    const count = await prisma.embedding.count();
    console.log('\nTotal number of embeddings:', count);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmbeddings();