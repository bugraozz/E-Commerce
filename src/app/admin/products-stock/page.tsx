


'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, ArrowUpDown, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const formatPrice = (price: any): string => {
    if (typeof price === 'number') {
        return price.toFixed(2);
    } else if (typeof price === 'string') {
        const numPrice = parseFloat(price);
        return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    }
    return '0.00';
}

interface Size {
    size: string;
    stock: number;
}

interface Product {
    id: number;
    name: string;
    price: number | string | null;
    category: string;
    gender: string;
    sizes: Size[];
}

export default function AdminProductsStockPage() {
    const { getToken } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortColumn, setSortColumn] = useState<keyof Product>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState<string>('all');

    const fetchProducts = async () => {
        try {
            const token = getToken();
            const response = await fetch('/api/products', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ürünler yüklenirken bir hata oluştu.');
            }
            const data = await response.json();
            console.log('Fetched products:', data);
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setLoading(false);
            toast({
                title: "Hata",
                description: error.message || "Ürünler yüklenirken bir hata oluştu.",
                variant: "destructive",
            });
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const getTotalStock = (sizes: Size[]) => {
        return sizes.reduce((total, size) => total + size.stock, 0);
    }

    const sortProducts = (a: Product, b: Product) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    }

    const handleSort = (column: keyof Product) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    }

    const filteredProducts = products
        .filter(product => {
            const matchesSearch = 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.gender.toLowerCase().includes(searchTerm.toLowerCase());
            
                const matchesGender = 
                genderFilter === 'all' || 
                (genderFilter === 'Men' && product.gender.toLowerCase() === 'men') ||
                (genderFilter === 'Women' && product.gender.toLowerCase() === 'women');

            return matchesSearch && matchesGender;
        })
        .sort(sortProducts);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Ürün Stok Durumu</h1>
            <div className="flex items-center space-x-4 mb-4">
                <Input
                    type="text"
                    placeholder="Ürün ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                    icon={<Search className="h-4 w-4 text-gray-500" />}
                />
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Cinsiyet Seç" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Men">Men</SelectItem>
                        <SelectItem value="Women">Women</SelectItem>
                        
                    </SelectContent>
                </Select>
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">
                                    <Button variant="ghost" onClick={() => handleSort('name')}>
                                        Ürün Adı
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button variant="ghost" onClick={() => handleSort('category')}>
                                        Kategori
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button variant="ghost" onClick={() => handleSort('gender')}>
                                        Cinsiyet
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead className="text-right">
                                    <Button variant="ghost" onClick={() => handleSort('price')}>
                                        Fiyat
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead className="text-center">Toplam Stok</TableHead>
                                <TableHead className="text-center">Beden/Stok</TableHead>
                            </TableRow>
                        </TableHeader>
                    
<TableBody>
    {filteredProducts.map((product) => {
        const totalStock = getTotalStock(product.sizes);
        const isOutOfStock = totalStock === 0;
        const isLowStock = totalStock > 0 && totalStock < 10;

        // Satır rengi belirleme
        const rowClassName = isOutOfStock
            ? "bg-red-100" // Stok bitmişse hafif kırmızı
            : isLowStock
            ? "bg-yellow-100" // Stok az ise hafif sarı
            : "";

        return (
            <TableRow
                key={product.id}
                className={rowClassName}
            >
                {/* Ürün Adı */}
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.gender}</TableCell>
                <TableCell className="text-right">
                    {product.price !== undefined && product.price !== null
                        ? `${formatPrice(product.price)} TL`
                        : "Fiyat Yok"}
                </TableCell>
                <TableCell className="text-center">{totalStock}</TableCell>
                <TableCell>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {product.sizes.map((size) => (
                            <span
                                key={`${product.id}-${size.size}`}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                                {size.size}: {size.stock}
                            </span>
                        ))}
                    </div>
                </TableCell>
            </TableRow>
        );
    })}
</TableBody>


                    </Table>
                </div>
            )}
        </div>
    );
}


