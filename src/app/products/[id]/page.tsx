'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from '@/contexts/CartContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ProductSize {
  size: string;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  gender: string;
  sizes: ProductSize[];
}

const getImageSrc = (image: string | undefined) => {
  if (!image) return '/placeholder.svg';
  if (image.startsWith('http')) return image;
  return image.startsWith('/') ? `/api${image}` : `/api/${image}`;
};

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addItem } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Ürün yüklenirken bir hata oluştu.');
      }
      const data = await response.json();
      setProduct(data);
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0].size); // Varsayılan olarak ilk bedeni seç
      }
    } catch (err) {
      setError('Ürün yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (product && selectedSize) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: selectedSize,
        image: product.images[currentImageIndex],
      });
      setIsModalOpen(false); // Sepete ekledikten sonra modalı kapat
    }
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
    }
  };

  if (isLoading) return <div className="container mx-auto px-4 py-8">Yükleniyor...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  if (!product) return <div className="container mx-auto px-4 py-8">Ürün bulunamadı.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="relative aspect-square mb-2">
                <Image
                  src={getImageSrc(product.images[currentImageIndex])}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
                <Button className="absolute left-2 top-1/2 transform -translate-y-1/2" onClick={prevImage}>
                  &#8592;
                </Button>
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={nextImage}>
                  &#8594;
                </Button>
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 ${
                      index === currentImageIndex ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Image
                      src={getImageSrc(image)}
                      alt={`${product.name} - Görsel ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-2xl font-semibold mb-4">{product.price} TL</p>
              <p className="mb-4">{product.description || 'Ürün açıklaması bulunmamaktadır.'}</p>
              <div className="mb-4">
                <strong>Kategori:</strong> {product.category}
              </div>
              <div className="mb-4">
                <strong>Cinsiyet:</strong> {product.gender}
              </div>
              <div className="mb-4">
                <strong>Beden:</strong>
                <Select value={selectedSize || ''} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Beden seçin" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="z-50"> {/* z-index ve position ekleyin */}
                    {product.sizes.map((size) => (
                      <SelectItem key={size.size} value={size.size} disabled={size.stock === 0}>
                        {size.size} {size.stock === 0 ? '(Stokta yok)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setIsModalOpen(true)}>
                Ürünü Aç
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Yapısı */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              layoutId={`product-${product.id}-image`}
              className="fixed inset-x-4 bottom-0 md:inset-[10%] z-50 bg-white dark:bg-zinc-900 rounded-t-xl md:rounded-xl overflow-hidden max-h-[80vh] md:max-h-[80vh]"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <div className="h-full md:flex">
                <div className="relative md:w-2/5">
                  <motion.img
                    src={getImageSrc(product.images[currentImageIndex])}
                    alt={product.name}
                    className="w-full h-[200px] md:h-full object-cover"
                  />
                  <Button
                    className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    onClick={prevImage}
                  >
                    &#8592;
                  </Button>
                  <Button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={nextImage}
                  >
                    &#8594;
                  </Button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 md:w-3/5 flex flex-col">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                        <p className="text-2xl font-semibold mb-4">{product.price} TL</p>
                        <p className="mb-4">{product.description || 'Ürün açıklaması bulunmamaktadır.'}</p>
                        <div className="mb-4">
                          <strong>Kategori:</strong> {product.category}
                        </div>
                        <div className="mb-4">
                          <strong>Cinsiyet:</strong> {product.gender}
                        </div>
                        <div className="mb-4">
                          <strong>Beden:</strong>
                          <Select value={selectedSize || ''} onValueChange={setSelectedSize}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Beden seçin" />
                            </SelectTrigger>
                            <SelectContent position="popper" className="z-50"> {/* z-index ve position ekleyin */}
                              {product.sizes.map((size) => (
                                <SelectItem key={size.size} value={size.size} disabled={size.stock === 0}>
                                  {size.size} {size.stock === 0 ? '(Stokta yok)' : ''}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleAddToCart} disabled={!selectedSize}>
                    {selectedSize ? 'Sepete Ekle' : 'Beden Seçin'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}