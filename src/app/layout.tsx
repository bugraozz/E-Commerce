'use client';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/contexts/CartContext'
import { ShoppingCard } from '@/components/ShoppingCard'
import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from "@/components/theme-provider"
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { SessionProvider } from 'next-auth/react';
import VisitorTracker from './admin/VisitorTracker/page';
import { NotificationProvider } from '@/contexts/NotificationContext ';

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
    <NotificationProvider>
    <SessionProvider>
      <AuthProvider>
        <html lang="en">
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <CartProvider>     
                <FavoritesProvider>
                  {children}
                  <VisitorTracker /> {/* Move VisitorTracker here */}
                </FavoritesProvider>
              </CartProvider>
            </ThemeProvider>
          </body>
        </html>
      </AuthProvider>
    </SessionProvider>
    </NotificationProvider>
  )
}