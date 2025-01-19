'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from 'react-hot-toast'

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface Order {
  id: number
  created_at: string
  total_amount: number | string
  status: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, getToken } = useAuth()

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const token = getToken()
        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        } else {
          console.error('Failed to fetch orders:', response.status, response.statusText)
          toast.error('Siparişler alınamadı')
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Siparişler alınırken bir hata oluştu')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user, getToken])

  if (!user) {
    return <div className="text-center mt-8">Lütfen giriş yapın.</div>
  }

  if (isLoading) {
    return <div className="text-center mt-8">Yükleniyor...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Siparişlerim</h1>
      {orders.length === 0 ? (
        <p>Henüz siparişiniz bulunmamaktadır.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-4">
            <CardHeader>
              <CardTitle>Sipariş #{order.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tarih: {new Date(order.created_at).toLocaleDateString()}</p>
              <p>Toplam Tutar: {parseFloat(order.total_amount as string).toFixed(2)} TL</p>
              <p>Durum: {order.status}</p>
              <h3 className="font-semibold mt-2">Ürünler:</h3>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id} className="ml-4">
                    {item.name} - {item.quantity} adet - {item.price.toFixed(2)} TL
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))
      )}
      <Button onClick={() => window.history.back()}>Geri Dön</Button>
    </div>
  )
}