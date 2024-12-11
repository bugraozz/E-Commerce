// import Image from 'next/image'
// import Link from 'next/link'
// import { useCart } from '@/contexts/CartContext'
// import { useFavorites } from '@/contexts/FavoritesContext'
// import { useAuth } from '@/contexts/AuthContext'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Heart } from 'lucide-react'
// import { toast } from "@/hooks/use-toast"




// interface ProductSize {
//   size: string
//   stock: number
// }

// interface Product {
//   id: number
//   name: string
//   price: number | string
//   images: string[]
//   category: string
//   gender: string
//   sizes: ProductSize[]
// }

// const getImageSrc = (image: string | undefined) => {
//   if (!image) return '/placeholder.svg?height=300&width=300'
//   if (image.startsWith('http')) return image
//   return image.startsWith('/') ? image : `/${image}`
// }

// const formatPrice = (price: number | string): string => {
//   if (typeof price === 'number') {
//     return price.toFixed(2)
//   }
//   if (typeof price === 'string') {
//     const numPrice = parseFloat(price)
//     return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
//   }
//   return '0.00'
// }
 
// export function ProductCard({ product }: { product: Product }) {
//   const { addItem } = useCart()
//   const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
//   const { user } = useAuth()
  

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault()
//     if (product.sizes && product.sizes.length > 0) {
//       const firstAvailableSize = product.sizes.find(size => size.stock > 0)
//       if (firstAvailableSize) {
//         addItem({
//           id: product.id,
//           name: product.name,
//           price: parseFloat(formatPrice(product.price)),
//           quantity: 1,
//           size: firstAvailableSize.size
//         })
//       }
//     }
//   }

//   const handleToggleFavorite = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     console.log('Toggle favorite clicked for product:', product.id);
  
//     if (!user) {
//       console.log('User not logged in');
//       toast({
//         title: "Giriş Gerekli",
//         description: "Favorilere eklemek için lütfen giriş yapın",
//         variant: "destructive",
//       });
//       return;
//     }
  
//     console.log('User Token:', user?.token); 
  
//     try {
//       if (isFavorite(product.id)) {
//         console.log('Removing from favorites');
//         await removeFromFavorites(product.id);
//       } else {
//         console.log('Adding to favorites');
//         await addToFavorites({
//           id: product.id,
//           name: product.name,
//           price: parseFloat(formatPrice(product.price)),
//           image: product.images[0],
//         });
//       }
//     } catch (error) {
//       console.error('Failed to toggle favorite:', error);
//       toast({
//         title: "Hata",
//         description: "Favoriler güncellenirken bir hata oluştu",
//         variant: "destructive",
//       });
//     }
//   };

//   const imageSrc = product.images && product.images.length > 0 
//     ? getImageSrc(product.images[0]) 
//     : '/placeholder.svg?height=300&width=300'

//   const availableSizes = product.sizes.filter(size => size.stock > 0).map(size => size.size)

//   return (
//     <Link href={`/products/${product.id}`}>
//       <Card className="h-full hover:shadow-lg transition-shadow duration-300">
//         <CardContent className="p-2">
//           <div className="aspect-square relative mb-2">
//             <Image
//               src={imageSrc}
//               alt={product.name}
//               fill
//               className="object-cover rounded-lg"
//               priority
//             />
//             <Heart
//               className={`absolute top-2 right-2 cursor-pointer ${
//                 isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-500"
//               }`}
//               onClick={handleToggleFavorite}
//             />
//           </div>
//           <h3 className="font-semibold text-lg">{product.name}</h3>
//           <p className="text-sm text-gray-500">Bedenler: {availableSizes.join(', ')}</p>
//         </CardContent>
//         <CardFooter className="p-4 flex justify-between items-center">
//           <p className="font-bold">{formatPrice(product.price)} TL</p>
//           <Button onClick={handleAddToCart}>Sepete Ekle</Button>
//         </CardFooter>
//       </Card>
//     </Link>
//   )
// }



// 'use client'

// import Image from 'next/image'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { useCart } from '@/contexts/CartContext'
// import { useFavorites } from '@/contexts/FavoritesContext'
// import { useAuth } from '@/contexts/AuthContext'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Heart } from 'lucide-react'
// import { toast } from "@/hooks/use-toast"

// interface ProductSize {
//   size: string
//   stock: number
// }

// interface Product {
//   id: number
//   name: string
//   price: number | string
//   images: string[]
//   category: string
//   gender: string
//   sizes: ProductSize[]
// }

// const getImageSrc = (image: string | undefined) => {
//   if (!image) return '/placeholder.svg?height=300&width=300'
//   if (image.startsWith('http')) return image
//   return image.startsWith('/') ? image : `/${image}`
// }

// const formatPrice = (price: number | string): string => {
//   if (typeof price === 'number') {
//     return price.toFixed(2)
//   }
//   if (typeof price === 'string') {
//     const numPrice = parseFloat(price)
//     return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
//   }
//   return '0.00'
// }
 
// export function ProductCard({ product }: { product: Product }) {
//   const { addItem } = useCart()
//   const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
//   const { user, isLoggedIn } = useAuth()
//   const router = useRouter()

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault()
//     if (product.sizes && product.sizes.length > 0) {
//       const firstAvailableSize = product.sizes.find(size => size.stock > 0)
//       if (firstAvailableSize) {
//         addItem({
//           id: product.id,
//           name: product.name,
//           price: parseFloat(formatPrice(product.price)),
//           quantity: 1,
//           size: firstAvailableSize.size
//         })
//       }
//     }
//   }

//   const handleToggleFavorite = async (e: React.MouseEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
    
//     console.log('handleToggleFavorite called')

//     if (!isLoggedIn) {
//       console.log('User not logged in')
//       toast({
//         title: "Giriş Gerekli",
//         description: "Favorilere eklemek için lütfen giriş yapın",
//         variant: "destructive",
//       })
//       router.push('/login')
//       return
//     }

//     try {
//       console.log('Toggling favorite for product:', product.id)
//       console.log('Current favorite status:', isFavorite(product.id))
    
//       if (isFavorite(product.id)) {
//         console.log('Removing from favorites')
//         await removeFromFavorites(product.id)
//       } else {
//         console.log('Adding to favorites')
//         await addToFavorites({
//           id: product.id,
//           name: product.name,
//           price: parseFloat(formatPrice(product.price)),
//           image: product.images[0]
//         })
//       }
    
//       console.log('Favorite operation completed')
//     } catch (error) {
//       console.error('Failed to toggle favorite:', error)
//       toast({
//         title: "Hata",
//         description: "Favoriler güncellenirken bir hata oluştu",
//         variant: "destructive",
//       })
//     }
//   }

//   const imageSrc = product.images && product.images.length > 0 
//     ? getImageSrc(product.images[0]) 
//     : '/placeholder.svg?height=300&width=300'

//   const availableSizes = product.sizes.filter(size => size.stock > 0).map(size => size.size)

//   return (
//     <Link href={`/products/${product.id}`}>
//       <Card className="h-full hover:shadow-lg transition-shadow duration-300">
//         <CardContent className="p-2">
//           <div className="aspect-square relative mb-2">
//             <Image
//               src={imageSrc}
//               alt={product.name}
//               fill
//               className="object-cover rounded-lg"
//               priority
//             />
//             <Heart
//               className={`absolute top-2 right-2 cursor-pointer ${
//                 isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-500"
//               }`}
//               onClick={handleToggleFavorite}
//             />
//           </div>
//           <h3 className="font-semibold text-lg">{product.name}</h3>
//           <p className="text-sm text-gray-500">Bedenler: {availableSizes.join(', ')}</p>
//         </CardContent>
//         <CardFooter className="p-4 flex justify-between items-center">
//           <p className="font-bold">{formatPrice(product.price)} TL</p>
//           <Button onClick={handleAddToCart}>Sepete Ekle</Button>
//         </CardFooter>
//       </Card>
//     </Link>
//   )
// }





import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface ProductSize {
  size: string
  stock: number
}

interface Product {
  id: number
  name: string
  price: number | string
  image: string
  category: string
  gender: string
  sizes: ProductSize[]
}

const getImageSrc = (image: string | undefined) => {
  if (!image) return '/placeholder.svg?height=300&width=300'
  if (image.startsWith('http')) return image
  return image.startsWith('/') ? image : `/${image}`
}

const formatPrice = (price: number | string): string => {
  if (typeof price === 'number') {
    return price.toFixed(2)
  }
  if (typeof price === 'string') {
    const numPrice = parseFloat(price)
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
  }
  return '0.00'
}
 
export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { user } = useAuth()

  console.log('ProductCard: Current user:', user)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.sizes && product.sizes.length > 0) {
      const firstAvailableSize = product.sizes.find(size => size.stock > 0)
      if (firstAvailableSize) {
        addItem({
          id: product.id,
          name: product.name,
          price: parseFloat(formatPrice(product.price)),
          quantity: 1,
          size: firstAvailableSize.size
        })
      }
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('handleToggleFavorite called')

    if (!user) {
      console.log('User not logged in')
      toast({
        title: "Giriş Gerekli",
        description: "Favorilere eklemek için lütfen giriş yapın",
        variant: "destructive",
      })
      return
    }

    try {
      console.log('Toggling favorite for product:', product.id)
      console.log('Current favorite status:', isFavorite(product.id))
    
      if (isFavorite(product.id)) {
        console.log('Removing from favorites')
        await removeFromFavorites(product.id)
      } else {
        console.log('Adding to favorites')
        await addToFavorites({
          id: product.id,
          name: product.name,
          price: parseFloat(formatPrice(product.price)),
          image: product.image
        })
      }
    
      console.log('Favorite operation completed')
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      toast({
        title: "Hata",
        description: "Favoriler güncellenirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

    const imageSrc = product.images && product.images.length > 0 
    ? getImageSrc(product.images[0]) 
    : '/placeholder.svg?height=300&width=300'

  const availableSizes = product.sizes.filter(size => size.stock > 0).map(size => size.size)

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
            <Heart
              className={`absolute top-2 right-2 cursor-pointer ${
                isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
              onClick={handleToggleFavorite}
            />
          </div>
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-500">Bedenler: {availableSizes.join(', ')}</p>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center">
          <p className="font-bold">{formatPrice(product.price)} TL</p>
         
        </CardFooter>
      </Card>
    </Link>
  )
}