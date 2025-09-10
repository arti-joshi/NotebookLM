-- AlterTable
ALTER TABLE "Embedding" ADD COLUMN     "chunkIndex" INTEGER,
ADD COLUMN     "chunkingConfig" JSONB,
ADD COLUMN     "documentType" TEXT,
ADD COLUMN     "endLine" INTEGER,
ADD COLUMN     "section" TEXT,
ADD COLUMN     "startLine" INTEGER,
ADD COLUMN     "totalChunks" INTEGER;

-- CreateIndex
CREATE INDEX "Embedding_userId_idx" ON "Embedding"("userId");

-- CreateIndex
CREATE INDEX "Embedding_documentType_idx" ON "Embedding"("documentType");

-- CreateIndex
CREATE INDEX "Embedding_source_chunkIndex_idx" ON "Embedding"("source", "chunkIndex");
