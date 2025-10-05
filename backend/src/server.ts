import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { PrismaClient } from '../generated/prisma'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { corsConfig } from './config/cors'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import mammoth from 'mammoth'
import { z } from 'zod'
import fs from 'fs'
import { promises as fsPromises } from 'fs'
import { parsePDF } from './utils/pdfParser.js'

// ES Module path resolution
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import { createReadStream } from 'fs'
import { pipeline } from 'stream/promises'
import axios from 'axios'
import FormData from 'form-data'
import crypto from 'crypto'
// Services with LangChain integration
import { DocumentService } from './services/documentService'
import { RAGService } from './services/ragService'

// Types
interface User {
  id: string
  email: string
  role: string
  isDemo?: boolean
}

interface AuthenticatedRequest extends Request {
  user?: User
  isAuthenticated?: boolean
  isAdmin?: boolean
}

interface SambaNovaClient {
  chat: {
    completions: {
      create: (params: {
        model: string,
        messages: Array<{ role: 'system' | 'user' | 'assistant', content: string }>,
        temperature?: number,
        stream?: boolean
      }) => Promise<{ choices: Array<{ message: { role: string, content: string }, delta?: { content?: string } }> }>
    }
  }
}

// Simple demo credentials
const DEMO_ADMIN = {
  email: 'demo@admin.com',
  password: '123456',
  role: 'ADMIN'
}

// Simple session storage (in production, use Redis or database)
const sessions = new Map<string, { username: string, role: string, createdAt: number }>()

// Initialize Prisma first
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
})

// Track processing documents to prevent concurrent processing
const processingDocuments = new Map<string, { startTime: number, status: string }>()

// Initialize document services (after prisma)
const documentService = new DocumentService(prisma)

// Initialize enhanced RAG service (tuned)
const ragService = new RAGService(prisma, {
  // Retrieval window - using config defaults (maxResults: 20, similarityThreshold: 0.25)
  // maxResults and similarityThreshold will use config.retrieval values
  enableKeywordSearch: true,
  enableQueryExpansion: false,
  enableHybridSearch: true,

  // Reranking & adjustments
  enableReranking: true,
  keywordDensityWeight: 0.15,
  positionWeight: 0.07,
  sectionImportanceWeight: 0.12,
  exactMatchBoost: 0.2,
  narrativeBoost: 0.06,
  tocPenalty: 0.06,

  // Debug output
  debugRetrieval: true
})

// Memory-efficient PDF parsing function
async function parsePDFStream(filePath: string): Promise<string> {
  const CHUNK_SIZE = 1024 * 1024 // 1MB chunks
  const MAX_MEMORY_USAGE = 50 * 1024 * 1024 // 50MB max memory
  
  try {
    // First, try with streaming approach using pdf-parse with buffer chunks
    const stats = fs.statSync(filePath)
    const fileSize = stats.size
    
    if (fileSize > MAX_MEMORY_USAGE) {
      // For very large files, process in chunks
      return await parseLargePDFInChunks(filePath, fileSize)
    } else {
      // For smaller files, use optimized pdf-parse
      const buffer = fs.readFileSync(filePath)
      const data = await parsePDF(buffer)
      return data.text
    }
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Python PDF service integration
const PYTHON_PDF_SERVICE_URL = process.env.PYTHON_PDF_SERVICE_URL || 'http://localhost:8001'

interface TextBlock {
  text: string
  page_num: number
  block_num: number
  bbox: number[]
  block_type: string
  font_size: number
  font_flags: number
}

interface PythonParseResult {
  success: boolean
  full_text: string
  blocks: TextBlock[]
  page_count: number
  metadata: any
  error?: string
}

/**
 * Parse PDF using Python microservice with PyMuPDF for layout-aware extraction
 */
async function parsePdfWithPython(filePath: string): Promise<string> {
  try {
    console.log(`[PDF-Python] Sending ${filePath} to Python service at ${PYTHON_PDF_SERVICE_URL}`)
    
    // Create form data with the PDF file
    const form = new FormData()
    form.append('file', createReadStream(filePath))
    
    // Send to Python service
    const response = await axios.post(`${PYTHON_PDF_SERVICE_URL}/parse-pdf`, form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 120000, // 2 minutes timeout
      maxContentLength: 100 * 1024 * 1024, // 100MB max response
    })
    
    const result: PythonParseResult = response.data
    
    if (!result.success) {
      throw new Error(result.error || 'Python PDF service failed')
    }
    
    console.log(`[PDF-Python] Successfully parsed: ${result.page_count} pages, ${result.blocks.length} blocks, ${result.full_text.length} characters`)
    
    // Return the layout-aware full text
    return result.full_text
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Python PDF service is not running. Please start it with: uvicorn app:app --port 8001')
      } else if (error.response) {
        throw new Error(`Python PDF service error: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error('No response from Python PDF service')
      }
    }
    throw new Error(`PDF parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Function to handle very large PDFs by processing in memory-safe chunks
async function parseLargePDFInChunks(filePath: string, fileSize: number): Promise<string> {
  const CHUNK_SIZE = 10 * 1024 * 1024 // 10MB chunks for large files
  let extractedText = ''
  
  try {
    // For very large PDFs, we'll still need to load the whole file for pdf-parse
    // but we can optimize memory usage and add better error handling
    console.log(`[PDF] Processing large PDF (${(fileSize / 1024 / 1024).toFixed(1)}MB) with optimized settings`)
    
    const buffer = fs.readFileSync(filePath)
    
    // Use pdf-parse with basic settings
    const data = await parsePDF(buffer)
    
    return data.text
  } catch (error) {
    throw new Error(`Large PDF processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Static demo token that survives restarts and avoids 401s in demo mode
const DEMO_TOKEN = 'demo-token'

// Initialize Express app
const app = express()

// Apply CORS configuration
app.use(cors(corsConfig));

// Enable pre-flight requests for all routes
app.options('*', cors());

app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))

app.use((req: Request, res: Response, next: NextFunction) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  })
  next()
})

// ensure uploads directory exists
const uploadsDir = path.join(path.dirname(__dirname), 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

// multer storage & upload middleware
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const safe = Date.now() + '-' + file.originalname.replace(/\s+/g, '_')
      cb(null, safe)
    }
  }),
  limits: { 
    fileSize: 100 * 1024 * 1024, // Increased to 100 MB for large PDFs
    fieldSize: 100 * 1024 * 1024 // Also increase field size limit
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const allowedExts = new Set([
      // docs
      '.pdf', '.docx', '.txt', '.md',
      // data
      '.csv', '.tsv', '.json', '.sql',
      // code
      '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx',
      '.py', '.java', '.go', '.rb', '.php', '.c', '.cpp', '.h', '.hpp', '.cs', '.rs', '.sh',
      // config/text
      '.yml', '.yaml'
    ])
    cb(null, allowedExts.has(ext))
  }
})

// Utility functions
async function ensurePgVector(): Promise<void> {
  try {
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS vector`
    await prisma.$executeRaw`ALTER TABLE "Embedding" ADD COLUMN IF NOT EXISTS embedding_vec vector(768)`
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS embedding_vec_ivfflat_idx ON "Embedding" USING ivfflat (embedding_vec vector_cosine_ops) WITH (lists = 100)`
    console.log('pgvector setup completed successfully')
  } catch (e) {
    console.warn('pgvector setup failed:', (e as Error)?.message)
  }
}

// Resolve demo user id so FK inserts succeed
let DEMO_USER_ID = 'demo-admin-user'
async function resolveDemoUserId(): Promise<void> {
  try {
    const existing = await prisma.user.findUnique({ where: { email: DEMO_ADMIN.email } })
    if (existing?.id) {
      DEMO_USER_ID = existing.id
      return
    }

    const created = await prisma.user.create({
      data: {
        email: DEMO_ADMIN.email,
        passwordHash: 'demo', // Simple demo hash
        role: 'ADMIN',
        isVerified: true,
      }
    })
    DEMO_USER_ID = created.id
  } catch (e) {
    console.warn('Failed to resolve demo user id:', (e as Error)?.message)
  }
}

// Fast fallback timeouts (env overrideable)
const CHAT_EMBED_TIMEOUT_MS = Number(process.env.CHAT_EMBED_TIMEOUT_MS || 10000)
const CHAT_LLM_TIMEOUT_MS = Number(process.env.CHAT_LLM_TIMEOUT_MS || 15000)
const SAMBA_MODEL = process.env.SAMBA_MODEL || 'Llama-4-Maverick-17B-128E-Instruct'

// PDF processing timeouts
const PDF_PARSE_TIMEOUT_MS = Number(process.env.PDF_PARSE_TIMEOUT_MS || 60000) // 60 seconds for large PDFs
const MAX_PDF_SIZE_MB = Number(process.env.MAX_PDF_SIZE_MB || 50) // 50MB default limit

function generateFastFallback(userMessage: string, context: string): string {
  const trimmed = userMessage.trim()
  const base = trimmed ? `You asked: "${trimmed.slice(0, 240)}".` : 'I did not receive a question.'
  const ctxNote = context ? ' I may use your indexed notes for better answers when available.' : ''
  return `${base} I'm temporarily responding without an AI provider.${ctxNote} Try again in a moment.`
}

function extractAiAnswer(aiResponse: any): string {
  try {
    if (!aiResponse) return ''
    if (typeof aiResponse === 'string') return aiResponse

    const content = (aiResponse as any)?.content
    if (typeof content === 'string') return content
    if (Array.isArray(content)) {
      const joined = content
        .map((part: any) => {
          if (typeof part === 'string') return part
          if (typeof part?.text === 'string') return part.text
          if (typeof part?.content === 'string') return part.content
          return ''
        })
        .join('')
      if (joined.trim()) return joined
    }

    // LangChain generations shape
    const generationsText = (aiResponse as any)?.generations?.[0]?.[0]?.text || (aiResponse as any)?.generations?.[0]?.text
    if (typeof generationsText === 'string' && generationsText.trim()) return generationsText

    // Google SDK raw candidate shape
    const parts = (aiResponse as any)?.response?.candidates?.[0]?.content?.parts
    if (Array.isArray(parts)) {
      const raw = parts.map((p: any) => p?.text || '').join('')
      if (raw.trim()) return raw
    }

    // Fallback: JSON stringify small snapshot
    const str = JSON.stringify(aiResponse)
    if (str && str.length < 400) return str
    return ''
  } catch {
    return ''
  }
}

// Initialize database tasks (run before server starts)
async function initializeStartup(): Promise<void> {
  await ensurePgVector()
  await resolveDemoUserId()

  // Preload and process official PostgreSQL system document before listening
  try {
    const sysDocPath = path.join(path.dirname(__dirname), 'system-documents', 'postgresql', 'postgresql-17-A4.pdf')
    if (fs.existsSync(sysDocPath)) {
      console.log('[Startup] Ensuring system PostgreSQL doc is processed...')

      // Hash file to deduplicate
      const dataBuffer = fs.readFileSync(sysDocPath)
      const contentHash = crypto.createHash('sha256').update(dataBuffer).digest('hex')

      const existing = await prisma.document.findUnique({ where: { contentHash } })
      if (!existing) {
        const result = await documentService.uploadDocumentFromFile(
          DEMO_USER_ID,
          sysDocPath,
          'postgresql-17-A4.pdf',
          'application/pdf',
          undefined,
          true // isSystemDocument
        )
        console.log('[Startup] System doc queued for processing:', result)
      } else {
        // If exists but embeddings are missing, requeue
        const embCount = await prisma.embedding.count({ where: { documentId: existing.id } })
        if (embCount === 0 || existing.status !== 'COMPLETED') {
          console.log('[Startup] System doc exists but not fully processed. Re-queueing...')
          await prisma.document.update({
            where: { id: existing.id },
            data: { status: 'PENDING', processedChunks: 0, processingError: null, startedAt: null, completedAt: null }
          })
          // Restart processing from path
          // Note: DocumentService resume will pick it up as system doc by path
          await documentService.resumePendingProcessing()
        } else {
          console.log('[Startup] System doc already processed; skipping.')
        }
      }
    } else {
      console.warn('[Startup] System PostgreSQL doc not found at expected path:', sysDocPath)
    }
  } catch (e) {
    console.warn('[Startup] Failed ensuring system doc:', (e as Error)?.message)
  }

  // Resume any pending document processing
  await documentService.resumePendingProcessing().catch(console.error)
}

// Legacy background processing function - now handled by DocumentService
// This function is kept for backward compatibility but is no longer used

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true
        reject(new Error('timeout'))
      }
    }, ms)

    promise.then(value => {
      if (!settled) {
        settled = true
        clearTimeout(timeout)
        resolve(value)
      }
    }).catch(error => {
      if (!settled) {
        settled = true
        clearTimeout(timeout)
        reject(error)
      }
    })
  })
}

function cosineSimilarity(a: number[], b: number[]): number {
  const minLen = Math.min(a.length, b.length)
  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < minLen; i++) {
    const aVal = a[i]
    const bVal = b[i]
    if (aVal !== undefined && bVal !== undefined) {
      dot += aVal * bVal
      normA += aVal * aVal
      normB += bVal * bVal
    }
  }

  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Legacy chunking function removed - now using LangChain splitters

// Generate simple session token
function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Clean expired sessions
function cleanExpiredSessions(): void {
  const now = Date.now()
  const oneHour = 60 * 60 * 1000
  
  for (const [token, session] of sessions.entries()) {
    if (now - session.createdAt > oneHour) {
      sessions.delete(token)
    }
  }
}

// Clean sessions every 10 minutes
setInterval(cleanExpiredSessions, 10 * 60 * 1000)

// Async handler wrapper
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// SambaNova client using REST API compatible with OpenAI-style /v1/chat/completions
async function getSambaClient(): Promise<SambaNovaClient> {
  const apiKey = process.env.SAMBANOVA_API_KEY
  if (!apiKey) throw new Error('SAMBANOVA_API_KEY is required')

  const baseURL = process.env.SAMBANOVA_BASE_URL || 'https://api.sambanova.ai/v1'
  return {
    chat: {
      completions: {
        create: async (params) => {
          const resp = await axios.post(
            `${baseURL}/chat/completions`,
            {
              model: params.model,
              messages: params.messages,
              temperature: params.temperature ?? 0.7,
              stream: false
            },
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
              },
              timeout: CHAT_LLM_TIMEOUT_MS
            }
          )
          return resp.data
        }
      }
    }
  }
}

// Auth middleware with demo token support
function auth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    res.status(401).json({ error: 'Unauthorized - No token provided' })
    return
  }

  // Handle demo token
  if (token === DEMO_TOKEN) {
    // Set demo admin session properties
    (req as AuthenticatedRequest).user = {
      id: DEMO_USER_ID,
      email: DEMO_ADMIN.email,
      role: DEMO_ADMIN.role,
      isDemo: true
    };
    (req as AuthenticatedRequest).isAuthenticated = true;
    (req as AuthenticatedRequest).isAdmin = true;
    next();
    return;
  }

  // Regular JWT session handling for non-demo tokens
  const session = sessions.get(token)
  if (!session) {
    res.status(401).json({ error: 'Invalid session token' })
    return
  }

  // Check if session is expired (1 hour)
  const oneHour = 60 * 60 * 1000
  if (token !== DEMO_TOKEN) {
    if (Date.now() - session.createdAt > oneHour) {
      sessions.delete(token)
      res.status(401).json({ error: 'Session expired' })
      return
    }
  }

  const authReq = req as AuthenticatedRequest
  authReq.isAuthenticated = true
  authReq.isAdmin = session.role === 'ADMIN'
  next()
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthenticatedRequest
  if (!authReq.isAdmin) {
    res.status(403).json({ error: 'Forbidden: Admins only' })
    return
  }
  next()
}

// --- Simple Demo Auth Routes ---
app.post('/auth/login', asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({ 
    email: z.string().email(), 
    password: z.string() 
  })
  
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const { email, password } = parsed.data

  // Simple demo admin check
  if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
    const token = DEMO_TOKEN
    sessions.set(token, {
      username: DEMO_ADMIN.email,
      role: DEMO_ADMIN.role,
      createdAt: Date.now()
    })

    res.json({ 
      accessToken: token,
      token: token, // Keep both for compatibility
      role: DEMO_ADMIN.role,
      message: 'Demo admin login successful' 
    })
  } else {
    // Try to find user in database for proper authentication
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (user && user.passwordHash === 'demo') {
        // This is the demo user created by seed script
        const token = DEMO_TOKEN
        sessions.set(token, {
          username: user.email,
          role: user.role,
          createdAt: Date.now()
        })

        res.json({ 
          accessToken: token,
          token: token,
          role: user.role,
          message: 'Login successful' 
        })
      } else {
        res.status(401).json({ error: 'Invalid credentials' })
      }
    } catch (error) {
      console.error('Database auth error:', error)
      res.status(401).json({ error: 'Invalid credentials' })
    }
  }
}))

app.get('/auth/whoami', auth, asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest
  res.json({
    user: {
      email: DEMO_ADMIN.email,
      role: DEMO_ADMIN.role,
      id: DEMO_USER_ID
    }
  })
}))

app.post('/auth/refresh', asyncHandler(async (req: Request, res: Response) => {
  // For the simplified demo, we don't support refresh tokens
  // Just return 401 to trigger re-login
  res.status(401).json({ error: 'Refresh not supported in demo mode' })
}))

app.post('/auth/logout', asyncHandler(async (req: Request, res: Response) => {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  
  if (token) {
    sessions.delete(token)
  }
  
  res.json({ message: 'Logged out successfully' })
}))

// Simple demo user ID for all operations (resolved during startup)

// --- Note CRUD ---
app.get('/notes', auth, asyncHandler(async (req: Request, res: Response) => {
  const notes = await prisma.note.findMany({
    where: { userId: DEMO_USER_ID }
  })
  res.json(notes)
}))

app.get('/notes/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const note = await prisma.note.findFirst({
    where: { id: req.params.id, userId: DEMO_USER_ID }
  })

  if (!note) {
    return res.status(404).json({ error: 'Not found' })
  }

  res.json(note)
}))

app.post('/notes', auth, asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    document: z.string(),
    page: z.number().int().nonnegative(),
    content: z.string()
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const note = await prisma.note.create({
    data: { userId: DEMO_USER_ID, ...parsed.data }
  })

  res.status(201).json(note)
}))

app.put('/notes/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    document: z.string().optional(),
    page: z.number().int().nonnegative().optional(),
    content: z.string().optional()
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const existing = await prisma.note.findFirst({
    where: { id: req.params.id, userId: DEMO_USER_ID }
  })

  if (!existing) {
    return res.status(404).json({ error: 'Not found' })
  }

  const note = await prisma.note.update({
    where: { id: req.params.id },
    data: parsed.data
  })

  res.json(note)
}))

app.delete('/notes/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.note.findFirst({
    where: { id: req.params.id, userId: DEMO_USER_ID }
  })

  if (!existing) {
    return res.status(404).json({ error: 'Not found' })
  }

  await prisma.note.delete({ where: { id: req.params.id } })
  res.status(204).end()
}))

// --- Progress CRUD ---
app.get('/progress', auth, asyncHandler(async (req: Request, res: Response) => {
  const rows = await prisma.progress.findMany({
    where: { userId: DEMO_USER_ID }
  })
  res.json(rows)
}))

app.get('/progress/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const row = await prisma.progress.findFirst({
    where: { id: req.params.id, userId: DEMO_USER_ID }
  })

  if (!row) {
    return res.status(404).json({ error: 'Not found' })
  }

  res.json(row)
}))

app.post('/progress', auth, asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    document: z.string(),
    pagesRead: z.number().int().min(0).optional(),
    minutes: z.number().int().min(0).optional(),
    date: z.string().datetime().optional()
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const row = await prisma.progress.create({
    data: { userId: DEMO_USER_ID, ...parsed.data }
  })

  res.status(201).json(row)
}))

app.put('/progress/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    document: z.string().optional(),
    pagesRead: z.number().int().min(0).optional(),
    minutes: z.number().int().min(0).optional(),
    date: z.string().datetime().optional()
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const existing = await prisma.progress.findFirst({
    where: { id: req.params.id, userId: DEMO_USER_ID }
  })

  if (!existing) {
    return res.status(404).json({ error: 'Not found' })
  }

  const row = await prisma.progress.update({
    where: { id: req.params.id },
    data: parsed.data
  })

  res.json(row)
}))

app.delete('/progress/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.progress.findFirst({
    where: { id: req.params.id, userId: DEMO_USER_ID }
  })

  if (!existing) {
    return res.status(404).json({ error: 'Not found' })
  }

  await prisma.progress.delete({ where: { id: req.params.id } })
  res.status(204).end()
}))

// --- Embedding CRUD ---
app.get('/embeddings', auth, asyncHandler(async (req: Request, res: Response) => {
  const rows = await prisma.embedding.findMany({
    where: { userId: DEMO_USER_ID }
  })
  res.json(rows)
}))

app.get('/embeddings/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const row = await prisma.embedding.findFirst({
    where: { id: req.params.id, userId: DEMO_USER_ID }
  })

  if (!row) {
    return res.status(404).json({ error: 'Not found' })
  }

  res.json(row)
}))

app.post('/embeddings', auth, asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    source: z.string(),
    chunk: z.string(),
    embedding: z.array(z.number())
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const row = await prisma.embedding.create({
    data: { userId: DEMO_USER_ID, ...parsed.data }
  })

  res.status(201).json(row)
}))

app.put('/embeddings/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    source: z.string().optional(),
    chunk: z.string().optional(),
    embedding: z.array(z.number()).optional()
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const existing = await prisma.embedding.findFirst({
    where: { id: req.params.id, userId: DEMO_USER_ID }
  })

  if (!existing) {
    return res.status(404).json({ error: 'Not found' })
  }

  const row = await prisma.embedding.update({
    where: { id: req.params.id },
    data: parsed.data
  })

  res.json(row)
}))

app.delete('/embeddings/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.embedding.findFirst({
    where: { id: req.params.id, userId: DEMO_USER_ID }
  })

  if (!existing) {
    return res.status(404).json({ error: 'Not found' })
  }

  await prisma.embedding.delete({ where: { id: req.params.id } })
  res.status(204).end()
}))

// --- File Upload & Processing ---
app.post('/files/upload', auth, upload.single('file'), asyncHandler(async (req: Request, res: Response) => {
  const file = req.file
  if (!file) {
    return res.status(400).json({ error: 'No file provided' })
  }

  const ext = path.extname(file.originalname).toLowerCase()
  let text = ''

  try {
    switch (ext) {
      case '.pdf': {
        // Check file size before processing
        const stats = fs.statSync(file.path)
        const fileSizeMB = stats.size / (1024 * 1024)
        
        if (fileSizeMB > MAX_PDF_SIZE_MB) {
          return res.status(413).json({ 
            error: `PDF file too large (${fileSizeMB.toFixed(1)}MB). Maximum size is ${MAX_PDF_SIZE_MB}MB.`,
            maxSize: MAX_PDF_SIZE_MB,
            actualSize: fileSizeMB
          })
        }
        
        console.log(`[PDF] Processing ${file.originalname} (${fileSizeMB.toFixed(1)}MB)`)
        
        try {
          // Use document service with LangChain chunking (path-based to avoid UTF-8 corruption)
          console.log(`[PDF] Processing with LangChain chunking (path-based)...`)

          const result = await documentService.uploadDocumentFromFile(
            DEMO_USER_ID,
            file.path,
            file.originalname,
            file.mimetype
          )
          
          console.log(`[PDF] Processing completed:`, { 
            documentId: result.documentId, 
            status: result.status,
            isDuplicate: result.isDuplicate
          })
          
          return res.json({
            message: 'PDF processed successfully with LangChain chunking',
            filename: file.originalname,
            documentId: result.documentId,
            status: result.status,
            isDuplicate: result.isDuplicate,
            chunkingType: 'langchain-enhanced',
            note: `✅ Successfully processed with PostgreSQL-aware chunking`
          })
          
        } catch (pdfError) {
          const errorMessage = pdfError instanceof Error ? pdfError.message : 'Unknown error'
          console.error(`[PDF] Enhanced processing failed for ${file.originalname}:`, errorMessage)
          
          // Fallback to regular PDF processing
          console.log(`[PDF] Falling back to regular PDF processing...`)
          text = await withTimeout(
            parsePdfWithPython(file.path),
            PDF_PARSE_TIMEOUT_MS
          )
          
          if (!text || text.trim().length === 0) {
            throw new Error('No text content extracted from PDF')
          }
          
          console.log(`[PDF] Fallback extraction: ${text.length} characters`)
        }
        break
      }
      case '.docx': {
        const { value } = await mammoth.extractRawText({ path: file.path })
        text = value
        break
      }
      case '.txt':
      case '.md':
      case '.csv':
      case '.tsv':
      case '.json':
      case '.sql':
      case '.js':
      case '.mjs':
      case '.cjs':
      case '.ts':
      case '.tsx':
      case '.jsx':
      case '.py':
      case '.java':
      case '.go':
      case '.rb':
      case '.php':
      case '.c':
      case '.cpp':
      case '.h':
      case '.hpp':
      case '.cs':
      case '.rs':
      case '.sh':
      case '.yml':
      case '.yaml': {
        text = fs.readFileSync(file.path, 'utf8')
        break
      }
      default: {
        // Fallback: treat unknown text-like mimetypes as UTF-8 if mimetype hints text
        if ((file.mimetype || '').startsWith('text/')) {
          text = fs.readFileSync(file.path, 'utf8')
          break
        }
        return res.status(400).json({ error: 'Unsupported file type. Supported: .pdf, .docx, .txt, .md, .csv, .tsv, .json, .sql, common code files (.js, .ts, .py, .java, .go, .rb, .php, .c, .cpp, .cs, .rs), and .yml/.yaml' })
      }
    }
  } finally {
    // Clean up uploaded file
    fs.unlink(file.path, (err) => {
      if (err) console.warn('Failed to delete temp file:', err.message)
    })
  }

  if (!text.trim()) {
    return res.status(400).json({ error: 'No text content found in file' })
  }

  // For non-PDF text-like files, use text already extracted
  const filename = file.originalname;
  const fileSize = text.length;

  console.log(`[Upload] Processing ${filename} (${fileSize} chars) with Enhanced DocumentService`);

  try {
    const result = await documentService.uploadDocument(
      DEMO_USER_ID,
      filename,
      filename,
      text,
      file.mimetype
    );

    const estimatedChunks = Math.ceil(fileSize / 1000);
    const estimatedTime = Math.min(estimatedChunks * 100, 30000);

    res.json({
      message: 'Document processed successfully with enhanced LangChain chunking',
      filename: filename,
      documentId: result.documentId,
      status: result.status,
      isDuplicate: result.isDuplicate,
      estimatedProcessingTime: `${Math.round(estimatedTime / 1000)}s`,
      chunkingType: 'langchain-enhanced',
      note: `✅ Successfully processed with PostgreSQL-aware chunking`
    });

  } catch (error) {
    console.error(`[Upload] Enhanced DocumentService error for ${filename}:`, error);
    res.status(500).json({
      error: 'Failed to process document with enhanced chunking',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}))

// --- Document Management Routes ---
app.get('/documents', auth, asyncHandler(async (req: Request, res: Response) => {
  const documents = await documentService.getUserDocuments(DEMO_USER_ID);
  res.json({ documents });
}))

app.get('/documents/system', auth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const systemDocuments = await prisma.document.findMany({
      where: {
        isSystemDocument: true
      },
      include: {
        embeddings: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json({ documents: systemDocuments });
  } catch (error) {
    console.error('Error fetching system documents:', error);
    res.status(500).json({ 
      error: 'Failed to fetch system documents',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}))

app.get('/documents/:documentId/status', auth, asyncHandler(async (req: Request, res: Response) => {
  const { documentId } = req.params;
  const status = await documentService.getDocumentStatus(documentId);
  
  if (!status) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  res.json(status);
}))

app.get('/documents/:documentId/chunk-stats', auth, asyncHandler(async (req: Request, res: Response) => {
  const { documentId } = req.params;
  
  try {
    const stats = await documentService.getChunkStatistics(documentId);
    res.json(stats);
  } catch (error) {
    console.error(`[ChunkStats] Error getting chunk statistics for ${documentId}:`, error);
    res.status(500).json({
      error: 'Failed to get chunk statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}))

app.get('/documents/:documentId/chunks/:contentType', auth, asyncHandler(async (req: Request, res: Response) => {
  const { documentId, contentType } = req.params;
  const limit = parseInt(req.query.limit as string) || 10;
  
  try {
    const chunks = await documentService.searchChunksByContentType(
      documentId, 
      contentType as any, 
      limit
    );
    res.json({ chunks, count: chunks.length });
  } catch (error) {
    console.error(`[ChunksByType] Error searching chunks for ${documentId} by type ${contentType}:`, error);
    res.status(500).json({
      error: 'Failed to search chunks by content type',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}))

app.delete('/documents/:documentId', auth, asyncHandler(async (req: Request, res: Response) => {
  const { documentId } = req.params;
  
  try {
    // First, check if document exists and belongs to user
    const document = await prisma.document.findFirst({
      where: { 
        id: documentId,
        userId: DEMO_USER_ID 
      }
    });
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Delete all associated embeddings first (cascade should handle this, but being explicit)
    const embeddingDeleteResult = await prisma.embedding.deleteMany({
      where: { documentId }
    });
    
    // Delete the document
    await prisma.document.delete({
      where: { id: documentId }
    });
    
    console.log(`[DocumentDelete] Deleted document ${documentId} and ${embeddingDeleteResult.count} associated embeddings`);
    
    res.json({ 
      message: 'Document deleted successfully',
      deletedEmbeddings: embeddingDeleteResult.count,
      documentId 
    });
    
  } catch (error) {
    console.error(`[DocumentDelete] Error deleting document ${documentId}:`, error);
    res.status(500).json({ 
      error: 'Failed to delete document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}))

app.delete('/documents/:documentId/cancel', auth, asyncHandler(async (req: Request, res: Response) => {
  const { documentId } = req.params;
  const success = await documentService.cancelProcessing(documentId);
  
  if (success) {
    res.json({ message: 'Processing cancelled successfully', success: true });
  } else {
    res.status(404).json({ error: 'Document not found or not cancellable', success: false });
  }
}))

// Legacy processing status routes (for backward compatibility)
app.get('/processing/status', auth, asyncHandler(async (req: Request, res: Response) => {
  const activeProcessing = Array.from(processingDocuments.entries()).map(([key, info]) => ({
    documentKey: key,
    status: info.status,
    startTime: info.startTime,
    duration: Date.now() - info.startTime,
    durationMinutes: Math.round((Date.now() - info.startTime) / 60000)
  }))

  res.json({
    activeProcessing,
    totalActive: activeProcessing.length
  })
}))

app.delete('/processing/stop/:documentKey', auth, asyncHandler(async (req: Request, res: Response) => {
  const { documentKey } = req.params
  
  if (processingDocuments.has(documentKey)) {
    processingDocuments.delete(documentKey)
    res.json({ 
      message: `Processing stopped for ${documentKey}`,
      success: true 
    })
  } else {
    res.status(404).json({ 
      error: `No active processing found for ${documentKey}`,
      success: false 
    })
  }
}))

// --- AI Chat Routes ---
app.post('/ai/chat', auth, asyncHandler(async (req: Request, res: Response) => {
  console.log(`[ai/chat] Starting chat request processing`)
  const startTime = Date.now()

  const schema = z.object({
    messages: z.array(z.object({
      role: z.string(),
      content: z.string()
    }))
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    console.warn(`[ai/chat] Invalid payload: ${JSON.stringify(parsed.error)}`)
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const userMessage = [...parsed.data.messages]
    .reverse()
    .find(m => m.role === 'user')?.content || ''

  if (!userMessage.trim()) {
    console.warn(`[ai/chat] Empty user message`)
    return res.status(400).json({ error: 'No user message found' })
  }

  console.log(`[ai/chat] Processing user message: "${userMessage.slice(0, 100)}${userMessage.length > 100 ? '...' : ''}"`)

  let context = ''
  const contextParts: { source?: string, chunk: string, score?: number, method?: string }[] = []
  let ragResult: any = null
  
  // Use enhanced RAG service with hybrid search
  const ragStartTime = Date.now()
  try {
    console.log(`[ai/chat] Starting RAG retrieval...`)
    ragResult = await withTimeout(
      ragService.retrieveContext(userMessage, DEMO_USER_ID), 
      CHAT_EMBED_TIMEOUT_MS
    )
    
    context = ragResult.context
    ragResult.results.forEach((r: any) => contextParts.push({ 
      source: r.source, 
      chunk: r.chunk,
      score: r.score,
      method: r.method
    }))
    
    // Enhanced debug logging
    console.log(`[ai/chat] RAG Retrieval Success:
- Query: "${userMessage}"
- Methods Used: ${ragResult.results.map((r: any) => r.method).join(', ')}
- Results Found: ${ragResult.results.length}
- Top Keywords: ${ragResult.debug.keywords.join(', ')}
- Processing Time: ${Date.now() - ragStartTime}ms
- Sources: ${ragResult.results.map((r: any) => r.source).filter(Boolean).join(', ')}`)
    
    // Log individual chunk details
    ragResult.results.slice(0, 5).forEach((r: any, i: number) => {
      const meta: any = r.metadata || {}
      const section = meta?.section || meta?.Header_1 || meta?.Header_2 || meta?.Header_3 || 'n/a'
      console.log(`[ai/chat] Top${i + 1}:
 - Method: ${r.method}
 - Score: ${r.score?.toFixed(4) || 'N/A'} Final: ${(r as any).finalScore?.toFixed?.(4) || 'N/A'}
 - Source: ${r.source || 'unknown'} Page: ${meta?.pageNumber ?? meta?.loc?.pageNumber ?? 'n/a'} Section: ${section} Index: ${r.chunkIndex ?? 'n/a'}
 - contentType: ${meta?.contentType ?? 'n/a'} sqlKeywords: ${Array.isArray(meta?.sqlKeywords) ? meta.sqlKeywords.slice(0,5).join(',') : 'n/a'}
 - Preview: ${r.chunk.substring(0, 140).replace(/\n/g, ' ')}...`)
    })
    
  } catch (err) {
    console.error(`[ai/chat] Enhanced RAG retrieval failed after ${Date.now() - ragStartTime}ms:`, err)
    console.log(`[ai/chat] Attempting fallback retrieval...`)
    
    // Fallback to simple recent chunks
    try {
      const recent = await prisma.embedding.findMany({
        where: { userId: DEMO_USER_ID },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { chunk: true, source: true }
      })
      if (recent.length > 0) {
        recent.forEach(r => contextParts.push({ source: r.source, chunk: r.chunk }))
        context = recent.map(r => `[${r.source}]\n${r.chunk}`).join('\n\n')
        console.log(`[ai/chat] Fallback retrieval succeeded with ${recent.length} recent chunks`)
      }
    } catch (fallbackErr) {
      console.error('Fallback context retrieval failed:', fallbackErr)
      context = ''
    }
  }

  // Last-resort fallback: if context is still empty, pull the most recent chunks
  if (!context.trim()) {
    console.log(`[ai/chat] No context found, attempting last-resort retrieval...`)
    try {
      const recent = await prisma.embedding.findMany({
        where: { userId: DEMO_USER_ID },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { chunk: true, source: true }
      })
      if (recent.length > 0) {
        recent.forEach(r => contextParts.push({ source: r.source, chunk: r.chunk }))
        context = recent.map(r => `[${r.source}]\n${r.chunk}`).join('\n\n')
        console.log(`[ai/chat] Last-resort retrieval succeeded with ${recent.length} chunks`)
      } else {
        console.warn(`[ai/chat] Last-resort retrieval found no chunks`)
      }
    } catch (e) {
      console.error('Final context fallback failed:', e)
    }
  }

  // Log final context stats
  console.log(`[ai/chat] Context preparation complete:
- Length: ${context.length} chars
- Sources: ${contextParts.map(p => p.source).filter(Boolean).slice(0,3).join(', ')}
- Parts: ${contextParts.length}
- Retrieval Time: ${Date.now() - ragStartTime}ms`)

  // If key missing, return fast fallback (retrieval still may work without provider)
  if (!process.env.SAMBANOVA_API_KEY) {
    console.warn(`[ai/chat] No Google API key found, using fallback response`)
    const fallback = generateFastFallback(userMessage, context)
    return res.json({ answer: fallback })
  }

  // LLM processing
  const llmStartTime = Date.now()
  try {
    console.log(`[ai/chat] Initializing SambaNova LLM with model: ${SAMBA_MODEL}`)
    const samba = await getSambaClient()
    console.log(`[ai/chat] Sending request to SambaNova (timeout: ${CHAT_LLM_TIMEOUT_MS}ms)`) 
    console.log(`[ai/chat] Using embeddings provider: google (text-embedding-004)`)
    const completion = await withTimeout(samba.chat.completions.create({
      model: SAMBA_MODEL,
      messages: [
      {
        role: 'system',
        content: `You are a PostgreSQL documentation assistant. Answer using ONLY the provided CONTEXT.

MANDATORY CITATION FORMAT:
The CONTEXT includes markers like [Page X] and section names. For EVERY factual statement, cite using this exact format:
[Page X, Section: Y]

Examples:
✓ CORRECT: "A primary key uniquely identifies each row [Page 107, Section: Table Constraints]."
✓ CORRECT: "Use CREATE TABLE to define a new table [Page 97, Section: Creating a New Table]."
✗ WRONG: "A primary key uniquely identifies each row. [Page 107]"
✗ WRONG: "A primary key uniquely identifies each row."

CITATION PLACEMENT:
- Place citations immediately after each fact
- If section name is unavailable in context, use [Page X only]
- Cite the most specific page where information appears
- Do not group all citations at the end

WHEN CONTEXT IS INSUFFICIENT:
Say exactly: "This specific topic is not covered in the provided context. The PostgreSQL documentation may contain this information in a different section."

NEVER say: "suggest uploading", "upload a document", or "I need more context"

FORMAT RULES:
- Be concise and technically precise
- Include SQL code examples when relevant (use fenced code blocks)
- Every claim needs [Page X, Section: Y]
- Use bullet points only when listing 3+ items
- Do not fabricate facts that are not present in CONTEXT
`
      },
        {
          role: 'user',
          content: `CONTEXT:\n${context}\n\nQUESTION: ${userMessage}`
        }
      ],
      temperature: 0.7
    }), CHAT_LLM_TIMEOUT_MS)

    const llmTime = Date.now() - llmStartTime
    console.log(`[ai/chat] LLM response received:
- Generation provider: SambaNova
- Processing Time: ${llmTime}ms
- Status: Success`)
    let answer = completion?.choices?.[0]?.message?.content || 'I could not generate a response.'

    // Citations disabled by request

    // Log final stats
    console.log(`[ai/chat] Request complete:
- Total Time: ${Date.now() - startTime}ms
- RAG Time: ${ragStartTime - startTime}ms
- LLM Time: ${llmTime}ms
- Answer Length: ${answer.length} chars`)

    res.json({ answer })
  } catch (err) {
    console.error(`[ai/chat] LLM processing failed after ${Date.now() - llmStartTime}ms:`, err)
    const fallback = generateFastFallback(userMessage, context)
    res.json({ answer: fallback })
  }
}))

// Compatibility route for older frontend paths
app.post('/postgres-docs/chat', auth, (req: Request, res: Response) => {
  // Preserve method and body for POST
  res.redirect(307, '/ai/chat')
})

// --- System Document PDF serving (protected) ---
app.get('/system-docs/:filename', auth, asyncHandler(async (req: Request, res: Response) => {
  const filename = req.params.filename
  try {
    // Validate exists in DB as system document
    const doc = await prisma.document.findFirst({
      where: { isSystemDocument: true, filename }
    })
    if (!doc) {
      res.status(404).json({ error: 'System document not found' })
      return
    }

    const filePath = path.join(path.dirname(__dirname), 'system-documents', 'postgresql', filename)
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'File not found on disk' })
      return
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Cache-Control', 'no-cache')
    const stream = createReadStream(filePath)
    stream.on('error', () => res.status(500).end())
    await pipeline(stream, res)
  } catch (e) {
    res.status(500).json({ error: 'Failed to serve system document' })
  }
}))

app.post('/ai/chat-sambanova', auth, asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    messages: z.array(z.object({
      role: z.string(),
      content: z.string()
    }))
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const userMessage = [...parsed.data.messages]
    .reverse()
    .find(m => m.role === 'user')?.content || ''

  if (!userMessage.trim()) {
    return res.status(400).json({ error: 'No user message found' })
  }

  // Retrieve relevant context
  let context = ''
  if (process.env.GOOGLE_API_KEY) {
    try {
      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        modelName: 'text-embedding-004'
      })

      const queryEmb = await withTimeout(embeddings.embedQuery(userMessage), 5000)
      const vec = `[${queryEmb.join(',')}]`

      const rows = await prisma.$queryRaw<{ chunk: string }[]>`
        SELECT chunk FROM "Embedding"
        ORDER BY embedding_vec <=> ${vec}::vector
        LIMIT 3`

      context = rows.map(r => r.chunk).join('\n\n')
    } catch (err) {
      console.warn('RAG disabled (retrieval failed):', (err as Error)?.message)
      context = ''
    }
  }

  const samba = await getSambaClient()
  const completion = await withTimeout(samba.chat.completions.create({
    model: SAMBA_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant grounded in the user\'s documents. Use the provided CONTEXT to answer succinctly and accurately. If the context is insufficient, say so.'
      },
      {
        role: 'user',
        content: `CONTEXT:\n${context}\n\nQUESTION: ${userMessage}`
      },
    ],
    temperature: 0.7,
  }), 20000)

  const answer = completion?.choices?.[0]?.message?.content || ''
  res.json({ answer })
}))

// Debug endpoint for RAG retrieval testing
app.post('/ai/debug-rag', auth, asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    queries: z.array(z.string()).optional().default([
      "Where was Aryabhata born?",
      "Tell me about Aryabhata",
      "Aryabhata birth place",
      "Kusumapura",
      "476 CE"
    ])
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const results = []
  
  for (const query of parsed.data.queries) {
    try {
      const ragResult = await ragService.retrieveContext(query, DEMO_USER_ID)
      
      results.push({
        query,
        success: true,
        resultsCount: ragResult.results.length,
        methods: ragResult.results.map(r => r.method),
        chunkIndexes: ragResult.results.map(r => r.chunkIndex).filter(idx => idx !== null),
        scores: ragResult.results.map(r => r.score),
        debug: ragResult.debug,
        preview: ragResult.results.slice(0, 2).map(r => ({
          method: r.method,
          score: r.score,
          chunkIndex: r.chunkIndex,
          preview: r.chunk.substring(0, 150) + '...'
        }))
      })
    } catch (error) {
      results.push({
        query,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  res.json({
    message: 'RAG debugging completed',
    results,
    summary: {
      totalQueries: parsed.data.queries.length,
      successfulQueries: results.filter(r => r.success).length,
      failedQueries: results.filter(r => !r.success).length
    }
  })
}))

app.get('/ai/chat-sambanova', auth, asyncHandler(async (req: Request, res: Response) => {
  const q = typeof req.query.q === 'string' ? req.query.q : ''
  if (!q.trim()) {
    return res.status(400).json({ error: 'Missing or empty q query param' })
  }

  // Retrieve relevant context
  let context = ''
  if (process.env.GOOGLE_API_KEY) {
    try {
      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        modelName: 'text-embedding-004'
      })

      const retrievalStart = performance.now()
      const queryEmb = await withTimeout(embeddings.embedQuery(q), 5000)
      const vec = `[${queryEmb.join(',')}]`

      const rows = await prisma.$queryRaw<{ chunk: string }[]>`
        SELECT chunk FROM "Embedding"
        ORDER BY embedding_vec <=> ${vec}::vector
        LIMIT 3`

      context = rows.map(r => r.chunk).join('\n\n')
    } catch (err) {
      console.warn('RAG disabled (retrieval failed):', (err as Error)?.message)
      context = ''
    }
  }

  const samba = await getSambaClient()
  const completion = await withTimeout(samba.chat.completions.create({
    model: 'Llama-4-Maverick-17B-128E-Instruct',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant grounded in the user\'s documents. Use the provided CONTEXT to answer succinctly and accurately. If the context is insufficient, say so.'
      },
      {
        role: 'user',
        content: `CONTEXT:\n${context}\n\nQUESTION: ${q}`
      },
    ],
    temperature: 0.7,
  }), 20000)

  const answer = completion?.choices?.[0]?.message?.content || ''
  res.json({ answer })
}))

app.get('/ai/chat-sambanova/stream', asyncHandler(async (req: Request, res: Response) => {
  const q = typeof req.query.q === 'string' ? req.query.q : ''
  if (!q.trim()) {
    res.status(400).json({ error: 'Missing or empty q query param' })
    return
  }

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()

  const send = (data: string) => {
    res.write(`data: ${data}\n\n`)
  }

  try {
    // Retrieve relevant context
    let context = ''
    if (process.env.GOOGLE_API_KEY) {
      try {
        const embeddings = new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.GOOGLE_API_KEY,
          modelName: 'text-embedding-004'
        })

        const queryEmb = await withTimeout(embeddings.embedQuery(q), 5000)
        const vec = `[${queryEmb.join(',')}]`

        const rows = await prisma.$queryRaw<{ chunk: string }[]>`
          SELECT chunk FROM "Embedding"
          ORDER BY embedding_vec <=> ${vec}::vector
          LIMIT 3`

        context = rows.map(r => r.chunk).join('\n\n')
      } catch (err) {
        console.warn('RAG disabled (stream):', (err as Error)?.message)
        context = ''
      }
    }

    const samba = await getSambaClient()

    // Non-streaming completion; we simulate streaming by chunking the result
    const completion = await withTimeout(samba.chat.completions.create({
      model: SAMBA_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant grounded in the user\'s documents. Use the provided CONTEXT to answer succinctly and accurately. If the context is insufficient, say so.'
        },
        {
          role: 'user',
          content: `CONTEXT:\n${context}\n\nQUESTION: ${q}`
        },
      ],
      temperature: 0.7,
    }), 20000)

    const full = completion?.choices?.[0]?.message?.content || ''

    // Send in small chunks to simulate streaming
    const parts = full.match(/.{1,60}(\s|$)/g) || [full]
    for (const part of parts) {
      send(JSON.stringify({ delta: part }))
      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    send(JSON.stringify({ done: true }))
    res.end()
  } catch (error) {
    console.error('Stream error:', error)
    send(JSON.stringify({ error: 'Stream failed' }))
    res.end()
  }
}))

// --- Progress Summary ---
app.get('/progress/summary', auth, asyncHandler(async (req: Request, res: Response) => {
  try {
    // Get user's progress data for calculations
    const progressData = await prisma.progress.findMany({
      where: { userId: DEMO_USER_ID },
      orderBy: { date: 'desc' },
      take: 30, // Last 30 entries for streak calculation
      select: {
        id: true,
        userId: true,
        document: true,
        pagesRead: true,
        minutes: true,
        date: true
      }
    })

    // Calculate streak (consecutive days with progress)
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)

      const hasProgress = progressData.some(p => {
        const progressDate = new Date(p.date)
        progressDate.setHours(0, 0, 0, 0)
        return progressDate.getTime() === checkDate.getTime() &&
          ((p.pagesRead || 0) > 0 || (p.minutes || 0) > 0)
      })

      if (hasProgress) {
        streak++
      } else if (i > 0) { // Don't break streak if today has no progress yet
        break
      }
    }

    // Get last 7 days for weekly summary
    const weekly = []
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const dayProgress = progressData.filter(p => {
        const progressDate = new Date(p.date)
        progressDate.setHours(0, 0, 0, 0)
        return progressDate.getTime() === date.getTime()
      })

      const totalPages = dayProgress.reduce((sum, p) => sum + (p.pagesRead || 0), 0)
      const totalMinutes = dayProgress.reduce((sum, p) => sum + (p.minutes || 0), 0)

      weekly.push({
        day: dayNames[date.getDay()],
        pages: totalPages,
        minutes: totalMinutes
      })
    }

    res.json({ streak, weekly })
  } catch (error) {
    console.error('Progress summary error:', error)
    // Fallback to static data
    res.json({
      streak: 0,
      weekly: [
        { day: 'Mon', pages: 0, minutes: 0 },
        { day: 'Tue', pages: 0, minutes: 0 },
        { day: 'Wed', pages: 0, minutes: 0 },
        { day: 'Thu', pages: 0, minutes: 0 },
        { day: 'Fri', pages: 0, minutes: 0 },
        { day: 'Sat', pages: 0, minutes: 0 },
        { day: 'Sun', pages: 0, minutes: 0 },
      ],
    })
  }
}))

// --- Status Routes ---
app.get('/rag/status', asyncHandler(async (req: Request, res: Response) => {
  const hasGoogleKey = !!process.env.GOOGLE_API_KEY
  const hasSambaKey = !!process.env.SAMBANOVA_API_KEY

  let embeddingCount = 0
  let withVec = 0
  try {
    embeddingCount = await prisma.embedding.count()
    try {
      const rows = await prisma.$queryRaw<{ c: number }[]>`SELECT COUNT(*)::int as c FROM "Embedding" WHERE embedding_vec IS NOT NULL`
      withVec = rows?.[0]?.c || 0
    } catch {}
  } catch (error) {
    console.warn('Could not count embeddings:', error)
  }

  const status = {
    hasGoogleKey,
    hasSambaKey,
    embeddingCount,
    embeddingWithVector: withVec,
    postgresConnected: true,
    note: hasGoogleKey
      ? 'Postgres-based RAG enabled with Google embeddings'
      : 'Set GOOGLE_API_KEY to enable embeddings and RAG'
  }

  res.json(status)
}))

// --- Debug: Embedding status and sample ---
app.get('/debug/embeddings', auth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const total = await prisma.embedding.count({ where: { userId: DEMO_USER_ID } })
    let withVec = 0
    try {
      const rows = await prisma.$queryRaw<{ c: number }[]>`
        SELECT COUNT(*)::int as c FROM "Embedding" WHERE "userId" = ${DEMO_USER_ID} AND embedding_vec IS NOT NULL`
      withVec = rows?.[0]?.c || 0
    } catch {}

    const sample = await prisma.embedding.findMany({
      where: { userId: DEMO_USER_ID },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, source: true, createdAt: true, embedding: true }
    })

    // Compute embedding length from JSON and presence of vector via a separate check
    const sampleWithFlags = [] as any[]
    for (const s of sample) {
      let hasVec = false
      try {
        const r = await prisma.$queryRaw<{ hv: boolean }[]>`
          SELECT (embedding_vec IS NOT NULL) as hv FROM "Embedding" WHERE id = ${s.id} LIMIT 1`
        hasVec = !!r?.[0]?.hv
      } catch {}
      sampleWithFlags.push({
        id: s.id,
        source: s.source,
        createdAt: s.createdAt,
        embeddingLength: Array.isArray(s.embedding) ? s.embedding.length : 0,
        hasVector: hasVec,
      })
    }

    res.json({ total, withVector: withVec, sample: sampleWithFlags })
  } catch (e) {
    res.status(500).json({ error: 'debug failed' })
  }
}))

app.get('/health', asyncHandler(async (req: Request, res: Response) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: 'Database connection failed'
    })
  }
}))

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API OK - Simple Demo Authentication',
    version: '1.0.0',
    demo_credentials: {
      email: 'demo@admin.com',
      password: '123456'
    },
    endpoints: {
      auth: ['/auth/login', '/auth/logout'],
      notes: ['/notes'],
      progress: ['/progress', '/progress/summary'],
      embeddings: ['/embeddings'],
      files: ['/files/upload'],
      documents: ['/documents', '/documents/:id/status', '/documents/:id/chunk-stats', '/documents/:id/chunks/:contentType'],
      ai: ['/ai/chat', '/ai/chat-sambanova', '/ai/chat-sambanova/stream'],
      status: ['/rag/status', '/health']
    }
  })
})

// --- Error Handling ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err.stack || err.message)

  const status = (err as any).status && Number.isInteger((err as any).status)
    ? (err as any).status
    : 500

  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message || 'Internal server error'

  res.status(status).json({ error: message })
})

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' })
})

// --- Server Startup ---
const PORT = Number(process.env.PORT) || 4001  // Fixed port 4001

async function startServer(): Promise<void> {
  // Run startup initialization first
  await initializeStartup()

  const server = app.listen(PORT)
    .on('listening', () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/health`)
      console.log(`🔍 RAG status: http://localhost:${PORT}/rag/status`)
    })
    .on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`)
        console.error('Please ensure no other server is running on this port.')
        console.error('You can:')
        console.error(`1. Stop any other service using port ${PORT}`)
        console.error(`2. Set a different port using PORT environment variable`)
        process.exit(1)
      } else {
        console.error('❌ Failed to start server:', error)
        process.exit(1)
      }
    })

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...')
    server.close(() => {
      prisma.$disconnect()
      process.exit(0)
    })
  })

  process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully...')
    server.close(() => {
      prisma.$disconnect()
      process.exit(0)
    })
  })
}

startServer()