'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext'

export default function AdminPage() {

  const { logout } = useAuth()
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Paneli</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/women">
          <Card>
            <CardHeader>
              <CardTitle>Kadın Ürünleri</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Kadın ürünlerini düzenle</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/men">
          <Card>
            <CardHeader>
              <CardTitle>Erkek Ürünleri</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Erkek ürünlerini düzenle</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/users" >
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcılar</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Kullanıcıları düzenle</p>
            </CardContent>
          </Card>    
        </Link>
        <Link href="/admin/content-pages">
          <Card>
            <CardHeader>
              <CardTitle>Sayfalar</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Sayfaları düzenle</p>
            </CardContent>
          </Card>
        </Link>
      </div>
      <Button onClick={logout} className="mt-4 fixed top-0 right-20 z-50">Logout</Button>
    </div>
  )
}