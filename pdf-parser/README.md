# PDF Parser Microservice

Layout-aware PDF parsing using PyMuPDF for proper text extraction with column/page order.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the service:
```bash
uvicorn app:app --port 8001 --reload
```

3. Test with curl:
```bash
curl -F "file=@sample.pdf" http://localhost:8001/parse-pdf
```

## Features

- **Layout-aware parsing**: Maintains proper reading order and column detection
- **Block-level extraction**: Returns structured text blocks with position metadata
- **Multi-column support**: Automatically detects and handles column layouts
- **Font information**: Extracts font size and formatting flags
- **Image detection**: Identifies and marks image blocks
- **Page markers**: Adds clear page break indicators

## API Endpoints

- `POST /parse-pdf` - Parse PDF file and return structured text
- `GET /health` - Health check
- `GET /` - Service information

## Response Format

```json
{
  "success": true,
  "full_text": "Complete text with proper ordering...",
  "blocks": [
    {
      "text": "Block content",
      "page_num": 1,
      "block_num": 0,
      "bbox": [x0, y0, x1, y1],
      "block_type": "text",
      "font_size": 12.0,
      "font_flags": 0
    }
  ],
  "page_count": 5,
  "metadata": {...}
}
```
