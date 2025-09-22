import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export interface PDFData {
  numpages: number;
  numrender: number;
  info: any;
  metadata: any;
  text: string;
  version: string;
}

export async function parsePDF(dataBuffer: Buffer): Promise<PDFData> {
  try {
    const options = {
      // Disable test file loading
      testMode: true,
      // Other pdf-parse options if needed
      max: 0, // 0 = unlimited
      pagerender: undefined
    };
    
    return await pdfParse(dataBuffer, options);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
}