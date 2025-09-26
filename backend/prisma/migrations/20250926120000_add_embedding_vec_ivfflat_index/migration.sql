-- Ensure pgvector extension is available
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create IVFFLAT index for cosine similarity on embedding_vec
CREATE INDEX IF NOT EXISTS embedding_vec_ivfflat_idx
ON "Embedding"
USING ivfflat (embedding_vec vector_cosine_ops)
WITH (lists = 100);


