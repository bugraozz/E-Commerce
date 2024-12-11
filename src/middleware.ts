import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')?.value;
  console.log('User cookie:', user)

  if (['/login', '/admin/login'].includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      console.log('No user cookie found, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const parsedUser = JSON.parse(user);
      console.log('Parsed user:', parsedUser)
      if (parsedUser.role !== 'admin') {
        console.log('User is not admin, redirecting to home')
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.log('Error parsing user cookie, redirecting to login', error)
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/admin/login'],
};
