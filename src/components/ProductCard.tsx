



import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProductSize {
  size: string;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  price: number | string;
  images: string[];
  category: string;
  gender: string;
  sizes: ProductSize[];
}

const getImageSrc = (image: string | undefined) => {
  if (!image) return '/placeholder.svg?height=300&width=300';
  if (image.startsWith('http')) return image;
  return image.startsWith('/') ? image : `/${image}`;
};

const formatPrice = (price: number | string): string => {
  if (typeof price === 'number') {
    return price.toFixed(2);
  }
  if (typeof price === 'string') {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  }
  return '0.00';
};
 
export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (product.sizes && product.sizes.length > 0) {
      const firstAvailableSize = product.sizes.find(size => size.stock > 0);
      if (firstAvailableSize) {
        addItem({
          id: product.id,
          name: product.name,
          price: parseFloat(formatPrice(product.price)),
          quantity: 1,
          size: firstAvailableSize.size
        });
      }
    }
  };

  const imageSrc = product.images && product.images.length > 0 
    ? getImageSrc(product.images[0]) 
    : '/placeholder.svg?height=300&width=300';

  const availableSizes = product.sizes.filter(size => size.stock > 0).map(size => size.size);

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-2">
          <div className="aspect-square relative mb-2">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
          <h3 className="font-semibold text-lg">{product.name}</h3>
          {/* <p className="text-sm text-gray-500">{product.category}</p>  */}
          <p className="text-sm text-gray-500">Bedenler: {availableSizes.join(', ')}</p>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center">
          <p className="font-bold">{formatPrice(product.price)} TL</p>
          {/* <Button onClick={handleAddToCart} disabled={availableSizes.length === 0}>
            {availableSizes.length > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
          </Button> */}
        </CardFooter>
      </Card>
    </Link>
  );
}

