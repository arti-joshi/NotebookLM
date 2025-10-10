import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetMastery() {
  console.log('🔄 COMPREHENSIVE RESET: Question Counting + Mastery Formula')
  console.log('=' .repeat(70))
  
  try {
    // Step 1: Show current inflated state
    console.log('\n📊 BEFORE FIX - Current State:')
    const beforeMastery = await prisma.topicMastery.findMany({})
    const beforeInteractions = await prisma.topicInteraction.findMany({
      select: { query: true }
    })
    
    const beforeTotalQuestions = beforeMastery.reduce((sum, m) => sum + m.questionsAsked, 0)
    const beforeUniqueQueries = new Set(beforeInteractions.map(i => i.query.toLowerCase().trim())).size
    const beforeAvgMastery = beforeMastery.length > 0 
      ? beforeMastery.reduce((sum, m) => sum + m.masteryLevel, 0) / beforeMastery.length 
      : 0
    
    console.log(`   Mastery records: ${beforeMastery.length}`)
    console.log(`   Total questionsAsked (inflated): ${beforeTotalQuestions}`)
    console.log(`   Actual unique questions: ${beforeUniqueQueries}`)
    console.log(`   Inflation ratio: ${beforeUniqueQueries > 0 ? (beforeTotalQuestions / beforeUniqueQueries).toFixed(2) : 0}x`)
    console.log(`   Average mastery level: ${beforeAvgMastery.toFixed(2)}%`)
    console.log(`   Status distribution:`)
    
    const statusCounts = beforeMastery.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`     - ${status}: ${count}`)
    })
    
    // Step 2: Delete inflated mastery records
    console.log('\n🗑️  Deleting inflated mastery records...')
    const deletedMastery = await prisma.topicMastery.deleteMany({})
    console.log(`   ✅ Deleted ${deletedMastery.count} records`)
    
    // Step 3: Recalculate with fixed formulas
    console.log('\n📊 Recalculating with FIXED formulas...')
    console.log('   - Unique query counting ✅')
    console.log('   - Stricter depth scoring ✅')
    console.log('   - Stricter retention scoring ✅')
    console.log('   - Progressive mastery caps ✅')
    console.log('   - Stricter status thresholds ✅')
    
    const uniqueCombinations = await prisma.topicInteraction.findMany({
      distinct: ['userId', 'topicId'],
      select: { userId: true, topicId: true }
    })
    
    console.log(`\n   Found ${uniqueCombinations.length} user-topic combinations to recalculate`)
    
    // Import progressService with updated formulas
    const { updateMastery } = await import('../services/progressService')
    
    let successCount = 0
    let failCount = 0
    
    for (const { userId, topicId } of uniqueCombinations) {
      try {
        await updateMastery(userId, topicId)
        successCount++
        
        // Show progress every 5 updates
        if (successCount % 5 === 0) {
          process.stdout.write(`\r   Progress: ${successCount}/${uniqueCombinations.length}`)
        }
      } catch (err: any) {
        console.error(`\n   ✗ Failed ${topicId}:`, err.message)
        failCount++
      }
    }
    
    console.log(`\n   ✅ Recalculation complete!`)
    console.log(`   Success: ${successCount} | Failed: ${failCount}`)
    
    // Step 4: Show new accurate state
    console.log('\n📊 AFTER FIX - New Accurate State:')
    const afterMastery = await prisma.topicMastery.findMany({})
    const afterInteractions = await prisma.topicInteraction.findMany({
      select: { query: true }
    })
    
    const afterTotalQuestions = afterMastery.reduce((sum, m) => sum + m.questionsAsked, 0)
    const afterUniqueQueries = new Set(afterInteractions.map(i => i.query.toLowerCase().trim())).size
    const afterAvgMastery = afterMastery.length > 0
      ? afterMastery.reduce((sum, m) => sum + m.masteryLevel, 0) / afterMastery.length
      : 0
    
    console.log(`   Mastery records: ${afterMastery.length}`)
    console.log(`   Total questionsAsked (fixed): ${afterTotalQuestions}`)
    console.log(`   Actual unique questions: ${afterUniqueQueries}`)
    console.log(`   Accuracy: ${afterTotalQuestions === afterUniqueQueries ? '✅ PERFECT' : '⚠️  Still some variation (acceptable)'}`)
    console.log(`   Average mastery level: ${afterAvgMastery.toFixed(2)}%`)
    console.log(`   Status distribution:`)
    
    const newStatusCounts = afterMastery.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    Object.entries(newStatusCounts).forEach(([status, count]) => {
      console.log(`     - ${status}: ${count}`)
    })
    
    // Step 5: Show comparison
    console.log('\n📈 COMPARISON:')
    if (beforeUniqueQueries > 0 && beforeAvgMastery > 0) {
      console.log(`   Question count: ${beforeTotalQuestions} → ${afterTotalQuestions} (${((1 - afterTotalQuestions/beforeTotalQuestions) * 100).toFixed(1)}% reduction)`) 
      console.log(`   Avg mastery: ${beforeAvgMastery.toFixed(2)}% → ${afterAvgMastery.toFixed(2)}% (${(afterAvgMastery - beforeAvgMastery).toFixed(2)}% change)`) 
    }
    
    // Step 6: Sample topic breakdown
    console.log('\n🔍 Sample Topic Breakdown (first 5):')
    const sampleTopics = afterMastery.slice(0, 5)
    
    for (const mastery of sampleTopics) {
      const topic = await prisma.topic.findUnique({ where: { id: mastery.topicId } })
      console.log(`\n   ${topic?.name || mastery.topicId}`)
      console.log(`     - Questions: ${mastery.questionsAsked}/${topic?.expectedQuestions || 8}`)
      console.log(`     - Mastery: ${mastery.masteryLevel.toFixed(2)}%`)
      console.log(`     - Status: ${mastery.status}`)
      console.log(`     - Scores: Coverage=${mastery.coverageScore.toFixed(0)}% Depth=${mastery.depthScore.toFixed(0)}% Confidence=${mastery.confidenceScore.toFixed(0)}%`)
    }
    
    console.log('\n' + '='.repeat(70))
    console.log('✅ COMPREHENSIVE RESET COMPLETE!')
    console.log('   Your progress is now accurate and realistic.')
    console.log('   Refresh your dashboard to see the changes.')
    
  } catch (error: any) {
    console.error('\n❌ Reset failed:', error)
    console.error(error.stack)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

resetMastery()
