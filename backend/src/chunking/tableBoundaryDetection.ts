/**
 * Table Boundary Detection System
 * Advanced detection of table start/end boundaries for academic content
 */

export interface TableBoundary {
  startLine: number;
  endLine: number;
  type: 'academic_matrix' | 'grading_table' | 'assessment_criteria' | 'curriculum_data' | 'unknown';
  confidence: number; // 0-1 confidence score
  patterns: string[]; // Detected patterns
}

export interface TableDetectionResult {
  boundaries: TableBoundary[];
  totalTables: number;
  averageConfidence: number;
  detectionReport: string[];
}

/**
 * Main table boundary detection function
 */
export function detectTableBoundaries(lines: string[]): TableDetectionResult {
  console.log('🔍 [TABLE BOUNDARY DETECTION] Starting detection for', lines.length, 'lines');
  
  const result: TableDetectionResult = {
    boundaries: [],
    totalTables: 0,
    averageConfidence: 0,
    detectionReport: []
  };
  
  let i = 0;
  while (i < lines.length) {
    const boundary = detectTableBoundaryAtLine(lines, i);
    
    if (boundary) {
      result.boundaries.push(boundary);
      result.totalTables++;
      
      console.log(`📊 [TABLE BOUNDARY] Found table at lines ${boundary.startLine}-${boundary.endLine}, type: ${boundary.type}, confidence: ${boundary.confidence}`);
      
      // Skip to end of table
      i = boundary.endLine + 1;
    } else {
      i++;
    }
  }
  
  // Calculate average confidence
  if (result.boundaries.length > 0) {
    result.averageConfidence = result.boundaries.reduce((sum, b) => sum + b.confidence, 0) / result.boundaries.length;
  }
  
  // Generate report
  result.detectionReport = generateDetectionReport(result);
  
  console.log(`🎯 [TABLE BOUNDARY DETECTION] Complete: ${result.totalTables} tables found, avg confidence: ${result.averageConfidence.toFixed(2)}`);
  return result;
}

/**
 * Detect table boundary starting at a specific line
 */
function detectTableBoundaryAtLine(lines: string[], startLine: number): TableBoundary | null {
  const line = lines[startLine]?.trim();
  if (!line) return null;
  
  // Check for academic matrix patterns
  const academicMatrix = detectAcademicMatrixBoundary(lines, startLine);
  if (academicMatrix) return academicMatrix;
  
  // Check for grading table patterns
  const gradingTable = detectGradingTableBoundary(lines, startLine);
  if (gradingTable) return gradingTable;
  
  // Check for assessment criteria patterns
  const assessmentCriteria = detectAssessmentCriteriaBoundary(lines, startLine);
  if (assessmentCriteria) return assessmentCriteria;
  
  // Check for curriculum data patterns
  const curriculumData = detectCurriculumDataBoundary(lines, startLine);
  if (curriculumData) return curriculumData;
  
  return null;
}

/**
 * Detect academic matrix boundaries (CO/PO matrices)
 */
function detectAcademicMatrixBoundary(lines: string[], startLine: number): TableBoundary | null {
  const line = lines[startLine]?.trim();
  if (!line) return null;
  
  // Check if line matches academic matrix pattern
  const academicMatrixPattern = /^(CO|PO|LO)\d*\s+[\d\s\-]+$/;
  if (!academicMatrixPattern.test(line)) return null;
  
  console.log(`🎓 [ACADEMIC MATRIX] Potential matrix start at line ${startLine}: "${line}"`);
  
  let endLine = startLine;
  let confidence = 0.8; // Base confidence
  const patterns: string[] = ['academic_matrix_pattern'];
  
  // Look for consecutive matrix lines
  for (let i = startLine + 1; i < lines.length; i++) {
    const nextLine = lines[i]?.trim();
    if (!nextLine) break;
    
    // Check if next line is also a matrix line
    if (academicMatrixPattern.test(nextLine)) {
      endLine = i;
      confidence += 0.1; // Increase confidence for each consecutive line
      patterns.push(`consecutive_matrix_line_${i}`);
    } else {
      // Check if it's a related pattern (like headers or separators)
      if (isMatrixRelatedLine(nextLine)) {
        endLine = i;
        confidence += 0.05;
        patterns.push(`matrix_related_line_${i}`);
      } else {
        break;
      }
    }
  }
  
  // Cap confidence at 1.0
  confidence = Math.min(confidence, 1.0);
  
  // Must have at least 2 lines to be considered a table
  if (endLine > startLine) {
    return {
      startLine,
      endLine,
      type: 'academic_matrix',
      confidence,
      patterns
    };
  }
  
  return null;
}

/**
 * Detect grading table boundaries
 */
function detectGradingTableBoundary(lines: string[], startLine: number): TableBoundary | null {
  const line = lines[startLine]?.trim();
  if (!line) return null;
  
  // Check if line matches grading pattern
  const gradingPattern = /^\s*\w+\s+[\d\s\-\.]+$/;
  if (!gradingPattern.test(line)) return null;
  
  const words = line.split(/\s+/);
  const numericWords = words.filter(word => /^\d+$/.test(word) || /^\-$/.test(word));
  
  // Must have at least 3 numeric values
  if (numericWords.length < 3) return null;
  
  console.log(`📊 [GRADING TABLE] Potential grading table start at line ${startLine}: "${line}"`);
  
  let endLine = startLine;
  let confidence = 0.7; // Base confidence
  const patterns: string[] = ['grading_pattern'];
  
  // Look for consecutive grading lines
  for (let i = startLine + 1; i < lines.length; i++) {
    const nextLine = lines[i]?.trim();
    if (!nextLine) break;
    
    if (gradingPattern.test(nextLine)) {
      const nextWords = nextLine.split(/\s+/);
      const nextNumericWords = nextWords.filter(word => /^\d+$/.test(word) || /^\-$/.test(word));
      
      // Check if structure is similar (similar number of columns)
      if (Math.abs(nextWords.length - words.length) <= 2) {
        endLine = i;
        confidence += 0.1;
        patterns.push(`consecutive_grading_line_${i}`);
      } else {
        break;
      }
    } else {
      break;
    }
  }
  
  confidence = Math.min(confidence, 1.0);
  
  if (endLine > startLine) {
    return {
      startLine,
      endLine,
      type: 'grading_table',
      confidence,
      patterns
    };
  }
  
  return null;
}

/**
 * Detect assessment criteria boundaries
 */
function detectAssessmentCriteriaBoundary(lines: string[], startLine: number): TableBoundary | null {
  const line = lines[startLine]?.trim();
  if (!line) return null;
  
  // Check for assessment criteria patterns
  const assessmentPatterns = [
    /^\s*\w+\s+[\d\s\-]+$/, // Basic assessment pattern
    /^\s*[A-Z]+\d*\s+[\d\s\-]+$/, // Assessment codes
    /^\s*\w+\s+[\d\s\-\.]+$/ // Assessment with decimals
  ];
  
  let matchesPattern = false;
  for (const pattern of assessmentPatterns) {
    if (pattern.test(line)) {
      matchesPattern = true;
      break;
    }
  }
  
  if (!matchesPattern) return null;
  
  console.log(`📋 [ASSESSMENT CRITERIA] Potential assessment table start at line ${startLine}: "${line}"`);
  
  let endLine = startLine;
  let confidence = 0.6; // Base confidence
  const patterns: string[] = ['assessment_pattern'];
  
  // Look for consecutive assessment lines
  for (let i = startLine + 1; i < lines.length; i++) {
    const nextLine = lines[i]?.trim();
    if (!nextLine) break;
    
    let nextMatches = false;
    for (const pattern of assessmentPatterns) {
      if (pattern.test(nextLine)) {
        nextMatches = true;
        break;
      }
    }
    
    if (nextMatches) {
      endLine = i;
      confidence += 0.1;
      patterns.push(`consecutive_assessment_line_${i}`);
    } else {
      break;
    }
  }
  
  confidence = Math.min(confidence, 1.0);
  
  if (endLine > startLine) {
    return {
      startLine,
      endLine,
      type: 'assessment_criteria',
      confidence,
      patterns
    };
  }
  
  return null;
}

/**
 * Detect curriculum data boundaries
 */
function detectCurriculumDataBoundary(lines: string[], startLine: number): TableBoundary | null {
  const line = lines[startLine]?.trim();
  if (!line) return null;
  
  // Check for curriculum data patterns
  const curriculumPatterns = [
    /^\s*\w+\s+[\d\s\-]+$/, // Basic curriculum pattern
    /^\s*[A-Z]+\d*\s+[\d\s\-]+$/, // Course codes
    /^\s*\w+\s+[\d\s\-\.]+$/ // Curriculum with decimals
  ];
  
  let matchesPattern = false;
  for (const pattern of curriculumPatterns) {
    if (pattern.test(line)) {
      matchesPattern = true;
      break;
    }
  }
  
  if (!matchesPattern) return null;
  
  console.log(`📚 [CURRICULUM DATA] Potential curriculum table start at line ${startLine}: "${line}"`);
  
  let endLine = startLine;
  let confidence = 0.6; // Base confidence
  const patterns: string[] = ['curriculum_pattern'];
  
  // Look for consecutive curriculum lines
  for (let i = startLine + 1; i < lines.length; i++) {
    const nextLine = lines[i]?.trim();
    if (!nextLine) break;
    
    let nextMatches = false;
    for (const pattern of curriculumPatterns) {
      if (pattern.test(nextLine)) {
        nextMatches = true;
        break;
      }
    }
    
    if (nextMatches) {
      endLine = i;
      confidence += 0.1;
      patterns.push(`consecutive_curriculum_line_${i}`);
    } else {
      break;
    }
  }
  
  confidence = Math.min(confidence, 1.0);
  
  if (endLine > startLine) {
    return {
      startLine,
      endLine,
      type: 'curriculum_data',
      confidence,
      patterns
    };
  }
  
  return null;
}

/**
 * Check if line is related to matrix (headers, separators, etc.)
 */
function isMatrixRelatedLine(line: string): boolean {
  const trimmed = line.trim();
  
  // Check for headers
  if (/^(CO|PO|LO|Course|Outcome|Program)/i.test(trimmed)) {
    return true;
  }
  
  // Check for separators
  if (/^[\-\=\+]+$/.test(trimmed)) {
    return true;
  }
  
  // Check for empty lines (but not too many)
  if (trimmed.length === 0) {
    return true;
  }
  
  return false;
}

/**
 * Generate detection report
 */
function generateDetectionReport(result: TableDetectionResult): string[] {
  const report: string[] = [];
  
  report.push(`📊 Table Boundary Detection Report:`);
  report.push(`   Total tables found: ${result.totalTables}`);
  report.push(`   Average confidence: ${result.averageConfidence.toFixed(2)}`);
  
  for (const boundary of result.boundaries) {
    report.push(`   📋 Table ${boundary.startLine}-${boundary.endLine}: ${boundary.type} (confidence: ${boundary.confidence.toFixed(2)})`);
    report.push(`      Patterns: ${boundary.patterns.join(', ')}`);
  }
  
  return report;
}

/**
 * Quick fix: Prevent table splitting by implementing table boundary lock
 */
export function implementTableBoundaryLock(
  lines: string[], 
  config: { maxChunkSize: number; preserveTableIntegrity: boolean }
): { lockedBoundaries: TableBoundary[]; canSplitAtLine: (lineIndex: number) => boolean } {
  
  if (!config.preserveTableIntegrity) {
    return {
      lockedBoundaries: [],
      canSplitAtLine: () => true
    };
  }
  
  const boundaries = detectTableBoundaries(lines);
  
  return {
    lockedBoundaries: boundaries.boundaries,
    canSplitAtLine: (lineIndex: number) => {
      // Check if line is inside any table boundary
      for (const boundary of boundaries.boundaries) {
        if (lineIndex >= boundary.startLine && lineIndex <= boundary.endLine) {
          return false; // Cannot split inside table
        }
      }
      return true; // Can split outside tables
    }
  };
}
