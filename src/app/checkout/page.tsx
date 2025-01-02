

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

  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

 

  const handleConfirm = async () => {
    if (!user) {
      toast.error('Lütfen giriş yapın.');
      return;
    }
  
    setIsProcessing(true);
    try {
      const body = {
        Username: user.Username, // Ensure 'user.name' contains the full name
        email: user.email,
        adress: user.adress,
        city: user.city,
        country: user.country,
        zipcode: user.zipcode,
        cardNumber: '4111111111111111', // Replace with actual card number input
        cardExpiry: '12/26', // Replace with actual expiry input
        cardCVC: '123', // Replace with actual CVC input
        totalAmount: totalPrice,
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
  
      const { paymentPageUrl } = await response.json();
      router.push(paymentPageUrl);
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
                      src={getImageSrc(item.image)}
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
                    <p className="font-semibold">{item.price}TL</p>
                    <p>Toplam: {item.price * item.quantity}TL</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold text-lg">Genel Toplam:</span>
                <span className="font-semibold text-lg">{totalPrice}TL</span>
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



