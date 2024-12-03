// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const isLoggedIn = request.cookies.get('auth')?.value

//   if (request.nextUrl.pathname.startsWith('/admin') && 
//       !request.nextUrl.pathname.startsWith('/admin/login') && 
//       !isLoggedIn) {
//     return NextResponse.redirect(new URL('/admin/login', request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: '/admin/:path*',
// }



import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')?.value;

  
  if (['/login', '/admin/login'].includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/admin/login'],
};
