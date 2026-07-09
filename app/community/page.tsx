"use client";
import React from 'react';
import Link from 'next/link';
import { useTranslate } from '@tolgee/react';

export default function CommunityHome() {
  const { t } = useTranslate();

  return (
    <main className="min-h-screen bg-slate-900 font-sans text-white">
      {/* Header with Location Pin */}
      <header className="p-6 bg-slate-900 border-b-4 border-orange-500 flex flex-col items-center">
        <div className="w-12 h-12 bg-white rounded-t-full rounded-bl-full rotate-45 flex items-center justify-center mb-2">
          <div className="w-5 h-5 bg-slate-900 rounded-full -rotate-45"></div>
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight">{t('community.portalTitle')}</h1>
        <p className="text-orange-400 font-bold text-sm">{t('community.portalTagline')}</p>
      </header>

      {/* Main Menu Grid */}
      <div className="p-6 grid grid-cols-1 gap-4 max-w-md mx-auto">
        <Link href="/community/report" className="bg-orange-600 p-6 rounded-xl flex items-center gap-4 shadow-lg active:scale-95 transition-transform">
          <span className="text-3xl">📝</span>
          <div className="text-left">
            <p className="font-black text-xl uppercase">{t('community.menu.reportIncident')}</p>
            <p className="text-orange-100 text-sm">{t('community.menu.reportIncidentSubtitle')}</p>
          </div>
        </Link>

        <Link href="/community/my-reports" className="bg-slate-800 p-6 rounded-xl border-2 border-slate-700 flex items-center gap-4">
          <span className="text-3xl">📁</span>
          <div className="text-left">
            <p className="font-black text-xl uppercase">{t('community.menu.myReports')}</p>
            <p className="text-slate-400 text-sm">{t('community.menu.myReportsSubtitle')}</p>
          </div>
        </Link>

        <Link href="/community/track" className="bg-slate-800 p-6 rounded-xl border-2 border-slate-700 flex items-center gap-4">
          <span className="text-3xl">🔍</span>
          <div className="text-left">
            <p className="font-black text-xl uppercase">{t('community.menu.trackReport')}</p>
            <p className="text-slate-400 text-sm">{t('community.menu.trackReportSubtitle')}</p>
          </div>
        </Link>
      </div>

      {/* Offline Status Banner */}
      <div className="fixed bottom-0 w-full bg-yellow-500 text-slate-900 p-3 flex justify-between items-center font-black uppercase text-xs">
        <span>{t('community.offlineBanner.message')}</span>
        <span className="bg-slate-900 text-white px-2 py-1 rounded">{t('community.offlineBanner.pendingSync')}</span>
      </div>
    </main>
  );
}