import { useState } from 'react'

const ACCEPT = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
}

function UploadPage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setMessage('')
    const form = new FormData()
    form.append('file', file)
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const res = await fetch(api + '/files/upload', {
        method: 'POST',
        body: form,
      })
      const data = await res.json()
      setMessage(data.message || 'Uploaded')
    } catch (err) {
      setMessage('Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Upload documents</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept={`${ACCEPT.pdf},${ACCEPT.docx},${ACCEPT.txt}`}
          onChange={(e)=> setFile(e.target.files?.[0] ?? null)}
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-brand file:text-white"
        />
        <div>
          <button disabled={loading || !file} className="px-4 py-2 bg-brand text-white rounded disabled:opacity-50">{loading ? 'Uploading...' : 'Upload'}</button>
        </div>
      </form>
      {message && <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{message}</p>}
    </div>
  )
}

export default UploadPage


