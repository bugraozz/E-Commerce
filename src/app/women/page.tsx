


// 'use client';

// import { ProductCard } from '../../components/ProductCard';
// import ProductFilters from '../../components/ProductFilters';
// import { useState, useEffect, useCallback } from 'react';
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"

// interface Product {
//   id: number;
//   name: string;
//   price: number | string;
//   images: string[];
//   category: string;
//   size: string;
//   sizes: {size:string}[]
// }

// interface FilterState {
//   selectedCategories: string[];
//   selectedSizes: string[];
//   priceRange: [number, number];
// }

// export default function WomenPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [productsPerPage] = useState(12); // Adjust this number as needed

//   useEffect(() => {
//     fetchProducts();
//   }, []);
  
//   const fetchProducts = async () => {
//     try {
//       const response = await fetch('/api/products?gender=women');
//       if (!response.ok) throw new Error('Ürünler yüklenirken bir hata oluştu.');
  
//       const data = await response.json();
//       console.log('Fetched products:', data); // Gelen ürünleri kontrol edin
//       setProducts(data);
//       setFilteredProducts(data); // Başlangıçta tüm ürünleri göster
//     } catch (error) {
//       setError(error.message);
//     }
//   };
  

//   const handleFilterChange = useCallback(
//     (filters: FilterState) => {
//       console.log('Filters applied:', filters);
  
//       const newFilteredProducts = products.filter((product) => {
//         const categoryMatch =
//           filters.selectedCategories.length === 0 || filters.selectedCategories.includes(product.category);
      
//         const sizeMatch =
//           filters.selectedSizes.length === 0 ||
//           product.sizes.some((sizeObj) => filters.selectedSizes.includes(sizeObj.size)); // sizes içindeki eşleşmeyi kontrol et
      
//         const priceMatch =
//           product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      
      
//         return categoryMatch && sizeMatch && priceMatch;
//       });
      
  
//       console.log('Filtered products:', newFilteredProducts);
  
//       setFilteredProducts(newFilteredProducts);
//       setCurrentPage(1); // Sayfayı filtreleme işleminden sonra 1. sayfaya sıfırla
//     },
//     [products]
//   );
  

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

//   return (
//     <div className="container m-4 px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Kadın Ürünleri</h1>
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       <div className="flex flex-col md:flex-row gap-8">
//         <div className="md:w-1/4">
//           <ProductFilters gender="women" onFilterChange={handleFilterChange} />
//         </div>
//         <div className="md:w-3/4">
//           {currentProducts.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {currentProducts.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500">Seçilen filtrelere uygun ürün bulunamadı.</p>
//           )}

//           {filteredProducts.length > productsPerPage && (
//             <Pagination className="mt-8">
//               <PaginationContent>
//                 <PaginationItem>
//                   <PaginationPrevious 
//                     href="#" 
//                     onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
//                   />
//                 </PaginationItem>
//                 {[...Array(totalPages)].map((_, index) => (
//                   <PaginationItem key={index}>
//                     <PaginationLink 
//                       href="#" 
//                       isActive={currentPage === index + 1}
//                       onClick={() => paginate(index + 1)}
//                     >
//                       {index + 1}
//                     </PaginationLink>
//                   </PaginationItem>
//                 ))}
//                 <PaginationItem>
//                   <PaginationNext 
//                     href="#" 
//                     onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
//                   />
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';

import { ProductCard } from '../../components/ProductCard';
import ProductFilters from '../../components/ProductFilters';
import { useState, useEffect, useCallback } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Search, Heart } from 'lucide-react';
import { ShoppingCard } from '../../components/ShoppingCard'; // Sepet bileşeni için doğru yolu belirtin.

interface Product {
  id: number;
  name: string;
  price: number | string;
  images: string[];
  category: string;
  size: string;
  sizes: { size: string }[];
}

interface FilterState {
  selectedCategories: string[];
  selectedSizes: string[];
  priceRange: [number, number];
}

export default function WomenPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12); // Adjust this number as needed

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?gender=women');
      if (!response.ok) throw new Error('Ürünler yüklenirken bir hata oluştu.');

      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data); // Başlangıçta tüm ürünleri göster
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFilterChange = useCallback(
    (filters: FilterState) => {
      const newFilteredProducts = products.filter((product) => {
        const categoryMatch =
          filters.selectedCategories.length === 0 || filters.selectedCategories.includes(product.category);

        const sizeMatch =
          filters.selectedSizes.length === 0 ||
          product.sizes.some((sizeObj) => filters.selectedSizes.includes(sizeObj.size)); // sizes içindeki eşleşmeyi kontrol et

        const priceMatch =
          product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

        return categoryMatch && sizeMatch && priceMatch;
      });

      setFilteredProducts(newFilteredProducts);
      setCurrentPage(1); // Sayfayı filtreleme işleminden sonra 1. sayfaya sıfırla
    },
    [products]
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-background border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            
          </div>
          <div className="text-2xl font-bold">C&B</div>
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5" />
            <ShoppingCard />
            <Heart className="h-5 w-5" />
            
          </div>
        </div>
      </nav>

      {/* Women Products Page */}
      <div className="container m-4 px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Kadın Ürünleri</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <ProductFilters gender="women" onFilterChange={handleFilterChange} />
          </div>
          <div className="md:w-3/4">
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Seçilen filtrelere uygun ürün bulunamadı.</p>
            )}

            {filteredProducts.length > productsPerPage && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === index + 1}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
