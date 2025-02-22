'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { User, Lock, Mail, Phone, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const [Username, setUsername] = useState('')
  const [Password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { login, register, error } = useAuth()
  const [phone, setPhone] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(Username, Password);
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Password !== confirmPassword) {
      console.error("Passwords don't match");
      return;
    }
    await register(Username, email, Number(phone), Password, confirmPassword);
  }

  return (
    <div className="min-h-screen flex">
      {/* Sol taraf: Görsel */}
      <div className="hidden md:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/cakmak4.jpg')" }}></div>
      
      {/* Sağ taraf: Giriş/Kayıt Formu */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 relative">
        <Button variant="ghost" className="absolute top-4 right-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2" size={20} />
          Geri
        </Button>
        <Card className="w-full max-w-md shadow-lg border rounded-lg p-6 space-y-4">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold">  Hesabınıza Giriş Yapın</CardTitle>
          </CardHeader>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Giriş</TabsTrigger>
              <TabsTrigger value="register">Kayıt</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 p-4">
                <div className="relative flex items-center">
                  <User className="absolute left-3 text-gray-400" size={20} />
                  <Input className="pl-10" placeholder="Kullanıcı Adı" type="text" value={Username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 text-gray-400" size={20} />
                  <Input className="pl-10" placeholder="Şifre" type="password" value={Password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Separator className="my-4" />
                <CardFooter>
                  <Button type="submit" className="w-full">Giriş Yap</Button>
                </CardFooter>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 p-4">
                <div className="relative flex items-center">
                  <User className="absolute left-3 text-gray-400" size={20} />
                  <Input className="pl-10" placeholder="Kullanıcı Adı" type="text" value={Username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 text-gray-400" size={20} />
                  <Input className="pl-10" placeholder="E-posta" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 text-gray-400" size={20} />
                  <Input className="pl-10" placeholder="Telefon" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 text-gray-400" size={20} />
                  <Input className="pl-10" placeholder="Şifre" type="password" value={Password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 text-gray-400" size={20} />
                  <Input className="pl-10" placeholder="Şifreyi Onayla" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <Separator className="" />
                <CardFooter>
                  <Button type="submit" className="w-full">Kayıt Ol</Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        </Card>
      </div>
    </div>
  )
}
