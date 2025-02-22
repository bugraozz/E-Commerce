'use client'

import { useState } from 'react'
import { motion } from "framer-motion";
import { X, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { ProductCard } from '@/components/ProductCard'

const getImageSrc = (image: string | undefined) => {
  if (!image) return '/placeholder.jpg';
  if (image.startsWith('http')) return image;
  return image.startsWith('/') ? image : `/${image}`;
};

export const ShoppingCard = () => {
  const { items, removeItem, totalQuantity } = useCart();
  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="z-50">
      <Button 
        variant="ghost" 
        className="relative h-8 w-8 rounded-full"
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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white dark:bg-zinc-900 shadow-xl"
          >
            <div className="flex flex-col h-full ">
              <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-medium">Shopping Cart</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <Link href={`/products/${item.id}`}>
                      <Image
                        src={getImageSrc(item.image)}
                        alt={item.name}
                        width={800}
                        height={600}
                        className="w-40 h-[100px] md:h-full object-cover object-center"
                        quality={100}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-medium truncate">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Qty: {item.quantity}</p>
                      <p className="text-base font-medium mt-1">{item.price * item.quantity} TL</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between mb-4">
                  <span className="text-base">Total</span>
                  <span className="text-base font-medium">{totalPrice} TL</span>
                </div>
                <Link href="/checkout">
                  <Button className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-base font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};