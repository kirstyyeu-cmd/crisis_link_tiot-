import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ALL_LOCALES, DEFAULT_LOCALE } from './tolgee/config';

const PROTECTED_ROUTES = ['/community', '/report', '/coc', '/my-reports'];
const COC_ROUTES = ['/coc'];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('auth_token')?.value;

  // Strip locale from pathname for route checking
  const pathWithoutLocale = pathname.replace(/^\/(en|fr|ar|es|zh|ru)/, '') || '/';

  // Check if route needs protection
  const isProtected = PROTECTED_ROUTES.some(r => pathWithoutLocale.startsWith(r));
  const isCOC = COC_ROUTES.some(r => pathWithoutLocale.startsWith(r));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/com_login', request.url));
  }

  if (isCOC && !token) {
    return NextResponse.redirect(new URL('/coc-login', request.url));
  }

  // Handle locale routing
  const hasLocale = ALL_LOCALES.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocale) {
    const acceptLanguage = request.headers.get('accept-language') ?? '';
    const browserLang = acceptLanguage.split(',')[0].split('-')[0];
    const locale = ALL_LOCALES.includes(browserLang) ? browserLang : DEFAULT_LOCALE;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};