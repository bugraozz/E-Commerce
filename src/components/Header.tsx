import React from "react";
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Search, Heart } from 'lucide-react'
import { ModeToggle } from '@/components/ModeToggle'
import { UserMenu } from '@/components/UserMenu'
import { ShoppingCard } from '@/components/ShoppingCard'


export default function Header() {
    return (
        <header className="bg-background border-b">
          <nav className="bg-background border-b">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/women">
                  <Button variant="ghost">Women</Button>
                </Link>
                <Link href="/men">
                  <Button variant="ghost">Men</Button>
                </Link>
              </div>
              <div className="text-2xl font-bold">C&B</div>
              <div className="flex items-center space-x-3">
                <Link href="/search">
                <Search className="h-5 w-5" />
                </Link>
                <UserMenu />
                <ShoppingCard />
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
                <ModeToggle />
              </div>
            </div>
          </nav>
        </header>
    );
}
