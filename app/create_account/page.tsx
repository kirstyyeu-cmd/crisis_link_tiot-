"use client";

import { useTranslate } from '@tolgee/react';

export default function CreateAccountPage() {
  const { t } = useTranslate();

  return (
    <main className="min-h-screen bg-orange-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-4xl bg-white/95 p-8 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-700">{t('createAccount.brand')}</span>
            <h1 className="mt-4 text-4xl font-extrabold text-slate-900">{t('createAccount.title')}</h1>
            <p className="mt-3 text-base text-slate-600">{t('createAccount.subtitle')}</p>
          </div>

          <form className="mt-10 grid gap-6">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t('createAccount.fields.name')}</span>
              <input
                type="text"
                name="name"
                placeholder={t('createAccount.fields.namePlaceholder')}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t('createAccount.fields.email')}</span>
              <input
                type="email"
                name="email"
                placeholder={t('createAccount.fields.emailPlaceholder')}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </label>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">{t('createAccount.fields.password')}</span>
                <input
                  type="password"
                  name="password"
                  placeholder={t('createAccount.fields.passwordPlaceholder')}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">{t('createAccount.fields.confirmPassword')}</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder={t('createAccount.fields.confirmPasswordPlaceholder')}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t('createAccount.fields.organization')}</span>
              <input
                type="text"
                name="organization"
                placeholder={t('createAccount.fields.organizationPlaceholder')}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t('createAccount.fields.country')}</span>
              <input
                type="text"
                name="country"
                placeholder={t('createAccount.fields.countryPlaceholder')}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex w-full justify-center rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              {t('createAccount.actions.createAccount')}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            {t('createAccount.footer.haveAccount')}{' '}
            <a href="/login" className="font-semibold text-sky-700 hover:text-sky-800">
              {t('createAccount.footer.login')}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
