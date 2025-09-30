import 'dotenv/config'
import { PrismaClient } from '../generated/prisma'
import { RAGService } from '../src/services/ragService'

type TestCase = {
  question: string
  expected: string[]
}

let TESTS: TestCase[] = [
  {
    question: 'Who originally developed PostgreSQL?',
    expected: ['Berkeley', 'Michael Stonebraker']
  },
  {
    question: 'How to create a database in PostgreSQL?',
    expected: ['createdb', 'mydb']
  },
  {
    question: 'What modern features does PostgreSQL offer?',
    expected: ['object-relational', 'inheritance', 'multiversion']
  },
  {
    question: 'Explain the brief history of PostgreSQL.',
    expected: ['POSTGRES', 'Berkeley', 'UC']
  },
  {
    question: 'What are ISO 8601 interval unit abbreviations in PostgreSQL?',
    expected: ['ISO 8601', 'interval']
  }
]

const DEMO_USER_ID = process.env.DEMO_USER_ID || 'demo-user'
const TOP_N = parseInt(process.env.RETRIEVAL_TEST_TOP_N || '10', 10)

function containsAnyKeyword(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase()
  return keywords.some(k => lower.includes(k.toLowerCase()))
}

function printChunkList(items: Array<{ score?: number, finalScore?: number, metadata?: any, chunk: string }>) {
  items.slice(0, TOP_N).forEach((r, i) => {
    const page = r?.metadata?.pageNumber ?? r?.metadata?.loc?.pageNumber ?? 'n/a'
    const score = (r.finalScore ?? r.score ?? 0).toFixed(4)
    const preview = (r.chunk || '').slice(0, 200).replace(/\s+/g, ' ')
    console.log(`${String(i + 1).padStart(2, ' ')}. score=${score} page=${page} | ${preview}`)
  })
}

async function chunkExistsInDB(prisma: PrismaClient, keyword: string): Promise<boolean> {
  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM "Embedding"
    WHERE chunk ILIKE ${`%${keyword}%`}
    LIMIT 1;
  `
  return rows.length > 0
}

async function main() {
  const prisma = new PrismaClient()
  const ragService = new RAGService(prisma, { debugRetrieval: false })
  try {
    // Optional: load custom tests from JSON file via env var TESTS_FILE
    const testsFile = process.env.TESTS_FILE
    if (testsFile) {
      try {
        const fs = await import('fs')
        const path = await import('path')
        const filePath = path.isAbsolute(testsFile) ? testsFile : path.join(process.cwd(), testsFile)
        const raw = fs.readFileSync(filePath, 'utf8')
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          TESTS = parsed.filter(t => t && typeof t.question === 'string' && Array.isArray(t.expected))
        }
      } catch (e) {
        console.warn('Could not load custom tests from TESTS_FILE:', (e as Error)?.message)
      }
    }

    const resultsSummary: Array<{ question: string, expected: string, retrieved: boolean, exists: boolean, status: string }>[] = [] as any
    console.log('=== Retrieval Accuracy Test ===')
    console.log(`Top N = ${TOP_N}`)

    for (const test of TESTS) {
      console.log(`\nQ: ${test.question}`)

      const rag = await ragService.retrieveContext(test.question, DEMO_USER_ID)
      console.log(`Refined queries: ${rag.debug.expandedQueries.join(' | ')}`)
      console.log(`Keywords: ${rag.debug.keywords.join(', ')}`)
      const top = rag.results.slice(0, TOP_N)

      console.log('Top results:')
      printChunkList(top)

      const concatenated = top.map(r => r.chunk).join('\n\n')
      const found = containsAnyKeyword(concatenated, test.expected)

      let existsAny = false
      for (const kw of test.expected) {
        const exists = await chunkExistsInDB(prisma, kw)
        if (exists) { existsAny = true; break }
      }

      const expectedShown = test.expected.join(' | ')
      if (found) {
        console.log(`✅ Expected keyword present: [${expectedShown}]`)
      } else {
        console.log(`❌ Expected keyword missing in top ${TOP_N}: [${expectedShown}]`)
        if (existsAny) {
          console.log('➡️ Relevant chunk exists in DB but was NOT retrieved (Retrieval Failure)')
        } else {
          console.log('➡️ Relevant chunk does NOT exist in DB (Ingestion Failure)')
        }
      }

      // Collect per-keyword summary rows
      for (const kw of test.expected) {
        const kwFound = containsAnyKeyword(concatenated, [kw])
        const kwExists = await chunkExistsInDB(prisma, kw)
        const status = kwFound ? 'OK' : (kwExists ? 'Retrieval Failure' : 'Ingestion Failure')
        resultsSummary.push([{ question: test.question, expected: kw, retrieved: kwFound, exists: kwExists, status }])
      }
    }

    // Print summary table
    console.log('\n=== Summary ===')
    console.log('| Question | Expected Keyword | Retrieved? | Exists in DB? | Status |')
    console.log('|---|---|---|---|---|')
    for (const rows of resultsSummary) {
      for (const r of rows) {
        const retrieved = r.retrieved ? '✅' : '❌'
        const exists = r.exists ? '✅' : '❌'
        console.log(`| ${r.question} | ${r.expected} | ${retrieved} | ${exists} | ${r.status} |`)
      }
    }
  } catch (err) {
    console.error(err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()


