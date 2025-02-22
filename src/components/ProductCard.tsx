import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useAuth } from '@/contexts/AuthContext'
import { Heart, X } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { user } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (selectedSize) {
      addItem({
        id: product.id,
        name: product.name,
        price: parseFloat(formatPrice(product.price)),
        quantity: 1,
        size: selectedSize,
        image: product.images?.[0] || ''
      })
    } else {
      toast({
        title: "Beden Seçimi Gerekli",
        description: "Lütfen bir beden seçin",
        variant: "destructive",
      })
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
          images: product.images || [],
          category: product.category,
          gender: ''
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (product.images && product.images.length > 1) {
      const { width, left } = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - left
      const index = Math.min(
        Math.max(Math.floor((x / width) * product.images.length), 0),
        product.images.length - 1
      )
      setCurrentImageIndex(index)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return

    const touchEndX = e.touches[0].clientX
    const touchDiff = touchStartX - touchEndX

    if (Math.abs(touchDiff) > 50) {
      if (touchDiff > 0) {
        // Swipe left
        setCurrentImageIndex((prevIndex) =>
          Math.min(prevIndex + 1, (product.images?.length || 1) - 1)
        )
      } else {
        // Swipe right
        setCurrentImageIndex((prevIndex) =>
          Math.max(prevIndex - 1, 0)
        )
      }
      setTouchStartX(null)
    }
  }

  const nextImage = () => {
    if (product.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length)
    }
  }

  const imageSrc = product.images && product.images.length > 0
    ? getImageSrc(product.images[currentImageIndex])
    : getImageSrc(product.image)

  const availableSizes = product.sizes
    ? product.sizes.filter(size => size.stock > 0).map(size => size.size)
    : []

  return (
    <>
      <div
        className="border rounded-lg overflow-hidden shadow-md cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div
          className="relative h-80" // Increase the height here
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
          />
          <Heart
            className={`absolute top-2 right-2 cursor-pointer ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            onClick={handleToggleFavorite}
          />
        </div>
        {/* {product.images && product.images.length > 1 && (
          <div className="flex justify-center space-x-1 my-7">
            {product.images.map((_, index) => (
              <span
                key={index}
                className={`block w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-gray-800' : 'bg-gray-400'
                  }`}
                style={{ transition: 'background-color 0.3s', zIndex: 10 }}
              />
            ))}
          </div>
        )} */}
        <div className="p-4">
          <h2 className="text-lg font-bold">{product.name}</h2>
          <p className="text-sm text-gray-500">{formatPrice(product.price)} TL</p>
          <p className="text-xs text-gray-400">{product.category}</p>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              layoutId={`product-${product.id}-image`}
              className="fixed inset-x-4 bottom-0 md:inset-[10%] z-50 bg-white dark:bg-zinc-900 rounded-t-xl md:rounded-xl overflow-hidden max-h-[80vh] md:max-h-[80vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="h-full md:flex">
                <div className="relative md:w-2/5">
                  <motion.img
                    src={getImageSrc(product.images[currentImageIndex])}
                    alt={product.name}
                    className="w-full h-[200px] md:h-full object-cover"
                  />
                  <button
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full p-1"
                    onClick={prevImage}
                  >
                    &#8592;
                  </button>
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full p-1"
                    onClick={nextImage}
                  >
                    &#8594;
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 md:w-3/5 flex flex-col">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h2 className="text-sm font-medium">{product.name}</h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{product.category}</p>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(product.price)} TL</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-zinc-600 dark:text-zinc-300">{product.description}</p>
                      <div className="mt-4">
                        <strong>Beden:</strong>
                        <select
                          value={selectedSize || ''}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className="w-full p-2 border rounded bg-white mt-2"
                        >
                          <option value="" disabled>Beden seçin</option>
                          {availableSizes.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full mt-3 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}