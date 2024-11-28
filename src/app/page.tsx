

import Link from 'next/link';
import Image from 'next/image';
import { ModeToggle } from '@/components/ModeToggle';

export default function Home() {
  return (
    <div className="flex min-h-screen relative">
      <div className="absolute top-4 right-4 z-50">
        <Link href="/admin/login" className="text-black underline text-lg">
          Admin Girişi
        </Link>
        <div className=" top-4 right-18 z-50">
        <ModeToggle />
        </div>
      </div>
      <div className="flex w-full">
        <Link href="/women" className="w-1/2 h-screen relative cursor-pointer">
          <Image
            src="/image3.jpg" 
            alt="Kadın Bölümü"
            fill
            className="object-cover"
          />
        </Link>
        <Link href="/men" className="w-1/2 h-screen relative cursor-pointer">
          <Image
            src="/image4.jpg" 
            alt="Erkek Bölümü"
            fill
            className="object-cover"
          />
        </Link>
      </div>
    </div>
  );
}
