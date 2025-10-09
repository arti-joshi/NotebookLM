import { PrismaClient } from '../../generated/prisma';
import { TopicMapping } from './topicService';
import { 
  RecordInteractionParams, 
  ProgressSummary, 
  TopicDetail, 
  RAGMetadata 
} from '../types/progress';

const prisma = new PrismaClient();

function toVectorLiteral(vec: number[]): string {
  if (!Array.isArray(vec) || vec.length === 0) return '[]';
  return `[${vec.map(v => (Number.isFinite(v) ? v : 0)).join(',')}]`;
}

export async function recordInteraction(params: RecordInteractionParams): Promise<void> {
  const {
    userId,
    query,
    queryEmbedding,
    topicMappings,
    ragMetadata,
    answerLength,
    citationCount,
    timeSpentMs
  } = params;

  if (!userId) throw new Error('recordInteraction: userId is required');
  if (!query) throw new Error('recordInteraction: query is required');
  if (!Array.isArray(topicMappings)) throw new Error('recordInteraction: topicMappings must be an array');

  const eligible = topicMappings.filter(m => (m?.confidence ?? 0) > 0.6 && m?.topicId);
  if (eligible.length === 0) return; // nothing to record

  const citedSections = Array.isArray(ragMetadata?.citedSections) ? ragMetadata.citedSections : [];
  const ragConfidence = (ragMetadata?.confidence || '').toString();
  const ragTopScore = Number(ragMetadata?.topScore || 0);

  const affectedTopicIds = new Set<string>();

  await prisma.$transaction(async (tx) => {
    for (const m of eligible) {
      // Create interaction without vector first
      const interaction = await tx.topicInteraction.create({
        data: {
          userId,
          topicId: m.topicId,
          query,
          mappingConfidence: m.confidence,
          ragConfidence,
          ragTopScore,
          citedSections,
          answerLength,
          citationCount,
          timeSpentMs: timeSpentMs ?? null,
        }
      });

      // Update vector field via raw SQL
      try {
        const vec = toVectorLiteral(queryEmbedding);
        await tx.$executeRawUnsafe(
          'UPDATE "TopicInteraction" SET "queryEmbedding" = $1::vector WHERE id = $2',
          vec,
          interaction.id
        );
      } catch (e) {
        console.warn('[progressService] Failed to set queryEmbedding vector for interaction', interaction.id, e);
      }

      affectedTopicIds.add(m.topicId);
    }
  }, {
    maxWait: 10000, // 10 seconds max wait for transaction
    timeout: 30000  // 30 seconds timeout
  });

  // Recompute mastery using detailed algorithm outside the transaction
  for (const topicId of Array.from(affectedTopicIds)) {
    try {
      await updateMastery(userId, topicId);
    } catch (e) {
      console.warn('[progressService] updateMastery failed after recordInteraction for topic', topicId, e);
    }
  }
}

// Legacy/simple mastery updater (kept for reference)
async function updateMasteryLegacy(tx: PrismaClient, userId: string, topicId: string): Promise<void> {
  try {
    // Fetch recent interactions for simple aggregation (last 200)
    const interactions = await tx.topicInteraction.findMany({
      where: { userId, topicId },
      orderBy: { createdAt: 'desc' },
      take: 200
    });

    const total = interactions.length;
    const questionsAsked = total;
    const avgMapping = total ? (interactions.reduce((s, r) => s + (r.mappingConfidence || 0), 0) / total) : 0;
    const avgAnswerLen = total ? (interactions.reduce((s, r) => s + (r.answerLength || 0), 0) / total) : 0;
    const avgCitations = total ? (interactions.reduce((s, r) => s + (r.citationCount || 0), 0) / total) : 0;

    // Coverage: unique cited sections over interactions
    const sectionSet = new Set<string>();
    for (const r of interactions) (r.citedSections || []).forEach(s => s && sectionSet.add(s));
    const coverage = Math.min(1, sectionSet.size / Math.max(5, total));

    // Depth: proxy by avg answer length and citations
    const depth = Math.min(1, (avgAnswerLen / 800) * 0.7 + (avgCitations / 5) * 0.3);

    // Confidence: avg mapping confidence
    const confidence = Math.min(1, avgMapping);

    // Diversity: spread of sections
    const diversity = Math.min(1, sectionSet.size / Math.max(8, total));

    // Retention: simple decay based on recency (placeholder: if last interaction within 7 days => higher)
    const last = interactions[0]?.createdAt ? new Date(interactions[0].createdAt).getTime() : 0;
    const daysSince = last ? (Date.now() - last) / (1000 * 60 * 60 * 24) : 999;
    const retention = daysSince <= 7 ? 1 : daysSince <= 30 ? 0.7 : daysSince <= 90 ? 0.4 : 0.2;

    // Aggregate mastery (0-100)
    const mastery = Math.round(
      (coverage * 0.25 + depth * 0.25 + confidence * 0.30 + diversity * 0.10 + retention * 0.10) * 100
    );

    // Status thresholds
    let status: any = 'NOT_STARTED';
    if (mastery >= 85) status = 'MASTERED';
    else if (mastery >= 65) status = 'PROFICIENT';
    else if (mastery >= 40) status = 'LEARNING';
    else if (mastery > 0) status = 'BEGINNER';

    // Subtopics explored proxy: use cited sections as identifiers
    const subtopicsExplored = Array.from(sectionSet).slice(0, 100);

    const firstInteraction = interactions[total - 1]?.createdAt || null;
    const lastInteraction = interactions[0]?.createdAt || null;
    const completedAt = status === 'MASTERED' ? (lastInteraction as Date | null) : null;

    await tx.topicMastery.upsert({
      where: { userId_topicId: { userId, topicId } },
      update: {
        masteryLevel: mastery,
        status,
        questionsAsked,
        coverageScore: coverage,
        depthScore: depth,
        confidenceScore: confidence,
        diversityScore: diversity,
        retentionScore: retention,
        subtopicsExplored,
        firstInteraction: firstInteraction as Date | null,
        lastInteraction: lastInteraction as Date | null,
        completedAt: completedAt as Date | null,
      },
      create: {
        userId,
        topicId,
        masteryLevel: mastery,
        status,
        questionsAsked,
        coverageScore: coverage,
        depthScore: depth,
        confidenceScore: confidence,
        diversityScore: diversity,
        retentionScore: retention,
        subtopicsExplored,
        firstInteraction: firstInteraction as Date | null,
        lastInteraction: lastInteraction as Date | null,
        completedAt: completedAt as Date | null,
      }
    });
  } catch (e) {
    console.error('[progressService] updateMastery failed:', e);
  }
}

function parseVectorTextToArray(text: string | null): number[] {
  if (!text) return [];
  const inside = text.trim().replace(/^\[/, '').replace(/\]$/, '');
  if (!inside) return [];
  return inside.split(',').map(x => Number(x.trim())).filter(n => Number.isFinite(n));
}

function cosineSim(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  if (len === 0) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < len; i++) { const x = a[i]; const y = b[i]; dot += x * y; na += x * x; nb += y * y; }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function mapRagConfidence(c: string): number {
  const v = (c || '').toLowerCase();
  if (v === 'high') return 1.0;
  if (v === 'medium') return 0.7;
  if (v === 'low') return 0.4;
  return 0;
}

export async function updateMastery(userId: string, topicId: string): Promise<void> {
  console.log(`[progressService] updateMastery start user=${userId} topic=${topicId}`);
  await prisma.$transaction(async (tx) => {
    // a) Fetch interactions
    const interactions = await tx.topicInteraction.findMany({ where: { userId, topicId }, orderBy: { createdAt: 'asc' } });
    const questionsAsked = interactions.length;
    if (questionsAsked === 0) {
      await tx.topicMastery.upsert({
        where: { userId_topicId: { userId, topicId } },
        update: {
          masteryLevel: 0,
          status: 'NOT_STARTED',
          questionsAsked: 0,
          coverageScore: 0,
          depthScore: 0,
          confidenceScore: 0,
          diversityScore: 0,
          retentionScore: 0,
          subtopicsExplored: [],
          firstInteraction: null,
          lastInteraction: null,
          completedAt: null,
        },
        create: {
          userId,
          topicId,
          masteryLevel: 0,
          status: 'NOT_STARTED',
          questionsAsked: 0,
          coverageScore: 0,
          depthScore: 0,
          confidenceScore: 0,
          diversityScore: 0,
          retentionScore: 0,
          subtopicsExplored: [],
          firstInteraction: null,
          lastInteraction: null,
          completedAt: null,
        }
      });
      console.log('[progressService] No interactions; set NOT_STARTED.');
      return;
    }

    // Load topic and children
    const topic = await tx.topic.findUnique({ where: { id: topicId } });
    const children = await tx.topic.findMany({ where: { parentId: topicId } });
    const expectedQuestions = Number(topic?.expectedQuestions ?? 5);

    // c) Coverage Score
    const sectionSet = new Set<string>();
    for (const it of interactions) (it.citedSections || []).forEach(s => s && sectionSet.add((s || '').toString().toLowerCase().trim()));
    let subtopicsExploredIds: string[] = [];
    if (children.length > 0) {
      const matched = new Set<string>();
      for (const child of children) {
        const name = (child.name || '').toLowerCase();
        const slug = (child.slug || '').toLowerCase();
        for (const sec of sectionSet) {
          if (sec.includes(name) || sec.includes(slug)) {
            matched.add(child.id);
            break;
          }
        }
      }
      subtopicsExploredIds = Array.from(matched);
    }
    let coverageScore = 0;
    if (children.length === 0) {
      coverageScore = questionsAsked >= expectedQuestions ? 100 : Math.min(100, (questionsAsked / Math.max(1, expectedQuestions)) * 100);
    } else {
      coverageScore = Math.min(100, (subtopicsExploredIds.length / Math.max(1, children.length)) * 100);
    }
    console.log(`[progressService] coverageScore=${coverageScore.toFixed(2)} explored=${subtopicsExploredIds.length}/${children.length}`);

    // d) Depth Score per interaction then average
    const depthScores: number[] = interactions.map(it => {
      const ragMap = (it.ragConfidence || '').toLowerCase() === 'high' ? 90 : (it.ragConfidence || '').toLowerCase() === 'medium' ? 70 : 40;
      const answerQuality = Math.min(100, (Math.max(0, it.answerLength || 0) / 500) * 50 + (Math.max(0, it.citationCount || 0) * 10));
      const followBonus = it.hadFollowUp ? 10 : 0;
      const score = Math.min(100, ragMap + answerQuality + followBonus);
      return score;
    });
    const depthScore = depthScores.reduce((a, b) => a + b, 0) / depthScores.length;
    console.log(`[progressService] depthScore=${depthScore.toFixed(2)}`);

    // e) Confidence Score: avg ragTopScore * 100
    const avgRagTop = interactions.reduce((s, it) => s + (it.ragTopScore || 0), 0) / interactions.length;
    const confidenceScore = Math.min(100, Math.max(0, avgRagTop * 100));
    console.log(`[progressService] confidenceScore=${confidenceScore.toFixed(2)} avgRagTop=${avgRagTop.toFixed(4)}`);

    // f) Diversity Score via cosine similarities on queryEmbedding
    let diversityScore = 0;
    if (questionsAsked < 3) {
      diversityScore = 0;
    } else {
      // fetch vectors as text and parse
      const rows = await tx.$queryRaw<Array<{ id: string; vec: string }>>`SELECT id, "queryEmbedding"::text as vec FROM "TopicInteraction" WHERE "userId" = ${userId} AND "topicId" = ${topicId}`;
      const vectors = rows.map(r => parseVectorTextToArray(r.vec)).filter(v => v.length > 0);
      let pairs = 0; let simSum = 0;
      for (let i = 0; i < vectors.length; i++) {
        for (let j = i + 1; j < vectors.length; j++) {
          pairs++;
          simSum += cosineSim(vectors[i], vectors[j]);
        }
      }
      const avgSim = pairs ? (simSum / pairs) : 1;
      diversityScore = Math.max(0, Math.min(100, 100 - (avgSim * 100)));
    }
    console.log(`[progressService] diversityScore=${diversityScore.toFixed(2)}`);

    // g) Retention Score based on time gaps
    let retentionScore = 0;
    if (interactions.length <= 1) {
      retentionScore = 60; // neutral default for single interaction
    } else {
      const gaps: number[] = [];
      for (let i = 1; i < interactions.length; i++) {
        const prev = (interactions[i - 1].createdAt as any as Date).getTime();
        const curr = (interactions[i].createdAt as any as Date).getTime();
        gaps.push(Math.max(0, curr - prev));
      }
      const scores = gaps.map(ms => {
        const hrs = ms / (1000 * 60 * 60);
        if (hrs < 2) return 40;
        if (hrs < 24) return 60;
        if (hrs < 24 * 3) return 80;
        if (hrs < 24 * 7) return 90;
        return 100;
      });
      retentionScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    }
    console.log(`[progressService] retentionScore=${retentionScore.toFixed(2)}`);

    // h) Final masteryLevel
    const masteryLevel = (
      coverageScore * 0.30 +
      depthScore * 0.25 +
      confidenceScore * 0.20 +
      diversityScore * 0.15 +
      retentionScore * 0.10
    );
    console.log(`[progressService] masteryLevel=${masteryLevel.toFixed(2)}`);

    // i) Status
    let status: any = 'NOT_STARTED';
    if (masteryLevel >= 85) status = 'MASTERED';
    else if (masteryLevel >= 70) status = 'PROFICIENT';
    else if (masteryLevel >= 40) status = 'LEARNING';
    else if (masteryLevel >= 20) status = 'BEGINNER';

    // j) Completion criteria
    const avgRagConfidence = interactions.reduce((s, it) => s + mapRagConfidence(it.ragConfidence || ''), 0) / interactions.length;
    const firstInteraction = (interactions[0].createdAt as any as Date) || null;
    const lastInteraction = (interactions[interactions.length - 1].createdAt as any as Date) || null;
    const spanDays = firstInteraction ? ((Date.now() - firstInteraction.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    let completedAt: Date | null = null;
    if (
      masteryLevel >= 85 &&
      questionsAsked >= expectedQuestions &&
      avgRagConfidence >= 0.75 &&
      diversityScore >= 60 &&
      spanDays >= 3
    ) {
      completedAt = new Date();
    }
    console.log(`[progressService] status=${status} completedAt=${completedAt ? completedAt.toISOString() : 'null'}`);

    await tx.topicMastery.upsert({
      where: { userId_topicId: { userId, topicId } },
      update: {
        masteryLevel,
        status,
        questionsAsked,
        coverageScore,
        depthScore,
        confidenceScore,
        diversityScore,
        retentionScore,
        subtopicsExplored: subtopicsExploredIds,
        firstInteraction,
        lastInteraction,
        completedAt,
      },
      create: {
        userId,
        topicId,
        masteryLevel,
        status,
        questionsAsked,
        coverageScore,
        depthScore,
        confidenceScore,
        diversityScore,
        retentionScore,
        subtopicsExplored: subtopicsExploredIds,
        firstInteraction,
        lastInteraction,
        completedAt,
      }
    });
  });
}

export default {
  recordInteraction,
  updateMastery,
};

// -------- Aggregations & Details --------

export async function getUserProgress(userId: string): Promise<ProgressSummary> {
  // Load all mastery rows and topics for weighting
  const [masteries, topics] = await Promise.all([
    prisma.topicMastery.findMany({ where: { userId } }),
    prisma.topic.findMany({})
  ]);

  const topicById = new Map(topics.map(t => [t.id, t] as const));

  // Weighted overall progress
  const totalExpected = topics.reduce((s, t) => s + (t.expectedQuestions || 0), 0);
  const weightedSum = masteries.reduce((s, m) => {
    const tw = topicById.get(m.topicId)?.expectedQuestions || 0;
    return s + (m.masteryLevel || 0) * tw;
  }, 0);
  const overallProgress = totalExpected > 0 ? Math.min(100, Math.max(0, weightedSum / totalExpected)) : (
    masteries.length ? (masteries.reduce((s, m) => s + (m.masteryLevel || 0), 0) / masteries.length) : 0
  );

  // Totals and status breakdown
  const totalQuestions = masteries.reduce((s, m) => s + (m.questionsAsked || 0), 0);
  const topicsByStatus = {
    mastered: masteries.filter(m => m.status === 'MASTERED').length,
    proficient: masteries.filter(m => m.status === 'PROFICIENT').length,
    learning: masteries.filter(m => m.status === 'LEARNING').length,
    beginner: masteries.filter(m => m.status === 'BEGINNER').length,
    notStarted: masteries.filter(m => m.status === 'NOT_STARTED').length,
  };
  const topicsExplored = masteries.filter(m => m.status !== 'NOT_STARTED').length;
  const topicsMastered = topicsByStatus.mastered;

  // Total time spent across interactions (minutes)
  const interactionsAll = await prisma.topicInteraction.findMany({ where: { userId }, select: { timeSpentMs: true } });
  const totalTimeSpent = Math.round(interactionsAll.reduce((s, r) => s + (r.timeSpentMs || 0), 0) / 60000);

  // Weekly activity (last 7 days)
  const nowTs = Date.now();
  const sevenDaysAgo = new Date(nowTs - 7 * 24 * 60 * 60 * 1000);
  const interactionsWeek = await prisma.topicInteraction.findMany({
    where: { userId, createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true, timeSpentMs: true }
  });
  const dayBuckets = new Map<string, { questions: number; minutes: number }>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(nowTs - (6 - i) * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dayBuckets.set(key, { questions: 0, minutes: 0 });
  }
  for (const it of interactionsWeek) {
    const key = (it.createdAt as any as Date).toISOString().slice(0, 10);
    const bucket = dayBuckets.get(key);
    if (bucket) {
      bucket.questions += 1;
      bucket.minutes += Math.round((it.timeSpentMs || 0) / 60000);
    }
  }
  const weeklyActivity = Array.from(dayBuckets.entries()).map(([day, v]) => ({ day, questions: v.questions, minutes: v.minutes }));

  // Top active topics by lastInteraction
  const top = masteries
    .filter(m => !!m.lastInteraction)
    .sort((a, b) => (b.lastInteraction?.getTime() || 0) - (a.lastInteraction?.getTime() || 0))
    .slice(0, 10)
    .map(m => {
      const t = topicById.get(m.topicId);
      // Determine chapter name
      let chapterName = t?.name || '';
      if (t?.level === 1 && t.parentId) {
        const ch = topicById.get(t.parentId);
        if (ch) chapterName = ch.name;
      }
      return {
        topicId: m.topicId,
        topicName: t?.name || m.topicId,
        chapterName,
        masteryLevel: m.masteryLevel || 0,
        status: m.status,
        questionsAsked: m.questionsAsked || 0,
        lastActive: (m.lastInteraction as any as Date) || new Date(0)
      };
    });

  return {
    overallProgress: Number(overallProgress.toFixed(2)),
    totalQuestions,
    totalTimeSpent,
    topicsExplored,
    topicsMastered,
    topicsByStatus,
    weeklyActivity,
    topActiveTopics: top
  };
}

export async function getTopicDetail(userId: string, topicId: string): Promise<TopicDetail> {
  const topic = await prisma.topic.findUnique({ where: { id: topicId } });
  if (!topic) throw new Error('Topic not found');
  const mastery = await prisma.topicMastery.findUnique({ where: { userId_topicId: { userId, topicId } } });
  const recentInteractions = await prisma.topicInteraction.findMany({
    where: { userId, topicId },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  // Subtopics progress if chapter
  let subtopicsProgress: Array<{ subtopic: any; explored: boolean }> = [];
  if (topic.level === 0) {
    const children = await prisma.topic.findMany({ where: { parentId: topic.id } });
    const exploredSet = new Set<string>((mastery?.subtopicsExplored || []).map(String));
    subtopicsProgress = children.map(ch => ({ subtopic: ch, explored: exploredSet.has(ch.id) }));
  }

  // Recommendations: siblings and next chapter
  const recommendations: string[] = [];
  if (topic.level === 1 && topic.parentId) {
    const siblings = await prisma.topic.findMany({ where: { parentId: topic.parentId } });
    for (const s of siblings) if (s.id !== topic.id) recommendations.push(s.name);
    // Next chapter topics
    const parent = await prisma.topic.findUnique({ where: { id: topic.parentId } });
    if (parent?.chapterNum != null) {
      const nextChapter = await prisma.topic.findFirst({ where: { level: 0, chapterNum: (parent.chapterNum || 0) + 1 } });
      if (nextChapter) {
        const nextChildren = await prisma.topic.findMany({ where: { parentId: nextChapter.id } });
        recommendations.push(...nextChildren.map(c => c.name));
      }
    }
  } else if (topic.level === 0) {
    // Next chapter
    if (topic.chapterNum != null) {
      const nextChapter = await prisma.topic.findFirst({ where: { level: 0, chapterNum: (topic.chapterNum || 0) + 1 } });
      if (nextChapter) {
        const nextChildren = await prisma.topic.findMany({ where: { parentId: nextChapter.id } });
        recommendations.push(...nextChildren.map(c => c.name));
      }
    }
  }

  return {
    topic,
    mastery,
    recentInteractions,
    subtopicsProgress,
    recommendations: recommendations.slice(0, 10)
  };
}


