
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

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
  description: string;
  sizes: ProductSize[];
}

interface Category {
  id: number;
  name: string;
  gender: string;
}

async function fetchProducts(category: string): Promise<Product[]> {
  console.log('Fetching products for category:', category);
  const response = await fetch(`/api/products?category=${category}`);
  if (!response.ok) {
    console.error('Error fetching products:', response.statusText);
    throw new Error('Ürünler yüklenirken bir hata oluştu.');
  }
  const data = await response.json();
  console.log('Fetched products:', data);
  return data;
}

async function fetchCategories(gender: string): Promise<Category[]> {
  console.log('Fetching categories for gender:', gender);
  const response = await fetch(`/api/categories?gender=${gender}`);
  if (!response.ok) {
    console.error('Error fetching categories:', response.statusText);
    throw new Error('Kategoriler yüklenirken bir hata oluştu.');
  }
  const data = await response.json();
  console.log('Fetched categories:', data);
  return data;
}

export default function AdminCategoryPage({ params }: { params: { category: string } }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({ 
    name: '', 
    price: 0, 
    images: [''], 
    category: '', 
    description: '',
    sizes: [{ size: '', stock: 0 }]
  });
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({ name: '', gender: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(params.category);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const gender = params.category === 'women' ? 'women' : 'men';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching data for category:', selectedCategory);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(selectedCategory),
          fetchCategories(gender)
        ]);
        console.log('Fetched products:', productsData);
        console.log('Fetched categories:', categoriesData);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Veri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin ve tekrar deneyin.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, gender]);

  const handleAddCategory = async () => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCategory, gender }),
      });

      if (!response.ok) throw new Error('Kategori eklenirken bir hata oluştu.');

      const addedCategory = await response.json();
      setCategories(prevCategories => [...prevCategories, addedCategory]);
      setNewCategory({ name: '', gender: '' });
      setSuccess('Kategori başarıyla eklendi.');
      setError(null);
    } catch (error) {
      setError('Kategori eklenirken bir hata oluştu.');
      setSuccess(null);
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProduct, gender }),
      });
  
      if (!response.ok) throw new Error('Ürün eklenirken bir hata oluştu.');
  
      const addedProduct = await response.json();
      if (addedProduct.category === selectedCategory) {
        setProducts(prevProducts => [...prevProducts, addedProduct]);
      }
      setNewProduct({ name: '', price: 0, images: [''], category: '', description: '', sizes: [{ size: '', stock: 0 }] });
      setSuccess('Ürün başarıyla eklendi.');
      setError(null);
  
      const updatedProducts = await fetchProducts(selectedCategory);
      setProducts(Array.isArray(updatedProducts) ? updatedProducts : []);
    } catch (error) {
      setError('Ürün eklenirken bir hata oluştu.');
      setSuccess(null);
    }
  };

  const handleUpdateProduct = async (id: number) => {
    const updatedProduct = products.find(p => p.id === id);
    if (!updatedProduct) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) throw new Error('Ürün güncellenirken bir hata oluştu.');

      setProducts(prevProducts => prevProducts.map(p => (p.id === id ? updatedProduct : p)));
      setSuccess('Ürün başarıyla güncellendi.');
      setError(null);
    } catch (error) {
      setError
      ('Ürün güncellenirken bir hata oluştu.');
      setSuccess(null);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });

      if (!response.ok) throw new Error('Ürün silinirken bir hata oluştu.');

      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      setSuccess('Ürün başarıyla silindi.');
      setError(null);
    } catch (error) {
      setError('Ürün silinirken bir hata oluştu.');
      setSuccess(null);
    }
  };

  const handleInputChange = (id: number, field: keyof Product, value: string | number | string[]) => {
    setProducts(prevProducts => prevProducts.map(product =>
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const handleImageChange = (id: number, index: number, value: string) => {
    setProducts(prevProducts => prevProducts.map(product => {
      if (product.id === id) {
        const newImages = [...product.images];
        newImages[index] = value;
        return { ...product, images: newImages };
      }
      return product;
    }));
  };

  const addImageField = (id: number) => {
    setProducts(prevProducts => prevProducts.map(product => 
      product.id === id ? { ...product, images: [...product.images, ''] } : product
    ));
  };

  const removeImageField = (id: number, index: number) => {
    setProducts(prevProducts => prevProducts.map(product => {
      if (product.id === id) {
        const newImages = product.images.filter((_, i) => i !== index);
        return { ...product, images: newImages };
      }
      return product;
    }));
  };

  const handleAddSize = (productId: number) => {
    setProducts(prevProducts => prevProducts.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          sizes: [...product.sizes, { size: '', stock: 0 }]
        };
      }
      return product;
    }));
  };

  const handleRemoveSize = (productId: number, index: number) => {
    setProducts(prevProducts => prevProducts.map(product => {
      if (product.id === productId) {
        const newSizes = [...product.sizes];
        newSizes.splice(index, 1);
        return { ...product, sizes: newSizes };
      }
      return product;
    }));
  };

  const handleSizeChange = (productId: number, index: number, field: 'size' | 'stock', value: string | number) => {
    setProducts(prevProducts => prevProducts.map(product => {
      if (product.id === productId) {
        const newSizes = [...product.sizes];
        newSizes[index] = { ...newSizes[index], [field]: value };
        return { ...product, sizes: newSizes };
      }
      return product;
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
        <span className="sr-only">Yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          {gender === 'women' ? 'Kadın' : 'Erkek'} Ürünleri ve Kategorileri Yönetimi
        </h1>
  
        {success && <p className="bg-green-100 text-green-700 p-4 rounded mb-6">{success}</p>}
  
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            variant="default"
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Kategori Ekle
          </Button>
          <Button
            onClick={() => setShowProductForm(!showProductForm)}
            variant="default"
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Ürün Ekle
          </Button>
        </div>
  
        {showCategoryForm && (
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Yeni Kategori Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Kategori Adı"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="mb-4 border-gray-300 focus:ring focus:ring-blue-500"
              />
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleAddCategory}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Kategori Ekle
              </Button>
            </CardFooter>
          </Card>
        )}
  
        {showProductForm && (
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Yeni Ürün Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Ürün Adı"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="mb-4 border-gray-300 focus:ring focus:ring-blue-500"
              />
              <Input
                type="number"
                placeholder="Fiyat"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                className="mb-4 border-gray-300 focus:ring focus:ring-blue-500"
              />
              {newProduct.images.map((image, index) => (
                <div key={index} className="flex items-center mb-4">
                  <Input
                    type="text"
                    placeholder={`Resim URL ${index + 1}`}
                    value={image}
                    onChange={(e) => {
                      const newImages = [...newProduct.images];
                      newImages[index] = e.target.value;
                      setNewProduct({ ...newProduct, images: newImages });
                    }}
                    className="flex-grow border-gray-300 focus:ring focus:ring-blue-500"
                  />
                  <Button
                    onClick={() => {
                      const newImages = newProduct.images.filter((_, i) => i !== index);
                      setNewProduct({ ...newProduct, images: newImages });
                    }}
                    variant="destructive"
                    className="ml-2 text-red-500 hover:text-red-600"
                  >
                    Sil
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => setNewProduct({ ...newProduct, images: [...newProduct.images, ''] })}
                variant="outline"
                className="mb-4 border border-gray-300 hover:bg-gray-200"
              >
                Resim Ekle
              </Button>
              <Textarea
                placeholder="Ürün Açıklaması"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="mb-4 border-gray-300 focus:ring focus:ring-blue-500"
              />
              <Select
                value={newProduct.category}
                onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                className="mb-4"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori Seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Bedenler ve Stoklar</h4>
                {newProduct.sizes.map((size, index) => (
                  <div key={index} className="flex items-center gap-4 mb-4">
                    <Input
                      type="text"
                      placeholder="Beden"
                      value={size.size}
                      onChange={(e) => {
                        const newSizes = [...newProduct.sizes];
                        newSizes[index].size = e.target.value;
                        setNewProduct({ ...newProduct, sizes: newSizes });
                      }}
                      className="flex-grow border-gray-300 focus:ring focus:ring-blue-500"
                    />
                    <Input
                      type="number"
                      placeholder="Stok"
                      value={size.stock}
                      onChange={(e) => {
                        const newSizes = [...newProduct.sizes];
                        newSizes[index].stock = parseInt(e.target.value);
                        setNewProduct({ ...newProduct, sizes: newSizes });
                      }}
                      className="flex-grow border-gray-300 focus:ring focus:ring-blue-500"
                    />
                    <Button
                      onClick={() => {
                        const newSizes = newProduct.sizes.filter((_, i) => i !== index);
                        setNewProduct({ ...newProduct, sizes: newSizes });
                      }}
                      variant="destructive"
                      className="text-red-500 hover:text-red-600"
                    >
                      Sil
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => setNewProduct({ ...newProduct, sizes: [...newProduct.sizes, { size: '', stock: 0 }] })}
                  variant="outline"
                  className="border border-gray-300 hover:bg-gray-200"
                >
                  Beden Ekle
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleAddProduct}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Ürün Ekle
              </Button>
            </CardFooter>
          </Card>
        )}
  
        <div className="mb-6">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <SelectTrigger>
              <SelectValue placeholder="Kategori Seçin" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p className="text-gray-500">Bu kategoride ürün bulunmamaktadır.</p>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="shadow-md">
                <CardHeader>
                  <CardTitle className="font-semibold text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleInputChange(product.id, 'name', e.target.value)}
                    className="mb-4 border-gray-300 focus:ring focus:ring-blue-500"
                  />
                  <Input
                    type="number"
                    value={product.price}
                    onChange={(e) => handleInputChange(product.id, 'price', parseFloat(e.target.value))}
                    className="mb-4 border-gray-300 focus:ring focus:ring-blue-500"
                  />
                  {product.images.map((image, index) => (
                    <div key={index} className="flex items-center mb-4">
                      <Input
                        type="text"
                        value={image}
                        onChange={(e) => handleImageChange(product.id, index, e.target.value)}
                        className="flex-grow border-gray-300 focus:ring focus:ring-blue-500"
                      />
                      <Button 
                        onClick={() => removeImageField(product.id, index)}
                        variant="destructive"
                        className="ml-2"
                      >
                        Sil
                      </Button>
                    </div>
                  ))}
                  <Button 
                    onClick={() => addImageField(product.id)}
                    variant="outline"
                    className="mb-2"
                  >
                    Resim Ekle
                  </Button>
                  <Textarea
                    value={product.description}
                    onChange={(e) => handleInputChange(product.id, 'description', e.target.value)}
                    className="mb-2"
                  />
                  <Select
                    value={product.category}
                    onValueChange={(value) => handleInputChange(product.id, 'category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Bedenler ve Stoklar</h4>
                    {product.sizes.map((size, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          type="text"
                          value={size.size}
                          onChange={(e) => handleSizeChange(product.id, index, 'size', e.target.value)}
                        />
                        <Input
                          type="number"
                          value={size.stock}
                          onChange={(e) => handleSizeChange(product.id, index, 'stock', parseInt(e.target.value))}
                        />
                        <Button 
                          onClick={() => handleRemoveSize(product.id, index)}
                          variant="destructive"
                        >
                          Sil
                        </Button>
                      </div>
                    ))}
                    <Button 
                      onClick={() => handleAddSize(product.id)}
                      variant="outline"
                    >
                      Beden Ekle
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleDeleteProduct(product.id)} variant="destructive" className="mr-2">
                    Sil
                  </Button>
                  <Button onClick={() => handleUpdateProduct(product.id)} variant="default">
                    Güncelle
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
  

  // return (
  //   <div className="container mx-auto px-4 py-8">
  //     <h1 className="text-3xl font-bold mb-6">{gender === 'women' ? 'Kadın' : 'Erkek'} Ürünleri ve Kategorileri Yönetimi</h1>

  //     {success && <p className="text-green-500 mb-4">{success}</p>}

  //     <div className="flex gap-4 mb-8">
  //       <Button onClick={() => setShowCategoryForm(!showCategoryForm)} variant="default">
  //         Kategori Ekle
  //       </Button>
  //       <Button onClick={() => setShowProductForm(!showProductForm)} variant="default">
  //         Ürün Ekle
  //       </Button>
  //     </div>

  //     {showCategoryForm && (
  //       <Card className="mb-8">
  //         <CardHeader>
  //           <CardTitle>Yeni Kategori Ekle</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <Input
  //             type="text"
  //             placeholder="Kategori Adı"
  //             value={newCategory.name}
  //             onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
  //             className="mb-4"
  //           />
  //         </CardContent>
  //         <CardFooter>
  //           <Button onClick={handleAddCategory}>Kategori Ekle</Button>
  //         </CardFooter>
  //       </Card>
  //     )}

  //     {showProductForm && (
  //       <Card className="mb-8">
  //         <CardHeader>
  //           <CardTitle>Yeni Ürün Ekle</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <Input
  //             type="text"
  //             placeholder="Ürün Adı"
  //             value={newProduct.name}
  //             onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
  //             className="mb-2"
  //           />
  //           <Input
  //             type="number"
  //             placeholder="Fiyat"
  //             value={newProduct.price}
  //             onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
  //             className="mb-2"
  //           />
  //           {newProduct.images.map((image, index) => (
  //             <div key={index} className="flex mb-2">
  //               <Input
  //                 type="text"
  //                 placeholder={`Resim URL ${index + 1}`}
  //                 value={image}
  //                 onChange={(e) => {
  //                   const newImages = [...newProduct.images];
  //                   newImages[index] = e.target.value;
  //                   setNewProduct({ ...newProduct, images: newImages });
  //                 }}
  //                 className="flex-grow"
  //               />
  //               <Button 
  //                 onClick={() => {
  //                   const newImages = newProduct.images.filter((_, i) => i !== index);
  //                   setNewProduct({ ...newProduct, images: newImages });
  //                 }}
  //                 variant="destructive"
  //                 className="ml-2"
  //               >
  //                 Sil
  //               </Button>
  //             </div>
  //           ))}
  //           <Button 
  //             onClick={() => setNewProduct({ ...newProduct, images: [...newProduct.images, ''] })}
  //             variant="outline"
  //             className="mb-2"
  //           >
  //             Resim Ekle
  //           </Button>
  //           <Textarea
  //             placeholder="Ürün Açıklaması"
  //             value={newProduct.description}
  //             onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
  //             className="mb-2"
  //           />
  //           <Select
  //             value={newProduct.category}
  //             onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
  //           >
  //             <SelectTrigger>
  //               <SelectValue placeholder="Kategori Seçin" />
  //             </SelectTrigger>
  //             <SelectContent>
  //               {categories.map((category) => (
  //                 <SelectItem key={category.id} value={category.name}>
  //                   {category.name}
  //                 </SelectItem>
  //               ))}
  //             </SelectContent>
  //           </Select>
  //           <div className="mt-4">
  //             <h4 className="font-semibold mb-2">Bedenler ve Stoklar</h4>
  //             {newProduct.sizes.map((size, index) => (
  //               <div key={index} className="flex gap-2 mb-2">
  //                 <Input
  //                   type="text"
  //                   placeholder="Beden"
  //                   value={size.size}
  //                   onChange={(e) => {
  //                     const newSizes = [...newProduct.sizes];
  //                     newSizes[index].size = e.target.value;
  //                     setNewProduct({ ...newProduct, sizes: newSizes });
  //                   }}
  //                 />
  //                 <Input
  //                   type="number"
  //                   placeholder="Stok"
  //                   value={size.stock}
  //                   onChange={(e) => {
  //                     const newSizes = [...newProduct.sizes];
  //                     newSizes[index].stock = parseInt(e.target.value);
  //                     setNewProduct({ ...newProduct, sizes: newSizes });
  //                   }}
  //                 />
  //                 <Button 
  //                   onClick={() => {
  //                     const newSizes = newProduct.sizes.filter((_, i) => i !== index);
  //                     setNewProduct({ ...newProduct, sizes: newSizes });
  //                   }}
  //                   variant="destructive"
  //                 >
  //                   Sil
  //                 </Button>
  //               </div>
  //             ))}
  //             <Button 
  //               onClick={() => setNewProduct({ ...newProduct, sizes: [...newProduct.sizes, { size: '', stock: 0 }] })}
  //               variant="outline"
  //             >
  //               Beden Ekle
  //             </Button>
  //           </div>
  //         </CardContent>
  //         <CardFooter>
  //           <Button onClick={handleAddProduct}>Ürün Ekle</Button>
  //         </CardFooter>
  //       </Card>
  //     )}

  //     <div className="mb-4">
  //       <Select value={selectedCategory} onValueChange={setSelectedCategory}>
  //         <SelectTrigger>
  //           <SelectValue placeholder="Kategori Seçin" />
  //         </SelectTrigger>
  //         <SelectContent>
  //           {categories.map((category) => (
  //             <SelectItem key={category.id} value={category.name}>
  //               {category.name}
  //             </SelectItem>
  //           ))}
  //         </SelectContent>
  //       </Select>
  //     </div>

  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //       {products.length === 0 ? (
  //         <p>Bu kategoride ürün bulunmamaktadır.</p>
  //       ) : (
  //         products.map((product) => (
  //           <Card key={product.id}>
  //             <CardHeader>
  //               <CardTitle>{product.name}</CardTitle>
  //             </CardHeader>
  //             <CardContent>
  //               <Input
  //                 type="text"
  //                 value={product.name}
  //                 onChange={(e) => handleInputChange(product.id, 'name', e.target.value)}
  //                 className="mb-2"
  //               />
  //               <Input
  //                 type="number"
  //                 value={product.price}
  //                 onChange={(e) => handleInputChange(product.id, 'price', parseFloat(e.target.value))}
  //                 className="mb-2"
  //               />
  //               {product.images.map((image, index) => (
  //                 <div key={index} className="flex mb-2">
  //                   <Input
  //                     type="text"
  //                     value={image}
  //                     onChange={(e) => handleImageChange(product.id, index, e.target.value)}
  //                     className="flex-grow"
  //                   />
  //                   <Button 
  //                     onClick={() => removeImageField(product.id, index)}
  //                     variant="destructive"
  //                     className="ml-2"
  //                   >
  //                     Sil
  //                   </Button>
  //                 </div>
  //               ))}
  //               <Button 
  //                 onClick={() => addImageField(product.id)}
  //                 variant="outline"
  //                 className="mb-2"
  //               >
  //                 Resim Ekle
  //               </Button>
  //               <Textarea
  //                 value={product.description}
  //                 onChange={(e) => handleInputChange(product.id, 'description', e.target.value)}
  //                 className="mb-2"
  //               />
  //               <Select
  //                 value={product.category}
  //                 onValueChange={(value) => handleInputChange(product.id, 'category', value)}
  //               >
  //                 <SelectTrigger>
  //                   <SelectValue placeholder="Kategori Seçin" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   {categories.map((category) => (
  //                     <SelectItem key={category.id} value={category.name}>
  //                       {category.name}
  //                     </SelectItem>
  //                   ))}
  //                 </SelectContent>
  //               </Select>
  //               <div className="mt-4">
  //                 <h4 className="font-semibold mb-2">Bedenler ve Stoklar</h4>
  //                 {product.sizes.map((size, index) => (
  //                   <div key={index} className="flex gap-2 mb-2">
  //                     <Input
  //                       type="text"
  //                       value={size.size}
  //                       onChange={(e) => handleSizeChange(product.id, index, 'size', e.target.value)}
  //                     />
  //                     <Input
  //                       type="number"
  //                       value={size.stock}
  //                       onChange={(e) => handleSizeChange(product.id, index, 'stock', parseInt(e.target.value))}
  //                     />
  //                     <Button 
  //                       onClick={() => handleRemoveSize(product.id, index)}
  //                       variant="destructive"
  //                     >
  //                       Sil
  //                     </Button>
  //                   </div>
  //                 ))}
  //                 <Button 
  //                   onClick={() => handleAddSize(product.id)}
  //                   variant="outline"
  //                 >
  //                   Beden Ekle
  //                 </Button>
  //               </div>
  //             </CardContent>
  //             <CardFooter>
  //               <Button onClick={() => handleDeleteProduct(product.id)} variant="destructive" className="mr-2">
  //                 Sil
  //               </Button>
  //               <Button onClick={() => handleUpdateProduct(product.id)} variant="default">
  //                 Güncelle
  //               </Button>
  //             </CardFooter>
  //           </Card>
  //         ))
  //       )}
  //     </div>
  //   </div>
  // );
}

