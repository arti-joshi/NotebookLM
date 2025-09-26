import fetch from 'node-fetch';

const BASE = 'http://localhost:4001';

async function loginDemo() {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@admin.com', password: '123456' }),
  });
  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }
  const data = await res.json();
  return data.accessToken || data.token;
}

async function chat(token: string, query: string) {
  const res = await fetch(`${BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ messages: [{ role: 'user', content: query }] }),
  });
  const data = await res.json();
  const answer = data.answer || '';
  const context = data.context || '';
  const pass = !!answer && !answer.includes('No relevant context found') && !answer.includes('Unauthorized');
  console.log(`\nQuery: ${query}`);
  console.log('-----------------------------');
  console.log('Answer:', answer.slice(0, 500));
  if (context) console.log('Context:', context.slice(0, 500));
  console.log(pass ? '✅ PASS' : '❌ FAIL');
  if (!pass) console.log('Log: Context missing or auth/LLM fallback.');
}

const TEST_QUERIES = [
  'Brief history of PostgreSQL',
  'What modern features does PostgreSQL offer?',
  'How to create a database in PostgreSQL?',
  'ISO 8601 interval unit abbreviations',
];

(async () => {
  const token = await loginDemo();
  for (const q of TEST_QUERIES) {
    await chat(token, q);
  }
})();
