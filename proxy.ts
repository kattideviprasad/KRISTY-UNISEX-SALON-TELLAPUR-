import { NextResponse, type NextRequest } from 'next/server';

const COOKIE_NAME = 'kristy_admin_session';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminLogin = pathname === '/admin/login';
  const isAdminRoute = pathname.startsWith('/admin');

  // Admin Route Protection at the Edge
  if (isAdminRoute) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const hasToken = Boolean(token && token.length > 20);

    // If unauthenticated and trying to access admin pages, redirect to login immediately
    if (!hasToken && !isAdminLogin) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }

    // If token exists and trying to visit /admin/login, send to /admin dashboard
    if (hasToken && isAdminLogin) {
      const dashUrl = request.nextUrl.clone();
      dashUrl.pathname = '/admin';
      return NextResponse.redirect(dashUrl);
    }
  }

  // Create response
  const response = NextResponse.next({ request });

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset files (.png, .jpg, .svg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)).*)',
  ],
};
