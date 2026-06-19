import { ALL_LOCALES } from '@/tolgee/config';
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

  return <>{children}</>;
}