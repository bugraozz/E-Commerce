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
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-background border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/women">
              <Button variant="ghost">Kadın</Button>
            </Link>
            <Link href="/men">
              <Button variant="ghost">Erkek</Button>
            </Link>
          </div>
          <div className="text-2xl font-bold">C&B</div>
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5" />
            <UserMenu />
            <ShoppingCard />
            <Link href="/wishlist">
              <Heart className="h-5 w-5 " />
            </Link>
            <ModeToggle />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 ">
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

        <h2 className="text-2xl font-semibold mb-4">Öne Çıkan Ürünler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 rounded-md">
          {[1, 2, 3, 4].map((product) => (
            <Card key={product}>
              <CardContent className="p-0">
                <img src={`/placeholder.svg?height=300&width=300&text=Ürün ${product}`} alt={`Ürün ${product}`} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Ürün {product}</h3>
                  <p className="text-sm text-muted-foreground mb-2">199,99 TL</p>
                  <Button variant="outline" size="sm">Sepete Ekle</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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