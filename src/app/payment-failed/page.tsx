'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PaymentFailedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorMessage = searchParams.get('error')
    setError(errorMessage)
  }, [searchParams])

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Ödeme Başarısız</h1>
          <p className="mb-4">Üzgünüz, ödeme işlemi sırasında bir hata oluştu.</p>
          {error && <p className="mb-4 text-red-500">Hata: {error}</p>}
          <Button onClick={() => router.push('/checkout')}>Tekrar Dene</Button>
        </CardContent>
      </Card>
    </div>
  )
}

