// Fixed API URL using consistent port 4001
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
console.log('API_URL:', API_URL) // Debug log

let accessToken = null
let authFailureHandler = () => {
  accessToken = null
  try { window.location.assign('/auth') } catch (e) {}
}

export function setAuthFailureHandler(fn) {
  authFailureHandler = fn
}

export function setAccessToken(token) {
  accessToken = token
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

export function clearAccessToken() {
  accessToken = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
}

function getAccessToken() {
  if (accessToken) return accessToken
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      accessToken = storedToken
      return storedToken
    }
  }
  return null
}

// low-level fetch wrapper
export async function callApi(path, opts = {}) {
  const url = API_URL + path
  const headers = opts.headers || {}

  const token = getAccessToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, {
    ...opts,
    headers,
    credentials: 'include'
  })

  if (res.status === 401) {
    clearAccessToken()
    try { authFailureHandler() } catch (_) {}
    throw new Error('Unauthorized')
  }

  return res
}

// ✅ For JSON requests
export async function apiPost(path, body) {
  const res = await callApi(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiGet(path) {
  const res = await callApi(path, { method: 'GET' })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

// ✅ New helper for file uploads (FormData) with timeout support
export async function apiUpload(path, formData, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 300000); // 5 minutes default

  try {
    const res = await callApi(path, {
      method: 'POST',
      body: formData, // don't stringify, don't set content-type
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Upload timeout - file too large or connection too slow');
    }
    throw error;
  }
}

// ✅ Upload with progress tracking for large files
export async function apiUploadWithProgress(path, formData, onProgress, options = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const timeout = options.timeout || 300000; // 5 minutes
    
    // Set timeout
    xhr.timeout = timeout;
    
    // Progress tracking
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });
    }
    
    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          resolve(xhr.responseText);
        }
      } else {
        // Enhanced error with server response details
        let errorMessage = `Upload failed: ${xhr.status} ${xhr.statusText}`;
        if (xhr.responseText) {
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage += ` - Server says: ${errorData.error || errorData.message || xhr.responseText}`;
          } catch (e) {
            errorMessage += ` - Server response: ${xhr.responseText}`;
          }
        }
        console.error('Server error details:', {
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText,
          responseHeaders: xhr.getAllResponseHeaders()
        });
        reject(new Error(errorMessage));
      }
    });
    
    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed due to network error'));
    });
    
    xhr.addEventListener('timeout', () => {
      reject(new Error('Upload timeout - file too large or connection too slow'));
    });
    
    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelled'));
    });
    
    // ✅ MUST call xhr.open() BEFORE setting headers
    const url = API_URL + path;
    xhr.open('POST', url);
    
    // ✅ NOW we can set headers (after xhr.open())
    const token = getAccessToken();
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    
    // Start upload
    xhr.send(formData);
  });
}

// ✅ Document management functions
export async function apiDelete(path) {
  const res = await callApi(path, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

// ✅ Document-specific API functions
export async function getDocuments() {
  return apiGet('/documents')
}

export async function getSystemDocuments() {
  return apiGet('/documents/system')
}

export async function getDocumentStatus(documentId) {
  return apiGet(`/documents/${documentId}/status`)
}

export async function deleteDocument(documentId) {
  return apiDelete(`/documents/${documentId}`)
}

export async function cancelDocumentProcessing(documentId) {
  return apiDelete(`/documents/${documentId}/cancel`)
}

export const apiFetch = callApi
