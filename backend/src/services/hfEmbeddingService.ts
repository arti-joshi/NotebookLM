import { pipeline } from '@xenova/transformers';

// Cache the pipeline/model after first load
let embeddingPipeline: any = null;

async function getEmbeddingPipeline() {
  if (!embeddingPipeline) {
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embeddingPipeline;
}

function tensorToArray(tensor: any): number[] {
  // Xenova Tensor: { data: Float32Array, ... }
  if (tensor && tensor.data && Array.isArray(tensor.data) === false) {
    return Array.from(tensor.data);
  }
  // Already array
  return tensor;
}

/**
 * Get Hugging Face embedding(s) for a string or array of strings.
 * @param text string or array of strings
 * @returns Promise<number[]> or Promise<number[][]>
 */
export async function embedTextHF(text: string | string[]): Promise<number[] | number[][]> {
  const pipe = await getEmbeddingPipeline();
  const input = Array.isArray(text) ? text : [text];
  const result = await pipe(input, { pooling: 'mean', normalize: true });
  // If input was a single string, return a single vector
  if (!Array.isArray(text)) {
    return tensorToArray(result[0]);
  }
  return result.map(tensorToArray);
}
