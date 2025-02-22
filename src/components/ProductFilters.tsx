'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface Category {
  id: number;
  name: string;
  gender: string;
}

interface ProductFiltersProps {
  gender: string;
  onFilterChange: (filters: FilterState) => void;
  sizes: string[]; // Add sizes prop
}

interface FilterState {
  selectedCategories: string[];
  selectedSizes: string[];
  priceRange: [number, number];
}

async function fetchCategories(gender: string): Promise<Category[]> {
  const response = await fetch(`/api/categories?gender=${gender}`);
  if (!response.ok) throw new Error('Kategoriler yüklenirken bir hata oluştu.');
  return response.json();
}

export default function ProductFilters({ gender, onFilterChange, sizes }: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await fetchCategories(gender);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    loadData();
  }, [gender]);

  const updateFilters = useCallback(() => {
    onFilterChange({ selectedCategories, selectedSizes, priceRange });
  }, [selectedCategories, selectedSizes, priceRange, onFilterChange]);

  useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="space-y-6">
      {/* Kategoriler */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Kategoriler</h2>
        {categories.map((category) => (
          <div key={category.id} className="flex items-center mb-2">
            <Checkbox
              id={`category-${category.id}`}
              checked={selectedCategories.includes(category.name)}
              onCheckedChange={() => handleCategoryChange(category.name)}
            />
            <label
              htmlFor={`category-${category.id}`}
              className="ml-2 text-sm font-medium leading-none"
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>

      {/* Beden */}
      <div>
        <h2 className="text-md font-semibold mb-2">Beden</h2>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? 'default' : 'outline'}
              className="w-full"
              onClick={() => handleSizeChange(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Fiyat Aralığı */}
      <div>
        <h2 className="text-md font-semibold mb-2">Fiyat Aralığı</h2>
        <Slider
          min={0}
          max={10000}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
        />
        <div className="flex justify-between mt-2">
          <span>{priceRange[0]} TL</span>
          <span>{priceRange[1]} TL</span>
        </div>
      </div>
    </div>
  );
}
