


'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

export const ShoppingCard = () => {
  const { items, removeItem, totalQuantity } = useCart();
  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  

  return (
    <div >
      <Button 
       variant="ghost" className="relative h-8 w-8 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingCart className="h-5 w-5" />
        {isLoggedIn && totalQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {totalQuantity}
          </span>
        )}
      </Button>
      {isOpen && isLoggedIn && totalQuantity > 0 && (
        <Card className="absolute top-12 right-0 w-64 bg-white shadow-xl">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Sepetinizde {totalQuantity} ürün var</h3>
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between mb-2">
                <span>  (x{item.quantity}) {item.name} Beden:{item.size} </span>
                <span className="font-semibold bg-blend-color-burn  ">{item.price}TL</span>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                  Kaldır
                </Button>
              </div>
            ))}
            <div className="mt-4">
              <span className="font-semibold bg-blend-color-burn  ">Toplam::</span>
              <span className="float-center">{items.reduce((acc, item) => acc + item.price * item.quantity, 0)}TL</span>
              <Button className="w-full">Sepete Git</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};