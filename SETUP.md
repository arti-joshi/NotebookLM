# MyNotebookLM Setup Guide

## 🚀 Quick Start

### 1. Start All Services
```bash
# Option 1: Use the batch file (Windows)
start-services.bat

# Option 2: Start manually
# Terminal 1: PDF Parser Service
cd pdf-parser
pip install -r requirements.txt
uvicorn app:app --port 8001 --reload

# Terminal 2: Backend Service
cd backend
npm install
npm run dev

# Terminal 3: Frontend Service
cd frontend
npm install
npm run dev
```

### 2. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4001
- **PDF Parser**: http://localhost:8001

## 📋 Prerequisites

### Required Software
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** (v12 or higher) with pgvector extension

### Required Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/mynotebooklm"

# Google AI Configuration (for embeddings and chat)
GOOGLE_API_KEY="your_google_api_key_here"

# Python PDF Service Configuration
PYTHON_PDF_SERVICE_URL="http://localhost:8001"

# Processing Configuration
CHAT_EMBED_TIMEOUT_MS=3000
CHAT_LLM_TIMEOUT_MS=15000
CHAT_MODEL="gemini-1.5-flash"
PDF_PARSE_TIMEOUT_MS=60000
MAX_PDF_SIZE_MB=50
```

## 🗄️ Database Setup

### 1. Install PostgreSQL with pgvector
```bash
# Install PostgreSQL
# Then install pgvector extension
# See: https://github.com/pgvector/pgvector#installation
```

### 2. Create Database
```sql
CREATE DATABASE mynotebooklm;
```

### 3. Run Migrations
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

### 4. Test pgvector (Optional)
```bash
cd backend
node test-pgvector.js
```

## 🧠 Chunking Strategy Overview

### Multi-Layered Chunking System

#### 1. **Document Type Detection**
- Automatically detects: Plain Text, Research/Technical, Code, Tables/CSV/SQL, Mixed
- Uses content analysis and file extensions

#### 2. **Adaptive PDF Chunking**
- **Layout-aware parsing** using PyMuPDF
- **Semantic section detection** with heading recognition
- **Intelligent overlap** (20% by default)
- **Structure preservation** for tables and images

#### 3. **Chunking Strategies**
- **Plain Text**: Character-based splitting with overlap
- **Research/Technical**: Section-based chunking preserving semantic coherence
- **Code**: Function/block-aware chunking
- **Tables/CSV/SQL**: Structure-preserving chunking
- **Mixed**: Multi-strategy approach

#### 4. **Database Integration**
- **Batch processing** with rate limiting
- **pgvector support** for similarity search
- **Optimized embeddings** generation
- **Duplicate detection** and processing status tracking

### Configuration Options

#### Chunking Presets
```typescript
// General documents
CHUNKING_PRESETS.GENERAL = {
  chunkSize: 1000,
  overlap: 200,
  minChunkSize: 100,
  maxChunkSize: 2000
}

// Research papers
CHUNKING_PRESETS.RESEARCH = {
  chunkSize: 1200,
  overlap: 300,
  minChunkSize: 150,
  maxChunkSize: 2500
}

// Code files
CHUNKING_PRESETS.CODE = {
  chunkSize: 1500,
  overlap: 100,
  minChunkSize: 200,
  maxChunkSize: 3000
}
```

#### Adaptive PDF Configuration
```typescript
DEFAULT_ADAPTIVE_CONFIG = {
  targetChunkSize: 1000,
  maxChunkSize: 1500,
  minChunkSize: 300,
  overlapPercentage: 0.20,
  respectSectionBoundaries: true,
  preserveTableIntegrity: true,
  detectHeadingsByFont: true,
  detectHeadingsByPattern: true
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. PDF Parser Not Starting
```bash
# Check if Python dependencies are installed
cd pdf-parser
pip install -r requirements.txt

# Check if port 8001 is available
netstat -an | findstr :8001
```

#### 2. Backend Database Connection Issues
```bash
# Check database connection
cd backend
npx prisma db push

# Test pgvector
node test-pgvector.js
```

#### 3. Frontend Not Loading
```bash
# Check if all services are running
curl http://localhost:4001/health
curl http://localhost:8001/health
```

### Performance Optimization

#### For Large Documents
- Increase `PDF_PARSE_TIMEOUT_MS` for complex PDFs
- Adjust `MAX_PDF_SIZE_MB` based on your needs
- Use batch processing for multiple documents

#### For High Volume
- Increase `BATCH_SIZE` in database integration
- Adjust `BATCH_DELAY_MS` for API rate limits
- Monitor memory usage during processing

## 📊 Monitoring

### Health Checks
- **Backend**: `GET /health`
- **PDF Parser**: `GET /health`
- **RAG Status**: `GET /rag/status`

### Database Cleanup
```bash
# Show current stats
node cleanup.js

# Clear all data (with confirmation)
node cleanup.js --all

# Clear specific user data
node cleanup.js --user <userId>

# Clear specific document
node cleanup.js --source <filename>
```

## 🎯 Demo Credentials
- **Email**: demo@admin.com
- **Password**: 123456

## 📚 API Endpoints

### Authentication
- `POST /auth/login` - Login
- `GET /auth/whoami` - Get current user
- `POST /auth/logout` - Logout

### Document Processing
- `POST /files/upload` - Upload and process documents
- `GET /documents` - List user documents
- `GET /documents/:id/status` - Get processing status

### AI Chat
- `POST /ai/chat` - Chat with AI using RAG
- `GET /ai/chat-sambanova/stream` - Stream chat responses

### Data Management
- `GET /notes` - List user notes
- `GET /progress` - List reading progress
- `GET /embeddings` - List embeddings/chunks
