'use client';
import { TolgeeProvider, useTolgeeSSR } from '@tolgee/react';
import type { TolgeeStaticDataProp } from '@tolgee/react';
import { createTolgee } from './config';
import { useState } from 'react';

type Props = {
  locale: string;
  staticData: TolgeeStaticDataProp;
  children: React.ReactNode;
};

export function AppTolgeeProvider({ locale, staticData, children }: Props) {
  const [tolgee] = useState(() => createTolgee(locale, staticData));
  const ssrTolgee = useTolgeeSSR(tolgee, locale);

  return (
    <TolgeeProvider tolgee={ssrTolgee} fallback="Loading...">
      {children}
    </TolgeeProvider>
  );
}