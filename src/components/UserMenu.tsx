// 'use client'

// import React from 'react'
// import Link from 'next/link'
// import { User } from 'lucide-react'
// import { useAuth } from '@/contexts/AuthContext'
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// export function UserMenu() {
//   const { user, logout } = useAuth()

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//           <User className="h-5 w-5" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56" align="end" forceMount>
//         {user ? (
//           <>
//             <DropdownMenuLabel className="font-normal">
//               <div className="flex flex-col space-y-1">
//                 <p className="text-sm font-medium leading-none">{user.name}</p>
//                 <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild>
//               <Link href="/user">Profil</Link>
//             </DropdownMenuItem>
//             <DropdownMenuItem asChild>
//               <Link href="/orders">Siparişlerim</Link>
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={logout}>Çıkış Yap</DropdownMenuItem>
//           </>
//         ) : (
//           <>
//             <DropdownMenuItem asChild>
//               <Link href="/admin/login">Giriş Yap & Kayıt Ol</Link>
//             </DropdownMenuItem>
//           </>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }




'use client'

import React from 'react'
import Link from 'next/link'
import { User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserMenu() {
  const { user, logout } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {user ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/user">Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders">Siparişlerim</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Çıkış Yap</DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin/login">Giriş Yap & Kayıt Ol</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

