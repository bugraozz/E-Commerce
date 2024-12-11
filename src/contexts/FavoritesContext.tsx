


'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { toast } from "@/hooks/use-toast"

interface FavoriteItem {
  id: number
  name: string
  price: number | string
  image: string
}

interface FavoritesContextType {
  favorites: FavoriteItem[]
  addToFavorites: (item: FavoriteItem) => Promise<void>
  removeFromFavorites: (id: number) => Promise<void>
  isFavorite: (id: number) => boolean
  isLoading: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  console.log('FavoritesProvider: Current user:', user)

  useEffect(() => {
    if (user) {
      console.log('User logged in, fetching favorites')
      fetchFavorites()
    } else {
      console.log('User not logged in, clearing favorites')
      setFavorites([])
      setIsLoading(false)
    }
  }, [user])

  const fetchFavorites = async () => {
    if (!user?.token) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/favorites', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch favorites: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Fetched favorites:', data)
      setFavorites(data)
    } catch (error) {
      console.error('Error fetching favorites:', error)
      toast({
        title: "Hata",
        description: "Favoriler yüklenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addToFavorites = async (item: FavoriteItem) => {
    console.log('addToFavorites called with item:', item)
    console.log('Current user state in addToFavorites:', user)
    if (!user?.token) {
      console.log('User not authenticated')
      toast({
        title: "Giriş Gerekli",
        description: "Favorilere eklemek için lütfen giriş yapın",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ id: item.id }),
      })

      if (!response.ok) {
        throw new Error(`Failed to add to favorites: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Add to favorites response:', result)

      if (result.favorite) {
        setFavorites(prev => {
          console.log('Previous favorites:', prev)
          const newFavorites = [...prev, result.favorite]
          console.log('New favorites:', newFavorites)
          return newFavorites
        })
        toast({
          title: "Başarılı",
          description: "Favorilere eklendi",
        })
      } else {
        toast({
          title: "Bilgi",
          description: "Bu ürün zaten favorilerinizde",
        })
      }
    } catch (error) {
      console.error('Error adding to favorites:', error)
      toast({
        title: "Hata",
        description: "Favorilere eklenirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const removeFromFavorites = async (id: number) => {
    if (!user?.token) return

    try {
      const response = await fetch(`/api/favorites/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to remove from favorites: ${response.status} ${response.statusText}`)
      }

      setFavorites(prev => {
        console.log('Previous favorites:', prev)
        const newFavorites = prev.filter(item => item.id !== id)
        console.log('New favorites after removal:', newFavorites)
        return newFavorites
      })
      toast({
        title: "Başarılı",
        description: "Favorilerden kaldırıldı",
      })
    } catch (error) {
      console.error('Error removing from favorites:', error)
      toast({
        title: "Hata",
        description: "Favorilerden kaldırılırken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const isFavorite = (id: number) => {
    const result = favorites.some((item) => item.id === id)
    console.log(`Checking if product ${id} is favorite:`, result)
    return result
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  )
}