import { runAgent, classifyQuery, TYPE_SPECIFIC_INSTRUCTIONS, buildPrompt } from '../src/services/aiAgentService';
import { POSTGRES_PROMPT } from '../src/config/systemPrompts';

const TEST_QUERIES = [
  'How do I create a table with a foreign key?',     // howto
  'INNER JOIN vs LEFT JOIN',                        // comparison
  'When should I use partial indexes?',             // best practice
  'Why isn’t my foreign key working?',              // troubleshooting
];

async function main() {
  for (const query of TEST_QUERIES) {
    console.log('==============================');
    console.log('Query:', query);
    const queryType = classifyQuery(query);
    console.log('Detected Query Type:', queryType);
    const typeInstructions = TYPE_SPECIFIC_INSTRUCTIONS[queryType];
    console.log('Type-Specific Instructions:', typeInstructions);
    // For test, use dummy context
    const dummyContext = '[Page 42, Section 3.1] Example context about PostgreSQL.';
    const prompt = buildPrompt(query, dummyContext, typeInstructions);
    console.log('Prompt Template Preview:\n', prompt.slice(0, 300), '...');
    // Run the real agent (will use actual retrieval and LLM)
    const result = await runAgent(query, 'test-user');
    console.log('--- Final Answer ---');
    console.log(result.answer);
    if (result.sources && result.sources.length) {
      console.log('Sources:', result.sources.map(s => s.source).join(', '));
    }
    console.log('------------------------------\n');
  }
}

await main();
