import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequestWithAuth } from 'next-auth/middleware';

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const token = await getToken({ req: request });
    const isAuth = !!token;
    const isAuthPage = request.nextUrl.pathname.startsWith('/login');
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
    const isAdminLoginPage = request.nextUrl.pathname === '/admin/login';

    // Если это страница админ-панели
    if (isAdminPage) {
      // Если пользователь не авторизован
      if (!isAuth) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // Если пользователь не админ и пытается зайти на админ-страницы (кроме логина)
      if (!token?.isAdmin && !isAdminLoginPage) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Если админ уже прошел верификацию и пытается зайти на страницу логина
      if (token?.isAdmin && token?.adminVerified && isAdminLoginPage) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }

      // Если админ не прошел верификацию и пытается зайти на админ-страницы (кроме логина)
      if (token?.isAdmin && !token?.adminVerified && !isAdminLoginPage) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }

    // Если авторизованный пользователь пытается зайти на страницу логина
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ['/login', '/admin/:path*'],
};
