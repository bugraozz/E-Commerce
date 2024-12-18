


'use client'

import { useEffect } from 'react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  price: number | string
  image: string 
}

const formatPrice = (price: number | string): string => {
  if (typeof price === 'number') {
    return price.toFixed(2)
  }
  if (typeof price === 'string') {
    const numPrice = parseFloat(price)
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
  }
  return '0.00'
}

const getImageSrc = (image: string | undefined) => {
  if (!image) return '/placeholder.svg?height=300&width=300'
  if (image.startsWith('http')) return image
  return image.startsWith('/') ? image : `/${image}`
}

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, isLoading } = useFavorites()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      window.location.href = '/'
    }
  }, [user])

  console.log('Favorites:', favorites)

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Favorilerim</h1>
      {favorites.length === 0 ? (
        <p>Henüz favori ürününüz bulunmamaktadır.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product: Product) => (
            <Card key={product.id} className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-2">
                <div className="aspect-square relative mb-2">
                  {product.image ? (
                    <Image
                      src={getImageSrc(product.image)}
                      alt={product.name}
                      fill
                      className="object-cover rounded-lg"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
    </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500">{formatPrice(product.price)} TL</p>
              </CardContent>
              <CardFooter className="p-4 flex justify-between items-center">
                <Link href={`/products/${product.id}`}>
                  <Button variant="outline">Ürüne Git</Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => removeFromFavorites(product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

