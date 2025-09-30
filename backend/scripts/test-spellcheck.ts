/**
 * Test script for spell correction functionality
 * Tests various misspelled queries to ensure they get corrected properly
 */

import { correctSpelling, spellCorrectionService } from '../src/services/spellCorrectionService.js';

// Test cases for spell correction
const TEST_CASES = [
  {
    input: "berkley",
    expected: "Berkeley",
    description: "Berkeley misspelling"
  },
  {
    input: "postgress",
    expected: "PostgreSQL",
    description: "PostgreSQL misspelling"
  },
  {
    input: "primery key",
    expected: "primary key",
    description: "Primary key misspelling"
  },
  {
    input: "foriegn key",
    expected: "foreign key",
    description: "Foreign key misspelling"
  },
  {
    input: "transacton",
    expected: "transaction",
    description: "Transaction misspelling"
  },
  {
    input: "concurreny",
    expected: "concurrency",
    description: "Concurrency misspelling"
  },
  {
    input: "indx",
    expected: "index",
    description: "Index abbreviation"
  },
  {
    input: "constaint",
    expected: "constraint",
    description: "Constraint misspelling"
  },
  {
    input: "who is berkley",
    expected: "who is Berkeley",
    description: "Full query with Berkeley misspelling"
  },
  {
    input: "how to create primery key",
    expected: "how to create primary key",
    description: "Full query with primary key misspelling"
  },
  {
    input: "postgressql installation",
    expected: "PostgreSQL installation",
    description: "PostgreSQL with installation"
  },
  {
    input: "MVCC transacton isolation",
    expected: "MVCC transaction isolation",
    description: "Technical query with transaction misspelling"
  }
];

interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  description: string;
}

function runSpellCorrectionTests(): TestResult[] {
  console.log('🧪 Running Spell Correction Tests...\n');
  
  const results: TestResult[] = [];
  
  for (const testCase of TEST_CASES) {
    const actual = correctSpelling(testCase.input);
    const passed = actual.toLowerCase().includes(testCase.expected.toLowerCase()) || 
                   actual === testCase.expected;
    
    const result: TestResult = {
      input: testCase.input,
      expected: testCase.expected,
      actual: actual,
      passed: passed,
      description: testCase.description
    };
    
    results.push(result);
    
    // Log individual test result
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testCase.description}`);
    console.log(`  Input: "${testCase.input}"`);
    console.log(`  Expected: "${testCase.expected}"`);
    console.log(`  Actual: "${actual}"`);
    console.log('');
  }
  
  return results;
}

function runIndividualWordTests(): void {
  console.log('🔍 Testing Individual Words...\n');
  
  const testWords = [
    'berkley', 'postgress', 'primery', 'foriegn', 'transacton',
    'concurreny', 'indx', 'constaint', 'postgresql', 'mvcc'
  ];
  
  for (const word of testWords) {
    const result = spellCorrectionService.testWord(word);
    console.log(`Word: "${word}"`);
    console.log(`  Match: ${result.match || 'None'}`);
    console.log(`  Score: ${result.score.toFixed(3)}`);
    console.log('');
  }
}

function runConfigurationTests(): void {
  console.log('⚙️ Testing Configuration...\n');
  
  // Test with different thresholds
  const originalConfig = spellCorrectionService.getConfig();
  
  console.log('Testing with threshold 0.9 (strict):');
  spellCorrectionService.updateConfig({ threshold: 0.9 });
  const strictResult = correctSpelling('berkley');
  console.log(`"berkley" → "${strictResult}"`);
  
  console.log('\nTesting with threshold 0.6 (lenient):');
  spellCorrectionService.updateConfig({ threshold: 0.6 });
  const lenientResult = correctSpelling('berkley');
  console.log(`"berkley" → "${lenientResult}"`);
  
  console.log('\nTesting with spell correction disabled:');
  spellCorrectionService.updateConfig({ enabled: false });
  const disabledResult = correctSpelling('berkley');
  console.log(`"berkley" → "${disabledResult}"`);
  
  // Restore original config
  spellCorrectionService.updateConfig(originalConfig);
  console.log('\nConfiguration restored to original settings.');
}

function printSummary(results: TestResult[]): void {
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const percentage = ((passed / total) * 100).toFixed(1);
  
  console.log('📊 Test Summary');
  console.log('===============');
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  console.log(`Success Rate: ${percentage}%`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Spell correction is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the results above for details.');
    
    const failedTests = results.filter(r => !r.passed);
    console.log('\nFailed Tests:');
    failedTests.forEach(test => {
      console.log(`- ${test.description}: "${test.input}" → "${test.actual}" (expected: "${test.expected}")`);
    });
  }
}

async function main(): Promise<void> {
  try {
    console.log('🚀 Starting Spell Correction Test Suite\n');
    
    // Run main spell correction tests
    const results = runSpellCorrectionTests();
    
    // Run individual word tests
    runIndividualWordTests();
    
    // Run configuration tests
    runConfigurationTests();
    
    // Print summary
    printSummary(results);
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run the tests
main();
