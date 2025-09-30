import 'dotenv/config'
import { runAgent } from '../src/services/aiAgentService.ts'

const TEST_CASES: Array<{
  query: string
  expectedKeywords: string[]
  mustNotContain: string[]
}> = [
  {
    query: 'How do I create an index on multiple columns?',
    expectedKeywords: ['CREATE INDEX', 'ON'],
    mustNotContain: ['DROP', 'ALTER']
  },
  {
    query: 'What is MVCC?',
    expectedKeywords: ['multiversion concurrency', 'transaction', 'isolation'],
    mustNotContain: ['MongoDB', 'MySQL']
  }
]

async function testPromptQuality() {
  for (const test of TEST_CASES) {
    try {
      const { answer, sources } = await runAgent(test.query, 'demo-user')
      const text = (answer || '').toLowerCase()

      const hasRequired = test.expectedKeywords.every(kw => text.includes(kw.toLowerCase()))
      const hasProhibited = test.mustNotContain.some(kw => text.includes(kw.toLowerCase()))

      const pass = hasRequired && !hasProhibited
      console.log(`\nQuery: ${test.query}`)
      console.log(`Result: ${pass ? '✅ PASS' : '❌ FAIL'}`)
      console.log('Sources:', sources)

      if (!pass) {
        console.log('Answer snippet:', answer.slice(0, 500))
      }
    } catch (err) {
      console.error(`Error running test for query: ${test.query}`, err)
    }
  }
}

// Auto-run in ESM environments
await testPromptQuality()
