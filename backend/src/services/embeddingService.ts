import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { embedTextHF } from './hfEmbeddingService';

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
 * Try Google API embedding, fallback to Hugging Face if error.
 * Logs which provider was used.
 * Returns embedding vector in the same format.
 */
export async function getEmbeddingWithFallback(text: string): Promise<{ embedding: number[], provider: 'google' | 'hf' }> {
  try {
    let embedding = await googleEmbeddings.embedQuery(text);
    embedding = normalizeEmbedding(embedding, 768);
    console.log('[EmbeddingService] Used Google API for embedding. Type:', Array.isArray(embedding) ? 'Array' : typeof embedding, 'Length:', embedding.length);
    return { embedding, provider: 'google' };
  } catch (err) {
    console.warn('[EmbeddingService] Google API failed, falling back to Hugging Face:', err?.message || err);
    let embedding = await embedTextHF(text) as number[];
    embedding = normalizeEmbedding(embedding, 768);
    console.log('[EmbeddingService] Used Hugging Face for embedding. Type:', Array.isArray(embedding) ? 'Array' : typeof embedding, 'Length:', embedding.length);
    return { embedding, provider: 'hf' };
  }
}
