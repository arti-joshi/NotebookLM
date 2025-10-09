import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { recordInteraction } from '../services/progressService'
import { getEmbedding } from '../services/embeddingService'

type Confidence = 'high' | 'medium' | 'low'

const prisma = new PrismaClient({ log: ['error', 'warn'] })
const TEST_USER_ID = 'test-user'

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function findTopicIdByNameFragment(fragmentOrList: string | string[]): Promise<string> {
  const fragments = Array.isArray(fragmentOrList) ? fragmentOrList : [fragmentOrList]
  for (const fragment of fragments) {
    const t = await prisma.topic.findFirst({
      where: {
        level: 1,
        OR: [
          { name: { contains: fragment, mode: 'insensitive' } },
          { slug: { contains: fragment.toLowerCase().replace(/\s+/g, '-') } },
          { keywords: { has: fragment.toLowerCase() } },
          { aliases: { has: fragment.toLowerCase() } }
        ]
      },
      select: { id: true, name: true, slug: true }
    })
    if (t) return t.id
  }
  // Fallback: try broader category guesses
  const broad = await prisma.topic.findFirst({
    where: {
      level: 1,
      OR: [
        { name: { contains: 'index', mode: 'insensitive' } },
        { name: { contains: 'transaction', mode: 'insensitive' } },
        { name: { contains: 'search', mode: 'insensitive' } },
        { name: { contains: 'optimiz', mode: 'insensitive' } },
        { name: { contains: 'partition', mode: 'insensitive' } }
      ]
    },
    select: { id: true }
  })
  if (broad) return broad.id
  throw new Error(`Topic not found for fragments: ${fragments.join(', ')}`)
}

async function findTopicIdBySlug(slug: string): Promise<string | null> {
  const t = await prisma.topic.findUnique({ where: { slug } })
  return t?.id || null
}

function confidenceNumber(level: Confidence): number {
  if (level === 'high') return 0.85
  if (level === 'medium') return 0.65
  return 0.45
}

function ragConfidenceFrom(level: Confidence): Confidence {
  return level
}

async function simulateQuestion(params: {
  userId: string
  topicId: string
  query: string
  confidence: Confidence
  citations: string[]
}) {
  const { userId, topicId, query, confidence, citations } = params

  const queryEmbedding = await getEmbedding(query)

  await recordInteraction({
    userId,
    query,
    queryEmbedding,
    topicMappings: [
      {
        topicId,
        confidence: confidenceNumber(confidence),
        source: 'embedding',
        matchedKeywords: []
      }
    ],
    ragMetadata: {
      confidence: ragConfidenceFrom(confidence),
      topScore: confidence === 'high' ? 0.85 : confidence === 'medium' ? 0.65 : 0.45,
      citedSections: citations
    },
    answerLength: Math.floor(300 + Math.random() * 400),
    citationCount: citations.length,
    timeSpentMs: 45000,
    hadFollowUp: Math.random() > 0.5
  })
}

async function main() {
  console.log('=== Progress Tracking Test ===')

  // 1) Clear prior progress for test user
  console.log('Resetting previous progress for user:', TEST_USER_ID)
  // Ensure test user exists (FK requirement)
  await prisma.user.upsert({
    where: { id: TEST_USER_ID },
    update: {},
    create: {
      id: TEST_USER_ID,
      email: 'test-user@example.com',
      passwordHash: 'demo',
      role: 'USER',
      isVerified: true
    }
  })
  await prisma.$transaction([
    prisma.topicInteraction.deleteMany({ where: { userId: TEST_USER_ID } }),
    prisma.topicMastery.deleteMany({ where: { userId: TEST_USER_ID } })
  ])

  // 2) Resolve topic IDs
  console.log('Resolving topic IDs...')
  const topics = {
    btree: await findTopicIdByNameFragment(['B-tree', 'Btree', 'B tree', 'B-tree Index', 'Index']),
    transactions: await findTopicIdByNameFragment(['Transaction', 'Transactions']),
    // Prefer explicit known slug if present, fallback to fuzzy
    fts: (await findTopicIdBySlug('fts-indexing-and-performance')) 
      || await findTopicIdByNameFragment(['Full Text', 'Full-Text', 'Text Search', 'Search', 'Indexing and Performance']),
    queryOpt: (await findTopicIdBySlug('planner-statistics'))
      || await findTopicIdByNameFragment(['Query Optimization', 'Optimization', 'Planner', 'Statistics', 'Query Planning']),
    partitioning: await findTopicIdByNameFragment(['Partitioning', 'Partition', 'Table Partitioning'])
  }

  // 3) Simulate 8 questions
  console.log('Simulating interactions...')
  const interactions: Array<() => Promise<void>> = [
    () => simulateQuestion({
      userId: TEST_USER_ID,
      topicId: topics.btree,
      query: 'How does a B-tree index work in PostgreSQL? Provide complexity.',
      confidence: 'high',
      citations: ['Indexes → B-tree Indexes']
    }),
    () => simulateQuestion({
      userId: TEST_USER_ID,
      topicId: topics.btree,
      query: 'When is a B-tree index chosen by the planner?',
      confidence: 'high',
      citations: ['Indexes → B-tree Indexes']
    }),
    () => simulateQuestion({
      userId: TEST_USER_ID,
      topicId: topics.transactions,
      query: 'Explain transaction isolation levels in PostgreSQL.',
      confidence: 'medium',
      citations: ['Transactions → Isolation']
    }),
    () => simulateQuestion({
      userId: TEST_USER_ID,
      topicId: topics.transactions,
      query: 'What is a transaction and how do COMMIT/ROLLBACK work?',
      confidence: 'medium',
      citations: ['Transactions → Basics']
    }),
    () => simulateQuestion({
      userId: TEST_USER_ID,
      topicId: topics.fts,
      query: 'How to configure full-text search with tsvector & tsquery?',
      confidence: 'high',
      citations: ['Full Text Search → Configuration']
    }),
    () => simulateQuestion({
      userId: TEST_USER_ID,
      topicId: topics.fts,
      query: 'What indexes are recommended for full-text search?',
      confidence: 'high',
      citations: ['Full Text Search → Indexing']
    }),
    () => simulateQuestion({
      userId: TEST_USER_ID,
      topicId: topics.queryOpt,
      query: 'General tips to optimize queries in PostgreSQL?',
      confidence: 'low',
      citations: ['Performance Tips → Overview']
    }),
    () => simulateQuestion({
      userId: TEST_USER_ID,
      topicId: topics.partitioning,
      query: 'How does table partitioning work and when to use it?',
      confidence: 'medium',
      citations: ['Data Definition → Table Partitioning']
    })
  ]

  for (const run of interactions) {
    await run()
    await sleep(100)
  }

  // 4) Verify results
  console.log('Verifying mastery records...')
  const masteries = await prisma.topicMastery.findMany({
    where: { userId: TEST_USER_ID },
    include: { topic: true }
  })

  const byTopic = new Map(masteries.map(m => [m.topicId, m]))
  const expectedCount = 5
  if (masteries.length !== expectedCount) {
    console.warn(`Expected ${expectedCount} mastery records, found ${masteries.length}`)
  }

  // Basic health checks on scores
  for (const m of masteries) {
    if (m.masteryLevel < 0 || m.masteryLevel > 100) {
      console.warn(`Mastery out of range for ${m.topic?.name}: ${m.masteryLevel}`)
    }
    if (m.coverageScore < 0 || m.coverageScore > 100) {
      console.warn(`Coverage out of range for ${m.topic?.name}: ${m.coverageScore}`)
    }
    if (m.depthScore < 0 || m.depthScore > 100) {
      console.warn(`Depth out of range for ${m.topic?.name}: ${m.depthScore}`)
    }
  }

  // 5) Print summary report
  console.log('\n=== Summary Report ===')
  for (const m of masteries.sort((a, b) => (b.masteryLevel - a.masteryLevel))) {
    console.log(`- ${m.topic?.name} [${m.status}]`)
    console.log(`  mastery=${m.masteryLevel.toFixed(1)}%`)
    console.log(`  coverage=${m.coverageScore.toFixed(1)} depth=${m.depthScore.toFixed(1)} confidence=${m.confidenceScore.toFixed(1)} diversity=${m.diversityScore.toFixed(1)} retention=${m.retentionScore.toFixed(1)}`)
    console.log(`  interactions=${m.questionsAsked} last=${m.lastInteraction?.toISOString?.()}`)
  }

  await prisma.$disconnect()
}

main().catch(async (err) => {
  console.error('Test failed:', err)
  try { await prisma.$disconnect() } catch {}
  process.exit(1)
})


