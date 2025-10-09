import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Ensuring metadata column exists on "Embedding" as jsonb ...');
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "Embedding" ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT \"{}\"::jsonb'
  );
  console.log('Done.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
