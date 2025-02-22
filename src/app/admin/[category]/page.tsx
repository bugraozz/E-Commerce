"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Trash2 } from "lucide-react"
import FileUpload from '@/components/FileUpload';
import { useAuth } from "@/contexts/AuthContext";

interface ProductSize {
  size: string
  stock: number
}

interface Product {
  id: number
  name: string
  price: number | string
  images: string[]
  category: string
  description: string
  sizes: ProductSize[]
}

interface Category {
  id: number
  name: string
  gender: string
}

async function fetchProducts(category: string): Promise<Product[]> {
  console.log("Fetching products for category:", category)
  const response = await fetch(`/api/products?category=${category}`)
  if (!response.ok) {
    console.error("Error fetching products:", response.statusText)
    throw new Error("Ürünler yüklenirken bir hata oluştu.")
  }
  const data = await response.json()
  console.log("Fetched products:", data)
  return data
}

async function fetchCategories(gender: string): Promise<Category[]> {
  console.log("Fetching categories for gender:", gender)
  const response = await fetch(`/api/categories?gender=${gender}&is_deleted=false`)
  if (!response.ok) {
    console.error("Error fetching categories:", response.statusText)
    throw new Error("Kategoriler yüklenirken bir hata oluştu.")
  }
  const data = await response.json()
  console.log("Fetched categories:", data)
  return data
}

export default function AdminCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    images: [],
    category: "default",
    description: "",
    sizes: [{ size: "", stock: 0 }],
  })
  const [newCategory, setNewCategory] = useState<Omit<Category, "id">>({ name: "", gender: "" })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>(params.category)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [clientSelectedCategory, setClientSelectedCategory] = useState<string>("")
  const { getToken } = useAuth();
  const token = getToken();

  useEffect(() => {
    setClientSelectedCategory(selectedCategory)
  }, [selectedCategory])

  const gender = params.category === "women" ? "women" : "men"

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        console.log("Fetching data for category:", selectedCategory)
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(selectedCategory),
          fetchCategories(gender),
        ])
        console.log("Fetched products:", productsData)
        console.log("Fetched categories:", categoriesData)
        setProducts(Array.isArray(productsData) ? productsData : [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Veri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin ve tekrar deneyin.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedCategory, gender])

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      setError("Kategori adı boş olamaz.");
      return;
    }

    if (categories.some(category => category.name.toLowerCase() === newCategory.name.toLowerCase())) {
      setError("Bu kategori zaten mevcut.");
      return;
    }

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newCategory, gender }),
      });

      if (!response.ok) throw new Error("Kategori eklenirken bir hata oluştu.");

      const addedCategory = await response.json();
      setCategories((prevCategories) => [...prevCategories, addedCategory]);
      setNewCategory({ name: "", gender: "" });
      setSuccess("Kategori başarıyla eklendi.");
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Kategori eklenirken bir hata oluştu.");
      setSuccess(null);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const response = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Kategori silinirken bir hata oluştu.");

      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
      setSuccess("Kategori başarıyla silindi.");
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Kategori silinirken bir hata oluştu.");
      setSuccess(null);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name.trim()) {
      setError("Ürün adı boş olamaz.")
      return
    }

    const uniqueSizes = new Set(newProduct.sizes.map(size => size.size));
    if (uniqueSizes.size !== newProduct.sizes.length) {
      setError("Aynı bedenden birden fazla ekleyemezsiniz.")
      return
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
         },
        body: JSON.stringify({ ...newProduct, gender }),
      })

      if (!response.ok) throw new Error("Ürün eklenirken bir hata oluştu.")

      const addedProduct = await response.json()
      if (addedProduct.category === selectedCategory) {
        setProducts((prevProducts) => [...prevProducts, addedProduct])
      }
      setNewProduct({
        name: "",
        price: 0,
        images: [""],
        category: "default",
        description: "",
        sizes: [{ size: "", stock: 0 }],
      })
      setSuccess("Ürün başarıyla eklendi.")
      setError(null)

      const updatedProducts = await fetchProducts(selectedCategory)
      setProducts(Array.isArray(updatedProducts) ? updatedProducts : [])
    } catch (error) {
      setError("Ürün eklenirken bir hata oluştu.")
      setSuccess(null)
    }
  }

  const handleUpdateProduct = async (id: number) => {
    const updatedProduct = products.find((p) => p.id === id)
    if (!updatedProduct) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
         },
        body: JSON.stringify(updatedProduct),
      })

      if (!response.ok) throw new Error("Ürün güncellenirken bir hata oluştu.")

      setProducts((prevProducts) => prevProducts.map((p) => (p.id === id ? updatedProduct : p)))
      setSuccess("Ürün başarıyla güncellendi.")
      setError(null)
    } catch (error) {
      setError("Ürün güncellenirken bir hata oluştu.")
      setSuccess(null)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
         method: "DELETE", 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
      })

      if (!response.ok) throw new Error("Ürün silinirken bir hata oluştu.")

      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id))
      setSuccess("Ürün başarıyla silindi.")
      setError(null)
    } catch (error) {
      setError("Ürün silinirken bir hata oluştu.")
      setSuccess(null)
    }
  }

  const handleInputChange = (id: number, field: keyof Product, value: string | number | string[]) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === id ? { ...product, [field]: value } : product)),
    )
  }

  const handleImageChange = (id: number, index: number, value: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === id) {
          const newImages = [...product.images]
          newImages[index] = value
          return { ...product, images: newImages }
        }
        return product
      }),
    )
  }

  const addImageField = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === id ? { ...product, images: [...product.images, ""] } : product)),
    )
  }

  const removeImageField = (id: number, index: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === id) {
          const newImages = product.images.filter((_, i) => i !== index)
          return { ...product, images: newImages }
        }
        return product
      }),
    )
  }

  const handleAddSize = (productId: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId) {
          const existingSizes = product.sizes.map(size => size.size);
          if (existingSizes.includes("")) {
            setError("Boş beden ekleyemezsiniz.");
            return product;
          }
          return {
            ...product,
            sizes: [...product.sizes, { size: "", stock: 0 }],
          };
        }
        return product;
      }),
    );
  };

  const handleRemoveSize = (productId: number, index: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId) {
          const newSizes = [...product.sizes]
          newSizes.splice(index, 1)
          return { ...product, sizes: newSizes }
        }
        return product
      }),
    )
  }

  const handleSizeChange = (productId: number, index: number, field: "size" | "stock", value: string | number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId) {
          const newSizes = [...product.sizes];
          newSizes[index] = { ...newSizes[index], [field]: value };

          // Check for duplicate sizes
          const sizeValues = newSizes.map(size => size.size);
          const uniqueSizes = new Set(sizeValues);
          if (uniqueSizes.size !== sizeValues.length) {
            setError("Aynı bedenden birden fazla ekleyemezsiniz.");
            return product;
          }

          return { ...product, sizes: newSizes };
        }
        return product;
      }),
    );
  };

  const handleFileUpload = (filePaths: string[]) => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      images: [...prevProduct.images, ...filePaths],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
  }

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          {gender === "women" ? "Kadın" : "Erkek"} Ürünleri ve Kategorileri Yönetimi
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
              <Button onClick={handleAddCategory} className="bg-green-500 text-white hover:bg-green-600">
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
                onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) })}
                className="mb-4 border-gray-300 focus:ring focus:ring-blue-500"
              />
              {newProduct.images.map((image, index) => (
                <div key={index} className="flex items-center mb-4">
                  <Input
                    type="text"
                    placeholder={`Resim URL ${index + 1}`}
                    value={image}
                    onChange={(e) => {
                      const newImages = [...newProduct.images]
                      newImages[index] = e.target.value
                      setNewProduct({ ...newProduct, images: newImages })
                    }}
                    className="flex-grow border-gray-300 focus:ring focus:ring-blue-500"
                  />
                  <Button
                    onClick={() => {
                      const newImages = newProduct.images.filter((_, i) => i !== index)
                      setNewProduct({ ...newProduct, images: newImages })
                    }}
                    variant="destructive"
                    className="ml-2 text-red-500 hover:text-red-600"
                  >
                    Sil
                  </Button>
                </div>
              ))}
            <FileUpload onUpload={handleFileUpload} />
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
                    <SelectItem key={category.id} value={category.name || `category-${category.id}`}>
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
                        const newSizes = [...newProduct.sizes]
                        newSizes[index].size = e.target.value
                        setNewProduct({ ...newProduct, sizes: newSizes })
                      }}
                      className="flex-grow border-gray-300 focus:ring focus:ring-blue-500"
                    />
                    <Input
                      type="number"
                      placeholder="Stok"
                      value={size.stock}
                      onChange={(e) => {
                        const newSizes = [...newProduct.sizes]
                        newSizes[index].stock = Number.parseInt(e.target.value)
                        setNewProduct({ ...newProduct, sizes: newSizes })
                      }}
                      className="flex-grow border-gray-300 focus:ring focus:ring-blue-500"
                    />
                    <Button
                      onClick={() => {
                        const newSizes = newProduct.sizes.filter((_, i) => i !== index)
                        setNewProduct({ ...newProduct, sizes: newSizes })
                      }}
                      variant="destructive"
                      className="text-red-500 hover:text-red-600"
                    >
                      Sil
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => setNewProduct({ ...newProduct, sizes: [...newProduct.sizes, { size: "", stock: 0 }] })}
                  variant="outline"
                  className="border border-gray-300 hover:bg-gray-200"
                >
                  Beden Ekle
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddProduct} className="bg-green-500 text-white hover:bg-green-600">
                Ürün Ekle
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="mb-6">
          <Select
            value={clientSelectedCategory}
            onValueChange={(value) => {
              setClientSelectedCategory(value)
              setSelectedCategory(value)
            }}
            className="w-full"
          >
            <SelectTrigger>
              <SelectValue placeholder="Kategori Seçin" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name || `category-${category.id}`}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2 bg-white p-2 rounded shadow">
              <span>{category.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p className="text-gray-500">Bu kategoride ürün bulunmamaktadır.</p>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-primary">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleInputChange(product.id, "name", e.target.value)}
                    placeholder="Ürün Adı"
                    className="focus:ring focus:ring-blue-500"
                  />
                  <Input
                    type="number"
                    value={product.price}
                    onChange={(e) => handleInputChange(product.id, "price", Number.parseFloat(e.target.value))}
                    placeholder="Fiyat"
                    className="focus:ring focus:ring-blue-500"
                  />
                    {product.images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="text"
                        value={image}
                        onChange={(e) => handleImageChange(product.id, index, e.target.value)}
                        placeholder={`Resim URL ${index + 1}`}
                      />
                      <Button onClick={() => removeImageField(product.id, index)} variant="destructive" size="sm">
                        Sil
                      </Button>
                    </div>
                  ))}
                  <Button onClick={() => addImageField(product.id)} variant="outline" size="sm">
                    Resim Ekle
                  </Button>
                  <FileUpload onUpload={(filePaths) => {
                    const updatedImages = [...product.images, ...filePaths];
                    handleInputChange(product.id, "images", updatedImages);
                  }} />
                  <Textarea
                    value={product.description}
                    onChange={(e) => handleInputChange(product.id, "description", e.target.value)}
                    placeholder="Ürün Açıklaması"
                    className="focus:ring focus:ring-blue-500"
                  />
                  <Select
                    value={product.category}
                    onValueChange={(value) => handleInputChange(product.id, "category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name || `category-${category.id}`}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-4 space-y-2">
                    <h4 className="text-base font-semibold">Bedenler ve Stoklar</h4>
                    {product.sizes.map((size, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          type="text"
                          value={size.size}
                          onChange={(e) => handleSizeChange(product.id, index, "size", e.target.value)}
                          placeholder="Beden"
                        />
                        <Input
                          type="number"
                          value={size.stock}
                          onChange={(e) =>
                            handleSizeChange(product.id, index, "stock", Number.parseInt(e.target.value))
                          }
                          placeholder="Stok"
                        />
                        <Button onClick={() => handleRemoveSize(product.id, index)} variant="destructive" size="sm">
                          Sil
                        </Button>
                      </div>
                    ))}
                    <Button onClick={() => handleAddSize(product.id)} variant="outline" size="sm">
                      Beden Ekle
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button onClick={() => handleDeleteProduct(product.id)} variant="destructive" size="sm">
                    Sil
                  </Button>
                  <Button onClick={() => handleUpdateProduct(product.id)} variant="default" size="sm">
                    Güncelle
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

