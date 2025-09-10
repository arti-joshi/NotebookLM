// 1. Updated AuthPage.jsx - Fix demo credentials and add proper autocomplete
import { useState } from 'react'
import { setAccessToken } from '../lib/api'

function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
        
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001'
            
      const res = await fetch(apiUrl + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })
            
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Login failed')
      }
            
      const data = await res.json()
            
      if (data?.accessToken) {
        setAccessToken(data.accessToken)
        // Store token in localStorage for RequireAuth component
        localStorage.setItem('auth_token', data.accessToken)
        // Dispatch custom event to notify App component
        window.dispatchEvent(new Event('authStateChanged'))
        // Redirect to upload page after successful login
        window.location.assign('/upload')
      } else {
        throw new Error('No access token returned from server')
      }
    } catch (err) {
      setError(err.message || 'Login error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded bg-gray-50 dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Sign in</h2>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your password"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm">
        <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Demo Account:</p>
        <p className="text-blue-600 dark:text-blue-300">Email: demo@admin.com</p>
        <p className="text-blue-600 dark:text-blue-300">Password: 123456</p>
      </div>
    </div>
  )
}

export default AuthPage