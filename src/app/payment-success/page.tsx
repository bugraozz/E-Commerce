'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from '@/contexts/CartContext'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const { clearCart } = useCart()

  useEffect(() => {
    // Başarılı ödemeden sonra sepeti temizle
    clearCart()
  }, [clearCart]) // Ensure dependency array includes clearCart

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-green-600">Ödeme Başarılı</h1>
          <p className="mb-4">Siparişiniz başarıyla tamamlandı. Teşekkür ederiz!</p>
          <Button onClick={() => router.push('/')}>Ana Sayfaya Dön</Button>
        </CardContent>
      </Card>
    </div>
  )
}

