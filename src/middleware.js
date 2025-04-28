 
import { NextResponse } from 'next/server';
export function middleware(request) {
  const response = NextResponse.next();
// const token =localStorage.getItem('token')
//   if (!token) {
//     return NextResponse.redirect(new URL('/auth/login', request.url));
//   }
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/'
};
export { default } from 'next-auth/middleware';