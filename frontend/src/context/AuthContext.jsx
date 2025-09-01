import { createContext, useContext, useEffect, useState } from 'react'
import { apiGet, setAccessToken, clearAccessToken, setAuthFailureHandler } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // attempt to load logged-in user (backend may set accessToken via refresh cookie)
    async function init() {
      try {
        const data = await apiGet('/auth/whoami')
        if (data?.user) setUser(data.user)
      } catch (e) {
        // ignore - user not authenticated
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  useEffect(() => {
    // hook up API auth failure -> call our logout so React state clears
    setAuthFailureHandler(() => {
      // perform logout via context (clear token + call server)
      logout()
    })
  }, []) // run once

  const login = (accessToken, userInfo) => {
    setAccessToken(accessToken)
    setUser(userInfo || null)
  }

  const logout = async () => {
    clearAccessToken()
    try {
      await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (e) {
      // ignore logout error
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)