'use client'

import { useCart } from '@/contexts/CartContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

const getImageSrc = (image: string | undefined) => {
  if (!image) return '/placeholder.jpg'
  if (image.startsWith('http')) return image
  return image.startsWith('/') ? image : `/${image}`
}

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const totalPrice = items.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0 as number)

  const handleConfirm = async () => {
    if (!user) {
      toast.error('Lütfen giriş yapın.');
      return;
    }

    setIsProcessing(true);
    try {
      const body = {
        Username: user.Username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        country: user.country,
        zipCode: user.zipCode,
        identityNumber: user.identityNumber || '11111111111',
        userId: user.id,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category || 'Default',
          price: parseFloat(item.price).toFixed(2),
          quantity: item.quantity
        }))
      };

      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment');
      }

      const data = await response.json();

      if (data.paymentPageUrl) {
        window.location.href = data.paymentPageUrl;
      } else {
        throw new Error('Payment page URL not received');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error(`Ödeme oluşturulurken bir hata oluştu: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sepetiniz</h1>
      {items.length === 0 ? (
        <p>Sepetiniz boş.</p>
      ) : (
        <>
          <Card className="mb-4">
            <CardContent className="p-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex items-center justify-between mb-4 border-b pb-4">
                  <div className="flex items-center">
                    <Image 
                      src={getImageSrc(item.image) || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md mr-4"
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p>Beden: {item.size}</p>
                      <p>Adet: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{parseFloat(item.price).toFixed(2)}TL</p>
                    <p>Toplam: {(parseFloat(item.price) * item.quantity).toFixed(2)}TL</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold text-lg">Genel Toplam:</span>
                <span className="font-semibold text-lg">{totalPrice.toFixed(2)}TL</span>
              </div>
            </CardContent>
          </Card>
          <Button onClick={handleConfirm} disabled={isProcessing} className="w-full">
            {isProcessing ? 'İşleniyor...' : 'Ödemeye Geç'}
          </Button>
        </>
      )}
    </div>
  )
}

