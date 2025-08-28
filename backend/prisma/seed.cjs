// Seed script to create a default admin user if missing
// Run via: npx prisma db seed

const bcrypt = require('bcrypt')
// Use the generated Prisma client output per schema.prisma generator
const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@demo.com'
  const password = 'password123' // change this in production

  const existing = await prisma.user.findUnique({ where: { email } })
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: { email, passwordHash, role: 'ADMIN' }
    })
    console.log(`✅ Seeded admin user: ${email}/${password}`)
  } else {
    // Ensure role is ADMIN for the seed user
    if (existing.role !== 'ADMIN') {
      await prisma.user.update({ where: { id: existing.id }, data: { role: 'ADMIN' } })
      console.log('ℹ️ Updated existing admin user role to ADMIN')
    } else {
      console.log('ℹ️ Admin already exists, skipping')
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


