/**
 * Example Usage of Smart Chunking System
 * 
 * This file demonstrates how to use the smart chunking pipeline
 * in your RAG chatbot application.
 */

import { PrismaClient } from '../../generated/prisma';
import { 
  chunkDocument, 
  processDocumentWithSmartChunking,
  CHUNKING_PRESETS,
  DocumentType,
  getChunkingStats
} from './index';

// Example 1: Basic chunking without database
export async function exampleBasicChunking() {
  const content = `
# Introduction to Machine Learning

Machine learning is a subset of artificial intelligence that focuses on algorithms.

## Types of Machine Learning

### Supervised Learning
Supervised learning uses labeled training data.

\`\`\`python
def train_model(X, y):
    model = LinearRegression()
    model.fit(X, y)
    return model
\`\`\`

### Unsupervised Learning
Unsupervised learning finds patterns in data without labels.

## Conclusion
Machine learning is powerful for data analysis.
  `;

  // Chunk the document
  const result = await chunkDocument(content, {
    filename: 'ml-intro.md',
    config: CHUNKING_PRESETS.RESEARCH
  });

  // Get statistics
  const stats = getChunkingStats(result);
  
  console.log('Document Type:', result.metadata.type);
  console.log('Confidence:', result.metadata.confidence);
  console.log('Total Chunks:', stats.totalChunks);
  console.log('Average Chunk Size:', stats.averageChunkSize);
  console.log('Processing Time:', stats.processingTime + 'ms');

  return result;
}

// Example 2: Chunking with database integration
export async function exampleDatabaseChunking() {
  const prisma = new PrismaClient();
  
  const content = `
# API Documentation

## Authentication
All API requests require authentication.

\`\`\`javascript
const response = await fetch('/api/data', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});
\`\`\`

## Endpoints

### GET /api/users
Returns a list of users.

| Field | Type | Description |
|-------|------|-------------|
| id    | int  | User ID     |
| name  | string | User name  |
  `;

  try {
    const result = await processDocumentWithSmartChunking(prisma, content, {
      userId: 'demo-user-id',
      source: 'api-docs.md',
      config: CHUNKING_PRESETS.RESEARCH
    });

    console.log('Processing Result:', {
      success: result.success,
      totalChunks: result.totalChunks,
      processedChunks: result.processedChunks,
      documentType: result.documentType,
      processingTime: result.processingTime + 'ms',
      errors: result.errors
    });

    return result;
  } finally {
    await prisma.$disconnect();
  }
}

// Example 3: Force specific document type
export async function exampleForceDocumentType() {
  const content = `
function calculateSum(a, b) {
  return a + b;
}

function calculateProduct(a, b) {
  return a * b;
}
  `;

  const result = await chunkDocument(content, {
    filename: 'math.js',
    forceType: DocumentType.CODE,
    config: CHUNKING_PRESETS.CODE
  });

  console.log('Forced Code Chunking:', {
    type: result.metadata.type,
    chunks: result.chunks.length,
    sections: result.chunks.map(c => c.metadata.section)
  });

  return result;
}

// Example 4: Custom chunking configuration
export async function exampleCustomConfig() {
  const content = 'This is a very long document with lots of content...';

  const customConfig = {
    chunkSize: 500,
    overlap: 100,
    minChunkSize: 50,
    maxChunkSize: 1000,
    preserveStructure: true
  };

  const result = await chunkDocument(content, {
    config: customConfig
  });

  console.log('Custom Config Result:', {
    chunks: result.chunks.length,
    config: result.config
  });

  return result;
}

// Example 5: Batch processing multiple documents
export async function exampleBatchProcessing() {
  const documents = [
    {
      content: '# Document 1\nThis is the first document.',
      filename: 'doc1.md'
    },
    {
      content: 'function test() { return true; }',
      filename: 'test.js'
    },
    {
      content: 'name,age,email\nJohn,25,john@example.com',
      filename: 'users.csv'
    }
  ];

  const results = await Promise.all(
    documents.map(doc => 
      chunkDocument(doc.content, { filename: doc.filename })
    )
  );

  console.log('Batch Processing Results:', 
    results.map((result, i) => ({
      filename: documents[i].filename,
      type: result.metadata.type,
      chunks: result.chunks.length
    }))
  );

  return results;
}

// Run examples (uncomment to test)
// exampleBasicChunking();
// exampleDatabaseChunking();
// exampleForceDocumentType();
// exampleCustomConfig();
// exampleBatchProcessing();
