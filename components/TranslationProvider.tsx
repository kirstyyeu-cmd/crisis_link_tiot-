"use client";

import type { PropsWithChildren } from 'react';
import { TolgeeProvider } from '@tolgee/react';
import { TolgeeCore } from '@tolgee/core';
import en from '@/locales/en.json';

let tolgeeInstance: ReturnType<ReturnType<typeof TolgeeCore>['init']> | null = null;

function getTolgeeInstance() {
  if (!tolgeeInstance) {
    tolgeeInstance = TolgeeCore().init({
      defaultLanguage: 'en',
      fallbackLanguage: 'en',
      language: 'en',
      availableLanguages: ['en'],
      staticData: { en },
      autoLoadRequiredData: false,
    });
  }

  return tolgeeInstance;
}

export default function TranslationProvider({ children }: PropsWithChildren<{}>) {
  return <TolgeeProvider tolgee={getTolgeeInstance()}>{children}</TolgeeProvider>;
}
