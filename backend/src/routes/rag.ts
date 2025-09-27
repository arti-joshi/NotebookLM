import { RAGService } from '../services/ragService';
import { PrismaClient } from '../../generated/prisma';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// Initialize the RAG service with optimal settings
const ragService = new RAGService(prisma, {
  maxResults: 10,
  similarityThreshold: 0.35, // Adjusted for better relevance
  enableKeywordSearch: true,
  enableQueryExpansion: true,
  enableHybridSearch: true,
  enableReranking: true
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
        const searchResults = await ragService.retrieveContext(query, 'demo-user');
        return {
          query,
          results: searchResults.results.map(r => ({
            chunk: r.chunk,
            source: r.source,
            score: r.score,
            method: r.method,
            finalScore: r.finalScore
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
