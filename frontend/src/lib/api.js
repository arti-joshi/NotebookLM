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
  if (!token) {
    clearAccessToken();
    return;
  }
  
  accessToken = token;
  try {
    localStorage.setItem('auth_token', token);
    console.log('Access token set successfully');
  } catch (error) {
    console.error('Error saving access token:', error);
  }
}

export function clearAccessToken() {
  accessToken = null;
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    console.log('Access token cleared successfully');
  } catch (error) {
    console.error('Error clearing access token:', error);
  }
}

function getAccessToken() {
  // First check memory
  if (accessToken) {
    return accessToken;
  }
  
  // Then check localStorage
  try {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      accessToken = storedToken;
      return storedToken;
    }
  } catch (error) {
    console.error('Error reading access token:', error);
  }
  
  return null;
}

// Configurable timeout
const DEFAULT_TIMEOUT = 30000; // 30 seconds

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// low-level fetch wrapper
export async function callApi(path, opts = {}) {
  const url = API_URL + path
  const headers = opts.headers || {}
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(), 
    opts.timeout || DEFAULT_TIMEOUT
  );

  const token = getAccessToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const res = await fetch(url, {
      ...opts,
      signal: controller.signal,
      headers,
      credentials: 'include'
    });

    if (res.status === 401) {
      clearAccessToken();
      try { authFailureHandler(); } catch (_) {}
      throw new APIError('Unauthorized', 401);
    }

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = await res.text();
      }
      throw new APIError(
        errorData.message || 'API request failed',
        res.status,
        errorData
      );
    }

    return res;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new APIError('Request timed out', 408);
    }
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error.message, 500);
  } finally {
    clearTimeout(timeout);
  }
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

// Progress endpoints
export async function getProgressSummary() {
  return apiGet('/progress/summary')
}

export async function getTopicsList() {
  return apiGet('/topics')
}

export async function getTopicProgress(topicId) {
  return apiGet(`/topics/${topicId}/progress`)
}

export async function getUserTopicMastery(status = null, limit = 100) {
  const query = new URLSearchParams()
  if (status) query.append('status', status)
  if (limit) query.append('limit', limit.toString())
  return apiGet(`/progress/topics?${query}`)
}

export async function markTopicComplete(topicId) {
  return apiPost(`/topics/${topicId}/complete`, {})
}