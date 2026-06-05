"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  { type: "info", title: "About the App", desc: "A secure, offline-ready tool for community-led crisis reporting and real-time humanitarian response coordination.", bg: "bg-blue-900", icon: <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { type: "info", title: "How to Report", desc: "Tap 'New Report', allow location access, take or upload photos, select damage type and submit. Your AI-classified report reaches responders instantly.", bg: "bg-blue-800", icon: <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
  { type: "info", title: "Works Offline", desc: "Reports are saved locally when there is no connectivity and synced automatically when your signal returns. You will never lose a report.", bg: "bg-slate-800", icon: <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg> },
  { type: "photo", image: "/slides/flood.jpg",     title: "Flood Response",        desc: "Community reports coordinated emergency response within hours." },
  { type: "photo", image: "/slides/earthquake.jpg", title: "Earthquake Damage",    desc: "Real-time reports enabled rapid structural damage assessment." },
  { type: "photo", image: "/slides/road.jpg",       title: "Road Infrastructure",  desc: "Road damage reports allow aid convoys to be rerouted immediately." },
];

const notifications = [
  { id: 1, type: "update",  title: "Report CRT-2026-00142 updated", desc: "A field responder has been assigned to your report.", time: "2 hrs ago",  read: false },
  { id: 2, type: "resolve", title: "Report CRT-2026-00098 resolved", desc: "The road damage on Samora Machel Ave has been addressed.", time: "1 day ago", read: false },
  { id: 3, type: "info",    title: "System notice",                  desc: "Offline sync is enabled. Any pending reports will submit automatically.", time: "2 days ago", read: true },
];

export default function CommunityHome() {
  const [current, setCurrent]         = useState(0);
  const [activeTab, setActiveTab]     = useState("home");
  const [isMenuOpen, setIsMenuOpen]   = useState(false);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">

      {/* ── Top bar */}
      <header className="bg-blue-900 sticky top-0 z-50 shadow-lg">
        {/* UNDP strip */}
        <div className="bg-blue-950 py-1 text-center text-[10px] text-blue-200 font-black tracking-widest uppercase">
          UNDP — Community Crisis Impact Tool
        </div>

        {/* Main header */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center font-black text-blue-900 text-[10px] leading-tight text-center shadow">
              UN<br />DP
            </div>
            <div>
              <h1 className="text-white font-black text-base uppercase tracking-tight leading-none">Crisis Impact Tool</h1>
              <p className="text-blue-300 text-[10px] font-bold tracking-wider">Community Dashboard</p>
            </div>
          </div>

          {/* Right: notification bell + avatar */}
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab("notifications")} className="relative p-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[9px] text-white font-black">{unreadCount}</span>
              )}
            </button>
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-black text-xs">CM</div>
          </div>
        </div>

        {/* ── Horizontal nav tabs */}
        <div className="flex border-t border-blue-800">
          {[
            { id: "home",          label: "Home",     icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
            { id: "report",        label: "Report",   icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
            { id: "my-reports",    label: "My Reports", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
            { id: "notifications", label: "Alerts",   icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => tab.id === "report" ? window.location.href = "/report" : setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-black uppercase tracking-wide transition-colors relative ${activeTab === tab.id ? "text-orange-400 border-b-2 border-orange-400" : "text-blue-300 hover:text-white"}`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === "notifications" && unreadCount > 0 && (
                <span className="absolute top-1.5 right-3 w-3.5 h-3.5 bg-orange-500 rounded-full text-[8px] text-white font-black flex items-center justify-center">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* ── Page content */}
      <div className="flex-grow flex flex-col max-w-2xl mx-auto w-full">

        {/* HOME TAB */}
        {activeTab === "home" && (
          <div className="p-4 space-y-4 flex flex-col flex-grow">

            {/* Welcome strip */}
            <div className="bg-blue-900 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">CM</div>
              <div>
                <p className="text-white font-black text-sm">Good day, Community Member</p>
                <p className="text-blue-300 text-xs font-medium">Your location is being monitored for crisis activity.</p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "My Reports",  value: "3",  color: "text-blue-900" },
                { label: "Under Review", value: "1", color: "text-yellow-600" },
                { label: "Resolved",    value: "2",  color: "text-green-600" },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl p-3 text-center border border-slate-100 shadow-sm">
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* New report CTA */}
            <Link href="/report" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black uppercase py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              New Incident Report
            </Link>

            {/* Slideshow */}
            <div className="flex-grow relative rounded-2xl overflow-hidden border border-slate-100 shadow-lg" style={{ minHeight: "240px" }}>
              {slide.type === "photo" ? (
                <div className="relative w-full h-full" style={{ minHeight: "240px" }}>
                  <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                    <h3 className="text-white font-black uppercase text-base">{slide.title}</h3>
                    <p className="text-slate-200 text-xs mt-1 leading-relaxed">{slide.desc}</p>
                  </div>
                </div>
              ) : (
                <div className={`${slide.bg} p-8 flex flex-col items-center justify-center text-center`} style={{ minHeight: "240px" }}>
                  <div className="mb-4">{slide.icon}</div>
                  <h3 className="text-white font-black uppercase text-lg mb-2">{slide.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-xs">{slide.desc}</p>
                </div>
              )}

              {/* Controls */}
              <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                <button onClick={() => setCurrent(p => (p === 0 ? slides.length - 1 : p - 1))} className="pointer-events-auto w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center border border-white/20 hover:bg-black/60 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={() => setCurrent(p => (p + 1) % slides.length)} className="pointer-events-auto w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center border border-white/20 hover:bg-black/60 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              {/* Dots */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-orange-500" : "w-1.5 bg-white/40"}`} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MY REPORTS TAB */}
        {activeTab === "my-reports" && (
          <div className="p-4 space-y-4">
            <h2 className="text-blue-900 font-black uppercase text-sm tracking-widest">My Reports</h2>
            {[
              { ref: "CRT-2026-00142", type: "Road",     grade: "Destroyed", status: "Under Review", statusColor: "bg-yellow-100 text-yellow-800", time: "2 hrs ago" },
              { ref: "CRT-2026-00098", type: "Building", grade: "Minimal",   status: "Resolved",     statusColor: "bg-green-100 text-green-800",   time: "3 days ago" },
              { ref: "CRT-2026-00071", type: "Water",    grade: "Medium",    status: "Responded",    statusColor: "bg-blue-100 text-blue-800",     time: "5 days ago" },
            ].map(report => (
              <div key={report.ref} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-900 font-black text-sm font-mono">{report.ref}</span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${report.statusColor}`}>{report.status}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                  <span>{report.type}</span>
                  <span>•</span>
                  <span>{report.grade}</span>
                  <span>•</span>
                  <span>{report.time}</span>
                </div>
                <button className="text-blue-700 text-xs font-black uppercase hover:underline">Track this report</button>
              </div>
            ))}
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-blue-900 font-black uppercase text-sm tracking-widest">Notifications</h2>
              <button className="text-[10px] text-slate-500 font-black uppercase border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">Clear All</button>
            </div>

            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-100 flex flex-col items-center text-center gap-3">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-slate-900 font-black uppercase text-sm">No updates yet</p>
                <p className="text-slate-500 text-xs font-medium">Notifications will appear here when your report status changes.</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`bg-white rounded-2xl p-4 border shadow-sm flex gap-3 ${n.read ? "border-slate-100" : "border-blue-200"}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === "resolve" ? "bg-green-100" : n.type === "update" ? "bg-orange-100" : "bg-blue-100"}`}>
                    {n.type === "resolve" ? (
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : n.type === "update" ? (
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    ) : (
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-black uppercase tracking-tight ${n.read ? "text-slate-700" : "text-slate-900"}`}>{n.title}</p>
                      {!n.read && <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-slate-500 text-xs font-medium mt-0.5 leading-relaxed">{n.desc}</p>
                    <p className="text-slate-400 text-[10px] font-bold mt-1.5 uppercase">{n.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* ── Footer */}
      <footer className="bg-yellow-400 py-2 text-center text-slate-900 font-black text-[10px] uppercase tracking-tighter">
        Offline-Ready — Data will sync when signal returns
      </footer>
    </main>
  );
}
