const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function cleanup() {
    try {
        // Delete document and its chunks
        const result = await prisma.document.deleteMany({
            where: {
                filename: 'postgresql-17-A4.pdf',
                isSystemDocument: true
            }
        });
        
        console.log(`Deleted ${result.count} documents`);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanup();