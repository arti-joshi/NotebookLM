import { useState } from 'react'

function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const api = import.meta.env.VITE_API_URL || 'http://localhost:4001'

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(api + (mode === 'login' ? '/auth/login' : '/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed')
      if (data?.token) {
        localStorage.setItem('auth_token', data.token)
        setMessage('Success. Token saved.')
      } else {
        setMessage('Success.')
      }
    } catch (err) {
      setMessage(err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">{mode === 'login' ? 'Login' : 'Register'}</h1>
          <button
            className="text-sm text-indigo-600 dark:text-indigo-400"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Create account' : 'Have an account? Login'}
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
              required
              minLength={6}
            />
          </div>
          <button
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Please wait…' : (mode === 'login' ? 'Login' : 'Register')}
          </button>
        </form>
        {message && (
          <div className="mt-3 text-sm text-center text-gray-700 dark:text-gray-300">{message}</div>
        )}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
        Token is stored in localStorage under key <code>auth_token</code>.
      </div>
    </div>
  )
}

export default AuthPage
