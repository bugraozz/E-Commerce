'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProductCard } from '@/components/ProductCard';



interface Product {
  id: number
  name: string
  price: number | string
  category: string
  gender: string
  images: string[]
}

export default function FeaturedProducts() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await fetch('/api/featured-products');
        if (!response.ok) throw new Error('Ürünler yüklenirken bir hata oluştu.');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      }
    }

    getProducts();
  }, []);

  if (error) {
    return <div className="container mx-auto p-4">Hata: {error}</div>;
  }

  const getImageSrc = (images) => {
    if (images && images.length > 0) {
      const image = images[0];
      if (image.startsWith('http') || image.startsWith('https')) return image;
      return image.startsWith('/') ? image : `/${image}`;
    }
    return '/placeholder.svg?height=300&width=300';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Öne Çıkan Ürünler</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product: Product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        ...product,
                        image: getImageSrc(product.images)
                      }}
                    />
                  ))}
      </div>
    </div>
  );
}