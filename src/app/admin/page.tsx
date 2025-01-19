

'use client'

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaTshirt, FaFileAlt, FaSquare, FaChartBar } from "react-icons/fa"; // Import icons
import { MdFemale, MdMale } from "react-icons/md";

export default function AdminPage() {
  const { logout } = useAuth();
  const user = useAuth();
  
  
  return (
    <div className="container mx-auto px-6 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Admin Panel</h1>
        <Button onClick={logout} className="bg-red-500 text-white hover:bg-red-600">Logout</Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Women Products */}
        <Link href="/admin/women">
          <Card className="hover:shadow-lg transform transition duration-300 hover:scale-105">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Kadın Ürünleri</CardTitle>
              <MdFemale className="text-pink-500 text-3xl" />
            </CardHeader>
            <CardContent>
              <p>Düzenlemek için tıklayın</p>
            </CardContent>
          </Card>
        </Link>

        {/* Men Products */}
        <Link href="/admin/men">
          <Card className="hover:shadow-lg transform transition duration-300 hover:scale-105">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Erkek Ürünleri</CardTitle>
              <MdMale className="text-blue-500 text-3xl" />
            </CardHeader>
            <CardContent>
              <p>Düzenlemek için tıklayın</p>
            </CardContent>
          </Card>
        </Link>

        {/* Users */}
        <Link href="/admin/users">
          <Card className="hover:shadow-lg transform transition duration-300 hover:scale-105">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Kullanıcılar</CardTitle>
              <FaUser className="text-green-500 text-3xl" />
            </CardHeader>
            <CardContent>
              <p>Kullanıcıları yönetmek için tıklayın</p>
            </CardContent>
          </Card>
        </Link>

        {/* Content Pages */}
        <Link href="/admin/content-pages">
          <Card className="hover:shadow-lg transform transition duration-300 hover:scale-105">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Sayfalar</CardTitle>
              <FaFileAlt className="text-yellow-500 text-3xl" />
            </CardHeader>
            <CardContent>
              <p>Sayfaları düzenlemek için tıklayın</p>
            </CardContent>
          </Card>
        </Link>


        {/* ProductsStock */}
        <Link href="/admin/products-stock">
          <Card className="hover:shadow-lg transform transition duration-300 hover:scale-105">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Ürün Stokları</CardTitle>
              <FaSquare className="text-purple-500 text-3xl" />
            </CardHeader>
            <CardContent>
              <p>Ürün Stoklarını düzenlemek için tıklayın</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/sales-dashboard">
          <Card className="hover:shadow-lg transform transition duration-300 hover:scale-105">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Satışlar</CardTitle>
              <FaChartBar className="text-red-500 text-3xl" />
            </CardHeader>
            <CardContent>
              <p>Satışları görmek için tıklayın</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
