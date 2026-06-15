import { FormatSimple, Tolgee, DevTools } from '@tolgee/react';
import type { TolgeeStaticDataProp } from '@tolgee/react';

export const ALL_LOCALES = ['en', 'fr', 'ar', 'es', 'zh', 'ru'];
export const DEFAULT_LOCALE = 'en';

export function createTolgee(
  locale: string,
  data: TolgeeStaticDataProp
) {
  return Tolgee()
    .use(DevTools())
    .use(FormatSimple())
    .init({
      defaultLanguage: DEFAULT_LOCALE,
      language: locale,
      apiKey: process.env.NEXT_PUBLIC_TOLGEE_API_KEY,
      apiUrl: process.env.NEXT_PUBLIC_TOLGEE_API_URL,
      staticData: data,
    });
}