'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'

type PaymentFormData = {
    Username: string
  email: string
  phone: string
  adress: string
  city: string
  country: string
  zipcode: string
  cardNumber: string
  cardExpiry: string
  cardCVC: string
}

export default function PaymentPage() {
  const router = useRouter()
  const { user, isLoggedIn, getToken } = useAuth()
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending')
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PaymentFormData>()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('admin/login')
    } else {
      fetchUserInfo()
    }
  }, [isLoggedIn, router])

  const fetchUserInfo = async () => {
    try {
      const token = getToken()
      const response = await fetch('/api/user/get-info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const userData = await response.json()
        setValue('Username', userData.name)
        setValue('email', userData.email)
        setValue('phone', userData.gsmNumber)
        setValue('adress', userData.address)
        setValue('city', userData.city)
        setValue('country', userData.country)
        setValue('zipcode', userData.zip_code)
      } else {
        toast.error('Kullanıcı bilgileri alınamadı')
      }
    } catch (error) {
      console.error('Error fetching user info:', error)
      toast.error('Kullanıcı bilgileri alınırken bir hata oluştu')
    }
  }

  const onSubmit = async (data: PaymentFormData) => {
    setPaymentStatus('processing')
    try {
      const token = getToken()
      if (!token) {
        throw new Error('No authentication token found. Please log in again.')
      }
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          Username: data.Username,
          email: data.email,
          gsmNumber: data.phone,
          address: data.adress,
          city: data.city,
          country: data.country,
          zipCode: data.zipcode,
          cardNumber: data.cardNumber,
          cardExpiry: data.cardExpiry,
          cardCVC: data.cardCVC,
          totalAmount: '100.00', 
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Payment error:', errorData)
        throw new Error(errorData.message || 'Ödeme başlatılamadı')
      }

      const { paymentPageUrl } = await response.json()
      if (!paymentPageUrl) {
        throw new Error('Payment page URL not received')
      }
      router.push(paymentPageUrl)
    } catch (error) {
      console.error('Ödeme hatası:', error)
      setPaymentStatus('error')
      toast.error(error.message || 'Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setPaymentStatus('pending')
    }
  }

  if (paymentStatus === 'success') {
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

  if (paymentStatus === 'error') {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Ödeme Başarısız</h1>
            <p className="mb-4">Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.</p>
            <Button onClick={() => router.push('/checkout')}>Sepete Geri Dön</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">Ödeme Bilgileri</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="Username">Ad Soyad</Label>
              <Input id="Username" {...register("Username", { required: "Ad Soyad gerekli" })} />
              {errors.Username && <p className="text-red-500">{errors.Username.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" {...register("email", { required: "E-posta gerekli" })} />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="address">Adres</Label>
              <Input id="address" {...register("address", { required: "Adres gerekli" })} />
              {errors.address && <p className="text-red-500">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Şehir</Label>
                <Input id="city" {...register("city", { required: "Şehir gerekli" })} />
                {errors.city && <p className="text-red-500">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="country">Ülke</Label>
                <Input id="country" {...register("country", { required: "Ülke gerekli" })} />
                {errors.country && <p className="text-red-500">{errors.country.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="zipCode">Posta Kodu</Label>
              <Input id="zipCode" {...register("zipCode", { required: "Posta kodu gerekli" })} />
              {errors.zipCode && <p className="text-red-500">{errors.zipCode.message}</p>}
            </div>
            <div>
              <Label htmlFor="cardNumber">Kart Numarası</Label>
              <Input id="cardNumber" {...register("cardNumber", { required: "Kart numarası gerekli" })} />
              {errors.cardNumber && <p className="text-red-500">{errors.cardNumber.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cardExpiry">Son Kullanma Tarihi (AA/YY)</Label>
                <Input 
                  id="cardExpiry" 
                  {...register("cardExpiry", { 
                    required: "Son kullanma tarihi gerekli",
                    pattern: {
                      value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                      message: "Geçerli bir tarih giriniz (AA/YY)"
                    }
                  })} 
                  placeholder="MM/YY"
                />
                {errors.cardExpiry && <p className="text-red-500">{errors.cardExpiry.message}</p>}
              </div>
              <div>
                <Label htmlFor="cardCVC">CVC</Label>
                <Input 
                  id="cardCVC" 
                  {...register("cardCVC", { 
                    required: "CVC gerekli",
                    pattern: {
                      value: /^\d{3,4}$/,
                      message: "Geçerli bir CVC giriniz"
                    }
                  })} 
                />
                {errors.cardCVC && <p className="text-red-500">{errors.cardCVC.message}</p>}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={paymentStatus === 'processing'}>
              {paymentStatus === 'processing' ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

