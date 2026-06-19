"use client";
import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useTranslate } from '@tolgee/react';

export default function CommunityLoginPage() {
  const { t } = useTranslate();

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-900 p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-blue-900 p-8 flex flex-col items-center text-white text-center border-b-4 border-orange-600">
          <div className="mb-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg font-black uppercase tracking-wider">
            {t('comLogin.title')}
          </h1>
          <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mt-1">
            {t('comLogin.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form className="p-8 space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-blue-900 text-xs font-black uppercase tracking-wide">
              {t('comLogin.usernameLabel')}
            </label>
            <input
              type="text"
              placeholder={t('comLogin.usernamePlaceholder')}
              className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none text-slate-900 placeholder:text-slate-300 font-semibold focus:border-blue-900 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-blue-900 text-xs font-black uppercase tracking-wide">
              {t('comLogin.passwordLabel')}
            </label>
            <input
              type="password"
              placeholder={t('comLogin.passwordPlaceholder')}
              className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none text-slate-900 font-semibold focus:border-blue-900 transition-all"
            />
          </div>

          <Link href="/community">
            <button
              type="button"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-wide transition-all active:scale-[0.98] text-sm mt-2"
            >
              {t('comLogin.signIn')}
            </button>
          </Link>

          <div className="text-center">
            <a href="#" className="text-blue-700 hover:underline text-xs font-bold">
              {t('comLogin.forgotPassword')}
            </a>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-100" />
            <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-black tracking-widest">
              {t('comLogin.newUser')}
            </span>
            <div className="flex-grow border-t border-slate-100" />
          </div>

          <Link
            href="/create_account"
            className="block w-full py-3.5 bg-white border-2 border-blue-900 text-blue-900 font-black uppercase text-xs rounded-xl hover:bg-slate-50 transition-all text-center"
          >
            {t('comLogin.createAccount')}
          </Link>
        </form>
      </div>
    </main>
  );
}