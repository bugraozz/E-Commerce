import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Heart } from 'lucide-react'
import { ModeToggle } from '@/components/ModeToggle'
import ImageCarousel from '@/components/ImageCorousel'
import { UserMenu } from '@/components/UserMenu'
import { ShoppingCard } from '@/components/ShoppingCard'
import { Footer } from '@/components/Footer'
import Header from '@/components/Header'
import FeaturedProducts from './featured-products/page'

const womenImages = [
  '/image3.jpg',
  '/image2.jpg',
  '/image1.jpg',
  '/image4.jpg',
]

const menImages = [
  '/image4.jpg',
  '/zara.jpg',
  '/image3.jpg',
  '/image5.jpg',
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground mt-0">
      <Header />
      <main className="container mx-auto px-4 py-12  mt-0">
        <div className="flex w-full h-[70vh] mb-8 ">
          <div className="w-1/2 h-full relative cursor-pointer ">
            <ImageCarousel
              images={womenImages}
              alt="Kadın Bölümü"
              linkHref="/women"
              buttonText="Kadın Koleksiyonu"
            />
          </div>
          <div className="w-1/2 h-full relative cursor-pointer">
            <ImageCarousel
              images={menImages}
              alt="Erkek Bölümü"
              linkHref="/men"
              buttonText="Erkek Koleksiyonu"
            />
          </div>
        </div>
        <FeaturedProducts />
        <div className="bg-primary text-primary-foreground p-8 text-center mb-8 rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Özel Kampanya</h2>
          <p className="mb-4">Seçili ürünlerde %50'ye varan indirimler!</p>
          <Button variant="secondary">Kampanyayı Keşfet</Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}


