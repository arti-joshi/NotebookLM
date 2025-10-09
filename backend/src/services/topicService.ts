import { PrismaClient, Topic as DbTopic } from '../../generated/prisma';
import { getEmbedding } from './embeddingService';

export interface TopicMapping {
  topicId: string;
  confidence: number; // 0-1
  source: 'embedding' | 'citation' | 'both';
  matchedKeywords?: string[];
}

type TopicMaps = {
  byId: Map<string, DbTopic & { children?: string[] }>; // store child ids for quick tree nav
  bySlug: Map<string, DbTopic & { children?: string[] }>;
};

const prisma = new PrismaClient();

let cachedMaps: TopicMaps | null = null;
let cacheLoadedAt: number | null = null;
const CACHE_TTL_MS = 60_000; // 1 minute TTL

function now(): number { return Date.now(); }

function normalize(s: string | null | undefined): string {
  return (s ?? '').toLowerCase().trim();
}

function keywordMatchScore(text: string, terms: string[]): { score: number; matches: string[] } {
  const t = normalize(text);
  if (!t || terms.length === 0) return { score: 0, matches: [] };
  const matches: string[] = [];
  let score = 0;
  for (const term of terms) {
    const nt = normalize(term);
    if (!nt) continue;
    if (t.includes(nt)) {
      matches.push(nt);
      // Heuristic: longer matches score slightly more
      score += Math.min(1, Math.max(0.1, nt.length / 12));
    }
  }
  // Normalize roughly to 0..1
  return { score: Math.min(1, score / Math.max(1, terms.length)), matches };
}

export async function loadTopicHierarchy(): Promise<TopicMaps> {
  try {
    if (cachedMaps && cacheLoadedAt && (now() - cacheLoadedAt) < CACHE_TTL_MS) {
      return cachedMaps;
    }

    // Fetch topics with raw SQL to get vectors properly
    const topicsRaw = await prisma.$queryRaw<any[]>`
      SELECT 
        id, level, name, slug, "parentId", "chapterNum",
        keywords, aliases, "expectedQuestions", "createdAt",
        "representativeEmbedding"::text as embedding_text
      FROM "Topic"
    `;
    
    const byId = new Map<string, DbTopic & { children?: string[] }>();
    const bySlug = new Map<string, DbTopic & { children?: string[] }>();

    // Initialize maps with parsed vectors
    for (const t of topicsRaw) {
      const topic: DbTopic & { children?: string[] } = {
        id: t.id,
        level: t.level,
        name: t.name,
        slug: t.slug,
        parentId: t.parentId,
        chapterNum: t.chapterNum,
        keywords: t.keywords || [],
        aliases: t.aliases || [],
        expectedQuestions: t.expectedQuestions || 5,
        createdAt: t.createdAt,
        representativeEmbedding: null,
        children: []
      };

      // Parse vector from PostgreSQL text format: "[0.1,0.2,...]"
      if (t.embedding_text) {
        try {
          const vecStr = t.embedding_text.replace(/[\[\]]/g, '');
          topic.representativeEmbedding = vecStr.split(',').map(parseFloat);
        } catch (err) {
          console.warn(`Failed to parse embedding for topic ${t.id}:`, err);
          topic.representativeEmbedding = null;
        }
      }

      byId.set(t.id, topic);
    }

    // Build parent-child relationships
    for (const t of topicsRaw) {
      if (t.parentId) {
        const parent = byId.get(t.parentId);
        if (parent) parent.children!.push(t.id);
      }
    }

    // Build slug map
    for (const t of topicsRaw) {
      const node = byId.get(t.id)!;
      bySlug.set(t.slug, node);
    }

    cachedMaps = { byId, bySlug };
    cacheLoadedAt = now();
    return cachedMaps;
  } catch (err) {
    console.error('[topicService] loadTopicHierarchy failed:', err);
    // Return empty maps on error to avoid crashing callers
    const empty = { byId: new Map(), bySlug: new Map() };
    cachedMaps = empty;
    cacheLoadedAt = now();
    return empty;
  }
}

export async function findTopicBySlug(slug: string): Promise<(DbTopic & { children?: string[] }) | null> {
  try {
    const maps = await loadTopicHierarchy();
    return maps.bySlug.get(slug) ?? null;
  } catch (err) {
    console.error('[topicService] findTopicBySlug failed:', err);
    return null;
  }
}

export async function findTopicsByKeywords(keywords: string[]): Promise<(DbTopic & { score: number; matched: string[] })[]> {
  try {
    const maps = await loadTopicHierarchy();
    const result: (DbTopic & { score: number; matched: string[] })[] = [];
    const terms = keywords.map(normalize).filter(Boolean);

    for (const topic of maps.byId.values()) {
      const keys = (topic.keywords || []).concat(topic.aliases || []).map(normalize);
      const { score, matches } = keywordMatchScore(keys.join(' '), terms);
      if (score > 0) {
        result.push({ ...(topic as DbTopic), score, matched: matches });
      }
    }
    result.sort((a, b) => b.score - a.score);
    return result;
  } catch (err) {
    console.error('[topicService] findTopicsByKeywords failed:', err);
    return [];
  }
}

export async function findTopicsByAliasesOrName(needle: string): Promise<(DbTopic & { score: number })[]> {
  const maps = await loadTopicHierarchy();
  const term = normalize(needle);
  const out: (DbTopic & { score: number })[] = [];
  for (const topic of maps.byId.values()) {
    const searchSpace = [topic.name, ...(topic.keywords || []), ...(topic.aliases || [])].map(normalize).join(' ');
    const { score } = keywordMatchScore(searchSpace, [term]);
    if (score > 0) out.push({ ...(topic as DbTopic), score });
  }
  out.sort((a, b) => b.score - a.score);
  return out;
}

export async function mapCitationToTopic(citationSection: string): Promise<{ topic: DbTopic; confidence: number } | null> {
  try {
    const maps = await loadTopicHierarchy();
    const normalized = normalize(citationSection).replace(/[^a-z0-9\s-_]/g, '');

    // Try exact slug match first
    const exact = maps.bySlug.get(normalized);
    if (exact) return { topic: exact as DbTopic, confidence: 0.95 };

    // Fuzzy match on name, keywords, aliases
    let best: { topic: DbTopic; confidence: number } | null = null;
    for (const topic of maps.byId.values()) {
      const fields = [topic.slug, topic.name, ...(topic.keywords || []), ...(topic.aliases || [])].map(normalize);
      const { score } = keywordMatchScore(fields.join(' '), [normalized]);
      const confidence = Math.min(1, score * 1.2); // scale
      if (!best || confidence > best.confidence) best = { topic: topic as DbTopic, confidence };
    }
    if (best && best.confidence > 0.6) return best;
    return null;
  } catch (err) {
    console.error('[topicService] mapCitationToTopic failed:', err);
    return null;
  }
}

function clamp01(x: number): number { return Math.max(0, Math.min(1, x)); }

export async function mapQueryToTopics(query: string, ragResults: any): Promise<TopicMapping[]> {
  try {
    const maps = await loadTopicHierarchy();

    // Compute query embedding
    let queryEmbedding: number[] | null = null;
    try {
      queryEmbedding = await getEmbedding(query);
    } catch (e) {
      console.warn('[topicService] getEmbedding failed; proceeding without embeddings:', (e as Error)?.message);
    }

    const candidates: { topicId: string; confidence: number; source: 'embedding' | 'citation' | 'both'; matchedKeywords?: string[] }[] = [];

    // Use pgvector cosine similarity directly in SQL for efficiency and to access Unsupported vector column
    if (queryEmbedding && Array.isArray(queryEmbedding) && queryEmbedding.length > 0) {
      const vec = `[${queryEmbedding.join(',')}]`;
      try {
        const rows = await prisma.$queryRaw<Array<{ id: string; distance: number }>>`
          SELECT id, ("representativeEmbedding" <=> ${vec}::vector) AS distance
          FROM "Topic"
          WHERE "representativeEmbedding" IS NOT NULL
          ORDER BY distance ASC
          LIMIT 3
        `;
        for (const r of rows) {
          const sim = 1 - (r.distance ?? 1);
          candidates.push({ topicId: r.id, confidence: clamp01(sim), source: 'embedding' });
        }
      } catch (sqlErr) {
        console.warn('[topicService] embedding similarity query failed:', sqlErr);
      }
    }

    // Cross-validate with RAG sections (citation-based evidence)
    try {
      const sections: string[] = Array.isArray(ragResults?.results)
        ? ragResults.results.map((r: any) => (r?.metadata?.section || '').toString()).filter(Boolean)
        : [];
      const normalizedSections = sections.map(normalize);

      if (normalizedSections.length) {
        // For each section, map to topic and boost confidence if overlapping with embedding result
        for (const sec of normalizedSections) {
          const match = await mapCitationToTopic(sec);
          if (match) {
            const existing = candidates.find(c => c.topicId === match.topic.id);
            if (existing) {
              existing.confidence = clamp01(Math.max(existing.confidence, match.confidence));
              existing.source = 'both';
            } else if (match.confidence > 0.6) {
              candidates.push({ topicId: match.topic.id, confidence: clamp01(match.confidence), source: 'citation' });
            }
          }
        }
      }
    } catch (cvErr) {
      console.warn('[topicService] citation cross-validate failed:', cvErr);
    }

    // Deduplicate and sort by confidence
    const uniq = new Map<string, TopicMapping>();
    for (const c of candidates) {
      const prev = uniq.get(c.topicId);
      if (!prev || c.confidence > prev.confidence) {
        uniq.set(c.topicId, { topicId: c.topicId, confidence: clamp01(c.confidence), source: c.source, matchedKeywords: c.matchedKeywords });
      } else if (prev && prev.source !== c.source) {
        // Upgrade to both if we have both evidence types
        prev.source = 'both';
      }
    }

    return Array.from(uniq.values()).sort((a, b) => b.confidence - a.confidence);
  } catch (err) {
    console.error('[topicService] mapQueryToTopics failed:', err);
    return [];
  }
}


