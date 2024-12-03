'use client';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/contexts/CartContext'
import { ShoppingCard } from '@/components/ShoppingCard'
import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

    const pathname = usePathname()
    const isHomePage = pathname === '/'
    const isAdminPage = pathname ? pathname.startsWith('/admin') : true

  return (
    <AuthProvider>
    <html lang="en">
      <body className={inter.className}>
      <AuthProvider>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <CartProvider>                
          {children}
          {/* {!isHomePage && !isAdminPage && <ShoppingCard />} */}
        </CartProvider>
        </ThemeProvider>
      </AuthProvider>
      </body>
    </html>
    </AuthProvider>
  )
}