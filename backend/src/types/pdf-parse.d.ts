declare module 'pdf-parse' {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: object;
    metadata: object;
    text: string;
    version: string;
  }

  function PDFParse(dataBuffer: Buffer): Promise<PDFData>;
  export default PDFParse;
}