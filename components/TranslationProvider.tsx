"use client";

import { useEffect, type PropsWithChildren } from 'react';
import { TolgeeProvider } from '@tolgee/react';
import { TolgeeCore } from '@tolgee/core';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';
import zh from '@/locales/zh.json';
import fr from '@/locales/fr.json';
import ru from '@/locales/ru.json';
import es from '@/locales/es.json';

const availableLanguages = ['en', 'ar', 'zh', 'fr', 'ru', 'es'];
const rtlLanguages = new Set(['ar']);
const storageKey = 'crisis-link-language';

let tolgeeInstance: ReturnType<ReturnType<typeof TolgeeCore>['init']> | null = null;

function syncDocumentLanguage(language: string) {
  if (typeof document === 'undefined') return;

  document.documentElement.lang = language;
  document.documentElement.dir = rtlLanguages.has(language) ? 'rtl' : 'ltr';
}

function getTolgeeInstance() {
  if (!tolgeeInstance) {
    tolgeeInstance = TolgeeCore().init({
      defaultLanguage: 'en',
      fallbackLanguage: 'en',
      language: 'en',
      availableLanguages,
      staticData: { en, ar, zh, fr, ru, es },
      autoLoadRequiredData: false,
    });

    syncDocumentLanguage('en');
  }

  return tolgeeInstance;
}

export default function TranslationProvider({ children }: PropsWithChildren<{}>) {
  useEffect(() => {
    const tolgee = getTolgeeInstance();

    if (typeof window !== 'undefined') {
      const savedLanguage = window.localStorage.getItem(storageKey);
      const preferredLanguage = availableLanguages.includes(savedLanguage || '')
        ? savedLanguage!
        : 'en';

      if (tolgee.getLanguage() !== preferredLanguage) {
        tolgee.changeLanguage(preferredLanguage);
      }

      window.localStorage.setItem(storageKey, tolgee.getLanguage());
      syncDocumentLanguage(tolgee.getLanguage());
    }
  }, []);

  return <TolgeeProvider tolgee={getTolgeeInstance()}>{children}</TolgeeProvider>;
}
