import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ALL_LOCALES, DEFAULT_LOCALE } from './tolgee/config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

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