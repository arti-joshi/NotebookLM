/**
 * Document Type Detection System
 * Detects the type of document to apply appropriate chunking strategies
 */

export enum DocumentType {
  PLAIN_TEXT = 'plain_text',
  RESEARCH_TECHNICAL = 'research_technical', 
  CODE = 'code',
  TABLE_CSV_SQL = 'table_csv_sql',
  MIXED = 'mixed'
}

export interface DocumentMetadata {
  type: DocumentType;
  confidence: number;
  features: {
    hasHeadings: boolean;
    hasCodeBlocks: boolean;
    hasTables: boolean;
    hasMarkdown: boolean;
    hasSQL: boolean;
    hasCSV: boolean;
    averageLineLength: number;
    totalLines: number;
  };
}

/**
 * Detects document type based on content analysis
 */
export function detectDocumentType(content: string, filename?: string): DocumentMetadata {
  const features = analyzeDocumentFeatures(content, filename);
  
  // Calculate confidence scores for each type
  const scores = {
    [DocumentType.PLAIN_TEXT]: calculatePlainTextScore(features),
    [DocumentType.RESEARCH_TECHNICAL]: calculateResearchTechnicalScore(features),
    [DocumentType.CODE]: calculateCodeScore(features),
    [DocumentType.TABLE_CSV_SQL]: calculateTableCSVSQLScore(features),
    [DocumentType.MIXED]: calculateMixedScore(features)
  };

  // Find the type with highest confidence
  const bestMatch = Object.entries(scores).reduce((best, [type, score]) => 
    score > best.score ? { type: type as DocumentType, score } : best,
    { type: DocumentType.PLAIN_TEXT, score: 0 }
  );

  return {
    type: bestMatch.type,
    confidence: bestMatch.score,
    features
  };
}

/**
 * Analyzes document features to determine its characteristics
 */
function analyzeDocumentFeatures(content: string, filename?: string): DocumentMetadata['features'] {
  const lines = content.split('\n');
  const totalLines = lines.length;
  
  // Check for headings (markdown style or numbered sections)
  const hasHeadings = /^(#{1,6}\s+|^\d+\.\s+|^[A-Z][A-Z\s]+$)/m.test(content);
  
  // Check for code blocks (``` or indented code)
  const hasCodeBlocks = /```[\s\S]*?```|^\s{4,}.*$/m.test(content);
  
  // Check for tables (markdown tables or pipe-separated)
  const hasTables = /\|.*\|.*\|/m.test(content) || /^\s*\|.*\|.*$/m.test(content);
  
  // Check for markdown formatting
  const hasMarkdown = /[*_`#\[\]()]/m.test(content);
  
  // Check for SQL keywords and patterns
  const hasSQL = /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|FROM|WHERE|JOIN|UNION)\b/i.test(content);
  
  // Check for CSV patterns (comma-separated with quotes)
  const hasCSV = /"[^"]*",|^[^,]*,[^,]*,[^,]*$/m.test(content);
  
  // Calculate average line length
  const averageLineLength = lines.reduce((sum, line) => sum + line.length, 0) / totalLines;
  
  // File extension hints
  if (filename) {
    const ext = filename.toLowerCase().split('.').pop();
    if (['sql', 'csv', 'tsv'].includes(ext || '')) {
      return {
        hasHeadings: false,
        hasCodeBlocks: false,
        hasTables: true,
        hasMarkdown: false,
        hasSQL: ext === 'sql',
        hasCSV: ['csv', 'tsv'].includes(ext || ''),
        averageLineLength,
        totalLines
      };
    }
    if (['js', 'ts', 'py', 'java', 'cpp', 'c', 'go', 'rs', 'php', 'rb'].includes(ext || '')) {
      return {
        hasHeadings: false,
        hasCodeBlocks: true,
        hasTables: false,
        hasMarkdown: false,
        hasSQL: false,
        hasCSV: false,
        averageLineLength,
        totalLines
      };
    }
  }
  
  return {
    hasHeadings,
    hasCodeBlocks,
    hasTables,
    hasMarkdown,
    hasSQL,
    hasCSV,
    averageLineLength,
    totalLines
  };
}

/**
 * Scoring functions for each document type
 */
function calculatePlainTextScore(features: DocumentMetadata['features']): number {
  let score = 0.5; // Base score
  
  // Plain text characteristics
  if (!features.hasHeadings && !features.hasCodeBlocks && !features.hasTables) score += 0.3;
  if (features.averageLineLength > 50 && features.averageLineLength < 200) score += 0.2;
  if (features.totalLines > 10) score += 0.1;
  
  return Math.min(score, 1.0);
}

function calculateResearchTechnicalScore(features: DocumentMetadata['features']): number {
  let score = 0.2; // Base score
  
  // Research/technical characteristics
  if (features.hasHeadings) score += 0.4;
  if (features.hasMarkdown) score += 0.2;
  if (features.averageLineLength > 30) score += 0.1;
  if (features.totalLines > 20) score += 0.1;
  
  return Math.min(score, 1.0);
}

function calculateCodeScore(features: DocumentMetadata['features']): number {
  let score = 0.3; // Base score
  
  // Code characteristics
  if (features.hasCodeBlocks) score += 0.4;
  if (features.averageLineLength < 100) score += 0.2;
  if (features.totalLines > 5) score += 0.1;
  
  return Math.min(score, 1.0);
}

function calculateTableCSVSQLScore(features: DocumentMetadata['features']): number {
  let score = 0.2; // Base score
  
  // Table/CSV/SQL characteristics
  if (features.hasTables) score += 0.4;
  if (features.hasSQL) score += 0.3;
  if (features.hasCSV) score += 0.3;
  if (features.averageLineLength < 200) score += 0.1;
  
  return Math.min(score, 1.0);
}

function calculateMixedScore(features: DocumentMetadata['features']): number {
  let score = 0.1; // Base score
  
  // Mixed document characteristics (multiple features present)
  const featureCount = [
    features.hasHeadings,
    features.hasCodeBlocks, 
    features.hasTables,
    features.hasMarkdown
  ].filter(Boolean).length;
  
  if (featureCount >= 2) score += 0.3;
  if (featureCount >= 3) score += 0.2;
  
  return Math.min(score, 1.0);
}
