


import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useAuth } from '@/contexts/AuthContext'
import { Heart } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface ProductSize {
  size: string
  stock: number
}

interface Product {
  id: number
  name: string
  price: number | string
  image: string
  category: string
  gender: string
  sizes?: ProductSize[]
  images?: string[]
}

const getImageSrc = (image: string | undefined) => {
  if (!image) return '/placeholder.svg'
  if (image.startsWith('http')) return image
  return image.startsWith('/') ? image : `/${image}`
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

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { user } = useAuth()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.sizes && product.sizes.length > 0) {
      const firstAvailableSize = product.sizes.find(size => size.stock > 0)
      if (firstAvailableSize) {
        addItem({
          id: product.id,
          name: product.name,
          price: parseFloat(formatPrice(product.price)),
          quantity: 1,
          size: firstAvailableSize.size
        })
      }
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Giriş Gerekli",
        description: "Favorilere eklemek için lütfen giriş yapın",
        variant: "destructive",
      })
      return
    }

    try {
      if (isFavorite(product.id)) {
        await removeFromFavorites(product.id)
      } else {
        await addToFavorites({
          id: product.id,
          name: product.name,
          price: parseFloat(formatPrice(product.price)),
          image: product.image
        })
      }
    } catch {
      toast({
        title: "Hata",
        description: "Favoriler güncellenirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const imageSrc = product.images && product.images.length > 0
    ? getImageSrc(product.images[0])
    : getImageSrc(product.image)

  const availableSizes = product.sizes
    ? product.sizes.filter(size => size.stock > 0).map(size => size.size)
    : []

  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
          />
          <Heart
            className={`absolute top-2 right-2 cursor-pointer ${
              isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
            onClick={handleToggleFavorite}
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold">{product.name}</h2>
          {availableSizes.length > 0 && (
            <p className="text-sm text-gray-500">Bedenler: {availableSizes.join(', ')}</p>
          )}
          <p className="text-sm text-gray-500">{formatPrice(product.price)} TL</p>
          <p className="text-xs text-gray-400">{product.category} - {product.gender}</p>
        </div>
      </Link>
    </div>
  )
}
