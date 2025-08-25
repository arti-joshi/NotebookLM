"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mammoth_1 = __importDefault(require("mammoth"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../generated/prisma");
const google_genai_1 = require("@langchain/google-genai");
const google_genai_2 = require("@langchain/google-genai");
const pinecone_1 = require("@pinecone-database/pinecone");
const sambaClient_1 = require("./sambaClient");
const prisma = new prisma_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '2mb' }));
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const upload = (0, multer_1.default)({ dest: uploadsDir });
// --- Auth (basic JWT) ---
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
app.post('/auth/register', async (req, res) => {
    const schema = zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string().min(6) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: 'Invalid payload' });
    const { email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
        return res.status(400).json({ error: 'Email already registered' });
    const hash = await bcrypt_1.default.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash: hash } });
    const token = jsonwebtoken_1.default.sign({ uid: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
});
app.post('/auth/login', async (req, res) => {
    const schema = zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string() });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: 'Invalid payload' });
    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!ok)
        return res.status(401).json({ error: 'Invalid credentials' });
    const token = jsonwebtoken_1.default.sign({ uid: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
});
function auth(req, res, next) {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.uid = payload.uid;
        next();
    }
    catch {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
// --- File upload & parsing ---
app.post('/files/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file)
            return res.status(400).json({ error: 'No file' });
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        let text = '';
        if (ext === '.pdf') {
            const data = await (0, pdf_parse_1.default)(fs_1.default.readFileSync(file.path));
            text = data.text;
        }
        else if (ext === '.docx') {
            const { value } = await mammoth_1.default.extractRawText({ path: file.path });
            text = value;
        }
        else if (ext === '.txt') {
            text = fs_1.default.readFileSync(file.path, 'utf8');
        }
        else {
            return res.status(400).json({ error: 'Unsupported file type' });
        }
        fs_1.default.unlink(file.path, () => { });
        const chunks = chunkText(text);
        // embed and upsert to Pinecone
        const pinecone = new pinecone_1.Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const index = pinecone.Index(process.env.PINECONE_INDEX);
        const embeddings = new google_genai_1.GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY, modelName: 'text-embedding-004' });
        const vectors = [];
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const emb = await embeddings.embedQuery(chunk || '');
            vectors.push({ id: `doc-${Date.now()}-${i}`, values: emb, metadata: { chunk, source: file.originalname } });
        }
        await index.upsert(vectors);
        res.json({ message: 'File processed and indexed', chunks: chunks.length });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to process file' });
    }
});
function chunkText(text, chunkSize = 1000, overlap = 200) {
    const clean = text.replace(/\s+/g, ' ').trim();
    const chunks = [];
    let i = 0;
    while (i < clean.length) {
        const end = Math.min(i + chunkSize, clean.length);
        chunks.push(clean.slice(i, end));
        i += chunkSize - overlap;
    }
    return chunks;
}
// --- AI Chat ---
app.post('/ai/chat', async (req, res) => {
    try {
        const schema = zod_1.z.object({ messages: zod_1.z.array(zod_1.z.object({ role: zod_1.z.string(), content: zod_1.z.string() })) });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid payload' });
        const userMessage = [...parsed.data.messages].reverse().find(m => m.role === 'user')?.content || '';
        const pinecone = new pinecone_1.Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const index = pinecone.Index(process.env.PINECONE_INDEX);
        const embeddings = new google_genai_1.GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY, modelName: 'text-embedding-004' });
        const queryEmb = await embeddings.embedQuery(userMessage);
        const results = await index.query({ vector: queryEmb, topK: 5, includeMetadata: true });
        const context = results.matches?.map(m => m.metadata?.chunk).filter(Boolean).join('\n\n') || '';
        const llm = new google_genai_2.ChatGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY, modelName: 'gemini-1.5-pro' });
        const prompt = `You are a helpful assistant grounded in the user's documents. Use the CONTEXT to answer.
CONTEXT:\n${context}\n\nQUESTION: ${userMessage}`;
        const ai = await llm.invoke(prompt);
        const answer = typeof ai === 'string'
            ? ai
            : (ai?.content?.[0]?.text || 'No answer');
        res.json({ answer });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'AI chat failed' });
    }
});
// --- AI Chat via SambaNova ---
app.post('/ai/chat-sambanova', async (req, res) => {
    try {
        const schema = zod_1.z.object({ messages: zod_1.z.array(zod_1.z.object({ role: zod_1.z.string(), content: zod_1.z.string() })) });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid payload' });
        const samba = await (0, sambaClient_1.getSambaClient)();
        const completion = await samba.chat.completions.create({
            model: 'Llama-4-Maverick-17B-128E-Instruct',
            messages: parsed.data.messages,
            temperature: 0.7,
        });
        const answer = completion.choices?.[0]?.message?.content || '';
        res.json({ answer });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'SambaNova chat failed' });
    }
});
// --- AI Chat via SambaNova (GET with query param) ---
app.get('/ai/chat-sambanova', async (req, res) => {
    try {
        const q = typeof req.query.q === 'string' ? req.query.q : '';
        if (!q)
            return res.status(400).json({ error: 'Missing q query param' });
        const samba = await (0, sambaClient_1.getSambaClient)();
        const completion = await samba.chat.completions.create({
            model: 'Llama-4-Maverick-17B-128E-Instruct',
            messages: [{ role: 'user', content: q }],
            temperature: 0.7,
        });
        const answer = completion.choices?.[0]?.message?.content || '';
        res.json({ answer });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'SambaNova chat (GET) failed' });
    }
});
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
    });
});
app.get('/', (_req, res) => res.send('API OK'));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map