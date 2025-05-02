import { NextResponse } from 'next/server';

/** @param {import('next/server').NextRequest} request */
export function middleware(request) {
  console.log('Middleware triggered for path:', request.nextUrl.pathname);
  const token = request.cookies.get('login-token')?.value;
  const { pathname } = request.nextUrl;


  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

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
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|auth/login).*)',
  ],
};


