"use client";

import type { PropsWithChildren } from 'react';
import { TolgeeProvider } from '@tolgee/react';
import { TolgeeCore } from '@tolgee/core';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';
import zh from '@/locales/zh.json';
import fr from '@/locales/fr.json';
import ru from '@/locales/ru.json';
import es from '@/locales/es.json';

const availableLanguages = ['en', 'ar', 'zh', 'fr', 'ru', 'es'];

let tolgeeInstance: ReturnType<ReturnType<typeof TolgeeCore>['init']> | null = null;

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
  }

  return tolgeeInstance;
}

export default function TranslationProvider({ children }: PropsWithChildren<{}>) {
  return <TolgeeProvider tolgee={getTolgeeInstance()}>{children}</TolgeeProvider>;
}
