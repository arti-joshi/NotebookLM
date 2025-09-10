/**
 * Test Table Detection with CO4 Data
 * This script tests the enhanced table detection with your specific CO4 data pattern
 */

// Import the detection functions (using require for Node.js compatibility)
const { detectTableBoundaries } = require('./tableBoundaryDetection.ts');
const { consolidateTableFragments, analyzeTableFragmentation } = require('./tableConsolidation.ts');
const { debugTableSplitting } = require('./debugTableSplitting.ts');

// Test data based on your CO4 pattern
const testContent = `
Course Outcome Matrix

CO4 3 3 3 1 1 - - 2 1
CO3 2 2 3 2 1 1 - 1 1
CO2 1 1 2 1 1 1 - 1 1
CO1 1 1 1 1 1 1 1 1 1

Assessment Criteria

Student1 85 90 78 92
Student2 92 88 85 90
Student3 78 85 92 88

Regular paragraph text that should not be detected as a table.

Grading Scale

A 90-100
B 80-89
C 70-79
D 60-69
F 0-59
`;

// Mock chunks that represent the fragmented CO4 data
const mockFragmentedChunks = [
  {
    content: "Course Outcome Matrix\n\nCO4 3 3 3 1 1 - - 2 1",
    metadata: { chunkIndex: 0, totalChunks: 6, type: 'plain_text' }
  },
  {
    content: "CO3 2 2 3 2 1 1 - 1 1\nCO2 1 1 2 1 1 1 - 1 1",
    metadata: { chunkIndex: 1, totalChunks: 6, type: 'plain_text' }
  },
  {
    content: "CO1 1 1 1 1 1 1 1 1 1\n\nAssessment Criteria",
    metadata: { chunkIndex: 2, totalChunks: 6, type: 'plain_text' }
  },
  {
    content: "Student1 85 90 78 92\nStudent2 92 88 85 90",
    metadata: { chunkIndex: 3, totalChunks: 6, type: 'plain_text' }
  },
  {
    content: "Student3 78 85 92 88\n\nRegular paragraph text that should not be detected as a table.",
    metadata: { chunkIndex: 4, totalChunks: 6, type: 'plain_text' }
  },
  {
    content: "Grading Scale\n\nA 90-100\nB 80-89\nC 70-79\nD 60-69\nF 0-59",
    metadata: { chunkIndex: 5, totalChunks: 6, type: 'plain_text' }
  }
];

function runTableDetectionTests() {
  console.log('🧪 [TABLE DETECTION TESTS] Starting comprehensive tests...');
  console.log('=' .repeat(60));
  
  // Test 1: Table Boundary Detection
  console.log('\n📊 Test 1: Table Boundary Detection');
  console.log('-'.repeat(40));
  
  try {
    const lines = testContent.split('\n');
    const boundaries = detectTableBoundaries(lines);
    
    console.log(`✅ Found ${boundaries.boundaries.length} table boundaries:`);
    boundaries.boundaries.forEach((boundary, index) => {
      console.log(`   ${index + 1}. Lines ${boundary.startLine}-${boundary.endLine}: ${boundary.type} (confidence: ${boundary.confidence.toFixed(2)})`);
    });
    
    // Check if CO4 table was detected
    const co4Table = boundaries.boundaries.find(b => 
      b.type === 'academic_matrix' && 
      testContent.split('\n')[b.startLine].includes('CO4')
    );
    
    if (co4Table) {
      console.log(`✅ CO4 table correctly detected at lines ${co4Table.startLine}-${co4Table.endLine}`);
    } else {
      console.log(`❌ CO4 table NOT detected - this is the problem!`);
    }
    
  } catch (error) {
    console.log(`❌ Table boundary detection failed: ${error.message}`);
  }
  
  // Test 2: Table Fragmentation Analysis
  console.log('\n🔍 Test 2: Table Fragmentation Analysis');
  console.log('-'.repeat(40));
  
  try {
    const fragmentationAnalysis = analyzeTableFragmentation(mockFragmentedChunks);
    
    console.log(`✅ Fragmentation analysis complete:`);
    console.log(`   Total chunks: ${fragmentationAnalysis.totalChunks}`);
    console.log(`   Table fragments: ${fragmentationAnalysis.tableFragments}`);
    console.log(`   Potential tables: ${fragmentationAnalysis.potentialTables}`);
    
    fragmentationAnalysis.fragmentationReport.forEach(line => {
      console.log(`   ${line}`);
    });
    
  } catch (error) {
    console.log(`❌ Fragmentation analysis failed: ${error.message}`);
  }
  
  // Test 3: Table Consolidation
  console.log('\n🔧 Test 3: Table Consolidation');
  console.log('-'.repeat(40));
  
  try {
    const consolidationResult = consolidateTableFragments(mockFragmentedChunks);
    
    console.log(`✅ Consolidation complete:`);
    console.log(`   Fragments merged: ${consolidationResult.fragmentsMerged}`);
    console.log(`   Tables restored: ${consolidationResult.tablesRestored}`);
    console.log(`   Final chunks: ${consolidationResult.consolidatedChunks.length}`);
    
    consolidationResult.report.forEach(line => {
      console.log(`   ${line}`);
    });
    
    // Check if CO4 table was consolidated
    const consolidatedCO4Chunk = consolidationResult.consolidatedChunks.find(chunk => 
      chunk.content.includes('CO4') && chunk.content.includes('CO3') && chunk.content.includes('CO2') && chunk.content.includes('CO1')
    );
    
    if (consolidatedCO4Chunk) {
      console.log(`✅ CO4 table successfully consolidated into single chunk`);
      console.log(`   Consolidated content: "${consolidatedCO4Chunk.content.substring(0, 100)}..."`);
    } else {
      console.log(`❌ CO4 table was NOT consolidated - still fragmented`);
    }
    
  } catch (error) {
    console.log(`❌ Table consolidation failed: ${error.message}`);
  }
  
  // Test 4: Debug Table Splitting
  console.log('\n🐛 Test 4: Debug Table Splitting');
  console.log('-'.repeat(40));
  
  try {
    const debugAnalysis = debugTableSplitting(testContent, mockFragmentedChunks);
    
    console.log(`✅ Debug analysis complete:`);
    console.log(`   Splitting issues: ${debugAnalysis.splittingIssues.length}`);
    console.log(`   Recommendations: ${debugAnalysis.recommendations.length}`);
    
    debugAnalysis.splittingIssues.forEach(issue => {
      console.log(`   ❌ ${issue}`);
    });
    
    debugAnalysis.recommendations.forEach(rec => {
      console.log(`   🔧 ${rec}`);
    });
    
  } catch (error) {
    console.log(`❌ Debug analysis failed: ${error.message}`);
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎉 [TABLE DETECTION TESTS] All tests completed!');
}

// Run the tests
if (require.main === module) {
  runTableDetectionTests();
}

module.exports = {
  runTableDetectionTests,
  testContent,
  mockFragmentedChunks
};
