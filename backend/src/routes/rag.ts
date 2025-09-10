import { EnhancedRAGService } from './services/enhancedRagService';
import { documentService } from './services/documentService';
import express from 'express';

const router = express.Router();

// Initialize the enhanced RAG service with optimal settings
const ragService = new EnhancedRAGService(prisma, {
  maxResults: 10,
  similarityThreshold: 0.1,
  minKeywordScore: 0.3,
  contextWindow: 2,
  hybridWeights: {
    vector: 0.6,
    keyword: 0.3,
    context: 0.1
  }
});

// Debug endpoint for testing RAG improvements
router.post('/debug-rag', async (req, res) => {
  try {
    const { queries } = req.body;
    if (!Array.isArray(queries)) {
      return res.status(400).json({ error: 'Queries must be an array' });
    }

    const results = await Promise.all(
      queries.map(async (query) => {
        const searchResults = await ragService.search(query, 'demo-user');
        return {
          query,
          results: searchResults.map(r => ({
            chunk: r.chunk,
            source: r.source,
            score: r.score,
            method: r.method,
            matches: r.matches
          }))
        };
      })
    );

    res.json({ results });
  } catch (error) {
    console.error('RAG debug error:', error);
    res.status(500).json({ error: 'RAG debug failed' });
  }
});

export default router;
