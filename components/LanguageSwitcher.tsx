"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English',  native: 'English'  },
  { code: 'ar', label: 'Arabic',   native: 'العربية'  },
  { code: 'zh', label: 'Chinese',  native: '中文'      },
  { code: 'fr', label: 'French',   native: 'Français' },
  { code: 'ru', label: 'Russian',  native: 'Русский'  },
  { code: 'es', label: 'Spanish',  native: 'Español'  },
];

export default function LanguageSwitcher() {
  const router        = useRouter();
  const pathname      = usePathname();
  const currentLocale = useLocale();
  const [open, setOpen]       = useState(false);
  const dropdownRef           = useRef<HTMLDivElement>(null);

  const activeLanguage = languages.find(l => l.code === currentLocale) ?? languages[0];

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function switchLanguage(code: string) {
    setOpen(false);
    // Strip the current locale prefix from the pathname
    // pathname is like /en/report — we strip /en and add /fr
    const segments = pathname.split('/');
    // segments[1] is the current locale
    segments[1] = code;
    const newPath = segments.join('/');
    router.replace(newPath);
  }

  return (
    <div ref={dropdownRef} className="absolute top-4 right-4 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white text-blue-900 font-bold px-4 py-2.5 rounded-full shadow-md border border-slate-200/80 hover:bg-slate-100 transition-all text-sm active:scale-95"
      >
        <Globe className="w-4 h-4 text-blue-900" />
        <span>{activeLanguage.label}</span>
        <ChevronDown className={`w-4 h-4 text-blue-900 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl overflow-hidden py-1 border border-slate-100">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full text-left px-4 py-2.5 text-blue-900 transition-colors flex flex-col group border-b border-slate-50 last:border-none ${
                currentLocale === lang.code
                  ? 'bg-blue-50 font-black'
                  : 'hover:bg-blue-50'
              }`}
            >
              <span className="font-bold text-sm">{lang.label}</span>
              <span className="text-xs text-slate-500 font-medium group-hover:text-blue-700">
                {lang.native}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}