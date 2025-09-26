-- AlterTable
ALTER TABLE "Document" ADD COLUMN "isSystemDocument" BOOLEAN NOT NULL DEFAULT false;

-- Table already exists, just adding the column above

-- Indexes and foreign keys already exist from previous migrations
