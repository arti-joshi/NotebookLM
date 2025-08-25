import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import mammoth from 'mammoth'
import pdfParse from 'pdf-parse'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { PrismaClient } from '../generated/prisma'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { Pinecone } from '@pinecone-database/pinecone'
import { getSambaClient } from './sambaClient'

const prisma = new PrismaClient()
const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
const upload = multer({ dest: uploadsDir })

// --- Auth (basic JWT) ---
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
app.post('/auth/register', async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(6) })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' })
  const { email, password } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(400).json({ error: 'Email already registered' })
  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, passwordHash: hash } })
  const token = jwt.sign({ uid: user.id }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
})

app.post('/auth/login', async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string() })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' })
  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ uid: user.id }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
})

function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    ;(req as any).uid = payload.uid
    next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

// --- File upload & parsing ---
app.post('/files/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    if (!file) return res.status(400).json({ error: 'No file' })
    const ext = path.extname(file.originalname).toLowerCase()
    let text = ''
    if (ext === '.pdf') {
      const data = await pdfParse(fs.readFileSync(file.path))
      text = data.text
    } else if (ext === '.docx') {
      const { value } = await mammoth.extractRawText({ path: file.path })
      text = value
    } else if (ext === '.txt') {
      text = fs.readFileSync(file.path, 'utf8')
    } else {
      return res.status(400).json({ error: 'Unsupported file type' })
    }
    fs.unlink(file.path, () => {})

    const chunks = chunkText(text)
    // embed and upsert to Pinecone
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
    const index = pinecone.Index(process.env.PINECONE_INDEX!)
    const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY!, modelName: 'text-embedding-004' })
    const vectors = [] as { id: string; values: number[]; metadata: Record<string, any> }[]
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const emb = await embeddings.embedQuery(chunk || '')
      vectors.push({ id: `doc-${Date.now()}-${i}`, values: emb, metadata: { chunk, source: file.originalname } })
    }
    await index.upsert(vectors)

    res.json({ message: 'File processed and indexed', chunks: chunks.length })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to process file' })
  }
})

function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
  const clean = text.replace(/\s+/g, ' ').trim()
  const chunks: string[] = []
  let i = 0
  while (i < clean.length) {
    const end = Math.min(i + chunkSize, clean.length)
    chunks.push(clean.slice(i, end))
    i += chunkSize - overlap
  }
  return chunks
}

// --- AI Chat ---
app.post('/ai/chat', async (req, res) => {
  try {
    const schema = z.object({ messages: z.array(z.object({ role: z.string(), content: z.string() })) })
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' })
    const userMessage = [...parsed.data.messages].reverse().find(m => m.role === 'user')?.content || ''

    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
    const index = pinecone.Index(process.env.PINECONE_INDEX!)
    const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY!, modelName: 'text-embedding-004' })
    const queryEmb = await embeddings.embedQuery(userMessage)
    const results = await index.query({ vector: queryEmb, topK: 5, includeMetadata: true })
    const context = results.matches?.map(m => (m.metadata as any)?.chunk).filter(Boolean).join('\n\n') || ''

    const llm = new ChatGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY!, modelName: 'gemini-1.5-pro' })
    const prompt = `You are a helpful assistant grounded in the user's documents. Use the CONTEXT to answer.
CONTEXT:\n${context}\n\nQUESTION: ${userMessage}`
    const ai = await llm.invoke(prompt)
    type AIResponse = {
      content?: Array<{text?: string}>;
    };

    const answer = typeof ai === 'string' 
      ? ai 
      : ((ai as AIResponse)?.content?.[0]?.text || 'No answer');
    res.json({ answer })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'AI chat failed' })
  }
})

// --- AI Chat via SambaNova ---
app.post('/ai/chat-sambanova', async (req, res) => {
  try {
    const schema = z.object({ messages: z.array(z.object({ role: z.string(), content: z.string() })) })
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' })
    const userMessage = [...parsed.data.messages].reverse().find(m => m.role === 'user')?.content || ''

    // Retrieve relevant context from Pinecone using Google embeddings (fallback-safe)
    let context = ''
    const hasPinecone = !!process.env.PINECONE_API_KEY && !!process.env.PINECONE_INDEX
    const hasGoogle = !!process.env.GOOGLE_API_KEY
    if (hasPinecone && hasGoogle) {
      try {
        const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
        const index = pinecone.Index(process.env.PINECONE_INDEX!)
        const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY!, modelName: 'text-embedding-004' })
        const queryEmb = await embeddings.embedQuery(userMessage)
        const results = await index.query({ vector: queryEmb, topK: 5, includeMetadata: true })
        context = results.matches?.map(m => (m.metadata as any)?.chunk).filter(Boolean).join('\n\n') || ''
      } catch (err) {
        console.warn('RAG disabled (retrieval failed):', (err as Error)?.message)
        context = ''
      }
    }

    const samba = await getSambaClient()
    const completion = await samba.chat.completions.create({
      model: 'Llama-4-Maverick-17B-128E-Instruct',
      messages: [
        { role: 'system', content: 'You are a helpful assistant grounded in the user\'s documents. Use the provided CONTEXT to answer succinctly and accurately. If the context is insufficient, say so.' },
        { role: 'user', content: `CONTEXT:\n${context}\n\nQUESTION: ${userMessage}` },
      ] as any,
      temperature: 0.7,
    })
    const answer = completion.choices?.[0]?.message?.content || ''
    res.json({ answer })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'SambaNova chat failed' })
  }
})

// --- AI Chat via SambaNova (GET with query param) ---
app.get('/ai/chat-sambanova', async (req, res) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : ''
    if (!q) return res.status(400).json({ error: 'Missing q query param' })

    // Retrieve relevant context from Pinecone using Google embeddings (fallback-safe)
    let context = ''
    const hasPinecone = !!process.env.PINECONE_API_KEY && !!process.env.PINECONE_INDEX
    const hasGoogle = !!process.env.GOOGLE_API_KEY
    if (hasPinecone && hasGoogle) {
      try {
        const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
        const index = pinecone.Index(process.env.PINECONE_INDEX!)
        const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY!, modelName: 'text-embedding-004' })
        const queryEmb = await embeddings.embedQuery(q)
        const results = await index.query({ vector: queryEmb, topK: 5, includeMetadata: true })
        context = results.matches?.map(m => (m.metadata as any)?.chunk).filter(Boolean).join('\n\n') || ''
      } catch (err) {
        console.warn('RAG disabled (retrieval failed):', (err as Error)?.message)
        context = ''
      }
    }

    const samba = await getSambaClient()
    const completion = await samba.chat.completions.create({
      model: 'Llama-4-Maverick-17B-128E-Instruct',
      messages: [
        { role: 'system', content: 'You are a helpful assistant grounded in the user\'s documents. Use the provided CONTEXT to answer succinctly and accurately. If the context is insufficient, say so.' },
        { role: 'user', content: `CONTEXT:\n${context}\n\nQUESTION: ${q}` },
      ] as any,
      temperature: 0.7,
    })
    const answer = completion.choices?.[0]?.message?.content || ''
    res.json({ answer })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'SambaNova chat (GET) failed' })
  }
})

// --- Progress summary ---
app.get('/progress/summary', async (_req, res) => {
  // placeholder static data; will wire to Prisma later
  res.json({
    streak: 3,
    weekly: [
      { day: 'Mon', pages: 12, minutes: 30 },
      { day: 'Tue', pages: 8, minutes: 20 },
      { day: 'Wed', pages: 15, minutes: 45 },
      { day: 'Thu', pages: 0, minutes: 0 },
      { day: 'Fri', pages: 10, minutes: 25 },
      { day: 'Sat', pages: 4, minutes: 12 },
      { day: 'Sun', pages: 6, minutes: 18 },
    ],
  })
})

app.get('/', (_req, res) => res.send('API OK'))

// --- RAG readiness status ---
app.get('/rag/status', async (_req, res) => {
  const hasPineconeKey = !!process.env.PINECONE_API_KEY
  const hasPineconeIndex = !!process.env.PINECONE_INDEX
  const hasGoogleKey = !!process.env.GOOGLE_API_KEY
  const status: any = {
    hasPineconeKey,
    hasPineconeIndex,
    hasGoogleKey,
    indexReachable: false,
    indexDimension: null as number | null,
    note: 'Set PINECONE_API_KEY, PINECONE_INDEX, GOOGLE_API_KEY to enable grounding.'
  }
  if (hasPineconeKey && hasPineconeIndex) {
    try {
      const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
      const index = pinecone.Index(process.env.PINECONE_INDEX!)
      const stats = await index.describeIndexStats()
      status.indexReachable = true
      // dimension not always present; leave null if unavailable
      status.namespaces = Object.keys(stats.namespaces || {})
    } catch (e) {
      status.indexReachable = false
      status.error = (e as Error)?.message
    }
  }
  res.json(status)
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})


