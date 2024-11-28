'use client';
import {ProductCard} from '../../components/ProductCard'
import ProductFilters from '../../components/ProductFilters'
import { useState, useEffect, useCallback } from 'react';


interface Product {
  id: number;
  name: string;
  price: number;
  subCategory: string;
  size: string;
}

interface FilterState {
  selectedCategories: string[];
  selectedSizes: string[];
  priceRange: [number, number];
}

export default function MenPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products?category=men');
            if (!response.ok) throw new Error('Ürünler yüklenirken bir hata oluştu.');

            const data = await response.json();
            setProducts(data);
            setFilteredProducts(data);


            const uniqueCategories = [...new Set(data.map((product: Product) => product.subCategory))];
            setCategories(uniqueCategories);
        } catch (error) {
            setError(error.message);
        }

      
};

useEffect(() => {
  fetchProducts();
}, []);


const handleFilterChange = useCallback((filters: FilterState) => {
  const newFilteredProducts = products.filter(product => 
    (filters.selectedCategories.length === 0 || filters.selectedCategories.includes(product.subCategory)) &&
    (filters.selectedSizes.length === 0 || filters.selectedSizes.includes(product.size)) &&
    product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
  );
  setFilteredProducts(newFilteredProducts);
}, [products]);

return (
  <div className="container  m-4 px-4 py-8 ">
    <h1 className="text-2xl font-semibold mb-6">Erkek Ürünleri</h1>
    {error && <div className="text-red-500 mb-4">{error}</div>}
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filtreleme Bölümü */}
      <div className="md:w-1/4  ">
        <ProductFilters categories={categories} onFilterChange={handleFilterChange} />
      </div>

      {/* Ürün Listesi */}
      <div className="md:w-3/4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  </div>
)
}