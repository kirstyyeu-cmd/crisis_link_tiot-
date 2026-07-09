"use client";

import { useEffect, useState } from 'react';
import { useTolgee, useTranslate } from '@tolgee/react';
import { ChevronDown } from 'lucide-react';

const languageOptions = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ar', label: 'العربية', short: 'AR' },
  { code: 'zh', label: '中文', short: 'ZH' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'es', label: 'Español', short: 'ES' },
];
const storageKey = 'crisis-link-language';

export default function HomePage() {
  const { t } = useTranslate();
  const tolgee = useTolgee();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage =
    languageOptions.find((option) => option.code === tolgee.getLanguage()) ?? languageOptions[0];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const current = tolgee.getLanguage();
      window.localStorage.setItem(storageKey, current);
      document.documentElement.lang = current;
      document.documentElement.dir = current === 'ar' ? 'rtl' : 'ltr';
    }
  }, [tolgee]);

  function handleLanguageChange(code: string) {
    tolgee.changeLanguage(code);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, code);
      document.documentElement.lang = code;
      document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    }
    setIsOpen(false);
  }

  return (
    <main className="relative min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6 lg:right-8 lg:top-8">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            aria-haspopup="menu"
            aria-expanded={isOpen}
          >
            <span>{`Switch language (${currentLanguage.short})`}</span>
            <ChevronDown className={`h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => handleLanguageChange(option.code)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm ${
                    currentLanguage.code === option.code
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>
                    {option.label} <span className="text-slate-400">({option.short})</span>
                  </span>
                  {currentLanguage.code === option.code && <span className="font-semibold">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl rounded-4xl bg-white p-10 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5">
        <h1 className="text-4xl font-extrabold text-slate-900">{t('home.title')}</h1>
        <p className="mt-4 text-base text-slate-600">{t('home.subtitle')}</p>
        <a
          href="/create_account"
          className="mt-8 inline-flex rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          {t('home.createAccountButton')}
        </a>
      </div>
    </main>
  );
}
