import { createContext, useContext, useEffect, useState } from 'react'
import {
  apiGet,
  setAccessToken,
  clearAccessToken,
  setAuthFailureHandler,
} from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // attempt to load logged-in user (backend may set accessToken via refresh cookie)
    async function init() {
      try {
        // Check if we have a stored token first
        const storedToken = localStorage.getItem('auth_token')
        if (storedToken) {
          setAccessToken(storedToken)
        }
        
        const data = await apiGet('/auth/whoami')
        if (data?.user) {
          setUser(data.user)
        }
      } catch (e) {
        // ignore - user not authenticated
        clearAccessToken()
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  useEffect(() => {
    // hook up API auth failure -> call our logout so React state clears
    setAuthFailureHandler(() => {
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
      await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4001') + '/auth/logout', {
        method: 'POST',
        credentials: 'include',
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