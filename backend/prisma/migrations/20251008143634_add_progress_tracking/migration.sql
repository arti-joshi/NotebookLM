-- CreateEnum
CREATE TYPE "MasteryStatus" AS ENUM ('NOT_STARTED', 'BEGINNER', 'LEARNING', 'PROFICIENT', 'MASTERED');

-- DropIndex
DROP INDEX "embedding_vec_ivfflat_idx";

-- CreateTable
CREATE TABLE "RetrievalLog" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "results" JSONB NOT NULL,
    "metrics" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RetrievalLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentId" TEXT,
    "chapterNum" INTEGER,
    "keywords" TEXT[],
    "aliases" TEXT[],
    "expectedQuestions" INTEGER NOT NULL DEFAULT 5,
    "representativeEmbedding" vector(768),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicInteraction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "queryEmbedding" vector(768) NOT NULL,
    "mappingConfidence" DOUBLE PRECISION NOT NULL,
    "ragConfidence" TEXT NOT NULL,
    "ragTopScore" DOUBLE PRECISION NOT NULL,
    "citedSections" TEXT[],
    "answerLength" INTEGER NOT NULL,
    "citationCount" INTEGER NOT NULL,
    "timeSpentMs" INTEGER,
    "hadFollowUp" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopicInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicMastery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "masteryLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "MasteryStatus" NOT NULL,
    "questionsAsked" INTEGER NOT NULL DEFAULT 0,
    "coverageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "depthScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "diversityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "retentionScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subtopicsExplored" TEXT[],
    "firstInteraction" TIMESTAMP(3),
    "lastInteraction" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopicMastery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Topic_slug_key" ON "Topic"("slug");

-- CreateIndex
CREATE INDEX "TopicInteraction_userId_idx" ON "TopicInteraction"("userId");

-- CreateIndex
CREATE INDEX "TopicInteraction_topicId_idx" ON "TopicInteraction"("topicId");

-- CreateIndex
CREATE INDEX "TopicInteraction_createdAt_idx" ON "TopicInteraction"("createdAt");

-- CreateIndex
CREATE INDEX "TopicMastery_userId_idx" ON "TopicMastery"("userId");

-- CreateIndex
CREATE INDEX "TopicMastery_status_idx" ON "TopicMastery"("status");

-- CreateIndex
CREATE INDEX "TopicMastery_masteryLevel_idx" ON "TopicMastery"("masteryLevel");

-- CreateIndex
CREATE UNIQUE INDEX "TopicMastery_userId_topicId_key" ON "TopicMastery"("userId", "topicId");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicInteraction" ADD CONSTRAINT "TopicInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicInteraction" ADD CONSTRAINT "TopicInteraction_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicMastery" ADD CONSTRAINT "TopicMastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicMastery" ADD CONSTRAINT "TopicMastery_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
