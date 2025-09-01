const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Keep access token in memory (avoid localStorage to reduce XSS risk)
let accessToken = null

// Optional handler called when auth is considered lost (refresh failed).
// Default: clear token and navigate to /auth
let authFailureHandler = () => {
  accessToken = null
  try { window.location.assign('/auth') } catch (e) { /* no-op in non-browser env */ }
}

export function setAuthFailureHandler(fn) {
  authFailureHandler = fn
}

export function setAccessToken(token) {
  accessToken = token
  // intentionally NOT storing in localStorage to reduce XSS exposure
}

export function clearAccessToken() {
  accessToken = null
}

/**
 * callApi: wrapper for fetch that attaches Authorization header and tries refresh on 401
 * options: same as fetch options
 */
export async function callApi(path, options = {}) {
  const url = API_URL + path

  // Build headers from options (do not overwrite)
  const headers = new Headers(options.headers || {})
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  // include cookies for refresh token flows
  let res = await fetch(url, { ...options, headers, credentials: 'include' })
  if (res.status !== 401) return res

  // 401 -> try refresh once (refresh logic is locked to avoid races)
  const refreshed = await tryRefreshToken()
  if (!refreshed) {
    // refresh failed -> treat as auth failure
    authFailureHandler()
    return res
  }

  // retry original request with new token
  const retryHeaders = new Headers(options.headers || {})
  if (accessToken) retryHeaders.set('Authorization', `Bearer ${accessToken}`)
  return fetch(url, { ...options, headers: retryHeaders, credentials: 'include' })
}

// Refresh lock to prevent multiple simultaneous refresh calls
let refreshingPromise = null

async function tryRefreshToken() {
  // If a refresh is already in progress, wait for it
  if (refreshingPromise) {
    try {
      return await refreshingPromise
    } catch (e) {
      return false
    }
  }

  refreshingPromise = (async () => {
    try {
      const res = await fetch(API_URL + '/auth/refresh', {
        method: 'POST',
        credentials: 'include' // refresh token expected in HttpOnly cookie
      })

      if (!res.ok) {
        // refresh failed
        clearAccessToken()
        return false
      }

      const data = await res.json()
      if (data?.accessToken) {
        setAccessToken(data.accessToken)
        return true
      } else {
        clearAccessToken()
        return false
      }
    } catch (e) {
      clearAccessToken()
      return false
    } finally {
      // clear the lock after attempt
      refreshingPromise = null
    }
  })()

  try {
    return await refreshingPromise
  } catch (e) {
    refreshingPromise = null
    return false
  }
}

// convenience helpers for JSON requests
export async function apiGet(path) {
  const res = await callApi(path, { method: 'GET' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `GET ${path} failed with ${res.status}`)
  }
  return res.json()
}

export async function apiPost(path, body, extraOptions = {}) {
  // Merge headers safely so we don't accidentally drop Authorization
  const mergedHeaders = new Headers(extraOptions.headers || {})
  mergedHeaders.set('Content-Type', 'application/json')

  const res = await callApi(path, {
    method: 'POST',
    headers: mergedHeaders,
    body: JSON.stringify(body),
    ...extraOptions
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `POST ${path} failed with ${res.status}`)
  }
  return res.json()
}
