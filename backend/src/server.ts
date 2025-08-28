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
// Pinecone removed; using Postgres via Prisma
import { getSambaClient } from './sambaClient'
import { performance } from 'perf_hooks'

const prisma = new PrismaClient()
const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

// Prevent caching of API responses and add simple latency logging
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  })
  const start = performance.now()
  res.on('finish', () => {
    const ms = Math.round(performance.now() - start)
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} ${ms}ms`)
  })
  next()
})

const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
const upload = multer({ dest: uploadsDir })

// Ensure pgvector extension and vector column present (non-blocking best-effort)
async function ensurePgVector() {
  try {
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector')
    await prisma.$executeRawUnsafe('ALTER TABLE "Embedding" ADD COLUMN IF NOT EXISTS embedding_vec vector(768)')
    await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS embedding_vec_ivfflat_idx ON "Embedding" USING ivfflat (embedding_vec vector_cosine_ops) WITH (lists = 100)')
  } catch (e) {
    console.warn('pgvector setup skipped:', (e as Error)?.message)
  }
}
ensurePgVector()

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
  const token = jwt.sign({ uid: user.id, role: (user as any).role, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, role: (user as any).role })
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
  const token = jwt.sign({ uid: user.id, role: (user as any).role, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, role: (user as any).role })
})

function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    ;(req as any).uid = payload.uid
    ;(req as any).role = payload.role
    ;(req as any).email = payload.email
    next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const role = (req as any).role
  if (role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden: Admins only' })
  next()
}

// --- CRUD: User ---
app.get('/users', auth, requireAdmin, async (_req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } })
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json(user)
})

app.post('/users', async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(6) })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' })
  const { email, password } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(400).json({ error: 'Email already exists' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, passwordHash } })
  res.status(201).json(user)
})

app.put('/users/:id', async (req, res) => {
  const schema = z.object({ email: z.string().email().optional(), password: z.string().min(6).optional() })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' })
  const data: any = {}
  if (parsed.data.email) data.email = parsed.data.email
  if (parsed.data.password) data.passwordHash = await bcrypt.hash(parsed.data.password, 10)
  try {
    const user = await prisma.user.update({ where: { id: req.params.id }, data })
    res.json(user)
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

app.delete('/users/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

// --- CRUD: Note (auth required) ---
app.get('/notes', auth, async (req, res) => {
  const uid = (req as any).uid as string
  const notes = await prisma.note.findMany({ where: { userId: uid } })
  res.json(notes)
})

app.get('/notes/:id', auth, async (req, res) => {
  const uid = (req as any).uid as string
  const note = await prisma.note.findFirst({ where: { id: req.params.id, userId: uid } })
  if (!note) return res.status(404).json({ error: 'Not found' })
  res.json(note)
})

app.post('/notes', auth, async (req, res) => {
  const uid = (req as any).uid as string
  const schema = z.object({ document: z.string(), page: z.number().int().nonnegative(), content: z.string() })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' })
  const note = await prisma.note.create({ data: { userId: uid, ...parsed.data } })
  res.status(201).json(note)
})

app.put('/notes/:id', auth, async (req, res) => {
  const uid = (req as any).uid as string
  const schema = z.object({ document: z.string().optional(), page: z.number().int().nonnegative().optional(), content: z.string().optional() })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' })
  try {
    const existing = await prisma.note.findFirst({ where: { id: req.params.id, userId: uid } })
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const note = await prisma.note.update({ where: { id: req.params.id }, data: parsed.data })
    res.json(note)
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

app.delete('/notes/:id', auth, async (req, res) => {
  const uid = (req as any).uid as string
  try {
    const existing = await prisma.note.findFirst({ where: { id: req.params.id, userId: uid } })
    if (!existing) return res.status(404).json({ error: 'Not found' })
    await prisma.note.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

// --- CRUD: Progress (auth required) ---
app.get('/progress', auth, async (req, res) => {
  const uid = (req as any).uid as string
  const rows = await prisma.progress.findMany({ where: { userId: uid } })
  res.json(rows)
})

app.get('/progress/:id', auth, async (req, res) => {
  const uid = (req as any).uid as string
  const row = await prisma.progress.findFirst({ where: { id: req.params.id, userId: uid } })
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json(row)
})

app.post('/progress', auth, async (req, res) => {
  const uid = (req as any).uid as string
  const schema = z.object({ document: z.string(), pagesRead: z.number().int().min(0).optional(), minutes: z.number().int().min(0).optional(), date: z.string().datetime().optional() })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' })
  const row = await prisma.progress.create({ data: { userId: uid, ...parsed.data } as any })
  res.status(201).json(row)
})

app.put('/progress/:id', auth, async (req, res) => {
  const uid = (req as any).uid as string
  const schema = z.object({ document: z.string().optional(), pagesRead: z.number().int().min(0).optional(), minutes: z.number().int().min(0).optional(), date: z.string().datetime().optional() })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' })
  try {
    const existing = await prisma.progress.findFirst({ where: { id: req.params.id, userId: uid } })
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const row = await prisma.progress.update({ where: { id: req.params.id }, data: parsed.data as any })
    res.json(row)
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

app.delete('/progress/:id', auth, async (req, res) => {
  const uid = (req as any).uid as string
  try {
    const existing = await prisma.progress.findFirst({ where: { id: req.params.id, userId: uid } })
    if (!existing) return res.status(404).json({ error: 'Not found' })
    await prisma.progress.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

// --- CRUD: Embedding (auth required; no vector updates here) ---
app.get('/embeddings', auth, async (req, res) => {
  const uid = (req as any).uid as string
  const rows = await prisma.embedding.findMany({ where: { userId: uid } })
  res.json(rows)
})

app.get('/embeddings/:id', auth, async (req, res) => {
  const uid = (req as any).uid as string
  const row = await prisma.embedding.findFirst({ where: { id: req.params.id, userId: uid } })
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json(row)
})

app.post('/embeddings', auth, async (req, res) => {
  const uid = (req as any).uid as string
  const schema = z.object({ source: z.string(), chunk: z.string(), embedding: z.array(z.number()) })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' })
  const row = await prisma.embedding.create({ data: { userId: uid, ...parsed.data } as any })
  res.status(201).json(row)
})

app.put('/embeddings/:id', auth, async (req, res) => {
  const uid = (req as any).uid as string
  const schema = z.object({ source: z.string().optional(), chunk: z.string().optional(), embedding: z.array(z.number()).optional() })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' })
  try {
    const existing = await prisma.embedding.findFirst({ where: { id: req.params.id, userId: uid } })
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const row = await prisma.embedding.update({ where: { id: req.params.id }, data: parsed.data as any })
    res.json(row)
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

app.delete('/embeddings/:id', auth, async (req, res) => {
  const uid = (req as any).uid as string
  try {
    const existing = await prisma.embedding.findFirst({ where: { id: req.params.id, userId: uid } })
    if (!existing) return res.status(404).json({ error: 'Not found' })
    await prisma.embedding.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

// --- File upload & parsing ---
app.post('/files/upload', auth, upload.single('file'), async (req, res) => {
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
    const uid = (req as any).uid as string
    const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY!, modelName: 'text-embedding-004' })
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const emb = await embeddings.embedQuery(chunk || '')
      const row = await prisma.embedding.create({
        data: {
          source: file.originalname,
          chunk,
          embedding: emb as any,
          userId: uid,
        }
      })
      // Write pgvector column with raw SQL
      const vec = `[${emb.join(',')}]`
      await prisma.$executeRawUnsafe(`UPDATE "Embedding" SET embedding_vec = '${vec}' WHERE id = '${row.id}'`)
    }

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

    const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY!, modelName: 'text-embedding-004' })
    const retrievalStart = performance.now()
    let context = ''
    try {
      const queryEmb = await withTimeout(embeddings.embedQuery(userMessage), 1200) as number[]
      const vec = `[${queryEmb.join(',')}]`
      const rows = await prisma.$queryRawUnsafe<{ chunk: string }[]>(`SELECT chunk FROM "Embedding" ORDER BY embedding_vec <=> '${vec}' LIMIT 3`)
      context = rows.map(r => r.chunk).join('\n\n')
      console.log('RAG retrieval (pgvector) ms:', Math.round(performance.now()-retrievalStart))
    } catch (err) {
      console.warn('RAG retrieval skipped:', (err as Error)?.message, 'ms:', Math.round(performance.now()-retrievalStart))
      context = ''
    }

    const llm = new ChatGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY!, modelName: 'gemini-1.5-pro' })
    const prompt = `You are a helpful assistant grounded in the user's documents. Use the CONTEXT to answer.
CONTEXT:\n${context}\n\nQUESTION: ${userMessage}`
    const modelStart = performance.now()
    const ai = await withTimeout(llm.invoke(prompt), 20000)
    type AIResponse = {
      content?: Array<{text?: string}>;
    };

    const answer = typeof ai === 'string' 
      ? ai 
      : ((ai as AIResponse)?.content?.[0]?.text || 'No answer');
    console.log('ai/chat modelMs:', Math.round(performance.now()-modelStart))
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
    const hasGoogle = !!process.env.GOOGLE_API_KEY
    if (hasGoogle) {
      try {
        const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY!, modelName: 'text-embedding-004' })
        const retrievalStart = performance.now()
        const queryEmb = await withTimeout(embeddings.embedQuery(userMessage), 1200) as number[]
        const vec = `[${queryEmb.join(',')}]`
        const rows = await prisma.$queryRawUnsafe<{ chunk: string }[]>(`SELECT chunk FROM "Embedding" ORDER BY embedding_vec <=> '${vec}' LIMIT 3`)
        context = rows.map(r => r.chunk).join('\n\n')
        console.log('RAG retrieval (pgvector) ms:', Math.round(performance.now()-retrievalStart))
      } catch (err) {
        console.warn('RAG disabled (retrieval failed):', (err as Error)?.message)
        context = ''
      }
    }

    const samba = await getSambaClient()
    const completion = await withTimeout(samba.chat.completions.create({
      model: 'Llama-4-Maverick-17B-128E-Instruct',
      messages: [
        { role: 'system', content: 'You are a helpful assistant grounded in the user\'s documents. Use the provided CONTEXT to answer succinctly and accurately. If the context is insufficient, say so.' },
        { role: 'user', content: `CONTEXT:\n${context}\n\nQUESTION: ${userMessage}` },
      ] as any,
      temperature: 0.7,
    }), 20000) as any
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
    const hasGoogle = !!process.env.GOOGLE_API_KEY
    if (hasGoogle) {
      try {
        const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY!, modelName: 'text-embedding-004' })
        const retrievalStart = performance.now()
        const queryEmb = await withTimeout(embeddings.embedQuery(q), 1200) as number[]
        const vec = `[${queryEmb.join(',')}]`
        const rows = await prisma.$queryRawUnsafe<{ chunk: string }[]>(`SELECT chunk FROM "Embedding" ORDER BY embedding_vec <=> '${vec}' LIMIT 3`)
        context = rows.map(r => r.chunk).join('\n\n')
        console.log('RAG retrieval (pgvector) ms:', Math.round(performance.now()-retrievalStart))
      } catch (err) {
        console.warn('RAG disabled (retrieval failed):', (err as Error)?.message)
        context = ''
      }
    }

    const samba = await getSambaClient()
    const completion = await withTimeout(samba.chat.completions.create({
      model: 'Llama-4-Maverick-17B-128E-Instruct',
      messages: [
        { role: 'system', content: 'You are a helpful assistant grounded in the user\'s documents. Use the provided CONTEXT to answer succinctly and accurately. If the context is insufficient, say so.' },
        { role: 'user', content: `CONTEXT:\n${context}\n\nQUESTION: ${q}` },
      ] as any,
      temperature: 0.7,
    }), 20000) as any
    const answer = completion.choices?.[0]?.message?.content || ''
    res.json({ answer })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'SambaNova chat (GET) failed' })
  }
})

// --- AI Chat via SambaNova (SSE streaming) ---
app.get('/ai/chat-sambanova/stream', async (req, res) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : ''
    if (!q) {
      res.status(400).json({ error: 'Missing q query param' })
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

    // Retrieve relevant context from Postgres via Prisma
    let context = ''
    try {
      const hasGoogle = !!process.env.GOOGLE_API_KEY
      if (hasGoogle) {
        const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY!, modelName: 'text-embedding-004' })
        const queryEmb = await withTimeout(embeddings.embedQuery(q), 1200)
        const rows = await prisma.embedding.findMany({ take: 500 })
        const scored = rows.map(r => ({ r, score: cosineSimilarity(queryEmb as number[], (r.embedding as any) as number[]) }))
        scored.sort((a,b)=> b.score - a.score)
        const top = scored.slice(0, 3)
        context = top.map(t => t.r.chunk).join('\n\n')
      }
    } catch (err) {
      console.warn('RAG disabled (stream) ->', (err as Error)?.message)
      context = ''
    }

    const samba = await getSambaClient()

    // Try provider streaming first if supported
    try {
      const maybeStream: any = await samba.chat.completions.create({
        model: 'Llama-4-Maverick-17B-128E-Instruct',
        messages: [
          { role: 'system', content: 'You are a helpful assistant grounded in the user\'s documents. Use the provided CONTEXT to answer succinctly and accurately. If the context is insufficient, say so.' },
          { role: 'user', content: `CONTEXT:\n${context}\n\nQUESTION: ${q}` },
        ] as any,
        temperature: 0.7,
        stream: true as any,
      })

      if (maybeStream && typeof maybeStream[Symbol.asyncIterator] === 'function') {
        for await (const chunk of maybeStream as AsyncIterable<any>) {
          const delta = chunk?.choices?.[0]?.delta?.content || chunk?.choices?.[0]?.message?.content || ''
          if (delta) send(JSON.stringify({ delta }))
        }
        send(JSON.stringify({ done: true }))
        res.end()
        return
      }
    } catch (streamErr) {
      console.warn('Provider streaming unsupported/failure, falling back:', (streamErr as Error)?.message)
    }

    // Fallback: non-streaming completion, then trickle to client
    try {
      const completion = await withTimeout(samba.chat.completions.create({
        model: 'Llama-4-Maverick-17B-128E-Instruct',
        messages: [
          { role: 'system', content: 'You are a helpful assistant grounded in the user\'s documents. Use the provided CONTEXT to answer succinctly and accurately. If the context is insufficient, say so.' },
          { role: 'user', content: `CONTEXT:\n${context}\n\nQUESTION: ${q}` },
        ] as any,
        temperature: 0.7,
      }), 20000) as any
      const full = completion?.choices?.[0]?.message?.content || ''
      // send in small chunks
      const parts = full.match(/.{1,60}(\s|$)/g) || [full]
      for (const p of parts) {
        send(JSON.stringify({ delta: p }))
      }
      send(JSON.stringify({ done: true }))
      res.end()
    } catch (e) {
      send(JSON.stringify({ error: 'stream-failed' }))
      res.end()
    }
  } catch (e) {
    console.error(e)
    if (!res.headersSent) res.status(500).json({ error: 'SambaNova chat (SSE) failed' })
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
  const hasGoogleKey = !!process.env.GOOGLE_API_KEY
  const status: any = {
    hasGoogleKey,
    note: 'Postgres-based RAG enabled. Set GOOGLE_API_KEY to enable embeddings.'
  }
  res.json(status)
})

const BASE_PORT = Number(process.env.PORT) || 4000
function startServer(port: number, retries = 5) {
  const server = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })
  server.on('error', (err: any) => {
    if (err?.code === 'EADDRINUSE' && retries > 0) {
      const nextPort = port + 1
      console.warn(`Port ${port} in use. Retrying on ${nextPort}...`)
      setTimeout(() => startServer(nextPort, retries - 1), 250)
    } else {
      console.error('Failed to start server:', err)
      process.exit(1)
    }
  })
}

startServer(BASE_PORT)

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false
    const t = setTimeout(() => {
      if (!settled) {
        settled = true
        reject(new Error('timeout'))
      }
    }, ms)
    p.then(v => {
      if (!settled) {
        settled = true
        clearTimeout(t)
        resolve(v)
      }
    }).catch(err => {
      if (!settled) {
        settled = true
        clearTimeout(t)
        reject(err)
      }
    })
  })
}

function cosineSimilarity(a: number[], b: number[]): number {
  const minLen = Math.min(a.length, b.length)
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < minLen; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  if (na === 0 || nb === 0) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}


