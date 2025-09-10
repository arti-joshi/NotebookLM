#!/usr/bin/env node

/**
 * Database Cleanup Script for MyNotebookLM
 * 
 * This script helps you clean up your vector chunks and embeddings data.
 * Run with different options to clear specific data or everything.
 * 
 * Usage:
 *   node cleanup.js --all              # Clear all embeddings/chunks
 *   node cleanup.js --user <userId>    # Clear chunks for specific user
 *   node cleanup.js --source <filename> # Clear chunks for specific document
 *   node cleanup.js --confirm          # Skip confirmation prompts
 *   node cleanup.js --dry-run          # Show what would be deleted without deleting
 */

const { PrismaClient } = require('./backend/generated/prisma');
const readline = require('readline');

const prisma = new PrismaClient();

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  all: args.includes('--all'),
  user: args.includes('--user') ? args[args.indexOf('--user') + 1] : null,
  source: args.includes('--source') ? args[args.indexOf('--source') + 1] : null,
  confirm: args.includes('--confirm'),
  dryRun: args.includes('--dry-run'),
  help: args.includes('--help') || args.includes('-h')
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase().trim());
    });
  });
}

async function showStats() {
  console.log('\n📊 Current Database Stats:');
  console.log('=' .repeat(50));
  
  try {
    // Total embeddings count
    const totalEmbeddings = await prisma.embedding.count();
    console.log(`Total Embeddings: ${totalEmbeddings}`);
    
    // Count by user
    const userStats = await prisma.embedding.groupBy({
      by: ['userId'],
      _count: { id: true }
    });
    
    console.log('\nBy User:');
    for (const stat of userStats) {
      console.log(`  User ${stat.userId}: ${stat._count.id} chunks`);
    }
    
    // Count by source document
    const sourceStats = await prisma.embedding.groupBy({
      by: ['source'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    });
    
    console.log('\nTop 10 Documents:');
    for (const stat of sourceStats) {
      console.log(`  ${stat.source}: ${stat._count.id} chunks`);
    }
    
    // Vector column stats
    try {
      const vectorStats = await prisma.$queryRaw`
        SELECT COUNT(*) as total, 
               COUNT(embedding_vec) as with_vectors
        FROM "Embedding"
      `;
      console.log(`\nVector Status: ${vectorStats[0].with_vectors}/${vectorStats[0].total} have pgvector data`);
    } catch (e) {
      console.log('\nVector Status: Unable to check pgvector column');
    }
    
  } catch (error) {
    console.error('Error fetching stats:', error.message);
  }
}

async function clearAll() {
  console.log('\n🗑️  CLEARING ALL EMBEDDINGS/CHUNKS');
  console.log('⚠️  This will delete ALL vector data from your database!');
  
  if (!options.confirm && !options.dryRun) {
    const answer = await askQuestion('\nAre you absolutely sure? Type "DELETE ALL" to confirm: ');
    if (answer !== 'delete all') {
      console.log('❌ Operation cancelled.');
      return;
    }
  }
  
  try {
    if (options.dryRun) {
      const count = await prisma.embedding.count();
      console.log(`🔍 DRY RUN: Would delete ${count} embeddings`);
      return;
    }
    
    console.log('🧹 Deleting all embeddings...');
    const result = await prisma.embedding.deleteMany({});
    console.log(`✅ Successfully deleted ${result.count} embeddings`);
    
    // Reset auto-increment if using PostgreSQL
    try {
      await prisma.$executeRaw`ALTER SEQUENCE "Embedding_id_seq" RESTART WITH 1`;
      console.log('✅ Reset ID sequence');
    } catch (e) {
      // Ignore if sequence doesn't exist or not PostgreSQL
    }
    
  } catch (error) {
    console.error('❌ Error clearing all embeddings:', error.message);
  }
}

async function clearByUser(userId) {
  console.log(`\n🗑️  CLEARING CHUNKS FOR USER: ${userId}`);
  
  try {
    // Check if user exists and show stats
    const userChunks = await prisma.embedding.count({
      where: { userId }
    });
    
    if (userChunks === 0) {
      console.log(`❌ No chunks found for user: ${userId}`);
      return;
    }
    
    console.log(`Found ${userChunks} chunks for user ${userId}`);
    
    if (!options.confirm && !options.dryRun) {
      const answer = await askQuestion(`Delete all ${userChunks} chunks for this user? (y/N): `);
      if (answer !== 'y' && answer !== 'yes') {
        console.log('❌ Operation cancelled.');
        return;
      }
    }
    
    if (options.dryRun) {
      console.log(`🔍 DRY RUN: Would delete ${userChunks} chunks for user ${userId}`);
      return;
    }
    
    console.log('🧹 Deleting user chunks...');
    const result = await prisma.embedding.deleteMany({
      where: { userId }
    });
    console.log(`✅ Successfully deleted ${result.count} chunks for user ${userId}`);
    
  } catch (error) {
    console.error('❌ Error clearing user chunks:', error.message);
  }
}

async function clearBySource(source) {
  console.log(`\n🗑️  CLEARING CHUNKS FOR DOCUMENT: ${source}`);
  
  try {
    // Check if document exists and show stats
    const docChunks = await prisma.embedding.count({
      where: { source }
    });
    
    if (docChunks === 0) {
      console.log(`❌ No chunks found for document: ${source}`);
      return;
    }
    
    console.log(`Found ${docChunks} chunks for document "${source}"`);
    
    if (!options.confirm && !options.dryRun) {
      const answer = await askQuestion(`Delete all ${docChunks} chunks for this document? (y/N): `);
      if (answer !== 'y' && answer !== 'yes') {
        console.log('❌ Operation cancelled.');
        return;
      }
    }
    
    if (options.dryRun) {
      console.log(`🔍 DRY RUN: Would delete ${docChunks} chunks for document "${source}"`);
      return;
    }
    
    console.log('🧹 Deleting document chunks...');
    const result = await prisma.embedding.deleteMany({
      where: { source }
    });
    console.log(`✅ Successfully deleted ${result.count} chunks for document "${source}"`);
    
  } catch (error) {
    console.error('❌ Error clearing document chunks:', error.message);
  }
}

function showHelp() {
  console.log(`
🧹 MyNotebookLM Database Cleanup Tool

Usage:
  node cleanup.js [options]

Options:
  --all                    Clear ALL embeddings/chunks (dangerous!)
  --user <userId>          Clear chunks for specific user
  --source <filename>      Clear chunks for specific document
  --confirm               Skip confirmation prompts
  --dry-run               Show what would be deleted without deleting
  --help, -h              Show this help message

Examples:
  node cleanup.js                           # Show stats only
  node cleanup.js --all                     # Clear everything (with confirmation)
  node cleanup.js --all --confirm           # Clear everything (no confirmation)
  node cleanup.js --user demo-admin-user    # Clear chunks for demo user
  node cleanup.js --source "document.pdf"   # Clear chunks for specific document
  node cleanup.js --dry-run --all           # See what would be deleted

⚠️  Always backup your database before running cleanup operations!
`);
}

async function main() {
  console.log('🧹 MyNotebookLM Database Cleanup Tool');
  console.log('=====================================');
  
  if (options.help) {
    showHelp();
    return;
  }
  
  // Always show current stats first
  await showStats();
  
  // Execute requested operation   
  if (options.all) {
    await clearAll();
  } else if (options.user) {
    await clearByUser(options.user);
  } else if (options.source) {
    await clearBySource(options.source);
  } else {
    console.log('\n💡 No cleanup operation specified.');
    console.log('   Use --help to see available options.');
    console.log('   Use --all to clear everything.');
  }
  
  // Show final stats if something was deleted
  if ((options.all || options.user || options.source) && !options.dryRun) {
    console.log('\n📊 Final Stats:');
    await showStats();
  }
}

// Run the script
main()
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
    console.log('\n👋 Cleanup complete!');
  });