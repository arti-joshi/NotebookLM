import { useEffect, useState, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, BookOpen, StickyNote, Search, Download, MenuIcon } from 'lucide-react'
import { useParams } from 'react-router-dom'
import PostgresTableOfContents from '../components/PostgresTableOfContents'
import ChatWidget from '../components/ChatWidget.jsx'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

function ReaderPage() {
  const { id } = useParams()
  const [fileUrl, setFileUrl] = useState('')
  const [documentTitle, setDocumentTitle] = useState('')
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [rotation, setRotation] = useState(0)
  const [notes, setNotes] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showNotes, setShowNotes] = useState(true)
  const [showTOC, setShowTOC] = useState(false)
  const [postgresSearch, setPostgresSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const documentRef = useRef(null)

  // Hide global floating chat; we'll render embedded full-size chat here
  useEffect(() => {
    try { document.body.classList.add('hide-floating-chat') } catch {}
    return () => { try { document.body.classList.remove('hide-floating-chat') } catch {} }
  }, [])

  useEffect(() => {
    async function loadDocument() {
      setIsLoading(true)
      try {
        if (!id) {
          // By default, load PostgreSQL documentation
          setFileUrl('/data/postgres_docs/pdf/postgresql.pdf')
          setDocumentTitle('PostgreSQL Documentation')
          setShowTOC(true)
        } else if (id === 'postgres-official') {
          // Load official PostgreSQL documentation (same as default)
          setFileUrl('/data/postgres_docs/pdf/postgresql.pdf')
          setDocumentTitle('PostgreSQL Documentation')
          setShowTOC(true)
        } else {
          // Load regular document
          const response = await fetch(`/api/documents/${id}`)
          const data = await response.json()
          setFileUrl(data.url)
          setDocumentTitle(data.originalName)
          setShowTOC(false)
        }
      } catch (error) {
        console.error('Failed to load document:', error)
        setError('Failed to load document. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadDocument()
  }, [id])

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages)
    setIsLoading(false)
    setError('')
  }

  function onLoadError(error) {
    setIsLoading(false)
    setError('Failed to load PDF. Please check the URL.')
    setNumPages(0)
  }

  const progress = numPages ? Math.round((pageNumber / numPages) * 100) : 0

  const goToPage = (page) => {
    const newPage = Math.max(1, Math.min(numPages, page))
    setPageNumber(newPage)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') goToPage(pageNumber - 1)
    if (e.key === 'ArrowRight') goToPage(pageNumber + 1)
    if (e.key === 'Home') goToPage(1)
    if (e.key === 'End') goToPage(numPages)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pageNumber, numPages])

  const saveNote = (content) => {
    setNotes(prev => ({ ...prev, [pageNumber]: content }))
    // TODO: Save to backend API
  }

  // PostgreSQL documentation search
  useEffect(() => {
    async function searchPostgresDocs() {
      if (!postgresSearch || !id === 'postgres-official') return setSearchResults([]);
      
      try {
        const response = await fetch(`/api/postgres-docs/search?q=${encodeURIComponent(postgresSearch)}`);
        const data = await response.json();
        setSearchResults(data.results);
      } catch (error) {
        console.error('Failed to search PostgreSQL docs:', error);
        setSearchResults([]);
      }
    }

    const debounceTimer = setTimeout(searchPostgresDocs, 300);
    return () => clearTimeout(debounceTimer);
  }, [postgresSearch]);

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      {/* Table of Contents */}
      {id === 'postgres-official' && showTOC && (
        <div className="col-span-3 space-y-4">
          <PostgresTableOfContents onNavigate={goToPage} currentPage={pageNumber} />
        </div>
      )}

      {/* Main area: Chatbot */}
      <div className={`${showNotes ? (showTOC ? 'col-span-5' : 'col-span-8') : (showTOC ? 'col-span-9' : 'col-span-12')} space-y-4`}>
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                Chat
              </h1>
            </div>
            {id === 'postgres-official' && (
              <button
                onClick={() => setShowTOC(!showTOC)}
                className={`p-2 rounded-lg transition-colors duration-200 mr-2 ${
                  showTOC
                    ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                title={showTOC ? 'Hide contents' : 'Show contents'}
              >
                <MenuIcon className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                showNotes 
                  ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
              title={showNotes ? 'Hide notes' : 'Show notes'}
            >
              <StickyNote className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600 dark:text-gray-300 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              {progress}% Complete
            </div>
          </div>
        </div>

        {/* Embedded full-screen Chat */}
        <div className="h-full">
          <ChatWidget fullScreen />
        </div>
      </div>

      {/* Notes Panel and Document Viewer moved to right column */}
      {showNotes && (
        <div className="col-span-4 space-y-4 overflow-y-auto">
          {/* Compact Document Viewer panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="font-medium text-sm truncate">{documentTitle || 'Document'}</div>
              <div className="text-xs text-gray-500">{progress}%</div>
            </div>
            <div className="h-64 overflow-auto flex justify-center items-start p-3 bg-gray-50 dark:bg-gray-900">
              {fileUrl && !error ? (
                <div ref={documentRef}>
                  <Document file={fileUrl} onLoadSuccess={onLoadSuccess} onLoadError={onLoadError} loading={<div className="flex items-center justify-center p-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div></div>}>
                    <Page pageNumber={pageNumber} scale={0.8} rotate={rotation} renderTextLayer={false} renderAnnotationLayer={false} />
                  </Document>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                  <div className="text-xs text-gray-500">No Document Loaded</div>
                </div>
              )}
            </div>
          </div>
          {/* PostgreSQL Search Section */}
          {id === 'postgres-official' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-medium text-sm mb-3">Search Documentation</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={postgresSearch}
                    onChange={(e) => setPostgresSearch(e.target.value)}
                    placeholder="Search PostgreSQL docs..."
                    className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {searchResults.map((result) => (
                    <button
                      key={result.page}
                      onClick={() => goToPage(result.page)}
                      className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          Page {result.page}
                        </span>
                        <span className="text-xs text-gray-500">{result.section}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {result.preview}
                      </p>
                    </button>
                  ))}
                  {postgresSearch && searchResults.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                      No results found
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <StickyNote className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Notes</span>
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page {pageNumber}
            </div>
          </div>

          {/* Search Notes */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Current Page Notes */}
          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">Current Page Notes</h3>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {notes[pageNumber]?.length || 0} characters
                </div>
              </div>
              <textarea 
                value={notes[pageNumber] || ''} 
                onChange={(e) => saveNote(e.target.value)}
                className="w-full h-40 px-3 py-2 text-sm border rounded-lg dark:bg-gray-900 dark:border-gray-600 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                placeholder="Write your notes for this page..."
              />
            </div>

            {/* All Notes Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-medium text-sm mb-3">All Notes</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(notes)
                  .filter(([page, note]) => note.trim() && 
                    (!searchTerm || note.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map(([page, note]) => (
                    <div 
                      key={page}
                      onClick={() => goToPage(parseInt(page))}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          Page {page}
                        </span>
                        {parseInt(page) === pageNumber && (
                          <span className="text-xs text-green-600 dark:text-green-400">Current</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {note}
                      </p>
                    </div>
                  ))}
                {Object.keys(notes).filter(page => notes[page].trim()).length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <StickyNote className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notes yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-medium text-sm mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200">
                  <Download className="w-4 h-4" />
                  <span>Export Notes</span>
                </button>
                <button 
                  onClick={() => goToPage(1)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Go to Beginning</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReaderPage