import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PrismaClient } from '../generated/prisma/index.js';
import { DocumentService } from '../src/services/documentService.js';
import { 
  RecursiveCharacterTextSplitter,
  MarkdownTextSplitter,
  CharacterTextSplitter
} from 'langchain/text_splitter';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();
const docService = new DocumentService(prisma);
const embedder = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY!,
  modelName: 'text-embedding-004',
});

interface ProcessedChunk {
  content: string;
  section?: string;
  page?: number;
  metadata: {
    chunkIndex: number;
    totalChunks: number;
    documentType?: string;
    hasTable: boolean;
    hasImage: boolean;
    wordCount: number;
    source: string;
  };
}

async function generateEmbedding(text: string): Promise<number[]> {
  const embedding = await embedder.embedQuery(text);
  return embedding;
}

async function processPostgresDoc(filePath: string): Promise<ProcessedChunk[]> {
  const filename = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();
  
  console.log(`📄 Processing ${filename} with LangChain splitters...`);
  
  // Create appropriate loader based on file type
  const loader = new TextLoader(filePath);
  const documents = await loader.load();
  
  let chunks;
  
  // Choose appropriate splitter based on file type
  if (ext === '.md') {
    // Use markdown splitter for better structure preservation
    const markdownSplitter = new MarkdownTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 150
    });
    
    chunks = await markdownSplitter.splitDocuments(documents);
  } else if (ext === '.html') {
    // Use recursive character splitter for HTML files
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 150,
      separators: ["\n\n", "\n", " ", ""]
    });
    
    chunks = await textSplitter.splitDocuments(documents);
  } else {
    // Use recursive character splitter for plain text
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", ". ", " ", ""]
    });
    
    chunks = await splitter.splitDocuments(documents);
  }

  console.log(`✅ Created ${chunks.length} chunks using LangChain splitters`);

  return chunks.map((chunk, index) => ({
    content: chunk.pageContent,
    section: chunk.metadata?.Header_1 || chunk.metadata?.Header_2 || chunk.metadata?.Header_3 || 'Introduction',
    page: chunk.metadata?.loc?.pageNumber || 1,
    metadata: {
      chunkIndex: index,
      totalChunks: chunks.length,
      documentType: 'postgres-documentation',
      hasTable: /\|.*\|/.test(chunk.pageContent) && /---/.test(chunk.pageContent),
      hasImage: /\[.*?\]\(.*?\)|!\[.*?\]\(.*?\)/.test(chunk.pageContent),
      wordCount: chunk.pageContent.split(/\s+/).length,
      source: filename
    }
  }));
}

async function ingestPostgresDocs() {
  const docsDir = path.join(__dirname, '../../data/postgres_docs');
  
  try {
    // Check if directory exists
    if (!fs.existsSync(docsDir)) {
      console.log(`📁 Creating directory: ${docsDir}`);
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    const files = fs.readdirSync(docsDir);
    console.log(`📚 Found ${files.length} documentation files`);

    if (files.length === 0) {
      console.log('⚠️  No files found in postgres_docs directory');
      console.log('   Place your documentation files (.txt, .md, .html) in the data/postgres_docs/ directory');
      return;
    }

    let totalChunks = 0;
    let processedChunks = 0;

    for (const file of files) {
      if (!file.match(/\.(txt|html|md)$/i)) {
        console.log(`⏭️  Skipping ${file} (unsupported format)`);
        continue;
      }
      
      console.log(`\n🔄 Processing ${file}...`);
      const filePath = path.join(docsDir, file);
      
      try {
        // Process the document using LangChain splitters
        const chunks = await processPostgresDoc(filePath);
        totalChunks += chunks.length;
        
        // Store chunks with embeddings
        for (const chunk of chunks) {
          try {
            const embedding = await generateEmbedding(chunk.content);
            
            // Use the main embeddings table instead of postgresDocEmbedding
            await prisma.embedding.create({
              data: {
                userId: 'system', // Use system user for postgres docs
                source: chunk.metadata.source,
                chunk: chunk.content,
                embedding: embedding,
                embedding_vec: `[${embedding.join(',')}]`,
                chunkIndex: chunk.metadata.chunkIndex,
                totalChunks: chunk.metadata.totalChunks,
                wordCount: chunk.metadata.wordCount,
                pageStart: chunk.page,
                chunkingConfig: {
                  contentType: chunk.metadata.hasTable ? 'table' : 'text',
                  section: chunk.section,
                  documentType: chunk.metadata.documentType,
                  hasTable: chunk.metadata.hasTable,
                  hasImage: chunk.metadata.hasImage,
                  source: chunk.metadata.source
                }
              }
            });
            
            processedChunks++;
            if (processedChunks % 10 === 0) {
              console.log(`✓ Processed ${processedChunks}/${totalChunks} chunks`);
            }
          } catch (error) {
            console.error(`❌ Error processing chunk from ${file}:`, error);
            // Continue with next chunk
          }
        }
        
        console.log(`✅ Completed ${file}: ${chunks.length} chunks processed`);
      } catch (error) {
        console.error(`❌ Error processing file ${file}:`, error);
        // Continue with next file
      }
    }
    
    console.log(`\n🎉 Ingestion complete!`);
    console.log(`📊 Total chunks processed: ${processedChunks}`);
    console.log(`📚 Files processed: ${files.filter(f => f.match(/\.(txt|html|md)$/i)).length}`);
    
  } catch (error) {
    console.error('❌ Fatal error during ingestion:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Check environment variables
if (!process.env.GOOGLE_API_KEY) {
  console.error('❌ GOOGLE_API_KEY environment variable is required');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

console.log('🚀 Starting PostgreSQL documentation ingestion with LangChain...');
console.log('📁 Looking for files in: data/postgres_docs/');
ingestPostgresDocs().catch(console.error);