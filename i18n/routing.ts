import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr', 'ar', 'es', 'zh', 'ru'],
  defaultLocale: 'en',
  localeDetection: true,
});