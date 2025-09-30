/**
 * Configuration settings for the backend application
 */

export interface AppConfig {
  // Spell correction settings
  spellCorrection: {
    enabled: boolean;
    threshold: number;
    maxCorrections: number;
  };
  
  // RAG settings
  rag: {
    enableQueryExpansion: boolean;
    enableKeywordSearch: boolean;
    enableSpellCorrection: boolean;
  };
  
  // Retrieval settings
  retrieval: {
    similarityThreshold: number;
    maxResults: number;
    rerankingEnabled: boolean;
  };
  
  // Server settings
  server: {
    port: number;
    cors: {
      origin: string[];
      credentials: boolean;
    };
  };
}

export const config: AppConfig = {
  spellCorrection: {
    enabled: process.env.ENABLE_SPELL_CORRECTION === 'true' || true,
    threshold: parseFloat(process.env.SPELL_CORRECTION_THRESHOLD || '0.8'),
    maxCorrections: parseInt(process.env.SPELL_CORRECTION_MAX || '3')
  },
  
  rag: {
    enableQueryExpansion: process.env.ENABLE_QUERY_EXPANSION !== 'false',
    enableKeywordSearch: process.env.ENABLE_KEYWORD_SEARCH !== 'false',
    enableSpellCorrection: process.env.ENABLE_SPELL_CORRECTION !== 'false'
  },
  
  retrieval: {
    similarityThreshold: parseFloat(process.env.RETRIEVAL_SIMILARITY_THRESHOLD || '0.25'),
    maxResults: parseInt(process.env.RETRIEVAL_MAX_RESULTS || '20'),
    rerankingEnabled: process.env.RETRIEVAL_RERANKING_ENABLED !== 'false'
  },
  
  server: {
    port: parseInt(process.env.PORT || '4001'),
    cors: {
      origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }
  }
};
