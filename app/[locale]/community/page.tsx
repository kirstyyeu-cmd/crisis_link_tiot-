"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Home, PlusCircle, ClipboardList, Bell,
  RefreshCw, CheckCircle, WifiOff,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// Exact keys verified against your en.json community block
const slides = [
  { type: "info", titleKey: "community.title",       descKey: "community.welcomeSub",   bgClass: "bg-blue-900" },
  { type: "photo", image: "/images/power.jpg",       titleKey: "community.slide2Title", descKey: "community.slide2Desc" },
  { type: "photo", image: "/images/com-road.jpg",    titleKey: "community.slide3Title", descKey: "community.slide3Desc" },
  { type: "photo", image: "/images/water.jpg",       titleKey: "community.slide4Title", descKey: "community.slide4Desc" },
  { type: "photo", image: "/images/flooding.jpg",    titleKey: "community.slide5Title", descKey: "community.slide5Desc" },
];

// Realigned to use slide texts as a fallback since notif keys are missing in en.json
const notifications = [
  { id: 1, type: "update",  titleKey: "community.slide2Title", descKey: "community.slide2Desc", time: "2 hrs ago",  read: false },
  { id: 2, type: "resolve", titleKey: "community.slide4Title", descKey: "community.slide4Desc", time: "1 day ago",  read: false },
  { id: 3, type: "info",    titleKey: "community.slide5Title", descKey: "community.slide5Desc", time: "2 days ago", read: true  },
];

export default function CommunityHome() {
  const t = useTranslations();
  const [current, setCurrent] = useState(0);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Top Bar */}
      <header className="bg-blue-900 sticky top-0 z-50 shadow-lg">
        <div className="bg-blue-950 py-1 text-center text-[10px] text-blue-200 font-black tracking-widest uppercase">
          {t('community.strip')}
        </div>

        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-lg flex items-center justify-center shadow">
              <img src="/UNDP.png" alt="UNDP Logo" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <h1 className="text-white font-black text-base uppercase tracking-tight leading-none">
                {t('community.title')}
              </h1>
              <p className="text-blue-300 text-[10px] font-bold tracking-wider">
                {t('community.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab("notifications")} className="relative p-2">
              <Bell className="w-6 h-6 text-white" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[9px] text-white font-black">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-black text-xs">
              CM
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-t border-blue-800">
          {[
            { id: "home",          labelKey: "community.tabHome",      icon: <Home className="w-4 h-4" /> },
            { id: "report",        labelKey: "community.tabReport",    icon: <PlusCircle className="w-4 h-4" /> },
            { id: "my-reports",    labelKey: "community.tabMyReports", icon: <ClipboardList className="w-4 h-4" /> },
            { id: "notifications", labelKey: "community.tabAlerts",    icon: <Bell className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => tab.id === "report" ? window.location.href = "/report" : setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-black uppercase tracking-wide transition-colors relative ${
                activeTab === tab.id
                  ? "text-orange-400 border-b-2 border-orange-400"
                  : "text-blue-300 hover:text-white"
              }`}
            >
              {tab.icon}
              {t(tab.labelKey)}
              {tab.id === "notifications" && unreadCount > 0 && (
                <span className="absolute top-1.5 right-3 w-3.5 h-3.5 bg-orange-500 rounded-full text-[8px] text-white font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Body */}
      <div className="flex-grow flex flex-col max-w-2xl mx-auto w-full">

        {/* HOME TAB */}
        {activeTab === "home" && (
          <div className="p-4 space-y-4 flex flex-col flex-grow">
            
            {/* Welcome message */}
            <div className="bg-blue-900 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                CM
              </div>
              <div>
                <p className="text-white font-black text-sm">{t('community.welcome')}</p>
                <p className="text-blue-300 text-xs font-medium">{t('community.welcomeSub')}</p>
              </div>
            </div>

            {/* Stats matrix */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { labelKey: "community.statMyReports",   value: "3", color: "text-blue-900" },
                { labelKey: "community.statUnderReview", value: "1", color: "text-yellow-600" },
                { labelKey: "community.statResolved",    value: "2", color: "text-green-600" },
              ].map((stat) => (
                <div key={stat.labelKey} className="bg-white rounded-2xl p-3 text-center border border-slate-100 shadow-sm">
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase mt-0.5">{t(stat.labelKey)}</p>
                </div>
              ))}
            </div>

            {/* Actions button */}
            <Link href="/report" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black uppercase py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]">
              <PlusCircle className="w-5 h-5" />
              {t('community.newReport')}
            </Link>

            {/* Slideshow Display Container */}
            <div className="grow relative rounded-2xl overflow-hidden border border-slate-100 shadow-lg" style={{ minHeight: "240px" }}>
              {slide.type === "photo" ? (
                <div className="relative w-full h-full min-h-[240px]">
                  <img 
                    src={slide.image} 
                    alt={t(slide.titleKey)} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-left z-10">
                    <h3 className="text-white font-black uppercase text-base tracking-tight">{t(slide.titleKey)}</h3>
                    <p className="text-slate-200 text-xs mt-1 leading-relaxed">{t(slide.descKey)}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-900 p-8 flex flex-col items-center justify-center text-center h-full min-h-[240px]">
                  <WifiOff className="w-10 h-10 text-white mb-4 animate-pulse" />
                  <h3 className="text-white font-black uppercase text-lg mb-2">{t(slide.titleKey)}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-xs">{t(slide.descKey)}</p>
                </div>
              )}

              {/* Slider Directional Controls */}
              <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none z-20">
                <button 
                  onClick={() => setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1))}
                  className="pointer-events-auto w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center border border-white/20 hover:bg-black/60 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setCurrent((p) => (p + 1) % slides.length)}
                  className="pointer-events-auto w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center border border-white/20 hover:bg-black/60 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Slider Navigation Indicators */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
                {slides.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-orange-500" : "w-1.5 bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MY REPORTS TAB */}
        {activeTab === "my-reports" && (
          <div className="p-4 space-y-4">
            <h2 className="text-blue-900 font-black uppercase text-sm tracking-widest">
              {t('community.myReportsTitle')}
            </h2>
            {[
              { ref: "CRT-2026-00142", type: "Road",     grade: "Destroyed", status: "Under Review", statusColor: "bg-yellow-100 text-yellow-800", time: "2 hrs ago"  },
              { ref: "CRT-2026-00098", type: "Building", grade: "Minimal",   status: "Resolved",     statusColor: "bg-green-100 text-green-800",   time: "3 days ago" },
              { ref: "CRT-2026-00071", type: "Water",    grade: "Medium",    status: "Responded",    statusColor: "bg-sky-100 text-sky-800",        time: "5 days ago" },
            ].map((report) => (
              <div key={report.ref} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-900 font-black text-sm font-mono">{report.ref}</span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${report.statusColor}`}>
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                  <span>{report.type}</span>
                  <span>•</span>
                  <span>{report.grade}</span>
                  <span>•</span>
                  <span>{report.time}</span>
                </div>
                <button className="text-blue-700 text-xs font-black uppercase hover:underline">
                  {t('community.trackReport')}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-blue-900 font-black uppercase text-sm tracking-widest">
                {t('community.tabAlerts')}
              </h2>
            </div>

            {notifications.map((n) => (
              <div key={n.id} className={`bg-white rounded-2xl p-4 border shadow-sm flex gap-3 ${n.read ? "border-slate-100" : "border-blue-200"}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  n.type === "resolve" ? "bg-green-100" : "bg-orange-100"
                }`}>
                  {n.type === "resolve" ? <CheckCircle className="w-4 h-4 text-green-600" /> : <RefreshCw className="w-4 h-4 text-orange-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-black uppercase tracking-tight ${n.read ? "text-slate-700" : "text-slate-900"}`}>
                      {t(n.titleKey)}
                    </p>
                    {!n.read && <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-slate-500 text-xs font-medium mt-0.5 leading-relaxed">{t(n.descKey)}</p>
                  <p className="text-slate-400 text-[10px] font-bold mt-1.5 uppercase">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Persistent Offline Status Footer */}
      <footer className="bg-yellow-400 py-2 text-center text-slate-900 font-black text-[10px] uppercase tracking-tighter">
        <div className="flex items-center justify-center gap-2">
          <WifiOff className="w-3 h-3" />
          {t('community.offline')}
        </div>
      </footer>
    </main>
  );
}