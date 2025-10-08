import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { PrismaClient } from '../../generated/prisma';

type TopicNode = {
  id: string;
  level: number;
  name: string;
  slug: string;
  keywords: string[];
  aliases?: string[];
  expectedQuestions?: number;
  chapterNum?: number;
  children?: TopicNode[];
};

type TopicHierarchy = {
  metadata: Record<string, unknown>;
  hierarchy: TopicNode[];
};

const prisma = new PrismaClient();

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function keywordOverlapScore(section: string, keywords: string[], aliases: string[]): number {
  if (!section) return 0;
  const s = normalize(section);
  const tokens = s.split(/\W+/).filter(Boolean);
  if (tokens.length === 0) return 0;

  let matches = 0;
  for (const k of keywords) {
    const nk = normalize(k);
    if (!nk) continue;
    if (s.includes(nk)) matches += 1;
  }
  for (const a of aliases) {
    const na = normalize(a);
    if (!na) continue;
    if (s.includes(na)) matches += 2; // alias match weighs higher
  }

  // Density: matches normalized by length
  const density = matches / Math.max(5, tokens.length);
  return matches + density; // simple composite score
}

function meanVectors(vectors: number[][]): number[] {
  if (vectors.length === 0) return [];
  const dim = vectors[0].length;
  const acc = new Array<number>(dim).fill(0);
  for (const v of vectors) {
    if (v.length !== dim) continue;
    for (let i = 0; i < dim; i++) acc[i] += v[i];
  }
  for (let i = 0; i < dim; i++) acc[i] /= vectors.length;
  return acc;
}

async function loadHierarchy(): Promise<TopicHierarchy> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.resolve(__dirname, '../data/topic-hierarchy.json');
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data) as TopicHierarchy;
}

async function upsertChapterAndTopics(nodes: TopicNode[]) {
  let processedTopics = 0;

  for (const chapter of nodes) {
    if (chapter.level !== 0) continue;

    // Skip duplicates by slug
    const existingChapter = await prisma.topic.findUnique({ where: { slug: chapter.slug } });
    if (!existingChapter) {
      await prisma.topic.create({
        data: {
          id: chapter.id,
          level: 0,
          name: chapter.name,
          slug: chapter.slug,
          parentId: null,
          chapterNum: chapter.chapterNum ?? null,
          keywords: chapter.keywords ?? [],
          aliases: chapter.aliases ?? [],
          expectedQuestions: chapter.expectedQuestions ?? 5,
        },
      });
    }

    if (Array.isArray(chapter.children)) {
      for (const topic of chapter.children) {
        // Skip duplicates by slug
        const existingTopic = await prisma.topic.findUnique({ where: { slug: topic.slug } });
        if (!existingTopic) {
          await prisma.topic.create({
            data: {
              id: topic.id,
              level: 1,
              name: topic.name,
              slug: topic.slug,
              parentId: chapter.id,
              chapterNum: chapter.chapterNum ?? null,
              keywords: topic.keywords ?? [],
              aliases: topic.aliases ?? [],
              expectedQuestions: topic.expectedQuestions ?? 5,
            },
          });
        }

        processedTopics++;
        if (processedTopics % 10 === 0) {
          console.log(`Seeded ${processedTopics} level-1 topics...`);
        }
      }
    }
  }
}

async function computeRepresentativeEmbeddings(nodes: TopicNode[]) {
  // Pre-fetch all embeddings with section to minimize round-trips
  const embeddings = await prisma.embedding.findMany({
    where: { section: { not: null } },
    select: { id: true, section: true, embedding: true },
    take: 50000, // safety cap
  });

  let processed = 0;

  for (const chapter of nodes) {
    if (!Array.isArray(chapter.children)) continue;
    for (const topic of chapter.children) {
      const keywords = (topic.keywords ?? []).map(normalize);
      const aliases = (topic.aliases ?? []).map(normalize);

      // Score each embedding by overlap/density
      const scored = embeddings
        .map(e => {
          const section = e.section ?? '';
          const score = keywordOverlapScore(section, keywords, aliases);
          return { id: e.id, section, score, embedding: e.embedding as unknown as number[] };
        })
        .filter(x => x.score > 0 && Array.isArray(x.embedding) && x.embedding.length > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      if (scored.length === 0) {
        processed++;
        continue;
      }

      const vectors = scored.map(s => s.embedding as number[]);
      const mean = meanVectors(vectors);
      if (mean.length === 0) {
        processed++;
        continue;
      }

      // Construct pgvector literal: '[v1, v2, ...]'
      const vecLiteral = `[${mean.map(v => (Number.isFinite(v) ? v : 0)).join(',')}]`;

      // Update representativeEmbedding using raw SQL (Unsupported type)
      await prisma.$executeRawUnsafe(
        'UPDATE "Topic" SET "representativeEmbedding" = $1::vector WHERE "slug" = $2',
        vecLiteral,
        topic.slug,
      );

      processed++;
      if (processed % 10 === 0) {
        console.log(`Computed representative embeddings for ${processed} topics...`);
      }
    }
  }
}

async function main() {
  console.log('Starting topics seeding...');

  await prisma.$transaction(async (tx) => {
    // Use the tx client for writes during transaction
    const data = await loadHierarchy();

    // We need tx for writes inside helpers
    // Patch prisma references dynamically for this transaction
    (prisma as any).topic = tx.topic;
    (prisma as any).embedding = tx.embedding;
    (prisma as any).$executeRawUnsafe = tx.$executeRawUnsafe.bind(tx);

    await upsertChapterAndTopics(data.hierarchy);
    await computeRepresentativeEmbeddings(data.hierarchy);
  });

  console.log('Topics seeding completed.');
}

main().catch(async (err) => {
  console.error('Seeding failed, rolling back:', err);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});


