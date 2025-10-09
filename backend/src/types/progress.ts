/**
 * TypeScript types for progress tracking system
 */

export interface QueryEmbedding extends Array<number> {
  length: 768
}

export interface RAGMetadata {
  confidence: 'high' | 'medium' | 'low'
  topScore: number
  citedSections: string[]
}

export interface TopicMapping {
  topicId: string
  confidence: number
  source: 'embedding' | 'rag' | 'hybrid'
  matchedKeywords?: string[]
}

export interface RecordInteractionParams {
  userId: string
  query: string
  queryEmbedding: QueryEmbedding
  topicMappings: TopicMapping[]
  ragMetadata: RAGMetadata
  answerLength: number
  citationCount: number
  timeSpentMs: number
  hadFollowUp: boolean
}

export interface ProgressSummary {
  totalTopics: number
  masteredTopics: number
  learningTopics: number
  notStartedTopics: number
  overallProgress: number
  weeklyActivity: Array<{
    date: string
    interactions: number
    topics: number
  }>
  topActiveTopics: Array<{
    topicId: string
    topicName: string
    masteryLevel: number
    status: 'NOT_STARTED' | 'BEGINNER' | 'LEARNING' | 'PROFICIENT' | 'MASTERED'
    lastInteraction: Date
  }>
}

export interface TopicDetail {
  topic: {
    id: string
    name: string
    slug: string
    keywords: string[]
    aliases: string[]
    expectedQuestions: number
    parent?: { name: string }
  }
  mastery?: {
    masteryLevel: number
    status: 'NOT_STARTED' | 'BEGINNER' | 'LEARNING' | 'PROFICIENT' | 'MASTERED'
    questionsAsked: number
    coverageScore: number
    depthScore: number
    confidenceScore: number
    diversityScore: number
    retentionScore: number
    subtopicsExplored: string[]
    firstInteraction?: Date
    lastInteraction?: Date
    completedAt?: Date
  }
  recentInteractions: Array<{
    id: string
    query: string
    mappingConfidence: number
    ragConfidence: number
    answerLength: number
    citationCount: number
    timeSpentMs: number
    createdAt: Date
  }>
  subtopicProgress: Array<{
    subtopicId: string
    subtopicName: string
    masteryLevel: number
    status: 'NOT_STARTED' | 'BEGINNER' | 'LEARNING' | 'PROFICIENT' | 'MASTERED'
  }>
  recommendations: string[]
}

export interface DbTopic {
  id: string
  level: number
  name: string
  slug: string
  parentId?: string
  chapterNum?: number
  keywords: string[]
  aliases: string[]
  expectedQuestions: number
  representativeEmbedding?: number[] | null
  createdAt: Date
  children?: string[]
}

export interface TopicMaps {
  byId: Map<string, DbTopic & { children?: string[] }>
  bySlug: Map<string, DbTopic & { children?: string[] }>
}
