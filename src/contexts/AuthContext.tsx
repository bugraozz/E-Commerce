'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  username: string
  token: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  register: (username: string, email: string, phone: number, password: string, confirmPassword: string) => Promise<void>
  error: string | null
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setIsLoggedIn(true)
      setIsAdmin(parsedUser.role === 'admin')
      console.log('User loaded from localStorage:', parsedUser)
    }
  }, [])

  const login = async (Username: string, Password: string) => {
    try {
      console.log('Login called with:', { Username, Password })
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username, Password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.log('Login failed:', errorData)
        throw new Error(errorData.message || 'Login failed')
      }

      const { user } = await response.json()
      console.log('User logged in:', user)
      setUser(user)
      setIsLoggedIn(true)
      setIsAdmin(user.role === 'admin')
      localStorage.setItem('user', JSON.stringify(user))
      
      // Set the user cookie with role information
      document.cookie = `user=${JSON.stringify({ id: user.id, role: user.role, token: user.token })}; path=/; max-age=86400`

      router.push(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      console.log('Login error:', err)
      const errorMessage = (err instanceof Error) ? err.message : 'Login failed. Please check your credentials.'
      setError(errorMessage)
    }
  }

  const register = async (Username: string, email: string, phone: number,  Password: string, ConfirmPassword: string) => {
    setError(null)

    if (!Username || !email || !Password || !phone || !ConfirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (Password !== ConfirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username, email, phone, Password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.message === 'Phone number already exists') {
          setError('Phone number already exists')
        } else {
          throw new Error(errorData.message || 'Registration failed')
        }
      }

      const user = await response.json()
      setUser(user)
      setIsLoggedIn(true)
      setIsAdmin(user.role === 'admin')
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/')
    } catch (error: unknown) {
      console.error('Registration error:', error)
      const errorMessage = (error instanceof Error) ? error.message : 'An error occurred. Please try again.'
      setError(errorMessage)
    }
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setIsAdmin(false)
    localStorage.removeItem('user')
    document.cookie = 'user=; Max-Age=0; path=/'; // Cookie'yi temizle
    console.log('User logged out')
    router.push('/')
  }

  const getToken = () => {
    return user?.token || null
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, login, logout, register, error, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}



