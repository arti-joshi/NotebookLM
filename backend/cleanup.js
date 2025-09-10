const fs = require('fs').promises;
const path = require('path');
const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function cleanup() {
    console.log('Starting cleanup process...');
    const startTime = Date.now();

    try {
        // 1. Clean temporary Prisma files
        console.log('\n🧹 Cleaning temporary Prisma files...');
        const prismaDir = path.join(__dirname, 'generated', 'prisma');
        const prismaFiles = await fs.readdir(prismaDir);
        for (const file of prismaFiles) {
            if (file.includes('.tmp') || file.match(/query_engine.*\.tmp/)) {
                await fs.unlink(path.join(prismaDir, file));
                console.log(`Removed temporary file: ${file}`);
            }
        }

        // 2. Clean uploads folder
        console.log('\n📁 Cleaning uploads folder...');
        const uploadsDir = path.join(__dirname, 'uploads');
        try {
            const uploadFiles = await fs.readdir(uploadsDir);
            
            // Group files by their base name (removing timestamp prefix)
            const fileGroups = new Map();
            uploadFiles.forEach(file => {
                const baseName = file.replace(/^\d+-/, '');
                if (!fileGroups.has(baseName)) {
                    fileGroups.set(baseName, []);
                }
                fileGroups.get(baseName).push(file);
            });

            // Remove duplicates (keep most recent)
            for (const [baseName, files] of fileGroups) {
                if (files.length > 1) {
                    // Sort by timestamp prefix, keep the most recent
                    files.sort().slice(0, -1).forEach(async file => {
                        await fs.unlink(path.join(uploadsDir, file));
                        console.log(`Removed duplicate upload: ${file}`);
                    });
                }
            }

            // Clean up processed files
            const processedDocs = await prisma.document.findMany({
                where: {
                    status: 'COMPLETED'
                },
                select: {
                    filename: true
                }
            });

            const processedFilenames = new Set(processedDocs.map(d => d.filename));
            for (const file of uploadFiles) {
                if (processedFilenames.has(file)) {
                    await fs.unlink(path.join(uploadsDir, file));
                    console.log(`Removed processed file: ${file}`);
                }
            }
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
            console.log('Uploads directory does not exist');
        }

        // 3. Clean old PyCache files
        console.log('\n🐍 Cleaning Python cache files...');
        const pdfParserDir = path.join(__dirname, '..', 'pdf-parser');
        try {
            const pycacheDir = path.join(pdfParserDir, '__pycache__');
            await fs.rmdir(pycacheDir, { recursive: true });
            console.log('Removed Python cache directory');
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
            console.log('No Python cache directory found');
        }

        // 4. Database cleanup
        console.log('\n🗄️ Database cleanup...');
        
        // Remove orphaned embeddings
        const { count: deletedEmbeddings } = await prisma.embedding.deleteMany({
            where: {
                OR: [
                    { userId: null },
                    { documentId: null }
                ]
            }
        });
        console.log(`Removed ${deletedEmbeddings} orphaned embeddings`);

        // Remove expired refresh tokens
        const { count: deletedTokens } = await prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
        console.log(`Removed ${deletedTokens} expired refresh tokens`);

        console.log(`\n✨ Cleanup completed in ${((Date.now() - startTime) / 1000).toFixed(2)}s`);

    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run cleanup if called directly
if (require.main === module) {
    cleanup().catch(console.error);
}

module.exports = cleanup;
