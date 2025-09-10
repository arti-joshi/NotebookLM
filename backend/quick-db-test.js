// Quick database test to verify Aryabhata data exists
require('dotenv').config()
const { PrismaClient } = require('./generated/prisma')

const prisma = new PrismaClient()

async function quickTest() {
  console.log('🔍 Quick Database Test')
  
  try {
    // Test 1: Find chunk 4
    const chunk4 = await prisma.$queryRaw`
      SELECT "chunkIndex", LEFT("chunk", 200) as preview, "source" 
      FROM "Embedding" 
      WHERE "chunkIndex" = 4 
      LIMIT 5
    `
    console.log('Chunk 4 results:', chunk4.length)
    chunk4.forEach(c => console.log(`  ${c.chunkIndex}: ${c.preview}...`))
    
    // Test 2: Find Aryabhata mentions
    const aryabhata = await prisma.$queryRaw`
      SELECT "chunkIndex", LEFT("chunk", 100) as preview
      FROM "Embedding" 
      WHERE "chunk" ILIKE '%Aryabhata%'
      LIMIT 3
    `
    console.log('\nAryabhata mentions:', aryabhata.length)
    aryabhata.forEach(c => console.log(`  ${c.chunkIndex}: ${c.preview}...`))
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

quickTest()
