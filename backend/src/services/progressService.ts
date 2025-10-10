// import { PrismaClient } from '@prisma/client';
// import { TopicMapping } from './topicService';
// import { 
//   RecordInteractionParams, 
//   ProgressSummary, 
//   TopicDetail, 
//   RAGMetadata 
// } from '../types/progress';

// const prisma = new PrismaClient();

// function toVectorLiteral(vec: number[]): string {
//   if (!Array.isArray(vec) || vec.length === 0) return '[]';
//   return `[${vec.map(v => (Number.isFinite(v) ? v : 0)).join(',')}]`;
// }

// export async function recordInteraction(params: RecordInteractionParams): Promise<void> {
//   const {
//     userId,
//     query,
//     queryEmbedding,
//     topicMappings,
//     ragMetadata,
//     answerLength,
//     citationCount,
//     timeSpentMs
//   } = params;

//   if (!userId) throw new Error('recordInteraction: userId is required');
//   if (!query) throw new Error('recordInteraction: query is required');
//   if (!Array.isArray(topicMappings)) throw new Error('recordInteraction: topicMappings must be an array');

//   const eligible = topicMappings.filter(m => (m?.confidence ?? 0) > 0.6 && m?.topicId);
//   if (eligible.length === 0) return; // nothing to record

//   const citedSections = Array.isArray(ragMetadata?.citedSections) ? ragMetadata.citedSections : [];
//   const ragConfidence = (ragMetadata?.confidence || '').toString();
//   const ragTopScore = Number(ragMetadata?.topScore || 0);

//   const affectedTopicIds = new Set<string>();

//   await prisma.$transaction(async (tx) => {
//     for (const m of eligible) {
//       // Create interaction without vector first
//       const interaction = await tx.topicInteraction.create({
//         data: {
//           userId,
//           topicId: m.topicId,
//           query,
//           mappingConfidence: m.confidence,
//           ragConfidence,
//           ragTopScore,
//           citedSections,
//           answerLength,
//           citationCount,
//           timeSpentMs: timeSpentMs ?? null,
//         }
//       });

//       // Update vector field via raw SQL
//       try {
//         const vec = toVectorLiteral(queryEmbedding);
//         await tx.$executeRawUnsafe(
//           'UPDATE "TopicInteraction" SET "queryEmbedding" = $1::vector WHERE id = $2',
//           vec,
//           interaction.id
//         );
//       } catch (e) {
//         console.warn('[progressService] Failed to set queryEmbedding vector for interaction', interaction.id, e);
//       }

//       affectedTopicIds.add(m.topicId);
//     }
//   }, {
//     maxWait: 10000, // 10 seconds max wait for transaction
//     timeout: 30000  // 30 seconds timeout
//   });

//   // Recompute mastery using detailed algorithm outside the transaction
//   for (const topicId of Array.from(affectedTopicIds)) {
//     try {
//       await updateMastery(userId, topicId);
//     } catch (e) {
//       console.warn('[progressService] updateMastery failed after recordInteraction for topic', topicId, e);
//     }
//   }
// }

// // Legacy/simple mastery updater (kept for reference)
// async function updateMasteryLegacy(tx: PrismaClient, userId: string, topicId: string): Promise<void> {
//   try {
//     // Fetch recent interactions for simple aggregation (last 200)
//     const interactions = await tx.topicInteraction.findMany({
//       where: { userId, topicId },
//       orderBy: { createdAt: 'desc' },
//       take: 200
//     });

//     const total = interactions.length;
//     const questionsAsked = total;
//     const avgMapping = total ? (interactions.reduce((s, r) => s + (r.mappingConfidence || 0), 0) / total) : 0;
//     const avgAnswerLen = total ? (interactions.reduce((s, r) => s + (r.answerLength || 0), 0) / total) : 0;
//     const avgCitations = total ? (interactions.reduce((s, r) => s + (r.citationCount || 0), 0) / total) : 0;

//     // Coverage: unique cited sections over interactions
//     const sectionSet = new Set<string>();
//     for (const r of interactions) (r.citedSections || []).forEach(s => s && sectionSet.add(s));
//     const coverage = Math.min(1, sectionSet.size / Math.max(5, total));

//     // Depth: proxy by avg answer length and citations
//     const depth = Math.min(1, (avgAnswerLen / 800) * 0.7 + (avgCitations / 5) * 0.3);

//     // Confidence: avg mapping confidence
//     const confidence = Math.min(1, avgMapping);

//     // Diversity: spread of sections
//     const diversity = Math.min(1, sectionSet.size / Math.max(8, total));

//     // Retention: simple decay based on recency (placeholder: if last interaction within 7 days => higher)
//     const last = interactions[0]?.createdAt ? new Date(interactions[0].createdAt).getTime() : 0;
//     const daysSince = last ? (Date.now() - last) / (1000 * 60 * 60 * 24) : 999;
//     const retention = daysSince <= 7 ? 1 : daysSince <= 30 ? 0.7 : daysSince <= 90 ? 0.4 : 0.2;

//     // Aggregate mastery (0-100)
//     const mastery = Math.round(
//       (coverage * 0.25 + depth * 0.25 + confidence * 0.30 + diversity * 0.10 + retention * 0.10) * 100
//     );

//     // Status thresholds
//     let status: any = 'NOT_STARTED';
//     if (mastery >= 85) status = 'MASTERED';
//     else if (mastery >= 65) status = 'PROFICIENT';
//     else if (mastery >= 40) status = 'LEARNING';
//     else if (mastery > 0) status = 'BEGINNER';

//     // Subtopics explored proxy: use cited sections as identifiers
//     const subtopicsExplored = Array.from(sectionSet).slice(0, 100);

//     const firstInteraction = interactions[total - 1]?.createdAt || null;
//     const lastInteraction = interactions[0]?.createdAt || null;
//     const completedAt = status === 'MASTERED' ? (lastInteraction as Date | null) : null;

//     await tx.topicMastery.upsert({
//       where: { userId_topicId: { userId, topicId } },
//       update: {
//         masteryLevel: mastery,
//         status,
//         questionsAsked,
//         coverageScore: coverage,
//         depthScore: depth,
//         confidenceScore: confidence,
//         diversityScore: diversity,
//         retentionScore: retention,
//         subtopicsExplored,
//         firstInteraction: firstInteraction as Date | null,
//         lastInteraction: lastInteraction as Date | null,
//         completedAt: completedAt as Date | null,
//       },
//       create: {
//         userId,
//         topicId,
//         masteryLevel: mastery,
//         status,
//         questionsAsked,
//         coverageScore: coverage,
//         depthScore: depth,
//         confidenceScore: confidence,
//         diversityScore: diversity,
//         retentionScore: retention,
//         subtopicsExplored,
//         firstInteraction: firstInteraction as Date | null,
//         lastInteraction: lastInteraction as Date | null,
//         completedAt: completedAt as Date | null,
//       }
//     });
//   } catch (e) {
//     console.error('[progressService] updateMastery failed:', e);
//   }
// }

// function parseVectorTextToArray(text: string | null): number[] {
//   if (!text) return [];
//   const inside = text.trim().replace(/^\[/, '').replace(/\]$/, '');
//   if (!inside) return [];
//   return inside.split(',').map(x => Number(x.trim())).filter(n => Number.isFinite(n));
// }

// function cosineSim(a: number[], b: number[]): number {
//   const len = Math.min(a.length, b.length);
//   if (len === 0) return 0;
//   let dot = 0, na = 0, nb = 0;
//   for (let i = 0; i < len; i++) { const x = a[i]; const y = b[i]; dot += x * y; na += x * x; nb += y * y; }
//   if (na === 0 || nb === 0) return 0;
//   return dot / (Math.sqrt(na) * Math.sqrt(nb));
// }

// function mapRagConfidence(c: string): number {
//   const v = (c || '').toLowerCase();
//   if (v === 'high') return 1.0;
//   if (v === 'medium') return 0.7;
//   if (v === 'low') return 0.4;
//   return 0;
// }

// export async function updateMastery(userId: string, topicId: string): Promise<void> {
//   console.log(`[progressService] updateMastery start user=${userId} topic=${topicId}`);
//   await prisma.$transaction(async (tx) => {
//     // a) Fetch interactions
//     const interactions = await tx.topicInteraction.findMany({ where: { userId, topicId }, orderBy: { createdAt: 'asc' } });
//     const questionsAsked = interactions.length;
//     if (questionsAsked === 0) {
//       await tx.topicMastery.upsert({
//         where: { userId_topicId: { userId, topicId } },
//         update: {
//           masteryLevel: 0,
//           status: 'NOT_STARTED',
//           questionsAsked: 0,
//           coverageScore: 0,
//           depthScore: 0,
//           confidenceScore: 0,
//           diversityScore: 0,
//           retentionScore: 0,
//           subtopicsExplored: [],
//           firstInteraction: null,
//           lastInteraction: null,
//           completedAt: null,
//         },
//         create: {
//           userId,
//           topicId,
//           masteryLevel: 0,
//           status: 'NOT_STARTED',
//           questionsAsked: 0,
//           coverageScore: 0,
//           depthScore: 0,
//           confidenceScore: 0,
//           diversityScore: 0,
//           retentionScore: 0,
//           subtopicsExplored: [],
//           firstInteraction: null,
//           lastInteraction: null,
//           completedAt: null,
//         }
//       });
//       console.log('[progressService] No interactions; set NOT_STARTED.');
//       return;
//     }

//     // Load topic and children
//     const topic = await tx.topic.findUnique({ where: { id: topicId } });
//     const children = await tx.topic.findMany({ where: { parentId: topicId } });
//     const expectedQuestions = Number(topic?.expectedQuestions ?? 5);

//     // c) Coverage Score
//     const sectionSet = new Set<string>();
//     for (const it of interactions) (it.citedSections || []).forEach(s => s && sectionSet.add((s || '').toString().toLowerCase().trim()));
//     let subtopicsExploredIds: string[] = [];
//     if (children.length > 0) {
//       const matched = new Set<string>();
//       for (const child of children) {
//         const name = (child.name || '').toLowerCase();
//         const slug = (child.slug || '').toLowerCase();
//         for (const sec of sectionSet) {
//           if (sec.includes(name) || sec.includes(slug)) {
//             matched.add(child.id);
//             break;
//           }
//         }
//       }
//       subtopicsExploredIds = Array.from(matched);
//     }
//     let coverageScore = 0;
//     if (children.length === 0) {
//       coverageScore = questionsAsked >= expectedQuestions ? 100 : Math.min(100, (questionsAsked / Math.max(1, expectedQuestions)) * 100);
//     } else {
//       // refine subtopic detection using topicService mapping for cited sections
//       try {
//         const explored = new Set<string>();
//         for (const it of interactions) {
//           for (const section of (it.citedSections || [])) {
//             const svc = await import('./topicService');
//             const mapped = await svc.mapCitationToTopic(section);
//             if (mapped && children.some(c => c.id === mapped.topic.id)) explored.add(mapped.topic.id);
//           }
//         }
//         subtopicsExploredIds = Array.from(explored);
//       } catch {}
//       coverageScore = Math.min(100, (subtopicsExploredIds.length / Math.max(1, children.length)) * 100);
//     }
//     console.log(`[progressService] coverageScore=${coverageScore.toFixed(2)} explored=${subtopicsExploredIds.length}/${children.length}`);

//   // d) Depth Score (more realistic scaling)
//   const depthScores: number[] = interactions.map(it => {
//     const lengthScore = Math.min(((Math.max(0, it.answerLength || 0)) / 800) * 50, 50); // up to 50
//     const citationScore = Math.min(((Math.max(0, it.citationCount || 0)) / 5) * 30, 30); // up to 30
//     const confidenceBonus = Math.min(Math.max(0, it.ragTopScore || 0) * 20, 20); // up to 20
//     return Math.min(lengthScore + citationScore + confidenceBonus, 100);
//   });
//   const depthScore = depthScores.reduce((a, b) => a + b, 0) / depthScores.length;
//     console.log(`[progressService] depthScore=${depthScore.toFixed(2)}`);

//     // e) Confidence Score: avg ragTopScore * 100
//     const avgRagTop = interactions.reduce((s, it) => s + (it.ragTopScore || 0), 0) / interactions.length;
//     const confidenceScore = Math.min(100, Math.max(0, avgRagTop * 100));
//     console.log(`[progressService] confidenceScore=${confidenceScore.toFixed(2)} avgRagTop=${avgRagTop.toFixed(4)}`);

//   // f) Diversity Score with small-sample handling
//   let diversityScore = 0;
//   // fetch vectors as text and parse for all interactions of this topic
//   const rows = await tx.$queryRaw<Array<{ id: string; vec: string }>>`SELECT id, "queryEmbedding"::text as vec FROM "TopicInteraction" WHERE "userId" = ${userId} AND "topicId" = ${topicId}`;
//   const vectors = rows.map(r => parseVectorTextToArray(r.vec)).filter(v => v.length > 0);
//   if (vectors.length < 2) {
//     diversityScore = 0;
//   } else if (vectors.length === 2) {
//     const sim = cosineSim(vectors[0], vectors[1]);
//     diversityScore = Math.max(0, (1 - sim) * 100);
//   } else {
//     let pairs = 0; let simSum = 0;
//     for (let i = 0; i < vectors.length; i++) {
//       for (let j = i + 1; j < vectors.length; j++) {
//         pairs++;
//         simSum += cosineSim(vectors[i], vectors[j]);
//       }
//     }
//     const avgSim = pairs ? (simSum / pairs) : 1;
//     diversityScore = Math.max(0, Math.min(100, 100 - (avgSim * 100)));
//   }
//     console.log(`[progressService] diversityScore=${diversityScore.toFixed(2)}`);

//   // g) Retention Score with early-interaction neutrality
//   let retentionScore = 0;
//   if (interactions.length < 2) {
//     retentionScore = 70; // neutral for one
//   } else if (interactions.length < 4) {
//     retentionScore = 60; // light penalty for quick follow-ups
//   } else {
//     const sorted = [...interactions].sort((a, b) => (new Date(a.createdAt as any as Date).getTime()) - (new Date(b.createdAt as any as Date).getTime()));
//     const gaps: number[] = [];
//     for (let i = 1; i < sorted.length; i++) {
//       const prev = (sorted[i - 1].createdAt as any as Date).getTime();
//       const curr = (sorted[i].createdAt as any as Date).getTime();
//       gaps.push(Math.max(0, curr - prev));
//     }
//     const scores = gaps.map(ms => {
//       const hrs = ms / (1000 * 60 * 60);
//       if (hrs < 1) return 40;
//       if (hrs < 12) return 60;
//       if (hrs < 48) return 85;
//       if (hrs < 24 * 7) return 95;
//       return 100;
//     });
//     retentionScore = scores.reduce((a, b) => a + b, 0) / scores.length;
//   }
//     console.log(`[progressService] retentionScore=${retentionScore.toFixed(2)}`);

//     // h) Final masteryLevel
//     const masteryLevel = (
//       coverageScore * 0.30 +
//       depthScore * 0.25 +
//       confidenceScore * 0.20 +
//       diversityScore * 0.15 +
//       retentionScore * 0.10
//     );
//     console.log(`[progressService] masteryLevel=${masteryLevel.toFixed(2)}`);

//     // i) Status
//     let status: any = 'NOT_STARTED';
//     if (masteryLevel >= 85) status = 'MASTERED';
//     else if (masteryLevel >= 70) status = 'PROFICIENT';
//     else if (masteryLevel >= 40) status = 'LEARNING';
//     else if (masteryLevel >= 20) status = 'BEGINNER';

//     // j) Completion criteria
//     const avgRagConfidence = interactions.reduce((s, it) => s + mapRagConfidence(it.ragConfidence || ''), 0) / interactions.length;
//     const firstInteraction = (interactions[0].createdAt as any as Date) || null;
//     const lastInteraction = (interactions[interactions.length - 1].createdAt as any as Date) || null;
//     const spanDays = firstInteraction ? ((Date.now() - firstInteraction.getTime()) / (1000 * 60 * 60 * 24)) : 0;
//     let completedAt: Date | null = null;
//     if (
//       masteryLevel >= 85 &&
//       questionsAsked >= expectedQuestions &&
//       avgRagConfidence >= 0.75 &&
//       diversityScore >= 60 &&
//       spanDays >= 3
//     ) {
//       completedAt = new Date();
//     }
//     console.log(`[progressService] status=${status} completedAt=${completedAt ? completedAt.toISOString() : 'null'}`);

//     await tx.topicMastery.upsert({
//       where: { userId_topicId: { userId, topicId } },
//       update: {
//         masteryLevel,
//         status,
//         questionsAsked,
//         coverageScore,
//         depthScore,
//         confidenceScore,
//         diversityScore,
//         retentionScore,
//         subtopicsExplored: subtopicsExploredIds,
//         firstInteraction,
//         lastInteraction,
//         completedAt,
//       },
//       create: {
//         userId,
//         topicId,
//         masteryLevel,
//         status,
//         questionsAsked,
//         coverageScore,
//         depthScore,
//         confidenceScore,
//         diversityScore,
//         retentionScore,
//         subtopicsExplored: subtopicsExploredIds,
//         firstInteraction,
//         lastInteraction,
//         completedAt,
//       }
//     });
//   });
// }

// export default {
//   recordInteraction,
//   updateMastery,
// };

// // -------- Aggregations & Details --------

// export async function getUserProgress(userId: string): Promise<ProgressSummary> {
//   // Load all mastery rows and topics for weighting
//   const [masteries, topics] = await Promise.all([
//     prisma.topicMastery.findMany({ where: { userId } }),
//     prisma.topic.findMany({})
//   ]);

//   const topicById = new Map(topics.map(t => [t.id, t] as const));

//   // Weighted overall progress
//   const totalExpected = topics.reduce((s, t) => s + (t.expectedQuestions || 0), 0);
//   const weightedSum = masteries.reduce((s, m) => {
//     const tw = topicById.get(m.topicId)?.expectedQuestions || 0;
//     return s + (m.masteryLevel || 0) * tw;
//   }, 0);
//   const overallProgress = totalExpected > 0 ? Math.min(100, Math.max(0, weightedSum / totalExpected)) : (
//     masteries.length ? (masteries.reduce((s, m) => s + (m.masteryLevel || 0), 0) / masteries.length) : 0
//   );

//   // Totals and status breakdown
//   const totalQuestions = masteries.reduce((s, m) => s + (m.questionsAsked || 0), 0);
//   const topicsByStatus = {
//     mastered: masteries.filter(m => m.status === 'MASTERED').length,
//     proficient: masteries.filter(m => m.status === 'PROFICIENT').length,
//     learning: masteries.filter(m => m.status === 'LEARNING').length,
//     beginner: masteries.filter(m => m.status === 'BEGINNER').length,
//     notStarted: masteries.filter(m => m.status === 'NOT_STARTED').length,
//   };
//   const topicsExplored = masteries.filter(m => m.status !== 'NOT_STARTED').length;
//   const topicsMastered = topicsByStatus.mastered;

//   // Total time spent across interactions (minutes)
//   const interactionsAll = await prisma.topicInteraction.findMany({ where: { userId }, select: { timeSpentMs: true } });
//   const totalTimeSpent = Math.round(interactionsAll.reduce((s, r) => s + (r.timeSpentMs || 0), 0) / 60000);

//   // Weekly activity (last 7 days)
//   const nowTs = Date.now();
//   const sevenDaysAgo = new Date(nowTs - 7 * 24 * 60 * 60 * 1000);
//   const interactionsWeek = await prisma.topicInteraction.findMany({
//     where: { userId, createdAt: { gte: sevenDaysAgo } },
//     select: { createdAt: true, timeSpentMs: true }
//   });
//   const dayBuckets = new Map<string, { questions: number; minutes: number }>();
//   for (let i = 0; i < 7; i++) {
//     const d = new Date(nowTs - (6 - i) * 24 * 60 * 60 * 1000);
//     const key = d.toISOString().slice(0, 10);
//     dayBuckets.set(key, { questions: 0, minutes: 0 });
//   }
//   for (const it of interactionsWeek) {
//     const key = (it.createdAt as any as Date).toISOString().slice(0, 10);
//     const bucket = dayBuckets.get(key);
//     if (bucket) {
//       bucket.questions += 1;
//       bucket.minutes += Math.round((it.timeSpentMs || 0) / 60000);
//     }
//   }
//   const weeklyActivity = Array.from(dayBuckets.entries()).map(([day, v]) => ({ date: day, interactions: v.questions, topics: 0 }));

//   // Top active topics by lastInteraction
//   const top = masteries
//     .filter(m => !!m.lastInteraction)
//     .sort((a, b) => (b.lastInteraction?.getTime() || 0) - (a.lastInteraction?.getTime() || 0))
//     .slice(0, 10)
//     .map(m => {
//       const t = topicById.get(m.topicId);
//       // Determine chapter name
//       let chapterName = t?.name || '';
//       if (t?.level === 1 && t.parentId) {
//         const ch = topicById.get(t.parentId);
//         if (ch) chapterName = ch.name;
//       }
//       return {
//         topicId: m.topicId,
//         topicName: t?.name || m.topicId,
//         chapterName,
//         masteryLevel: m.masteryLevel || 0,
//         status: m.status,
//         questionsAsked: m.questionsAsked || 0,
//         lastActive: (m.lastInteraction as any as Date) || new Date(0)
//       };
//     });

//   return {
//     overallProgress: Number(overallProgress.toFixed(2)),
//     totalQuestions,
//     totalTimeSpent,
//     topicsExplored,
//     topicsMastered,
//     topicsByStatus,
//     weeklyActivity,
//     topActiveTopics: top
//   };
// }

// export async function getTopicDetail(userId: string, topicId: string): Promise<TopicDetail> {
//   const topic = await prisma.topic.findUnique({ where: { id: topicId } });
//   if (!topic) throw new Error('Topic not found');
//   const mastery = await prisma.topicMastery.findUnique({ where: { userId_topicId: { userId, topicId } } });
//   const recentInteractions = await prisma.topicInteraction.findMany({
//     where: { userId, topicId },
//     orderBy: { createdAt: 'desc' },
//     take: 10
//   });

//   // Subtopics progress if chapter
//   let subtopicsProgress: Array<{ subtopic: any; explored: boolean }> = [];
//   if (topic.level === 0) {
//     const children = await prisma.topic.findMany({ where: { parentId: topic.id } });
//     const exploredSet = new Set<string>((mastery?.subtopicsExplored || []).map(String));
//     subtopicsProgress = children.map(ch => ({ subtopic: ch, explored: exploredSet.has(ch.id) }));
//   }

//   // Recommendations: siblings and next chapter
//   const recommendations: string[] = [];
//   if (topic.level === 1 && topic.parentId) {
//     const siblings = await prisma.topic.findMany({ where: { parentId: topic.parentId } });
//     for (const s of siblings) if (s.id !== topic.id) recommendations.push(s.name);
//     // Next chapter topics
//     const parent = await prisma.topic.findUnique({ where: { id: topic.parentId } });
//     if (parent?.chapterNum != null) {
//       const nextChapter = await prisma.topic.findFirst({ where: { level: 0, chapterNum: (parent.chapterNum || 0) + 1 } });
//       if (nextChapter) {
//         const nextChildren = await prisma.topic.findMany({ where: { parentId: nextChapter.id } });
//         recommendations.push(...nextChildren.map(c => c.name));
//       }
//     }
//   } else if (topic.level === 0) {
//     // Next chapter
//     if (topic.chapterNum != null) {
//       const nextChapter = await prisma.topic.findFirst({ where: { level: 0, chapterNum: (topic.chapterNum || 0) + 1 } });
//       if (nextChapter) {
//         const nextChildren = await prisma.topic.findMany({ where: { parentId: nextChapter.id } });
//         recommendations.push(...nextChildren.map(c => c.name));
//       }
//     }
//   }

//   return {
//     topic,
//     mastery,
//     recentInteractions,
//     subtopicProgress: subtopicsProgress,
//     recommendations: recommendations.slice(0, 10)
//   };
// }

import { PrismaClient } from '@prisma/client';
import { TopicMapping } from './topicService';
import { logInteraction, logMasteryUpdate, logError } from '../utils/progressLogger';
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

  // Handle topic mapping failure
  if (!topicMappings || topicMappings.length === 0) {
    console.warn('[progressService] No topics mapped for query, skipping interaction');
    return;
  }

  const eligible = topicMappings.filter(m => (m?.confidence ?? 0) > 0.6 && m?.topicId);
  if (eligible.length === 0) return;

  // Adjustments for very short queries
  let adjustedTimeSpent = timeSpentMs ?? null;
  let adjustedRagConfidence = (ragMetadata?.confidence || '').toString();
  if (query.split(/\s+/).filter(Boolean).length < 10) {
    adjustedTimeSpent = 0;
    adjustedRagConfidence = 'low';
  }

  const citedSections = Array.isArray(ragMetadata?.citedSections) ? ragMetadata.citedSections : [];
  const ragConfidence = adjustedRagConfidence;
  const ragTopScore = Number(ragMetadata?.topScore || 0);

  const affectedTopicIds = new Set<string>();

  // Follow-up detection: same topic within 5 minutes
  try {
    const primaryTopicId = eligible[0]?.topicId;
    if (primaryTopicId) {
      const recentInteraction = await prisma.topicInteraction.findFirst({
        where: {
          userId,
          topicId: primaryTopicId,
          createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) }
        },
        orderBy: { createdAt: 'desc' }
      });
      if (recentInteraction) {
        await prisma.topicInteraction.update({ where: { id: recentInteraction.id }, data: { hadFollowUp: true } });
      }
    }
  } catch (e) {
    console.warn('[progressService] follow-up detection failed', e);
  }

  await prisma.$transaction(async (tx) => {
    for (const m of eligible) {
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
          timeSpentMs: adjustedTimeSpent,
        }
      });

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

      try {
        logInteraction({
          userId,
          query,
          topicsMapped: [m.topicId],
          confidence: m.confidence,
          timestamp: new Date()
        })
      } catch {}
    }
  }, {
    maxWait: 10000,
    timeout: 30000
  });

  for (const topicId of Array.from(affectedTopicIds)) {
    try {
      const before = await prisma.topicMastery.findUnique({ where: { userId_topicId: { userId, topicId } } })
      await updateMastery(userId, topicId);
      const after = await prisma.topicMastery.findUnique({ where: { userId_topicId: { userId, topicId } } })
      if (after) {
        const oldLevel = before?.masteryLevel ?? 0
        const oldStatus = before?.status ?? 'NOT_STARTED'
        if (after.masteryLevel !== oldLevel || after.status !== oldStatus) {
          try {
            logMasteryUpdate({
              userId,
              topicId,
              oldLevel,
              newLevel: after.masteryLevel,
              oldStatus: String(oldStatus),
              newStatus: String(after.status)
            })
          } catch {}
        }
      }
    } catch (e) {
      console.warn('[progressService] updateMastery failed after recordInteraction for topic', topicId, e);
      try { logError('recordInteraction:updateMastery', e) } catch {}
    }
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
  for (let i = 0; i < len; i++) {
    const x = a[i];
    const y = b[i];
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
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
    const [interactions, topic, currentMastery] = await Promise.all([
      tx.topicInteraction.findMany({ where: { userId, topicId }, orderBy: { createdAt: 'asc' } }),
      tx.topic.findUnique({ where: { id: topicId }, include: { children: true } }),
      tx.topicMastery.findUnique({ where: { userId_topicId: { userId, topicId } } })
    ]);

    // Count UNIQUE queries (not total interactions)
    const uniqueQueries = new Set(interactions.map(i => i.query.toLowerCase().trim())).size;
    
    console.log(`[progressService] Total interactions: ${interactions.length}`);
    console.log(`[progressService] Unique queries: ${uniqueQueries}`);
    
    const questionsAsked = uniqueQueries;
    
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

    const children = await tx.topic.findMany({ where: { parentId: topicId } });
    const expectedQuestions = Number(topic?.expectedQuestions ?? 5);

    // ✅ FIX: Improved Coverage Score with proper subtopic tracking
    let coverageScore = 0;
    let subtopicsExploredIds: string[] = [];
    
    if (children.length === 0) {
      // Leaf topic: coverage based on questions vs expected
      coverageScore = questionsAsked >= expectedQuestions 
        ? 100 
        : Math.min(100, (questionsAsked / Math.max(1, expectedQuestions)) * 100);
    } else {
      // Parent topic: track which subtopics were explored via citations
      const explored = new Set<string>();
      
      try {
        // Import topicService dynamically to avoid circular deps
        const { mapCitationToTopic } = await import('./topicService');
        
        for (const interaction of interactions) {
          const sections = interaction.citedSections || [];
          for (const section of sections) {
            if (!section) continue;
            const mapped = await mapCitationToTopic(section);
            if (mapped && children.some(c => c.id === mapped.topic.id)) {
              explored.add(mapped.topic.id);
            }
          }
        }
        
        subtopicsExploredIds = Array.from(explored);
        coverageScore = Math.min(100, (subtopicsExploredIds.length / Math.max(1, children.length)) * 100);
      } catch (err) {
        console.warn('[progressService] Subtopic mapping failed, using fallback:', err);
        // Fallback: use cited section names for simple matching
        const sectionSet = new Set<string>();
        for (const it of interactions) {
          (it.citedSections || []).forEach(s => {
            if (s) sectionSet.add(s.toLowerCase().trim());
          });
        }
        
        for (const child of children) {
          const childName = (child.name || '').toLowerCase();
          const childSlug = (child.slug || '').toLowerCase();
          for (const sec of sectionSet) {
            if (sec.includes(childName) || sec.includes(childSlug)) {
              subtopicsExploredIds.push(child.id);
              break;
            }
          }
        }
        
        coverageScore = Math.min(100, (subtopicsExploredIds.length / Math.max(1, children.length)) * 100);
      }
    }
    
    console.log(`[progressService] coverageScore=${coverageScore.toFixed(2)} explored=${subtopicsExploredIds.length}/${children.length}`);

    // Calculate Depth Score (25% weight) - STRICTER VERSION
    let totalDepthScore = 0;
    for (const interaction of interactions) {
      // Base RAG score (reduced values)
      const ragScore = interaction.ragConfidence === 'high' ? 60 
        : interaction.ragConfidence === 'medium' ? 40 
        : 20;
      
      // Answer quality (capped at 30 points max)
      const answerQuality = Math.min(
        ((Math.max(0, interaction.answerLength || 0)) / 800) * 20 + ((Math.max(0, interaction.citationCount || 0)) * 2),
        30
      );
      
      // Follow-up bonus (reduced)
      const followUpBonus = interaction.hadFollowUp ? 5 : 0;
      
      // Single interaction score (max 95 points)
      const interactionScore = Math.min(ragScore + answerQuality + followUpBonus, 95);
      totalDepthScore += interactionScore;
    }
    // Apply question penalty - need more questions for high depth
    const questionPenalty = Math.min(interactions.length / Math.max(1, (topic?.expectedQuestions as number | undefined) ?? 5), 1);
    const depthScore = interactions.length > 0 
      ? (totalDepthScore / interactions.length) * questionPenalty 
      : 0;
    console.log(`[progressService] depthScore=${depthScore.toFixed(2)}`);

    // Calculate Confidence Score (20% weight) - STRICTER
    const avgRagTop = interactions.reduce((s, it) => s + (it.ragTopScore || 0), 0) / interactions.length;
    // Apply diminishing returns - need 3+ questions for full confidence
    const confirmationFactor = Math.min(interactions.length / 3, 1);
    const confidenceScore = Math.min(100, Math.max(0, (avgRagTop * 100) * confirmationFactor));
    console.log(`[progressService] confidenceScore=${confidenceScore.toFixed(2)} avgRagTop=${avgRagTop.toFixed(4)}`);

    // ✅ FIX: Diversity Score with proper small-sample handling
    let diversityScore = 0;
    const rows = await tx.$queryRaw<Array<{ id: string; vec: string }>>`
      SELECT id, "queryEmbedding"::text as vec 
      FROM "TopicInteraction" 
      WHERE "userId" = ${userId} AND "topicId" = ${topicId}
    `;
    const vectors = rows.map(r => parseVectorTextToArray(r.vec)).filter(v => v.length > 0);
    
    if (vectors.length < 2) {
      diversityScore = 0;
    } else if (vectors.length === 2) {
      const sim = cosineSim(vectors[0], vectors[1]);
      diversityScore = Math.max(0, (1 - sim) * 100);
    } else {
      let pairs = 0;
      let simSum = 0;
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

    // Calculate Retention Score (10% weight) - MUCH STRICTER
    const sortedInteractions = [...interactions].sort((a, b) => 
      (new Date(a.createdAt as any).getTime()) - (new Date(b.createdAt as any).getTime())
    );
    const retentionScores: number[] = [];
    for (let i = 1; i < sortedInteractions.length; i++) {
      const gapMs = new Date(sortedInteractions[i].createdAt as any).getTime() - 
                    new Date(sortedInteractions[i - 1].createdAt as any).getTime();
      const gapHours = gapMs / (1000 * 60 * 60);
      // Much stricter scoring
      let score = 10; // cramming (< 2 hours)
      if (gapHours >= 168) score = 100; // > 7 days
      else if (gapHours >= 72) score = 85; // 3-7 days
      else if (gapHours >= 48) score = 70; // 2-3 days
      else if (gapHours >= 24) score = 50; // 1-2 days
      else if (gapHours >= 6) score = 30; // 6-24 hours
      else if (gapHours >= 2) score = 20; // 2-6 hours
      retentionScores.push(score);
    }
    // Default to 0 for single interaction (no retention yet)
    const retentionScore = retentionScores.length > 0
      ? retentionScores.reduce((a, b) => a + b, 0) / retentionScores.length
      : 0;
    console.log(`[progressService] retentionScore=${retentionScore.toFixed(2)}`);

    // Compute final masteryLevel with progressive penalty
    let rawMasteryLevel = (
      coverageScore * 0.30 +
      depthScore * 0.25 +
      confidenceScore * 0.20 +
      diversityScore * 0.15 +
      retentionScore * 0.10
    );

    const expectedQ = Math.max(1, (topic?.expectedQuestions as number | undefined) ?? 5);
    const questionRatio = interactions.length / expectedQ;
    let masteryLevel: number;
    if (questionRatio < 0.3) {
      // Less than 30% of expected questions - cap at 40%
      masteryLevel = Math.min(rawMasteryLevel, 40);
    } else if (questionRatio < 0.5) {
      // Less than 50% - cap at 60%
      masteryLevel = Math.min(rawMasteryLevel, 60);
    } else if (questionRatio < 0.7) {
      // Less than 70% - cap at 75%
      masteryLevel = Math.min(rawMasteryLevel, 75);
    } else {
      // 70%+ questions - allow full score
      masteryLevel = rawMasteryLevel;
    }
    // Detailed breakdown logging
    console.log(`[progressService] === Mastery Calculation Breakdown ===`);
    console.log(`[progressService] Topic: ${topic?.name} (${topic?.id})`);
    console.log(`[progressService] Expected Questions: ${(topic?.expectedQuestions as number | undefined) ?? 0}`);
    console.log(`[progressService] Actual Questions: ${interactions.length}`);
    console.log(`[progressService] Question Ratio: ${(questionRatio * 100).toFixed(1)}%`);
    console.log(`[progressService] ---`);
    console.log(`[progressService] Coverage: ${coverageScore.toFixed(2)}% (weight: 30%)`);
    console.log(`[progressService] Depth: ${depthScore.toFixed(2)}% (weight: 25%)`);
    console.log(`[progressService] Confidence: ${confidenceScore.toFixed(2)}% (weight: 20%)`);
    console.log(`[progressService] Diversity: ${diversityScore.toFixed(2)}% (weight: 15%)`);
    console.log(`[progressService] Retention: ${retentionScore.toFixed(2)}% (weight: 10%)`);
    console.log(`[progressService] ---`);
    console.log(`[progressService] Raw Mastery: ${rawMasteryLevel.toFixed(2)}%`);
    console.log(`[progressService] Final Mastery: ${masteryLevel.toFixed(2)}% (after caps)`);

    // Determine status (stricter thresholds)
    let status: any = 'NOT_STARTED';
    if (masteryLevel >= 85 && interactions.length >= expectedQ) {
      status = 'MASTERED';
    } else if (masteryLevel >= 65 && interactions.length >= expectedQ * 0.7) {
      status = 'PROFICIENT';
    } else if (masteryLevel >= 35 && interactions.length >= 3) {
      status = 'LEARNING';
    } else if (masteryLevel >= 15 && interactions.length >= 1) {
      status = 'BEGINNER';
    }

    // Completion criteria
    const avgRagConfidence = interactions.reduce((s, it) => 
      s + mapRagConfidence(it.ragConfidence || ''), 0
    ) / interactions.length;
    
    const firstInteraction = (interactions[0].createdAt as any) || null;
    const lastInteraction = (interactions[interactions.length - 1].createdAt as any) || null;
    const spanDays = firstInteraction 
      ? ((Date.now() - new Date(firstInteraction).getTime()) / (1000 * 60 * 60 * 24)) 
      : 0;
    
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
    console.log(`[progressService] Status: ${status}`);
    console.log(`[progressService] =====================================`);

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
  }, {
    maxWait: 15000,
    timeout: 45000
  });
}

export async function getUserProgress(userId: string): Promise<ProgressSummary> {
  const [masteries, topics] = await Promise.all([
    prisma.topicMastery.findMany({ where: { userId } }),
    prisma.topic.findMany({})
  ]);

  const topicById = new Map(topics.map(t => [t.id, t]));

  // Weighted overall progress
  const totalExpected = topics.reduce((s, t) => s + (t.expectedQuestions || 0), 0);
  const weightedSum = masteries.reduce((s, m) => {
    const tw = topicById.get(m.topicId)?.expectedQuestions || 0;
    return s + (m.masteryLevel || 0) * tw;
  }, 0);
  
  const overallProgress = totalExpected > 0 
    ? Math.min(100, Math.max(0, weightedSum / totalExpected)) 
    : (masteries.length ? (masteries.reduce((s, m) => s + (m.masteryLevel || 0), 0) / masteries.length) : 0);

  // Calculate UNIQUE questions across ALL topics
  // Get all interactions and count unique queries
  const allInteractions = await prisma.topicInteraction.findMany({
    where: { userId },
    select: { query: true }
  });
  
  // Count unique queries (case-insensitive, trimmed)
  const uniqueQueries = new Set(
    allInteractions.map(i => i.query.toLowerCase().trim())
  );
  const totalQuestions = uniqueQueries.size;
  
  console.log(`[progressService] getUserProgress:`);
  console.log(`[progressService] - Total interactions: ${allInteractions.length}`);
  console.log(`[progressService] - Unique questions: ${totalQuestions}`);

  const topicsByStatus = {
    mastered: masteries.filter(m => m.status === 'MASTERED').length,
    proficient: masteries.filter(m => m.status === 'PROFICIENT').length,
    learning: masteries.filter(m => m.status === 'LEARNING').length,
    beginner: masteries.filter(m => m.status === 'BEGINNER').length,
    notStarted: masteries.filter(m => m.status === 'NOT_STARTED').length,
  };
  
  const topicsExplored = masteries.filter(m => m.status !== 'NOT_STARTED').length;
  const topicsMastered = topicsByStatus.mastered;

  // Total time spent
  const interactionsAll = await prisma.topicInteraction.findMany({
    where: { userId },
    select: { timeSpentMs: true }
  });
  const totalTimeSpent = Math.round(
    interactionsAll.reduce((s, r) => s + (r.timeSpentMs || 0), 0) / 60000
  );

  // Weekly activity
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
    const key = new Date(it.createdAt as any).toISOString().slice(0, 10);
    const bucket = dayBuckets.get(key);
    if (bucket) {
      bucket.questions += 1;
      bucket.minutes += Math.round((it.timeSpentMs || 0) / 60000);
    }
  }
  
  const weeklyActivity = Array.from(dayBuckets.entries()).map(([day, v]) => ({
    date: day,
    interactions: v.questions,
    topics: 0
  }));

  // Top active topics
  const top = masteries
    .filter(m => !!m.lastInteraction)
    .sort((a, b) => (b.lastInteraction?.getTime() || 0) - (a.lastInteraction?.getTime() || 0))
    .slice(0, 10)
    .map(m => {
      const t = topicById.get(m.topicId);
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
        lastActive: new Date(m.lastInteraction as any) || new Date(0)
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
  
  const mastery = await prisma.topicMastery.findUnique({
    where: { userId_topicId: { userId, topicId } }
  });
  
  const recentInteractions = await prisma.topicInteraction.findMany({
    where: { userId, topicId },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  let subtopicsProgress: Array<{ subtopic: any; explored: boolean }> = [];
  if (topic.level === 0) {
    const children = await prisma.topic.findMany({ where: { parentId: topic.id } });
    const exploredSet = new Set<string>((mastery?.subtopicsExplored || []).map(String));
    subtopicsProgress = children.map(ch => ({
      subtopic: ch,
      explored: exploredSet.has(ch.id)
    }));
  }

  const recommendations: string[] = [];
  if (topic.level === 1 && topic.parentId) {
    const siblings = await prisma.topic.findMany({ where: { parentId: topic.parentId } });
    for (const s of siblings) {
      if (s.id !== topic.id) recommendations.push(s.name);
    }
    
    const parent = await prisma.topic.findUnique({ where: { id: topic.parentId } });
    if (parent?.chapterNum != null) {
      const nextChapter = await prisma.topic.findFirst({
        where: { level: 0, chapterNum: (parent.chapterNum || 0) + 1 }
      });
      if (nextChapter) {
        const nextChildren = await prisma.topic.findMany({ where: { parentId: nextChapter.id } });
        recommendations.push(...nextChildren.map(c => c.name));
      }
    }
  } else if (topic.level === 0 && topic.chapterNum != null) {
    const nextChapter = await prisma.topic.findFirst({
      where: { level: 0, chapterNum: (topic.chapterNum || 0) + 1 }
    });
    if (nextChapter) {
      const nextChildren = await prisma.topic.findMany({ where: { parentId: nextChapter.id } });
      recommendations.push(...nextChildren.map(c => c.name));
    }
  }

  return {
    topic,
    mastery,
    recentInteractions,
    subtopicProgress: subtopicsProgress,
    recommendations: recommendations.slice(0, 10)
  };
}

export default {
  recordInteraction,
  updateMastery,
  getUserProgress,
  getTopicDetail
};

