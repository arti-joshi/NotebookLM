import { useState, useEffect, useRef } from 'react'
import { Upload, FileText, File, CheckCircle, XCircle, Loader, Trash2, AlertCircle, RefreshCw } from 'lucide-react'
import { apiGet, apiUpload, apiUploadWithProgress, getDocuments, deleteDocument } from '../lib/api'

const ACCEPT = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
}

const FILE_TYPES = [
  { type: 'pdf', icon: FileText, label: 'PDF Documents', color: 'text-red-500' },
  { type: 'docx', icon: File, label: 'Word Documents', color: 'text-blue-500' },
  { type: 'txt', icon: FileText, label: 'Text Files', color: 'text-green-500' },
]

export default function UploadPage() {
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [documents, setDocuments] = useState([])
  const [existingDocuments, setExistingDocuments] = useState([])
  const [loadingDocuments, setLoadingDocuments] = useState(false)
  const [deletingDocument, setDeletingDocument] = useState(null)
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadDocs()
    loadExistingDocuments()
  }, [])

  async function loadDocs() {
    try {
      const rows = await apiGet('/embeddings')
      const grouped = rows.reduce((acc, r) => {
        acc[r.source] = (acc[r.source] || 0) + 1
        return acc
      }, {})
      setDocuments(Object.entries(grouped).map(([source, count]) => ({ source, count })))
    } catch (e) {
      setDocuments([])
    }
  }

  async function loadExistingDocuments() {
    setLoadingDocuments(true)
    try {
      const response = await getDocuments()
      setExistingDocuments(response.documents || [])
    } catch (error) {
      console.error('Failed to load existing documents:', error)
      setExistingDocuments([])
    } finally {
      setLoadingDocuments(false)
    }
  }

  async function handleDeleteDocument(documentId, filename) {
    if (!confirm(`Are you sure you want to delete "${filename}"? This will remove all associated data and cannot be undone.`)) {
      return
    }

    setDeletingDocument(documentId)
    try {
      await deleteDocument(documentId)
      showMessage(`Successfully deleted "${filename}"`)
      await loadExistingDocuments() // Refresh the list
      await loadDocs() // Also refresh the embeddings count
    } catch (error) {
      console.error('Failed to delete document:', error)
      showMessage(`Failed to delete "${filename}": ${error.message}`)
    } finally {
      setDeletingDocument(null)
    }
  }

  function checkForDuplicate(filename) {
    return existingDocuments.some(doc => doc.originalName === filename)
  }

  function showMessage(msg) {
    setMessage(msg)
    // Clear message after 5 seconds
    setTimeout(() => setMessage(''), 5000)
  }

  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map(file => {
      const isDuplicate = checkForDuplicate(file.name)
      return {
        file,
        id: Math.random().toString(36).substr(2, 9),
        status: isDuplicate ? 'duplicate' : 'pending',
        message: isDuplicate ? 'File already exists' : ''
      }
    })
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const uploadFile = async (fileItem) => {
    // Check for duplicates before uploading
    if (checkForDuplicate(fileItem.file.name)) {
      setFiles(prev => prev.map(f =>
        f.id === fileItem.id
          ? { ...f, status: 'duplicate', message: 'File already exists in database' }
          : f
      ))
      return
    }

    const form = new FormData()
    form.append('file', fileItem.file)

    // Debug logging
    console.log('Upload attempt:', {
      fileName: fileItem.file.name,
      fileSize: fileItem.file.size,
      fileType: fileItem.file.type,
      formDataEntries: Array.from(form.entries()).map(([key, value]) => [
        key, 
        (value && typeof value === 'object' && value.constructor && value.constructor.name === 'File') 
          ? `File: ${value.name} (${value.size} bytes)` 
          : value
      ])
    });

    try {
      setFiles(prev => prev.map(f =>
        f.id === fileItem.id ? { ...f, status: 'uploading', progress: 0 } : f
      ))

      // Use progress upload for files larger than 1MB
      const isLargeFile = fileItem.file.size > 1024 * 1024; // 1MB
      
      let data;
      if (isLargeFile) {
        // Use progress tracking for large files
        data = await apiUploadWithProgress('/files/upload', form, (progress) => {
          setFiles(prev => prev.map(f =>
            f.id === fileItem.id ? { ...f, progress: Math.round(progress) } : f
          ))
        }, { timeout: 600000 }); // 10 minutes for large files
      } else {
        // Use regular upload for small files
        data = await apiUpload('/files/upload', form, { timeout: 120000 }); // 2 minutes for small files
      }

      setFiles(prev => prev.map(f =>
        f.id === fileItem.id
          ? { ...f, status: 'success', message: data.message || 'Uploaded successfully', progress: 100 }
          : f
      ))

      // Refresh the existing documents list after successful upload
      await loadExistingDocuments()
      await loadDocs()
    } catch (err) {
      console.error('Upload error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
        code: err.code,
        config: err.config,
        request: err.request ? 'Request object exists' : 'No request object',
        response: err.response ? {
          status: err.response.status,
          statusText: err.response.statusText,
          headers: err.response.headers,
          data: err.response.data
        } : 'No response object'
      });
      setFiles(prev => prev.map(f =>
        f.id === fileItem.id
          ? { ...f, status: 'error', message: err.message || 'Upload failed', progress: 0 }
          : f
      ))
    }
  }

  const uploadAll = async () => {
    setUploading(true)
    const pendingFiles = files.filter(f => f.status === 'pending')
    for (const fileItem of pendingFiles) {
      await uploadFile(fileItem)
    }
    setUploading(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    const fileType = FILE_TYPES.find(ft => ft.type === ext)
    return fileType || { icon: File, color: 'text-gray-500' }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return setMessage('Select a file first')
    setUploading(true)
    setMessage('')
    try {
      const form = new FormData()
      form.append('file', file)

      // ✅ use apiUpload
      const data = await apiUpload('/files/upload', form)

      showMessage(data.message || 'Uploaded successfully')
      setFile(null)
      await loadDocs()
      await loadExistingDocuments()
    } catch (err) {
      console.error('Single file upload error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
        code: err.code,
        config: err.config,
        request: err.request ? 'Request object exists' : 'No request object',
        response: err.response ? {
          status: err.response.status,
          statusText: err.response.statusText,
          headers: err.response.headers,
          data: err.response.data
        } : 'No response object'
      });
      showMessage(err.message || 'Upload error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Upload Your Documents
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Upload PDF, Word, or text documents to start analyzing and chatting with your content using AI
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.includes('Successfully') || message.includes('successfully') 
            ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
            : message.includes('Failed') || message.includes('Error')
            ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
            : 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
        }`}>
          <div className="flex items-center space-x-2">
            {message.includes('Successfully') || message.includes('successfully') ? (
              <CheckCircle className="w-5 h-5" />
            ) : message.includes('Failed') || message.includes('Error') ? (
              <XCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      {/* Supported File Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FILE_TYPES.map(({ type, icon: Icon, label, color }) => (
          <div key={type} className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors duration-200">
            <Icon className={`w-6 h-6 ${color}`} />
            <div>
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">.{type}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          dragOver
            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/10 scale-[1.02]'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-gray-800'
        }`}
      >
        <div className="space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300 ${
            dragOver ? 'bg-indigo-100 dark:bg-indigo-900/20' : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            <Upload className={`w-8 h-8 transition-colors duration-300 ${
              dragOver ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
            }`} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Drop files here or click to browse</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Support for PDF, DOCX, and TXT files up to 10MB each
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Upload className="w-4 h-4" />
            <span>Choose Files</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={`${ACCEPT.pdf},${ACCEPT.docx},${ACCEPT.txt}`}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Files to Upload</h2>
            {files.some(f => f.status === 'pending') && (
              <button
                onClick={uploadAll}
                disabled={uploading}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {uploading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>
                  {uploading ? 'Uploading...' : 
                   `Upload All (${files.filter(f => f.status === 'pending').length} pending, ${files.filter(f => f.status === 'duplicate').length} duplicates)`}
                </span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {files.map((fileItem) => {
              const { icon: Icon, color } = getFileIcon(fileItem.file.name)
              
              return (
                <div
                  key={fileItem.id}
                  className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                >
                  <Icon className={`w-6 h-6 ${color}`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{fileItem.file.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(fileItem.file.size)}
                    </div>
                    {fileItem.status === 'uploading' && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${fileItem.progress || 0}%` }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1">
                          {fileItem.progress || 0}% uploaded
                          {fileItem.progress === 100 && " - Processing on server..."}
                          {fileItem.progress < 100 && " - Large files may take several minutes"}
                        </div>
                      </div>
                    )}
                    {fileItem.message && fileItem.status !== 'uploading' && (
                      <div className={`text-xs mt-1 ${
                        fileItem.status === 'success' ? 'text-green-600 dark:text-green-400' :
                        fileItem.status === 'error' ? 'text-red-600 dark:text-red-400' :
                        'text-gray-500 dark:text-gray-400'
                      }`}>
                        {fileItem.message}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {fileItem.status === 'uploading' && (
                      <Loader className="w-5 h-5 text-indigo-500 animate-spin" />
                    )}
                    {fileItem.status === 'success' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {fileItem.status === 'error' && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    {fileItem.status === 'duplicate' && (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    
                    {(fileItem.status === 'pending' || fileItem.status === 'error' || fileItem.status === 'duplicate') && (
                      <button
                        onClick={() => removeFile(fileItem.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Existing Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Existing Documents 
            {existingDocuments.length > 0 && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({existingDocuments.length} total)
              </span>
            )}
          </h2>
          <button
            onClick={loadExistingDocuments}
            disabled={loadingDocuments}
            className="inline-flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${loadingDocuments ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {loadingDocuments ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-indigo-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading documents...</span>
          </div>
        ) : existingDocuments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No documents uploaded yet</p>
            <p className="text-sm">Upload your first document to get started</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {existingDocuments.map((doc) => {
              const { icon: Icon, color } = getFileIcon(doc.originalName)
              const isDeleting = deletingDocument === doc.id
              
              return (
                <div
                  key={doc.id}
                  className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                >
                  <Icon className={`w-6 h-6 ${color}`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{doc.originalName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <div>Uploaded: {new Date(doc.createdAt).toLocaleDateString()}</div>
                      <div>Size: {formatFileSize(doc.fileSize)}</div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          doc.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          doc.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                          doc.status === 'FAILED' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          doc.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {doc.status === 'COMPLETED' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {doc.status === 'PROCESSING' && <Loader className="w-3 h-3 mr-1 animate-spin" />}
                          {doc.status === 'FAILED' && <XCircle className="w-3 h-3 mr-1" />}
                          {doc.status === 'PENDING' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {doc.status}
                        </span>
                        {doc._count?.embeddings > 0 && (
                          <span className="text-xs text-gray-500">
                            {doc._count.embeddings} chunks
                          </span>
                        )}
                      </div>
                      {doc.processingError && (
                        <div className="text-xs text-red-600 dark:text-red-400">
                          Error: {doc.processingError}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isDeleting ? (
                      <Loader className="w-5 h-5 text-red-500 animate-spin" />
                    ) : (
                      <button
                        onClick={() => handleDeleteDocument(doc.id, doc.originalName)}
                        disabled={isDeleting}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 disabled:opacity-50"
                        title="Delete document"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Getting Started */}
      {files.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-medium">1. Upload Documents</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Upload your PDF, Word, or text documents to get started
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-medium">2. Read & Annotate</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use the reader to view documents and take notes
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
              <h3 className="font-medium">3. Chat with AI</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Ask questions and get insights from your documents
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Single File Upload Form */}
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Document</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block"
            accept=".pdf,.docx,.txt"
          />

          <button
            type="submit"
            disabled={uploading}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {uploading ? 'Uploading...' : 'Upload & Index'}
          </button>
        </form>

        {message && <div className="mt-4 text-sm">{message}</div>}

        <div className="mt-6">
          <h3 className="font-medium">Indexed Documents</h3>
          {documents.length === 0 ? (
            <div className="text-sm text-gray-500 mt-2">No documents indexed yet.</div>
          ) : (
            <ul className="mt-2 space-y-1">
              {documents.map((d) => (
                <li key={d.source} className="text-sm">
                  {d.source} — {d.count} chunks
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
