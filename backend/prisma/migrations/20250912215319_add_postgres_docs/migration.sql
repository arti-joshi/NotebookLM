-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Embedding" ADD COLUMN     "documentId" TEXT,
ADD COLUMN     "hasImage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasTable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pageEnd" INTEGER,
ADD COLUMN     "pageStart" INTEGER,
ADD COLUMN     "sectionLevel" INTEGER,
ADD COLUMN     "wordCount" INTEGER;

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "totalChunks" INTEGER,
    "processedChunks" INTEGER NOT NULL DEFAULT 0,
    "processingError" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostgresDocEmbedding" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,
    "section" TEXT,
    "page" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostgresDocEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_contentHash_key" ON "Document"("contentHash");

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "Document"("userId");

-- CreateIndex
CREATE INDEX "Document_contentHash_idx" ON "Document"("contentHash");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");

-- CreateIndex
CREATE INDEX "PostgresDocEmbedding_section_idx" ON "PostgresDocEmbedding"("section");

-- CreateIndex
CREATE INDEX "Embedding_documentId_idx" ON "Embedding"("documentId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embedding" ADD CONSTRAINT "Embedding_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
