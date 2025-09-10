const bcrypt = require('bcrypt')
const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  try {
    // Demo admin user credentials
    const adminEmail = 'demo@admin.com'  // Match VITE_DEMO_EMAIL
    const adminPassword = '123456'       // Match VITE_DEMO_PASSWORD

    // Check if demo admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (!existingAdmin) {
      // Create demo admin user
      const passwordHash = await bcrypt.hash(adminPassword, 10)
      
      const adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash,
          role: 'ADMIN',
          isVerified: true  // Set as verified since it's a demo account
        }
      })

      console.log(`✅ Created demo admin user:`)
      console.log(`   Email: ${adminUser.email}`)
      console.log(`   Password: ${adminPassword}`)
      console.log(`   Role: ${adminUser.role}`)
      console.log(`   ID: ${adminUser.id}`)
      
      // Create some sample data for the admin user
      await createSampleData(adminUser.id)
      
    } else {
      // Ensure existing user has correct role and verification status
      if (existingAdmin.role !== 'ADMIN' || !existingAdmin.isVerified) {
        await prisma.user.update({
          where: { id: existingAdmin.id },
          data: { 
            role: 'ADMIN', 
            isVerified: true 
          }
        })
        console.log('ℹ️  Updated existing demo user role to ADMIN and verified status')
      } else {
        console.log('ℹ️  Demo admin already exists with correct settings')
      }
    }

    // Create a regular demo user as well
    const userEmail = 'demo@user.com'
    const userPassword = '123456'

    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!existingUser) {
      const passwordHash = await bcrypt.hash(userPassword, 10)
      
      const demoUser = await prisma.user.create({
        data: {
          email: userEmail,
          passwordHash,
          role: 'USER',
          isVerified: true
        }
      })

      console.log(`✅ Created demo user:`)
      console.log(`   Email: ${demoUser.email}`)
      console.log(`   Password: ${userPassword}`)
      console.log(`   Role: ${demoUser.role}`)
    } else {
      console.log('ℹ️  Demo user already exists')
    }

    console.log('\n🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

async function createSampleData(userId) {
  try {
    console.log('📝 Creating sample data for admin user...')

    // Create sample notes
    const sampleNotes = [
      {
        document: 'Getting Started Guide',
        page: 1,
        content: 'Welcome to MyNotebookLM! This is your first note. You can create, edit, and organize your reading notes here.'
      },
      {
        document: 'User Manual',
        page: 5,
        content: 'The upload feature allows you to process PDF, DOCX, and TXT files. Once uploaded, the content becomes searchable through the AI chat feature.'
      }
    ]

    for (const noteData of sampleNotes) {
      await prisma.note.create({
        data: {
          userId,
          ...noteData
        }
      })
    }

    // Create sample progress entries
    const today = new Date()
    const sampleProgress = [
      {
        document: 'Getting Started Guide',
        pagesRead: 10,
        minutes: 25,
        date: new Date(today.getTime() - 86400000) // Yesterday
      },
      {
        document: 'User Manual',
        pagesRead: 15,
        minutes: 30,
        date: today
      }
    ]

    for (const progressData of sampleProgress) {
      await prisma.progress.create({
        data: {
          userId,
          ...progressData
        }
      })
    }

    // Create sample embeddings (basic ones for demo)
    const sampleEmbeddings = [
      {
        source: 'welcome-guide.txt',
        chunk: 'Welcome to MyNotebookLM! This is a personal notebook application that helps you organize your reading materials and notes. You can upload documents, create notes, track your reading progress, and use AI to search through your uploaded content.',
        embedding: Array.from({ length: 768 }, () => Math.random() - 0.5) // Mock embedding vector
      },
      {
        source: 'features-overview.txt',
        chunk: 'Key features include: file upload and processing for PDF, DOCX, and TXT files; intelligent text chunking and embedding generation; AI-powered search and chat functionality; progress tracking and analytics; secure user authentication with role-based access control.',
        embedding: Array.from({ length: 768 }, () => Math.random() - 0.5) // Mock embedding vector
      }
    ]

    for (const embeddingData of sampleEmbeddings) {
      const embedding = await prisma.embedding.create({
        data: {
          userId,
          ...embeddingData
        }
      })

      // Update pgvector column if available
      try {
        const vec = `[${embeddingData.embedding.join(',')}]`
        await prisma.$executeRaw`UPDATE "Embedding" SET embedding_vec = ${vec}::vector WHERE id = ${embedding.id}`
      } catch (error) {
        console.log('ℹ️  Skipped pgvector update (extension might not be installed)')
      }
    }

    console.log('✅ Sample data created successfully')
    console.log(`   - ${sampleNotes.length} sample notes`)
    console.log(`   - ${sampleProgress.length} sample progress entries`)
    console.log(`   - ${sampleEmbeddings.length} sample embeddings`)

  } catch (error) {
    console.warn('⚠️  Failed to create sample data:', error.message)
    // Don't throw here - sample data is optional
  }
}

main()
  .catch((e) => {
    console.error('💥 Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🔌 Database connection closed')
  })