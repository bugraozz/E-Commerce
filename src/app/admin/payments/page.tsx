import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Burada sipariş onaylama ve stok güncelleme işlemlerini yapabilirsiniz
    // Örneğin: API çağrısı yaparak siparişi onaylayabilir ve stokları güncelleyebilirsiniz
  }, [])

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

