import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

const googleEmbeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY!,
  modelName: 'text-embedding-004',
});

function normalizeEmbedding(vec: number[], targetDim = 768): number[] {
  if (vec.length === targetDim) return vec;
  if (vec.length > targetDim) return vec.slice(0, targetDim);
  return vec.concat(Array(targetDim - vec.length).fill(0));
}

/**
 * Generate embedding via Google only. No fallback.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  let embedding = await googleEmbeddings.embedQuery(text);
  embedding = normalizeEmbedding(embedding, 768);
  return embedding;
}
