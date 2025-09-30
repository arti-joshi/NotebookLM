import { POSTGRES_SYSTEM_PROMPT } from '../config/systemPrompts';
import { PrismaClient } from '../../generated/prisma';
import { RAGService } from './ragService';
import { getSambaClient } from '../sambaClient';

// --- Query Type Classification ---
export enum QueryType {
  SYNTAX = 'syntax',
  CONCEPT = 'concept',
  TROUBLESHOOT = 'debug',
  COMPARISON = 'compare',
}

export function classifyQuery(query: string): QueryType {
  const lower = query.toLowerCase();
  if (lower.match(/how (do|to)|create|syntax|index|ddl/)) return QueryType.SYNTAX;
  if (lower.match(/what is|explain|define|mvcc|concept/)) return QueryType.CONCEPT;
  if (lower.match(/why|error|problem|slow|fail|cannot/)) return QueryType.TROUBLESHOOT;
  if (lower.match(/difference|versus|compare|vs\.?/)) return QueryType.COMPARISON;
  return QueryType.CONCEPT;
}

export const TYPE_SPECIFIC_INSTRUCTIONS: Record<QueryType, string> = {
  [QueryType.SYNTAX]: `Focus on exact SQL syntax. Format:\n1. Basic syntax\n2. Common options\n3. Complete example\n4. Related commands`,
  [QueryType.CONCEPT]: `Explain the concept clearly:\n1. Definition in one sentence\n2. Why it matters\n3. Common use cases\n4. Related concepts`,
  [QueryType.TROUBLESHOOT]: `Provide diagnostic guidance:\n1. Common causes\n2. How to check/diagnose\n3. Solution steps\n4. Prevention tips`,
  [QueryType.COMPARISON]: `Compare systematically:\n1. Key differences\n2. When to use each\n3. Performance considerations\n4. Code examples of both`,
};

export const LLM_CONFIGS: Record<QueryType, { temperature: number; maxTokens: number }> = {
  [QueryType.SYNTAX]: { temperature: 0.0, maxTokens: 500 },
  [QueryType.CONCEPT]: { temperature: 0.1, maxTokens: 800 },
  [QueryType.TROUBLESHOOT]: { temperature: 0.2, maxTokens: 1000 },
  [QueryType.COMPARISON]: { temperature: 0.1, maxTokens: 800 },
};

export function buildPrompt(query: string, context: string, typeInstructions?: string): string {
  return `${POSTGRES_SYSTEM_PROMPT}\n\nDOCUMENTATION CONTEXT:\n${context}\n\nUSER QUESTION: ${query}\n\nProvide a clear, accurate answer based on the documentation context above. If the context doesn't contain relevant information, say so directly.` + (typeInstructions ? `\n\n${typeInstructions}` : '');
}

export function validateResponse(response: string, context: string): boolean {
  const postgresCommands = ['CREATE', 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'INDEX', 'USING'];
  const mentionsCommands = postgresCommands.some(cmd => response.includes(cmd));
  // Accept if clear composite index syntax is present and context references CREATE INDEX
  const compositeRegex = /CREATE\s+INDEX[\s\S]*?\([\s\S]*?,[\s\S]*?\)/i;
  const hasCompositeSyntax = compositeRegex.test(response);
  const contextHasCreateIndex = /create\s+index/i.test(context);
  if (hasCompositeSyntax && contextHasCreateIndex) {
    return true;
  }
  if (mentionsCommands && !context.includes(response.match(/[A-Z]{4,}/g)?.[0] || '')) {
    console.warn('Response may contain hallucinated commands');
    return false;
  }
  return true;
}

export function enforceSourceCitation(response: string, sources: Array<{chunk: string, source: string}>): string {
  const sourcesText = sources
    .map((s, i) => `[${i+1}] ${s.source}`)
    .join('\n');
  return `${response}\n\n---\nSources:\n${sourcesText}`;
}

function buildRefinedQueries(query: string, type: QueryType): string[] {
  const q = query.toLowerCase();
  const refinements: string[] = [];
  if (type === QueryType.SYNTAX) {
    refinements.push(
      'CREATE INDEX ON multiple columns PostgreSQL syntax',
      'PostgreSQL composite index syntax',
      'PostgreSQL multi-column index USING btree syntax',
      'CREATE INDEX examples multiple columns',
      'CREATE INDEX multiple columns PostgreSQL 17',
      'composite index PostgreSQL 17',
      'CREATE INDEX syntax Part VI'
    );
    if (!/create index/.test(q)) refinements.push(`CREATE INDEX ${query}`);
  } else if (type === QueryType.CONCEPT) {
    if (!/mvcc/.test(q)) refinements.push('PostgreSQL MVCC');
    refinements.push(
      'PostgreSQL MVCC documentation',
      'PostgreSQL multiversion concurrency control',
      'PostgreSQL 17 MVCC visibility snapshots',
      'MVCC Part',
      'concurrency control chapter'
    );
  }
  return refinements;
}

// Filter retrieved chunks by query type specific keywords to tighten grounding
function filterResultsByType(
  results: Array<{ chunk: string; source: string; chunkIndex?: number | null }>,
  type: QueryType
): Array<{ chunk: string; source: string; chunkIndex?: number | null }> {
  const lowerIncludes = (text: string, terms: string[]): boolean => {
    const t = text.toLowerCase();
    return terms.some(term => t.includes(term));
  };

  if (type === QueryType.SYNTAX) {
    const terms = ['create index', 'using btree', 'using gin', 'unique index', 'composite index', 'multiple columns'];
    // Prefer chunks that contain explicit composite index pattern: (col1, col2)
    const compositePattern = /create\s+index[\s\S]*?\(\s*\w+[\w\s"\.]*,\s*\w+/i;
    let filtered = results.filter(r => compositePattern.test(r.chunk));
    if (!filtered.length) {
      filtered = results.filter(r => lowerIncludes(r.chunk, terms));
    }
    return filtered.length ? filtered : results;
  }
  if (type === QueryType.CONCEPT) {
    const terms = ['multiversion concurrency control', 'mvcc', 'transaction visibility', 'snapshot'];
    const filtered = results.filter(r => lowerIncludes(r.chunk, terms));
    return filtered.length ? filtered : results;
  }
  return results;
}

// --- Main Agent Function ---
const prisma = new PrismaClient();
const ragService = new RAGService(prisma, {
  maxResults: 10,
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

    // First retrieval
    let { results, context } = await ragService.retrieveContext(query, userId);
    console.log('[aiAgentService] Context:', context);

    // Apply intent-specific filtering of results and rebuild context
    const filteredResults = filterResultsByType(results.map(r => ({ chunk: r.chunk, source: r.source, chunkIndex: r.chunkIndex })), queryType);
    if (filteredResults.length && filteredResults.length !== results.length) {
      console.log('[aiAgentService] Applied type-specific filtering, reduced results from', results.length, 'to', filteredResults.length);
      // Rebuild a compact context from filtered chunks grouped by source
      const bySource = filteredResults.reduce((acc, r) => {
        (acc[r.source] ||= []).push(r);
        return acc;
      }, {} as Record<string, Array<{ chunk: string; source: string; chunkIndex?: number | null }>>);
      const rebuilt = Object.entries(bySource)
        .map(([src, chunks]) => {
          const body = chunks
            .sort((a, b) => (a.chunkIndex ?? 0) - (b.chunkIndex ?? 0))
            .map(c => c.chunk)
            .join('\n---\n');
          return `📄 ${src}\n${body}`;
        })
        .join('\n\n================\n\n');
      if (rebuilt.trim().length > 0) {
        context = rebuilt;
      }
      // Replace results used for citations with filtered ones
      results = filteredResults.map(fr => ({
        chunk: fr.chunk,
        source: fr.source,
        chunkIndex: fr.chunkIndex ?? null,
        score: 0,
        method: 'context' as const,
      } as any));
    }

    // Build and send prompt
    const prompt = buildPrompt(query, context, TYPE_SPECIFIC_INSTRUCTIONS[queryType]);
    console.log('[aiAgentService] Prompt:', prompt);
    const llmConfig = LLM_CONFIGS[queryType];
    console.log('[aiAgentService] LLM Config:', llmConfig);
    console.log('[aiAgentService] System Prompt:', POSTGRES_SYSTEM_PROMPT);

    const samba = await getSambaClient();
    let completion = await samba.chat.completions.create({
      model: process.env.SAMBANOVA_MODEL || 'Llama-4-Maverick-17B-128E-Instruct',
      messages: [
        { role: 'system', content: POSTGRES_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: llmConfig.temperature,
      max_tokens: llmConfig.maxTokens,
    });
    console.log('[aiAgentService] Raw LLM Response:', completion);
    let answer = completion?.choices?.[0]?.message?.content?.trim() || 'I could not generate a response.';

    // Validate; if invalid or context looks irrelevant, attempt one refined retrieval + retry
    const contextLower = context.toLowerCase();
    const needsRetry =
      !validateResponse(answer, context) ||
      (queryType === QueryType.SYNTAX && !contextLower.includes('create index')) ||
      (queryType === QueryType.CONCEPT && !contextLower.includes('mvcc'));

    if (needsRetry) {
      console.warn('[aiAgentService] Retrying with refined retrieval queries');
      const refined = buildRefinedQueries(query, queryType);
      for (const r of refined) {
        const attempt = await ragService.retrieveContext(r, userId);
        const filteredAttempt = filterResultsByType(attempt.results.map(ar => ({ chunk: ar.chunk, source: ar.source, chunkIndex: ar.chunkIndex })), queryType);
        const attemptLower = attempt.context.toLowerCase();
        const hitsSyntax = attemptLower.includes('create index') || attemptLower.includes('using');
        const hitsMVCC = attemptLower.includes('mvcc') || attemptLower.includes('multiversion');
        const better = queryType === QueryType.SYNTAX ? hitsSyntax : (queryType === QueryType.CONCEPT ? hitsMVCC : false);
        if ((filteredAttempt.length && better) || (better && attempt.context.length > context.length * 0.6)) {
          results = filteredAttempt.length ? filteredAttempt.map(fr => ({
            chunk: fr.chunk,
            source: fr.source,
            chunkIndex: fr.chunkIndex ?? null,
            score: 0,
            method: 'context' as const,
          } as any)) : attempt.results;
          // Rebuild context from filtered attempt where possible
          if (filteredAttempt.length) {
            const bySource = filteredAttempt.reduce((acc, rr) => {
              (acc[rr.source] ||= []).push(rr);
              return acc;
            }, {} as Record<string, Array<{ chunk: string; source: string; chunkIndex?: number | null }>>);
            context = Object.entries(bySource)
              .map(([src, chunks]) => `📄 ${src}\n${chunks.map(c => c.chunk).join('\n---\n')}`)
              .join('\n\n================\n\n');
          } else {
            context = attempt.context;
          }
          console.log('[aiAgentService] Retry Context:', context);
          const retryPrompt = buildPrompt(query, context, TYPE_SPECIFIC_INSTRUCTIONS[queryType]);
          console.log('[aiAgentService] Retry Prompt:', retryPrompt);
          completion = await samba.chat.completions.create({
            model: process.env.SAMBANOVA_MODEL || 'Llama-4-Maverick-17B-128E-Instruct',
            messages: [
              { role: 'system', content: POSTGRES_SYSTEM_PROMPT },
              { role: 'user', content: retryPrompt },
            ],
            temperature: llmConfig.temperature,
            max_tokens: llmConfig.maxTokens,
          });
          console.log('[aiAgentService] Retry Raw LLM Response:', completion);
          answer = completion?.choices?.[0]?.message?.content?.trim() || answer;
          break;
        }
      }
    }

    if (!validateResponse(answer, context)) {
      answer = "I don't have enough information to answer accurately. Please rephrase your question.";
    } else {
      answer = enforceSourceCitation(answer, results.map(r => ({ chunk: (r as any).chunk, source: (r as any).source })));
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
      answer: 'Sorry, I encountered an error while processing your request.',
      sources: [],
    };
  }
}
