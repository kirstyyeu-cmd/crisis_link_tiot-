"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    type: "info",
    title: "What is This Tool?",
    desc: "An open-source, real-time platform that empowers community members to report damage, infrastructure failures, and humanitarian needs directly from the field — even in low-connectivity environments.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    type: "info",
    title: "How to Report",
    desc: "Tap 'Report a Crisis', allow location access, take or upload up to 4 photos of the damage, select the infrastructure type, and submit. Our AI will auto-classify the damage grade.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    type: "info",
    title: "Works Offline",
    desc: "No internet? No problem. Reports are saved locally on your device and automatically synced to the server once your connection is restored. Your report will never be lost.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
  },
  {
    type: "info",
    title: "Track Your Report",
    desc: "After submitting, you receive a unique reference number. Use it to track your report through four stages: Submitted, Under Review, Responded, and Resolved.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    type: "photo",
    image: "/slides/flood.jpg",
    title: "Flood Response",
    desc: "Community reports helped coordinate emergency response within hours of flooding.",
  },
  {
    type: "photo",
    image: "/slides/earthquake.jpg",
    title: "Earthquake Damage",
    desc: "Real-time reporting enabled rapid assessment of structural damage across affected zones.",
  },
  {
    type: "photo",
    image: "/slides/road.jpg",
    title: "Infrastructure Damage",
    desc: "Road and bridge damage reports allow responders to reroute aid convoys immediately.",
  },
];

export default function LandingPage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/crisis-bg.jpeg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-blue-900/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center text-center">

        {/* Logo */}
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
          Crisis Impact <br />
          <span className="text-orange-400">Reporter</span>
        </h1>
        <p className="text-slate-300 mt-3 text-base">
          Real-time reports. <br />
          <span className="text-orange-400 font-semibold">Faster humanitarian action.</span>
        </p>

        {/* CTA Buttons */}
        <div className="w-full mt-8 space-y-3">
          <Link href="/report" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 uppercase tracking-wide">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Report a Crisis
          </Link>

          <Link href="/dashboard" className="w-full bg-transparent border-2 border-white hover:bg-white/10 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wide">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            View Crisis Map
          </Link>
        </div>

        {/* Login links */}
        <div className="mt-6 flex flex-col gap-2">
          <Link href="/coc-login" className="text-blue-300 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors">
            Crisis Operations Center
          </Link>
          <Link href="/com_login" className="text-blue-300 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors">
            Community Member Login
          </Link>
        </div>

        {/* Slideshow */}
        <div className="w-full mt-8 relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl" style={{ minHeight: '200px' }}>

          {/* Photo slide */}
          {slide.type === 'photo' && (
            <div className="relative w-full h-48">
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <h3 className="text-white font-black uppercase text-base">{slide.title}</h3>
                <p className="text-slate-200 text-xs mt-1 leading-relaxed">{slide.desc}</p>
              </div>
            </div>
          )}

          {/* Info slide */}
          {slide.type === 'info' && (
            <div className="bg-blue-800 p-6 flex flex-col items-center text-center" style={{ minHeight: '192px' }}>
              <div className="mb-3">{slide.icon}</div>
              <h3 className="text-white font-black uppercase text-base mb-2">{slide.title}</h3>
              <p className="text-slate-300 text-xs leading-relaxed">{slide.desc}</p>
            </div>
          )}

          {/* Prev / Next */}
          <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
            <button onClick={() => setCurrent(p => (p === 0 ? slides.length - 1 : p - 1))} className="pointer-events-auto w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-all border border-white/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => setCurrent(p => (p + 1) % slides.length)} className="pointer-events-auto w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-all border border-white/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-orange-500' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 mb-4">
          <p className="text-slate-400 text-xs mb-2">Connecting communities to rapid response.</p>
          <div className="flex items-center justify-center gap-2">
            <div className="bg-blue-600 text-white text-[10px] px-2 py-1 font-black leading-tight">UN<br />DP</div>
          </div>
        </div>
      </div>
    </main>
  );
}
