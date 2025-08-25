import 'dotenv/config'

export async function getSambaClient() {
  const mod = await import('openai')
  const OpenAI = (mod as any).default
  const client = new OpenAI({
    baseURL: process.env.SAMBANOVA_BASE_URL,
    apiKey: process.env.SAMBANOVA_API_KEY,
  })
  return client
}


