import { AppTolgeeProvider } from '@/tolgee/provider';
import { ALL_LOCALES } from '@/tolgee/config';
import type { TolgeeStaticDataProp } from '@tolgee/react';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return ALL_LOCALES.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!ALL_LOCALES.includes(locale)) notFound();

  let staticData: TolgeeStaticDataProp = {};
  try {
    staticData = {
      [locale]: (await import(`../../messages/${locale}.json`)).default,
    };
  } catch {
    staticData = {
      en: (await import('../../messages/en.json')).default,
    };
  }

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <AppTolgeeProvider locale={locale} staticData={staticData}>
          {children}
        </AppTolgeeProvider>
      </body>
    </html>
  );
}