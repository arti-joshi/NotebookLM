import { POSTGRES_PROMPT } from '../config/systemPrompts';
import { PrismaClient } from '../../generated/prisma';
import { RAGService } from './ragService';
import { getSambaClient } from '../sambaClient';

// --- Extended Query Categories ---
export enum QueryType {
  SYNTAX = 'syntax',
  CONCEPT = 'concept',
  TROUBLESHOOT = 'debug',
  COMPARISON = 'compare',
  BESTPRACTICE = 'bestpractice',
  EXAMPLE = 'example',
  PERFORMANCE = 'performance',
}

// --- Classification ---
export function classifyQuery(query: string): QueryType {
  const lower = query.toLowerCase();

  if (lower.match(/how (do|to)|steps|procedure|syntax|create|insert|update|delete|ddl|query/))
    return QueryType.SYNTAX;
  if (lower.match(/what is|define|explain|meaning of|concept|purpose of/))
    return QueryType.CONCEPT;
  if (lower.match(/why|error|problem|issue|fix|not working|fail|cannot/))
    return QueryType.TROUBLESHOOT;
  if (lower.match(/difference|versus|compare|vs\.?|which is better/))
    return QueryType.COMPARISON;
  if (lower.match(/when should i|best way|best practices|should i use/))
    return QueryType.BESTPRACTICE;
  if (lower.match(/show me|give example|sample query|example of/))
    return QueryType.EXAMPLE;
  if (lower.match(/performance|optimize|speed|faster|slow query/))
    return QueryType.PERFORMANCE;

  // Default fallback
  return QueryType.CONCEPT;
}

// --- Type Specific Instructions ---
export const TYPE_SPECIFIC_INSTRUCTIONS: Record<QueryType, string> = {
  [QueryType.SYNTAX]: `Provide exact SQL syntax. Format:\n1. Basic syntax\n2. Common options\n3. Example query\n4. Related commands`,
  [QueryType.CONCEPT]: `Explain clearly:\n1. Short definition\n2. Why it matters\n3. Use cases\n4. Related concepts`,
  [QueryType.TROUBLESHOOT]: `Give diagnostic help:\n1. Common causes\n2. How to check/diagnose\n3. Fixes\n4. Prevention tips`,
  [QueryType.COMPARISON]: `Compare systematically:\n1. Key differences\n2. When to use each\n3. Performance trade-offs\n4. Examples`,
  [QueryType.BESTPRACTICE]: `Provide guidance:\n1. Best practice\n2. Why recommended\n3. Example\n4. Citation`,
  [QueryType.EXAMPLE]: `Show examples:\n1. Working SQL example\n2. Variants\n3. Notes\n4. Citation`,
  [QueryType.PERFORMANCE]: `Explain optimization:\n1. Performance considerations\n2. Tuning options\n3. Examples (EXPLAIN, indexes)\n4. Warnings`,
};

// --- LLM Configs ---
export const LLM_CONFIGS: Record<QueryType, { temperature: number; maxTokens: number }> = {
  [QueryType.SYNTAX]: { temperature: 0.0, maxTokens: 600 },
  [QueryType.CONCEPT]: { temperature: 0.1, maxTokens: 800 },
  [QueryType.TROUBLESHOOT]: { temperature: 0.2, maxTokens: 1000 },
  [QueryType.COMPARISON]: { temperature: 0.1, maxTokens: 800 },
  [QueryType.BESTPRACTICE]: { temperature: 0.1, maxTokens: 700 },
  [QueryType.EXAMPLE]: { temperature: 0.0, maxTokens: 600 },
  [QueryType.PERFORMANCE]: { temperature: 0.2, maxTokens: 1000 },
};

// --- Prompt Builder ---
export function buildPrompt(query: string, context: string, typeInstructions?: string): string {
  return `${POSTGRES_PROMPT}\n\nDOCUMENTATION CONTEXT:\n${context}\n\nUSER QUESTION: ${query}\n\nProvide a clear, accurate answer strictly based on the documentation above. Always cite relevant pages.`
    + (typeInstructions ? `\n\n${typeInstructions}` : '');
}

// --- Validation (generalized) ---
export function validateResponse(response: string, context: string): boolean {
  const postgresCommands = ['CREATE', 'ALTER', 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'INDEX', 'EXPLAIN', 'VACUUM'];
  const mentionsCommands = postgresCommands.some(cmd => response.includes(cmd));

  // Check if any SQL snippet exists
  const sqlPattern = /(CREATE|ALTER|SELECT|INSERT|UPDATE|DELETE|EXPLAIN)\s+[A-Z]/i;
  const hasSQL = sqlPattern.test(response);

  // Make sure context has relevant terms if SQL is mentioned
  if (hasSQL && !context.toLowerCase().includes('create')) {
    console.warn('Response may contain unsupported SQL not in context');
    return false;
  }
  return true;
}

// --- Citations ---
export function enforceSourceCitation(response: string, sources: Array<{chunk: string, source: string}>): string {
  const sourcesText = sources
    .map((s, i) => `[${i+1}] ${s.source}`)
    .join('\n');
  return `${response}\n\n---\nSources:\n${sourcesText}`;
}

// --- Main Agent ---
const prisma = new PrismaClient();
const ragService = new RAGService(prisma, {
  maxResults: 20,
  enableKeywordSearch: true,
  enableQueryExpansion: true,
  enableHybridSearch: true,
  enableReranking: true,
  debugRetrieval: false,
});

export interface AgentResult {
  answer: string;
  sources: Array<{ source: string; chunkIndex?: number | null; preview: string }>;
}

export async function runAgent(query: string, userId: string): Promise<AgentResult> {
  try {
    const queryType = classifyQuery(query);
    console.log('[aiAgentService] QueryType:', queryType);

    let { results, context } = await ragService.retrieveContext(query, userId);

    const prompt = buildPrompt(query, context, TYPE_SPECIFIC_INSTRUCTIONS[queryType]);
    const llmConfig = LLM_CONFIGS[queryType];

    const samba = await getSambaClient();
    let completion = await samba.chat.completions.create({
      model: process.env.SAMBANOVA_MODEL || 'Llama-4-Maverick-17B-128E-Instruct',
      messages: [
        { role: 'system', content: POSTGRES_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: llmConfig.temperature,
      max_tokens: llmConfig.maxTokens,
    });

    let answer = completion?.choices?.[0]?.message?.content?.trim() || 'I could not generate a response.';

    if (!validateResponse(answer, context)) {
      answer = "⚠️ I don't have enough information in the documentation to answer accurately.";
    } else {
      answer = enforceSourceCitation(answer, results.map(r => ({ chunk: r.chunk, source: r.source })));
    }

    const sources = results.map((r: any) => ({
      source: r.source,
      chunkIndex: r.chunkIndex,
      preview: r.chunk.slice(0, 200).replace(/\s+/g, ' '),
    }));
    return { answer, sources };
  } catch (error) {
    console.error('[aiAgentService] Error:', error);
    return {
      answer: '⚠️ Sorry, I encountered an error while processing your request.',
      sources: [],
    };
  }
}
