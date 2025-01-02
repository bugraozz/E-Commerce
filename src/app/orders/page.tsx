
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
  size: string
}

interface Order {
  id: number
  date: string
  totalAmount: number
  status: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, getToken } = useAuth()

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const token = getToken()
        console.log('Fetching orders with token:', token)
        const response = await fetch('/api/order', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          console.log('Received orders:', data)
          setOrders(data)
        } else {
          console.error('Failed to fetch orders:', response.status, response.statusText)
          const errorData = await response.text()
          console.error('Error data:', errorData)
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
  }, [getToken])

  if (isLoading) {
    return <div className="text-center mt-8">Yükleniyor...</div>
  }

  console.log('Rendering orders:', orders)

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
              <p>Tarih: {new Date(order.date).toLocaleDateString()}</p>
              <p>Toplam Tutar: {order.totalAmount} TL</p>
              <p>Durum: {order.status}</p>
              <h3 className="font-semibold mt-2">Ürünler:</h3>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id} className="ml-4">
                    {item.name} - {item.size} - {item.quantity} adet - {item.price} TL
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