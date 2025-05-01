import { NextResponse } from 'next/server';

/** @param {import('next/server').NextRequest} request */
export function middleware(request) {
  const token = request.cookies.get('login-token')?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = [
    '/admin',
    '/dashboard',
    '/add-blogs',
    '/blogs',
    '/estimate-project'
  ];

  const isProtected = protectedPaths.some(path =>
    pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/add-blogs/:path*',
    '/blogs/:path*',
    '/estimate-project/:path*',
  ],
};
