import { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

function ReaderPage() {
  const [fileUrl, setFileUrl] = useState('')
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [notes, setNotes] = useState({})

  useEffect(() => {
    // placeholder: later pull last-opened doc from backend
  }, [])

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  const progress = numPages ? Math.round((pageNumber / numPages) * 100) : 0

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8">
        <div className="flex items-center gap-3 mb-3">
          <input value={fileUrl} onChange={(e)=>setFileUrl(e.target.value)} placeholder="Paste PDF URL (temporary)" className="flex-1 px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700" />
          <div className="text-sm text-gray-600 dark:text-gray-300">{progress}%</div>
        </div>
        <div className="rounded border dark:border-gray-800 overflow-hidden">
          {fileUrl ? (
            <Document file={fileUrl} onLoadSuccess={onLoadSuccess} onLoadError={() => setNumPages(0)}>
              <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">Load a PDF URL to preview</div>
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          <button className="px-3 py-1.5 border rounded disabled:opacity-50" disabled={pageNumber <= 1} onClick={()=>setPageNumber(p => Math.max(1, p-1))}>Prev</button>
          <div className="text-sm">Page {pageNumber} of {numPages || '—'}</div>
          <button className="px-3 py-1.5 border rounded disabled:opacity-50" disabled={!numPages || pageNumber >= numPages} onClick={()=>setPageNumber(p => Math.min(numPages, p+1))}>Next</button>
        </div>
      </div>
      <div className="col-span-4">
        <h2 className="font-medium mb-2">Notes</h2>
        <textarea value={notes[pageNumber] || ''} onChange={(e)=>setNotes(n => ({...n, [pageNumber]: e.target.value}))} className="w-full h-64 px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700" placeholder="Write notes for this page..." />
      </div>
    </div>
  )
}

export default ReaderPage


