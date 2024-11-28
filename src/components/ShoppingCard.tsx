

'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export const ShoppingCard = () => {
  const { items, removeItem, totalQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button 
        variant="outline" 
        className="relative bg-white shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingCart className="h-5 w-5" />
        {totalQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {totalQuantity}
          </span>
        )}
      </Button>
      {isOpen && totalQuantity > 0 && (
        <Card className="absolute top-12 right-0 w-64 bg-white shadow-xl">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Sepetinizde {totalQuantity} ürün var</h3>
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between mb-2">
                <span>{item.name} (x{item.quantity})</span>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                  Kaldır
                </Button>
              </div>
            ))}
            <div className="mt-4">
              <Button className="w-full">Sepete Git</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};