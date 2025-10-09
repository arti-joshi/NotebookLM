import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function norm(s: string | null | undefined) {
  return (s ?? '').toLowerCase()
}

async function find(term: string) {
  const t = term.toLowerCase()
  const topics = await prisma.topic.findMany({ where: { level: 1 } })
  const hits = topics.filter((x) => {
    const name = norm(x.name)
    const slug = norm(x.slug)
    const keys = (x.keywords || []).map(norm)
    const aliases = (x.aliases || []).map(norm)
    const haystack = [name, slug, ...keys, ...aliases].join(' | ')
    return haystack.includes(t) || haystack.includes(t.replace(/[-\s]+/g, ' '))
  })
  return hits.map((h) => ({ id: h.id, name: h.name, slug: h.slug }))
}

async function main() {
  const queries = process.argv.slice(2)
  if (queries.length === 0) {
    console.log('Usage: tsx src/scripts/find-topics.ts "Full Text Search" "Query Optimization"')
    process.exit(0)
  }
  for (const q of queries) {
    const results = await find(q)
    console.log(`\nQuery: ${q}`)
    if (results.length === 0) console.log('  No matches')
    for (const r of results) {
      console.log(`  - ${r.id} | ${r.name} | ${r.slug}`)
    }
  }
}

main().finally(() => prisma.$disconnect())


