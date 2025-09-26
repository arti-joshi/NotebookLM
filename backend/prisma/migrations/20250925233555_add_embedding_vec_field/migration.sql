/*
  Warnings:

  - You are about to drop the `PostgresDocEmbedding` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Embedding" ADD COLUMN     "embedding_vec" vector(768);

-- DropTable
DROP TABLE "PostgresDocEmbedding";
