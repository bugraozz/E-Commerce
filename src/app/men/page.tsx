'use client'

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
import Header from '@/components/Header';

interface Product {
  id: number;
  name: string;
  price: number | string;
  images: string[];
  category: string;
  size: string;
  sizes: { size: string }[];
  image: string;
  gender: string;
}

interface FilterState {
  selectedCategories: string[];
  selectedSizes: string[];
  priceRange: [number, number];
}

export default function MenPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]); // Define sizes state
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12); // Adjust this number as needed

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSizes();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?gender=men&is_deleted=false');
      if (!response.ok) throw new Error('Ürünler yüklenirken bir hata oluştu.');

      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data); // Başlangıçta tüm ürünleri göster
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Bilinmeyen bir hata oluştu.');
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?gender=men&is_deleted=false');
      if (!response.ok) throw new Error('Kategoriler yüklenirken bir hata oluştu.');

      const data = await response.json();
      setCategories(data.map(category => category.name));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Bilinmeyen bir hata oluştu.');
      }
    }
  };

  const fetchSizes = async () => {
    try {
        const response = await fetch('/api/products/sizes?gender=men');
        if (!response.ok) throw new Error('Bedenler yüklenirken bir hata oluştu.');

        const data = await response.json();
        setSizes(data); // Set sizes state
    } catch (error) {
        if (error instanceof Error) {
            setError(error.message);
        } else {
            setError('Bilinmeyen bir hata oluştu.');
        }
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
          Number(product.price) >= filters.priceRange[0] && Number(product.price) <= filters.priceRange[1];

        return categoryMatch && sizeMatch && priceMatch;
      });

      setFilteredProducts(newFilteredProducts);
      setCurrentPage(1); 
    },
    [products]
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden ">
      <Header />

      <div className="container m-4 px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Erkek Ürünleri</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <ProductFilters gender="men" onFilterChange={handleFilterChange} sizes={sizes} />
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
