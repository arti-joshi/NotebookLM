const { PrismaClient } = require('./generated/prisma')
const crypto = require('crypto')
const path = require('path')
const fs = require('fs/promises')

// Parse CHUNK_LIMIT from CLI flag --limit=N or env CHUNK_LIMIT
function parseChunkLimit() {
	let cliLimit
	for (let i = 2; i < process.argv.length; i++) {
		const arg = process.argv[i]
		if (arg.startsWith('--limit=')) {
			const val = Number(arg.split('=')[1])
			if (Number.isFinite(val) && val > 0) cliLimit = val
		}
		if (arg === '--limit' && i + 1 < process.argv.length) {
			const val = Number(process.argv[i + 1])
			if (Number.isFinite(val) && val > 0) cliLimit = val
		}
	}
	const envLimit = Number(process.env.CHUNK_LIMIT)
	if (Number.isFinite(cliLimit)) return cliLimit
	if (Number.isFinite(envLimit) && envLimit > 0) return envLimit
	return undefined
}

const CHUNK_LIMIT = parseChunkLimit()

async function reprocessPostgreSQL17() {
	const prisma = new PrismaClient()
	
	try {
		console.log('🚀 Starting complete PostgreSQL 17 reprocessing...\n')
		if (Number.isFinite(CHUNK_LIMIT)) {
			console.log(`⏱️  Chunk limit enabled: processing up to ${CHUNK_LIMIT} chunks`)
		}
		
		// Import LangChain services dynamically
		let PDFLoader, RecursiveCharacterTextSplitter, GoogleGenerativeAIEmbeddings
		try {
			const langchain = await import('langchain/document_loaders/fs/pdf')
			PDFLoader = langchain.PDFLoader
			
			const textSplitter = await import('langchain/text_splitter')
			RecursiveCharacterTextSplitter = textSplitter.RecursiveCharacterTextSplitter
			
			const embeddings = await import('@langchain/google-genai')
			GoogleGenerativeAIEmbeddings = embeddings.GoogleGenerativeAIEmbeddings
		} catch (error) {
			console.error('❌ Failed to import LangChain modules:', error.message)
			return
		}
		
		// Enhanced content type detection for PostgreSQL documentation
		function detectContentType(text) {
			const lowerText = text.toLowerCase();
			
			// Enhanced SQL pattern detection
			const sqlPatterns = [
				/\b(create|insert|select|update|delete|alter|drop|grant|revoke)\s+/i,
				/\b(explain|analyze|vacuum|reindex|cluster)\s+/i,
				/\b(begin|commit|rollback|savepoint)\s+/i,
				/\b(declare|fetch|open|close|cursor)\s+/i,
				/\b(function|procedure|trigger|view|index)\s+/i,
				/\b(union|intersect|except|with)\s+/i,
				/\b(inner|left|right|full|outer)\s+join/i,
				/\b(group\s+by|order\s+by|having|where)\s+/i,
				/\b(limit|offset|distinct|all)\s+/i
			];
			
			const hasSqlPattern = sqlPatterns.some(pattern => pattern.test(text));
			if (hasSqlPattern) return "sql_example";
			
			// Enhanced table detection
			const tablePattern = /\|.*\|.*\n.*---/;
			if (tablePattern.test(text)) return "table";
			
			// Enhanced warning detection
			const warningPatterns = [
				/\b(note|caution|warning|important|tip|hint):/i,
				/\b(be\s+aware|remember|notice|attention):/i,
				/\b(deprecated|obsolete|removed|changed):/i,
				/\b(security|permission|privilege|access):/i
			];
			
			const hasWarningPattern = warningPatterns.some(pattern => pattern.test(text));
			if (hasWarningPattern) return "warning";
			
			return "text";
		}
		
		// Find the PostgreSQL 17 document
		const pgDoc = await prisma.document.findFirst({
			where: { 
				filename: 'postgresql-17-A4.pdf',
				isSystemDocument: true 
			}
		})
		
		if (!pgDoc) {
			console.log('❌ PostgreSQL 17 document not found')
			return
		}
		
		console.log(`📄 Processing: ${pgDoc.filename}`)
		console.log(`   File size: ${(pgDoc.fileSize / 1024 / 1024).toFixed(2)} MB`)
		
		// Update document status to processing
		await prisma.document.update({
			where: { id: pgDoc.id },
			data: {
				status: 'PROCESSING',
				startedAt: new Date(),
				processingError: null
			}
		})
		
		console.log('✅ Document status updated to PROCESSING')
		
		// Initialize embeddings
		console.log('🔧 Initializing Google AI embeddings...')
		const embeddings = new GoogleGenerativeAIEmbeddings({
			apiKey: process.env.GOOGLE_API_KEY,
			modelName: "text-embedding-004"
		})
		
		// Load PDF
		const pgDocPath = path.join(process.cwd(), 'system-documents', 'postgresql', 'postgresql-17-A4.pdf')
		console.log(`📖 Loading PDF from: ${pgDocPath}`)
		
		const loader = new PDFLoader(pgDocPath, {
			splitPages: true,
			parsedItemSeparator: '\n\n'
		})
		
		const docs = await loader.load()
		console.log(`✅ Loaded ${docs.length} pages from PDF`)
		
		// Configure text splitter for PostgreSQL documentation
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 200,
			separators: [
				"\n## ", // Section headers
				"\n### ", // Subsection headers
				"\n\n",  // Paragraphs
				"\n",    // Lines
				". ",    // Sentences
				" ",     // Words
				""       // Characters
			],
			keepSeparator: true
		})
		
		// Split into chunks
		console.log('✂️  Splitting document into chunks...')
		let splitDocs = await splitter.splitDocuments(docs)

		// Apply optional chunk limit for sampling / faster validation runs
		if (Number.isFinite(CHUNK_LIMIT)) {
			const original = splitDocs.length
			splitDocs = splitDocs.slice(0, CHUNK_LIMIT)
			console.log(`⚠️  Limiting chunks: ${splitDocs.length}/${original} (CHUNK_LIMIT=${CHUNK_LIMIT})`)
		}
		const totalChunks = splitDocs.length
		
		console.log(`✅ Created ${totalChunks} chunks`)
		console.log(`📊 Expected processing time: ${Math.ceil(totalChunks / 10)} minutes`)
		
		// Update document with total chunks
		await prisma.document.update({
			where: { id: pgDoc.id },
			data: { totalChunks }
		})
		
		// Process chunks in batches
		const BATCH_SIZE = 5 // Smaller batches to avoid rate limits
		let processedCount = 0
		const startTime = Date.now()
		
		console.log(`🔄 Processing chunks in batches of ${BATCH_SIZE}...`)
		
		for (let i = 0; i < splitDocs.length; i += BATCH_SIZE) {
			const batch = splitDocs.slice(i, Math.min(i + BATCH_SIZE, splitDocs.length))
			const batchStartTime = Date.now()
			
			try {
				// Process batch
				const chunkPromises = batch.map(async (doc, idx) => {
					const chunkText = doc.pageContent.trim()
					if (!chunkText) return null
					
					// Generate embedding
					const embedding = await embeddings.embedQuery(chunkText)
					
					// Detect content type
					const contentType = detectContentType(chunkText)
					
					// Extract metadata
					const pageNum = doc.metadata?.loc?.pageNumber ?? doc.metadata?.pdf?.page
					
					// Create comprehensive metadata
					const metadata = {
						pageNumber: typeof pageNum === 'number' ? pageNum : null,
						contentType,
						hasTable: contentType === 'table',
						hasImage: /!\[.*?\]\(.*?\)/.test(chunkText),
						chunkIndex: i + idx,
						totalChunks,
						source: pgDoc.filename,
						processingDate: new Date().toISOString()
					};

					return {
						documentId: pgDoc.id,
						userId: pgDoc.userId,
						source: pgDoc.filename,
						chunk: chunkText,
						chunkIndex: i + idx,
						totalChunks,
						embedding,
						contentType,
						wordCount: chunkText.split(/\s+/).length,
						pageNumber: typeof pageNum === 'number' ? pageNum : undefined,
						hasTable: contentType === 'table',
						hasImage: /!\[.*?\]\(.*?\)/.test(chunkText),
						metadata
					}
				})
				
				// Wait for batch completion
				const validChunks = (await Promise.all(chunkPromises)).filter(chunk => chunk !== null)
				
				// Insert chunks
				await prisma.embedding.createMany({
					data: validChunks,
					skipDuplicates: true
				})
				
				processedCount += validChunks.length
				
				// Update progress
				const batchTime = (Date.now() - batchStartTime) / 1000
				const totalTime = (Date.now() - startTime) / 1000
				const chunksPerSecond = processedCount / totalTime
				const estimatedSecondsLeft = (totalChunks - processedCount) / chunksPerSecond
				
				await prisma.document.update({
					where: { id: pgDoc.id },
					data: { processedChunks: processedCount }
				})
				
				const percentComplete = Math.round((processedCount / totalChunks) * 100)
				console.log(
					`✅ Progress: ${processedCount}/${totalChunks} chunks (${percentComplete}%)\n` +
					`   • Batch time: ${batchTime.toFixed(1)}s\n` +
					`   • Speed: ${chunksPerSecond.toFixed(1)} chunks/second\n` +
					`   • ETA: ${Math.ceil(estimatedSecondsLeft / 60)} minutes`
				)
				
				// Rate limiting delay
				if (i + BATCH_SIZE < splitDocs.length) {
					await new Promise(resolve => setTimeout(resolve, 1000))
				}
				
			} catch (batchError) {
				console.error(`❌ Error processing batch ${i}-${i + BATCH_SIZE}:`, batchError.message)
				processedCount += batch.length // Count failed chunks
			}
		}
		
		// Mark as completed
		await prisma.document.update({
			where: { id: pgDoc.id },
			data: {
				status: 'COMPLETED',
				processedChunks: processedCount,
				completedAt: new Date()
			}
		})
		
		const totalTime = (Date.now() - startTime) / 1000 / 60
		console.log(`\n🎉 Reprocessing finished.`)
		console.log(`   • Total chunks processed: ${processedCount}`)
		console.log(`   • Processing time: ${totalTime.toFixed(1)} minutes`)
		console.log(`   • Limit: ${Number.isFinite(CHUNK_LIMIT) ? CHUNK_LIMIT : 'none'}`)
		
	} catch (error) {
		console.error('❌ Error during reprocessing:', error)
		// Best-effort status update is omitted to avoid referencing pgDoc if undefined
	} 
}

// Old detectContentType function removed - now using enhanced version above

// Execute if run directly
if (require.main === module) {
	reprocessPostgreSQL17().catch(err => {
		console.error(err)
		process.exit(1)
	})
}