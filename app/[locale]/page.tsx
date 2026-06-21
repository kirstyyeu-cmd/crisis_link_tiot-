"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Info, ClipboardList, WifiOff, Map,
  ChevronLeft, ChevronRight, PlusCircle
} from 'lucide-react';

export default function LandingPage() {
  const t = useTranslations();
  const [current, setCurrent] = useState(0);

  const slides = [
    { type: "info", titleKey: "landing.slide1Title", descKey: "landing.slide1Desc", icon: <Info className="w-12 h-12 text-white" /> },
    { type: "info", titleKey: "landing.slide2Title", descKey: "landing.slide2Desc", icon: <ClipboardList className="w-12 h-12 text-white" /> },
    { type: "info", titleKey: "landing.slide3Title", descKey: "landing.slide3Desc", icon: <WifiOff className="w-12 h-12 text-white" /> },
    { type: "info", titleKey: "landing.slide4Title", descKey: "landing.slide4Desc", icon: <Map className="w-12 h-12 text-white" /> },
    { type: "photo", image: "/images/flooding.jpg",  titleKey: "landing.slide5Title", descKey: "landing.slide5Desc" },
    { type: "photo", image: "/images/fire.jpg",      titleKey: "landing.slide2Title", descKey: "landing.slide2Desc" },
    { type: "photo", image: "/images/road.jpg",      titleKey: "landing.slide4Title", descKey: "landing.slide4Desc" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/crisis-bg.jpeg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-blue-900/90" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center text-center">

        {/* Logo - Restored original SVG icon */}
        <div className="mb-6">
          <div className="w-20 h-20 border-4 border-white rounded-full flex items-center justify-center bg-blue-800">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-white text-3xl font-black tracking-tight uppercase">
          {t('landing.title').split(' ').slice(0, -1).join(' ')} <br />
          <span className="text-orange-400">{t('landing.title').split(' ').slice(-1)}</span>
        </h1>
        <p className="text-slate-300 mt-3 text-base">
          {t('landing.subtitle')} <br />
          <span className="text-orange-400 font-semibold">{t('landing.tagline')}</span>
        </p>

        {/* CTA Buttons */}
        <div className="w-full mt-8 space-y-3">
          <Link href="/report" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 uppercase tracking-wide">
            <PlusCircle className="w-5 h-5" />
            {t('landing.reportBtn')}
          </Link>
          <Link href="/crisis-map" className="w-full bg-transparent border-2 border-white hover:bg-white/10 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wide">
            <Map className="w-5 h-5" />
            {t('landing.mapBtn')}
          </Link>
        </div>

        {/* Login links */}
        <div className="mt-6 flex flex-col gap-2">
          <Link href="/coc-login" className="text-blue-300 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors">
            {t('landing.staffLogin')}
          </Link>
          <Link href="/com_login" className="text-blue-300 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors">
            {t('landing.communityLogin')}
          </Link>
        </div>

        {/* Slideshow */}
        <div className="w-full mt-8 relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl" style={{ minHeight: '200px' }}>
          {slide.type === 'photo' && (
            <div className="relative w-full h-48">
              <img src={slide.image} alt={t(slide.titleKey)} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <h3 className="text-white font-black uppercase text-base">{t(slide.titleKey)}</h3>
                <p className="text-slate-200 text-xs mt-1 leading-relaxed">{t(slide.descKey)}</p>
              </div>
            </div>
          )}
          {slide.type === 'info' && (
            <div className="bg-blue-800 p-6 flex flex-col items-center text-center" style={{ minHeight: '192px' }}>
              <div className="mb-3">{slide.icon}</div>
              <h3 className="text-white font-black uppercase text-base mb-2">{t(slide.titleKey)}</h3>
              <p className="text-slate-300 text-xs leading-relaxed">{t(slide.descKey)}</p>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
            <button onClick={() => setCurrent(p => (p === 0 ? slides.length - 1 : p - 1))} className="pointer-events-auto w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-all border border-white/20">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setCurrent(p => (p + 1) % slides.length)} className="pointer-events-auto w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-all border border-white/20">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-orange-500' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
        </div>

        {/* Footer - Replaced text box with official badge image */}
        <div className="mt-8 mb-4">
          <p className="text-slate-400 text-xs mb-2">{t('landing.connecting')}</p>
          <div className="flex items-center justify-center">
            <img src="/UNDP.png" alt="UNDP Logo" className="h-8 w-auto object-contain" />
          </div>
        </div>
      </div>
    </main>
  );
}