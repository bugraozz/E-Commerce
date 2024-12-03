


'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminLoginPage() {
    const [Username, setUsername] = useState('')
    const [Password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { login, register, error } = useAuth()

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
    await register(Username, email, Password, confirmPassword);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Register or Login</CardTitle>
        </CardHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Giriş</TabsTrigger>
            <TabsTrigger value="register">Kayıt</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Kullanıcı Adı
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={Username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Şifre
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Giriş Yap
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="register-username" className="text-sm font-medium text-gray-700">
                    Kullanıcı Adı
                  </label>
                  <Input
                    id="register-username"
                    type="text"
                    value={Username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    E-posta
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                    Şifre
                  </label>
                  <Input
                    id="register-password"
                    type="password"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                    Şifreyi Onayla
                  </label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Kayıt Ol
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
      </Card>
    </div>
  )
}