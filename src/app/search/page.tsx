'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import { Input } from "@/components/ui/input"
import { ProductCard } from '@/components/ProductCard'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  price: number
  category: string
  gender: string
  images: string[]
  sizes: string[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get('q') ?? ''
  const [searchTerm, setSearchTerm] = useState(searchQuery)
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchTerm.trim() === '') {
        setResults([])
        return
      }
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearchTerm)}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error('Arama hatası:', error)
        setError('Arama sırasında bir hata oluştu. Lütfen tekrar deneyin.')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [debouncedSearchTerm])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Arama Sonuçları</h1>
      <div className="flex justify-between items-center mb-2">
       
        <button onClick={() => window.history.back()} className="btn btn-primary font-italic">Geri Dön</button>
      </div>
      
      <Input
        type="text"
        placeholder="Ürün ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {isLoading && <p className="text-center">Yükleniyor...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!isLoading && !error && (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {results.map((product) => (
            <li key={product.id}>
              <Link href={`/products/${product.id}`}>
                <ProductCard product={product} />
              </Link>
            </li>
          ))}
        </ul>
      )}
      {!isLoading && !error && results.length === 0 && searchTerm && (
        <p className="text-center text-gray-500 mt-4">Sonuç bulunamadı.</p>
      )}
    </div>
  )
}

