-- Performance indexes for progress tracking system
-- Run these after the main migration

-- Index for topic interactions by user and topic with creation time
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_topic_interaction_user_topic_created 
  ON "TopicInteraction"("userId", "topicId", "createdAt" DESC);

-- Index for topic mastery by status and mastery level
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_topic_mastery_status_level 
  ON "TopicMastery"("status", "masteryLevel" DESC);

-- Index for topic mastery by user and status
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_topic_mastery_user_status 
  ON "TopicMastery"("userId", "status");

-- Index for topic interactions by user and creation time (for weekly activity)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_topic_interaction_user_created 
  ON "TopicInteraction"("userId", "createdAt" DESC);

-- Index for topics by level and parent (for hierarchy queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_topic_level_parent 
  ON "Topic"("level", "parentId");

-- Index for topics by chapter number (for chapter ordering)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_topic_chapter_num 
  ON "Topic"("chapterNum") WHERE "chapterNum" IS NOT NULL;

-- Index for topic interactions by mapping confidence (for filtering)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_topic_interaction_confidence 
  ON "TopicInteraction"("mappingConfidence") WHERE "mappingConfidence" > 0.6;

-- Composite index for topic mastery updates
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_topic_mastery_user_topic_updated 
  ON "TopicMastery"("userId", "topicId", "updatedAt" DESC);

-- Index for vector similarity queries (if using pgvector)
-- Note: This requires pgvector extension
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_topic_embedding_cosine 
--   ON "Topic" USING ivfflat ("representativeEmbedding" vector_cosine_ops) WITH (lists = 100);

-- Index for topic interactions by answer length and citation count (for depth scoring)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_topic_interaction_depth_metrics 
  ON "TopicInteraction"("answerLength", "citationCount") WHERE "answerLength" > 0;
