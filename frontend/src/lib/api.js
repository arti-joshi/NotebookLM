export function getApiBase() {
  return import.meta.env.VITE_API_URL || 'http://localhost:4001'
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('auth_token')
  const headers = new Headers(options.headers || {})
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return fetch(getApiBase() + path, { ...options, headers })
}
