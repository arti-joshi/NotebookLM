"""
PDF Parser Microservice
Layout-aware PDF parsing using PyMuPDF for proper text extraction with column/page order
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import fitz  # PyMuPDF
import io
import logging
from typing import List, Dict, Any
from pydantic import BaseModel
import tempfile
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="PDF Parser Service", version="1.0.0")

class TextBlock(BaseModel):
    """Represents a text block with position and metadata"""
    text: str
    page_num: int
    block_num: int
    bbox: List[float]  # [x0, y0, x1, y1]
    block_type: str
    font_size: float = 0.0
    font_flags: int = 0

class ParseResult(BaseModel):
    """Result of PDF parsing operation"""
    success: bool
    full_text: str
    blocks: List[TextBlock]
    page_count: int
    metadata: Dict[str, Any]
    error: str = None

def extract_text_blocks(pdf_document: fitz.Document) -> List[TextBlock]:
    """
    Extract text blocks from PDF with layout awareness
    Uses PyMuPDF's block detection to maintain proper reading order
    """
    blocks = []
    
    for page_num in range(len(pdf_document)):
        page = pdf_document[page_num]
        
        # Get text blocks with detailed information
        text_dict = page.get_text("dict")
        
        block_num = 0
        for block in text_dict["blocks"]:
            if "lines" in block:  # Text block
                # Extract text from all lines in the block
                block_text = ""
                font_size = 0.0
                font_flags = 0
                
                for line in block["lines"]:
                    for span in line["spans"]:
                        block_text += span["text"]
                        # Get font information from first span
                        if font_size == 0.0:
                            font_size = span.get("size", 0.0)
                            font_flags = span.get("flags", 0)
                    block_text += " "
                
                # Only add blocks with meaningful text
                if block_text.strip():
                    text_block = TextBlock(
                        text=block_text.strip(),
                        page_num=page_num + 1,  # 1-indexed
                        block_num=block_num,
                        bbox=block["bbox"],
                        block_type="text",
                        font_size=font_size,
                        font_flags=font_flags
                    )
                    blocks.append(text_block)
                    block_num += 1
            
            elif "image" in block:  # Image block
                # Add placeholder for images
                text_block = TextBlock(
                    text=f"[IMAGE: {block.get('width', 0)}x{block.get('height', 0)}]",
                    page_num=page_num + 1,
                    block_num=block_num,
                    bbox=block["bbox"],
                    block_type="image"
                )
                blocks.append(text_block)
                block_num += 1
    
    return blocks

def sort_blocks_reading_order(blocks: List[TextBlock]) -> List[TextBlock]:
    """
    Sort blocks in proper reading order:
    1. By page number
    2. By vertical position (top to bottom)
    3. By horizontal position (left to right) for same vertical level
    """
    def sort_key(block: TextBlock):
        # Primary: page number
        # Secondary: top position (y0)
        # Tertiary: left position (x0)
        return (block.page_num, block.bbox[1], block.bbox[0])
    
    return sorted(blocks, key=sort_key)

def detect_columns(blocks: List[TextBlock], page_num: int) -> List[List[TextBlock]]:
    """
    Detect column layout and group blocks accordingly
    Simple heuristic: if blocks have similar x-coordinates, they're in the same column
    """
    page_blocks = [b for b in blocks if b.page_num == page_num]
    if not page_blocks:
        return []
    
    # Group blocks by approximate x-coordinate (column detection)
    columns = {}
    tolerance = 50  # pixels
    
    for block in page_blocks:
        x_pos = block.bbox[0]  # left edge
        
        # Find existing column or create new one
        found_column = None
        for col_x in columns.keys():
            if abs(x_pos - col_x) <= tolerance:
                found_column = col_x
                break
        
        if found_column is not None:
            columns[found_column].append(block)
        else:
            columns[x_pos] = [block]
    
    # Sort columns left to right, and blocks within columns top to bottom
    sorted_columns = []
    for col_x in sorted(columns.keys()):
        column_blocks = sorted(columns[col_x], key=lambda b: b.bbox[1])  # sort by y-position
        sorted_columns.append(column_blocks)
    
    return sorted_columns

@app.post("/parse-pdf", response_model=ParseResult)
async def parse_pdf(file: UploadFile = File(...)):
    """
    Parse PDF with layout-aware text extraction
    Returns structured text blocks maintaining proper reading order
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        # Read file content
        content = await file.read()
        logger.info(f"Processing PDF: {file.filename} ({len(content)} bytes)")
        
        # Create temporary file for PyMuPDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Open PDF with PyMuPDF
            pdf_document = fitz.open(temp_file_path)
            
            # Extract metadata
            metadata = pdf_document.metadata
            page_count = len(pdf_document)
            
            # Extract text blocks with layout awareness
            raw_blocks = extract_text_blocks(pdf_document)
            
            # Sort blocks in proper reading order
            sorted_blocks = sort_blocks_reading_order(raw_blocks)
            
            # Build full text from sorted blocks
            full_text_parts = []
            current_page = 0
            
            for block in sorted_blocks:
                # Add page break markers
                if block.page_num != current_page:
                    if current_page > 0:
                        full_text_parts.append(f"\n\n--- Page {block.page_num} ---\n\n")
                    current_page = block.page_num
                
                full_text_parts.append(block.text)
                full_text_parts.append("\n\n")
            
            full_text = "".join(full_text_parts).strip()
            
            # Close PDF
            pdf_document.close()
            
            logger.info(f"Successfully parsed PDF: {len(sorted_blocks)} blocks, {len(full_text)} characters")
            
            return ParseResult(
                success=True,
                full_text=full_text,
                blocks=sorted_blocks,
                page_count=page_count,
                metadata=metadata or {}
            )
            
        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_file_path)
            except Exception as e:
                logger.warning(f"Failed to delete temp file: {e}")
    
    except Exception as e:
        logger.error(f"Error parsing PDF {file.filename}: {str(e)}")
        return ParseResult(
            success=False,
            full_text="",
            blocks=[],
            page_count=0,
            metadata={},
            error=str(e)
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "pdf-parser"}

@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "service": "PDF Parser Microservice",
        "version": "1.0.0",
        "description": "Layout-aware PDF parsing using PyMuPDF",
        "endpoints": {
            "parse": "POST /parse-pdf",
            "health": "GET /health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
