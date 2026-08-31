import { NextResponse, type NextRequest } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from '@/lib/admin-session';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminLogin = pathname === '/admin/login';
  const isAdminRoute = pathname.startsWith('/admin');

  if (!isAdminRoute) return NextResponse.next({ request });

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isAuthenticated = verifySessionToken(token);

  // Not authenticated → redirect to login
  if (!isAuthenticated && !isAdminLogin) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  // Already authenticated → redirect away from login
  if (isAuthenticated && isAdminLogin) {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = '/admin';
    return NextResponse.redirect(dashUrl);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ['/admin/:path*'],
};
