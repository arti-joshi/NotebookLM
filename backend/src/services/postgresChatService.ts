import { PrismaClient } from '../../generated/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  modelName: 'text-embedding-004'
});

export class PostgresChatService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Get relevant context from PostgreSQL documentation
   */
  private async getContext(query: string): Promise<string> {
    try {
      // Get query embedding
      const queryEmbedding = await embeddings.embedQuery(query);

      interface SearchResult {
        chunk: string;
        section: string;
        pageStart: number;
        score: number;
      }

      // Find relevant sections using hybrid search
      const results = await this.prisma.$queryRaw<SearchResult[]>`
        WITH vector_search AS (
          SELECT 
            chunk,
            section,
            "pageStart",
            1 - (embedding_vec <=> ${`[${(queryEmbedding as any).join(',')}]`}::vector) as similarity
          FROM "Embedding"
          WHERE embedding_vec IS NOT NULL
          ORDER BY embedding_vec <=> ${`[${(queryEmbedding as any).join(',')}]`}::vector
          LIMIT 3
        ),
        text_search AS (
          SELECT 
            chunk,
            section,
            "pageStart",
            ts_rank(to_tsvector('english', chunk), plainto_tsquery('english', ${query})) as rank
          FROM "Embedding"
          WHERE to_tsvector('english', chunk) @@ plainto_tsquery('english', ${query})
          ORDER BY rank DESC
          LIMIT 3
        )
        SELECT 
          chunk,
          section,
          "pageStart",
          GREATEST(COALESCE(vs.similarity, 0), COALESCE(ts.rank, 0)) as score
        FROM vector_search vs
        FULL OUTER JOIN text_search ts ON vs.chunk = ts.chunk
        ORDER BY score DESC
        LIMIT 3;
      `;

      if (!results.length) {
        return 'No relevant documentation sections found.';
      }

      // Format context with citations
      return results.map((r) => 
        `[From section "${r.section}" on page ${r.pageStart}]:\n${r.chunk}`
      ).join('\n\n');
    } catch (error) {
      console.error('Error getting context:', error);
      return '';
    }
  }

  /**
   * Generate chat response using context from PostgreSQL documentation
   */
  async generateResponse(messages: { role: string, content: string }[]): Promise<string> {
    try {
      // Get the user's latest question
      const userMessage = [...messages].reverse().find(m => m.role === 'user')?.content;
      if (!userMessage) return 'I couldn\'t understand your question. Could you please rephrase it?';

      // Get relevant context
      const context = await this.getContext(userMessage);
      
      // Prepare chat model
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      // Create chat
      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: m.content
        })),
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.8,
          topK: 40
        }
      });

      // Generate response
      const result = await chat.sendMessage(
        `You are a PostgreSQL documentation expert. Use the following documentation sections to answer the user's question. 
         Always cite your sources using [section "X" on page Y] format.
         If you're not sure about something, say so.
         
         Context from PostgreSQL documentation:
         ${context}
         
         User's question: ${userMessage}`
      );

      const response = result.response.text();
      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  }
}