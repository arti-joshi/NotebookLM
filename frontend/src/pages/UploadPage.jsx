// import { useRef, useState } from 'react'

// const ACCEPT = {
//   pdf: 'application/pdf',
//   docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//   txt: 'text/plain',
// }

// function UploadPage() {
//   const [file, setFile] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState('')
//   const [isError, setIsError] = useState(false)
//   const [isDragging, setIsDragging] = useState(false)
//   const inputRef = useRef(null)

//   const acceptList = `${ACCEPT.pdf},${ACCEPT.docx},${ACCEPT.txt}`

//   function formatBytes(bytes) {
//     if (!bytes && bytes !== 0) return ''
//     const sizes = ['B', 'KB', 'MB', 'GB']
//     const i = Math.floor(Math.log(bytes) / Math.log(1024))
//     const val = (bytes / Math.pow(1024, i)).toFixed(1)
//     return `${val} ${sizes[i]}`
//   }

//   function isMimeAllowed(f) {
//     return [ACCEPT.pdf, ACCEPT.docx, ACCEPT.txt].includes(f?.type)
//   }

//   function onDragOver(e) {
//     e.preventDefault()
//     setIsDragging(true)
//   }

//   function onDragLeave(e) {
//     e.preventDefault()
//     setIsDragging(false)
//   }

//   function onDrop(e) {
//     e.preventDefault()
//     setIsDragging(false)
//     const dropped = e.dataTransfer.files?.[0]
//     if (!dropped) return
//     if (!isMimeAllowed(dropped)) {
//       setIsError(true)
//       setMessage('Unsupported file type. Please upload PDF, DOCX, or TXT.')
//       return
//     }
//     setMessage('')
//     setIsError(false)
//     setFile(dropped)
//   }

//   function onBrowseClick() {
//     inputRef.current?.click()
//   }

//   async function handleUpload(e) {
//     e.preventDefault()
//     if (!file) return
//     setLoading(true)
//     setMessage('')
//     setIsError(false)
//     const form = new FormData()
//     form.append('file', file)
//     try {
//       const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
//       const res = await fetch(api + '/files/upload', {
//         method: 'POST',
//         body: form,
//       })
//       const data = await res.json()
//       if (!res.ok) throw new Error(data?.error || 'Upload failed')
//       setMessage(data.message || 'Uploaded successfully')
//       setIsError(false)
//     } catch (err) {
//       setIsError(true)
//       setMessage(err.message || 'Upload failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   function clearSelection() {
//     setFile(null)
//     setMessage('')
//     setIsError(false)
//     if (inputRef.current) inputRef.current.value = ''
//   }

//   return (
//     <div className="mx-auto max-w-2xl">
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold">Upload documents</h1>
//         <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">PDF, DOCX, or TXT up to a few MB. We’ll extract text and index it.</p>
//       </div>

//       <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
//         <form onSubmit={handleUpload} className="p-6">
//           <div
//             className={`rounded-xl border-2 border-dashed transition-colors p-8 text-center cursor-pointer select-none ${
//               isDragging ? 'border-brand bg-brand/5' : 'border-gray-300 dark:border-gray-700'
//             }`}
//             onClick={onBrowseClick}
//             onDragOver={onDragOver}
//             onDragLeave={onDragLeave}
//             onDrop={onDrop}
//           >
//             <input
//               ref={inputRef}
//               type="file"
//               accept={acceptList}
//               onChange={(e)=> {
//                 const f = e.target.files?.[0] ?? null
//                 if (f && !isMimeAllowed(f)) {
//                   setIsError(true)
//                   setMessage('Unsupported file type. Please upload PDF, DOCX, or TXT.')
//                   return
//                 }
//                 setIsError(false)
//                 setMessage('')
//                 setFile(f)
//               }}
//               className="hidden"
//             />

//             <div className="flex flex-col items-center gap-2">
//               <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xl">⬆️</div>
//               <div className="text-sm">
//                 <span className="font-medium text-brand">Click to upload</span> or drag and drop
//               </div>
//               <div className="text-xs text-gray-500">PDF, DOCX, TXT</div>
//             </div>
//           </div>

//           {file && (
//             <div className="mt-5 flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-3">
//               <div className="min-w-0">
//                 <div className="truncate font-medium">{file.name}</div>
//                 <div className="text-xs text-gray-500">{file.type || 'unknown'} • {formatBytes(file.size)}</div>
//               </div>
//               <button type="button" onClick={clearSelection} className="text-sm px-3 py-1.5 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">Clear</button>
//             </div>
//           )}

//           <div className="mt-6 flex items-center gap-3">
//             <button
//               disabled={loading || !file}
//               className="px-4 py-2 bg-brand text-white rounded disabled:opacity-50"
//             >
//               {loading ? (
//                 <span className="inline-flex items-center gap-2">
//                   <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3"/><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none"/></svg>
//                   Uploading...
//                 </span>
//               ) : 'Upload'}
//             </button>
//             <button type="button" onClick={clearSelection} className="px-4 py-2 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">Reset</button>
//           </div>

//           {message && (
//             <div className={`mt-4 text-sm px-3 py-2 rounded ${isError ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300' : 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300'}`}>
//               {message}
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   )
// }

// export default UploadPage

import { useState, useRef } from 'react'
import { Upload, FileText, File, CheckCircle, XCircle, Loader } from 'lucide-react'
import { apiFetch, getApiBase } from '../lib/api'

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

function UploadPage() {
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending', // pending, uploading, success, error
      message: ''
    }))
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const uploadFile = async (fileItem) => {
    const form = new FormData()
    form.append('file', fileItem.file)
    
    try {
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'uploading' } : f
      ))
      
      const api = getApiBase()
      const res = await apiFetch('/files/upload', {
        method: 'POST',
        body: form,
      })
      const data = await res.json()
      
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { ...f, status: 'success', message: data.message || 'Uploaded successfully' }
          : f
      ))
    } catch (err) {
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { ...f, status: 'error', message: 'Upload failed' }
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
                <span>{uploading ? 'Uploading...' : 'Upload All'}</span>
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
                    {fileItem.message && (
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
                    
                    {(fileItem.status === 'pending' || fileItem.status === 'error') && (
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
    </div>
  )
}

export default UploadPage


