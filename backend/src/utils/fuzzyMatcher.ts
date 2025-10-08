// Utility functions for fuzzy matching and vector similarity

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const len = Math.min(vecA?.length || 0, vecB?.length || 0);
  if (len === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < len; i++) {
    const a = vecA[i] || 0;
    const b = vecB[i] || 0;
    dot += a * b;
    normA += a * a;
    normB += b * b;
  }
  if (normA === 0 || normB === 0) return 0;
  return clamp01(dot / (Math.sqrt(normA) * Math.sqrt(normB)));
}

export function normalizeText(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // keep spaces and hyphens
    .replace(/\s+/g, ' ')
    .trim();
}

function simpleStem(word: string): string {
  // extremely naive stemmer good enough for lightweight matching
  let w = word;
  if (w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.endsWith('es')) return w.slice(0, -2);
  if (w.endsWith('s') && w.length > 3) return w.slice(0, -1);
  return w;
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(/[\s-]+/)
    .filter(Boolean)
    .map(simpleStem);
}

export function keywordMatch(text: string, keywords: string[]): { score: number, matches: string[] } {
  const hay = normalizeText(text);
  const terms = (keywords || []).map(k => normalizeText(k)).filter(Boolean);
  if (terms.length === 0) return { score: 0, matches: [] };
  const matches: string[] = [];
  for (const t of terms) {
    if (!t) continue;
    if (hay.includes(t)) matches.push(t);
  }
  const score = clamp01(matches.length / terms.length);
  return { score, matches };
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const la = a.length;
  const lb = b.length;
  if (la === 0) return lb;
  if (lb === 0) return la;
  const dp = new Array(lb + 1);
  for (let j = 0; j <= lb; j++) dp[j] = j;
  for (let i = 1; i <= la; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= lb; j++) {
      const temp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(
        dp[j] + 1,      // deletion
        dp[j - 1] + 1,  // insertion
        prev + cost     // substitution
      );
      prev = temp;
    }
  }
  return dp[lb];
}

function acronym(s: string): string {
  return tokenize(s).map(w => w[0]).join('');
}

export function fuzzyStringMatch(str1: string, str2: string): number {
  const aRaw = normalizeText(str1);
  const bRaw = normalizeText(str2);
  if (!aRaw || !bRaw) return 0;

  // Token-based Jaccard similarity with naive stemming
  const aTok = new Set(tokenize(aRaw));
  const bTok = new Set(tokenize(bRaw));
  const inter = [...aTok].filter(t => bTok.has(t)).length;
  const union = new Set<string>([...aTok, ...bTok]).size || 1;
  const jaccard = inter / union;

  // Substring heuristic
  const shorter = aRaw.length <= bRaw.length ? aRaw : bRaw;
  const longer = aRaw.length > bRaw.length ? aRaw : bRaw;
  const substr = longer.includes(shorter) ? Math.min(1, shorter.length / Math.max(1, longer.length)) : 0;

  // Acronym heuristic (e.g., Full Text Search -> FTS)
  const aAcr = acronym(aRaw);
  const bAcr = acronym(bRaw);
  const acrScore = (aAcr && bAcr && (aAcr === bAcr)) ? 0.8 : ((aAcr === bRaw || bAcr === aRaw) ? 0.7 : 0);

  // Levenshtein normalized similarity
  const maxLen = Math.max(aRaw.length, bRaw.length) || 1;
  const lev = 1 - (levenshtein(aRaw, bRaw) / maxLen);

  // Blend scores (weights tuned for practical matching)
  const score = clamp01(0.4 * lev + 0.4 * jaccard + 0.2 * Math.max(substr, acrScore));
  return score;
}

export function findBestMatch(query: string, candidates: string[]): { match: string, score: number } {
  let best = { match: '', score: 0 };
  for (const c of candidates || []) {
    const s = fuzzyStringMatch(query, c);
    if (s > best.score) best = { match: c, score: s };
  }
  return best;
}

export default {
  cosineSimilarity,
  normalizeText,
  keywordMatch,
  fuzzyStringMatch,
  findBestMatch,
};


