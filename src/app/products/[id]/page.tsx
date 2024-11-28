

'use client';

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from '@/contexts/CartContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductSize {
  size: string;
  stock: number;
}

interface Product {
  id: number
  name: string
  price: number
  description: string
  images: string[]
  category: string
  gender: string
  sizes: ProductSize[]
}

const getImageSrc = (image: string) => {
  if (image.startsWith('http') || image.startsWith('https')) {
    return image
  }
  return image.startsWith('/') ? image : `/${image}`
}

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [id])

  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) {
        throw new Error('Ürün yüklenirken bir hata oluştu.')
      }
      const data = await response.json()
      setProduct(data)
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0].size)
      }
    } catch (err) {
      setError('Ürün yüklenirken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if(product && selectedSize) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: selectedSize
      });
    }
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length)
    }
  }

  if (isLoading) return <div className="container mx-auto px-4 py-8">Yükleniyor...</div>
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
  if (!product) return <div className="container mx-auto px-4 py-8">Ürün bulunamadı.</div>

  return (
     <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="relative aspect-square mb-2">
                <Image
                  src={getImageSrc(product.images[currentImageIndex])}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
                <Button className="absolute left-2 top-1/2 transform -translate-y-1/2" onClick={prevImage}>
                  &#8592;
                </Button>
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 " onClick={nextImage}>
                  &#8594;
                </Button>
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 ${
                      index === currentImageIndex ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Image
                      src={getImageSrc(image)}
                      alt={`${product.name} - Görsel ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-2xl font-semibold mb-4">{product.price} TL</p>
              <p className="mb-4">{product.description || 'Ürün açıklaması bulunmamaktadır.'}</p>
              <div className="mb-4">
                <strong>Kategori:</strong> {product.category}
              </div>
              <div className="mb-4">
                <strong>Cinsiyet:</strong> {product.gender}
              </div>
              <div className="mb-4">
                <strong>Beden:</strong>
                <Select value={selectedSize || ''} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Beden seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size.size} value={size.size} disabled={size.stock === 0}>
                        {size.size} {size.stock === 0 ? '(Stokta yok)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddToCart} disabled={!selectedSize}>
                {selectedSize ? 'Sepete Ekle' : 'Beden Seçin'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
     </div>
  )
}

