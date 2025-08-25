// import { useEffect, useState } from 'react'
// import { Document, Page, pdfjs } from 'react-pdf'

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

// function ReaderPage() {
//   const [fileUrl, setFileUrl] = useState('')
//   const [numPages, setNumPages] = useState(0)
//   const [pageNumber, setPageNumber] = useState(1)
//   const [notes, setNotes] = useState({})

//   useEffect(() => {
//     // placeholder: later pull last-opened doc from backend
//   }, [])

//   function onLoadSuccess({ numPages }) {
//     setNumPages(numPages)
//   }

//   const progress = numPages ? Math.round((pageNumber / numPages) * 100) : 0

//   return (
//     <div className="grid grid-cols-12 gap-6">
//       <div className="col-span-8">
//         <div className="flex items-center gap-3 mb-3">
//           <input value={fileUrl} onChange={(e)=>setFileUrl(e.target.value)} placeholder="Paste PDF URL (temporary)" className="flex-1 px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700" />
//           <div className="text-sm text-gray-600 dark:text-gray-300">{progress}%</div>
//         </div>
//         <div className="rounded border dark:border-gray-800 overflow-hidden">
//           {fileUrl ? (
//             <Document file={fileUrl} onLoadSuccess={onLoadSuccess} onLoadError={() => setNumPages(0)}>
//               <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
//             </Document>
//           ) : (
//             <div className="p-8 text-center text-sm text-gray-500">Load a PDF URL to preview</div>
//           )}
//         </div>
//         <div className="flex items-center justify-between mt-3">
//           <button className="px-3 py-1.5 border rounded disabled:opacity-50" disabled={pageNumber <= 1} onClick={()=>setPageNumber(p => Math.max(1, p-1))}>Prev</button>
//           <div className="text-sm">Page {pageNumber} of {numPages || '—'}</div>
//           <button className="px-3 py-1.5 border rounded disabled:opacity-50" disabled={!numPages || pageNumber >= numPages} onClick={()=>setPageNumber(p => Math.min(numPages, p+1))}>Next</button>
//         </div>
//       </div>
//       <div className="col-span-4">
//         <h2 className="font-medium mb-2">Notes</h2>
//         <textarea value={notes[pageNumber] || ''} onChange={(e)=>setNotes(n => ({...n, [pageNumber]: e.target.value}))} className="w-full h-64 px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700" placeholder="Write notes for this page..." />
//       </div>
//     </div>
//   )
// }

// export default ReaderPage

import { useEffect, useState, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, BookOpen, StickyNote, Search, Download } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

function ReaderPage() {
  const [fileUrl, setFileUrl] = useState('')
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [rotation, setRotation] = useState(0)
  const [notes, setNotes] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showNotes, setShowNotes] = useState(true)
  const documentRef = useRef(null)

  useEffect(() => {
    // Placeholder: later pull last-opened doc from backend
    setFileUrl('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf')
  }, [])

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
    // TODO: Save to backend
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Main Document Viewer */}
      <div className={`${showNotes ? 'col-span-8' : 'col-span-12'} space-y-4`}>
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center space-x-3">
            <input 
              value={fileUrl} 
              onChange={(e) => {
                setFileUrl(e.target.value)
                setIsLoading(true)
              }}
              placeholder="Enter PDF URL or select from uploaded files" 
              className="w-80 px-3 py-2 text-sm border rounded-lg dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
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

        {/* Document Controls */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(pageNumber - 1)}
              disabled={pageNumber <= 1}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={pageNumber}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 text-sm text-center border rounded dark:bg-gray-900 dark:border-gray-600"
                min="1"
                max={numPages}
              />
              <span className="text-sm text-gray-500">of {numPages || '—'}</span>
            </div>

            <button
              onClick={() => goToPage(pageNumber + 1)}
              disabled={!numPages || pageNumber >= numPages}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setScale(Math.max(0.5, scale - 0.1))}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <span className="text-sm text-gray-600 dark:text-gray-300 px-2">
              {Math.round(scale * 100)}%
            </span>
            
            <button
              onClick={() => setScale(Math.min(3.0, scale + 0.1))}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => setRotation((rotation + 90) % 360)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              title="Rotate"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
          <div className="h-[70vh] overflow-auto flex justify-center items-start p-4 bg-gray-50 dark:bg-gray-900">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            )}
            
            {error && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <BookOpen className="w-12 h-12 text-gray-400" />
                <div className="text-red-600 dark:text-red-400">{error}</div>
                <div className="text-sm text-gray-500">
                  Try a different PDF URL or upload a file first
                </div>
              </div>
            )}

            {fileUrl && !error && (
              <div ref={documentRef} className="shadow-2xl">
                <Document 
                  file={fileUrl} 
                  onLoadSuccess={onLoadSuccess} 
                  onLoadError={onLoadError}
                  loading={
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  }
                >
                  <Page 
                    pageNumber={pageNumber} 
                    scale={scale}
                    rotate={rotation}
                    renderTextLayer={false} 
                    renderAnnotationLayer={false}
                    className="shadow-lg"
                  />
                </Document>
              </div>
            )}

            {!fileUrl && !error && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">No Document Loaded</h3>
                  <p className="text-sm text-gray-500">
                    Enter a PDF URL above or upload a document to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {numPages > 0 && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Notes Panel */}
      {showNotes && (
        <div className="col-span-4 space-y-4">
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