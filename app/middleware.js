// app/middleware.js
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Add profile to protected routes
    const protectedPaths = ['/profile', '/checkout', '/orders'];
    const isProtectedPath = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));

    // Check if token exists and is not expired
    if (isProtectedPath && !token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Check token expiration
    if (token && token.exp) {
      const tokenExpiration = token.exp * 1000; // Convert to milliseconds
      if (Date.now() >= tokenExpiration) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/profile/:path*', '/checkout/:path*', '/orders/:path*'],
};
