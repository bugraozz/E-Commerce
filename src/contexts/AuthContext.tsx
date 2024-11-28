'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  isLoggedIn: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const authCookie = document.cookie.includes('auth=true')
    setIsLoggedIn(authCookie)
  }, [])

  const login = async (Username: string, Password: string) => {
    setError(null)

    if (!Username || !Password) {
      setError('Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username, Password })
      })

      console.log("Response status:", response.status, response.statusText)

      if (response.ok) {
        setIsLoggedIn(true)
        document.cookie = 'auth=true; path=/'
        router.push('/admin')
      } else {
        const data = await response.json()
        console.log("Response data:", data)
        setError(data.message || 'Invalid credentials')
      }
    } catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'An error occurred. Please try again.'
      setError(errorMessage)
    }
  }

  const logout = () => {
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    setIsLoggedIn(false)
    router.push('/admin/login')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}