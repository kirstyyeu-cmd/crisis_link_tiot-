"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, Filter, LogOut,
  MapPin, Calendar, User, AlertTriangle,
  CheckCircle, Clock, Eye, ChevronDown
} from 'lucide-react';

// Mock data — replace with real API call when backend is ready
const MOCK_REPORTS = [
  {
    id: "CRT-2026-00142",
    reporter: "Delight",
    infrastructure: "Road",
    damage_grade: "Destroyed",
    location: "Harare CBD, Zimbabwe",
    date: "13 Jun 2026",
    time: "09:41 AM",
    status: "Under Review",
    photos: ["/mock/photo1.jpg", "/mock/photo2.jpg"],
    ai_classification: "Destroyed",
  },
  {
    id: "CRT-2026-00141",
    reporter: "Kuda",
    infrastructure: "Building",
    damage_grade: "Medium",
    location: "Bulawayo, Zimbabwe",
    date: "13 Jun 2026",
    time: "08:20 AM",
    status: "Submitted",
    photos: ["/mock/photo3.jpg"],
    ai_classification: "Medium",
  },
  {
    id: "CRT-2026-00140",
    reporter: "Divine",
    infrastructure: "Bridge",
    damage_grade: "Minimal",
    location: "Bulawayo, Zimbabwe",
    date: "12 Jun 2026",
    time: "04:15 PM",
    status: "Responded",
    photos: ["/mock/photo4.jpg"],
    ai_classification: "Minimal",
  },
  {
    id: "CRT-2026-00139",
    reporter: "Nigel",
    infrastructure: "Water",
    damage_grade: "Destroyed",
    location: "Gweru, Zimbabwe",
    date: "12 Jun 2026",
    time: "11:30 AM",
    status: "Resolved",
    photos: ["/mock/photo5.jpg"],
    ai_classification: "Destroyed",
  },
  {
    id: "CRT-2026-00138",
    reporter: "Anonymous",
    infrastructure: "Power",
    damage_grade: "Medium",
    location: "Masvingo, Zimbabwe",
    date: "11 Jun 2026",
    time: "02:45 PM",
    status: "Submitted",
    photos: ["/mock/photo6.jpg"],
    ai_classification: "Medium",
  },
  {
    id: "CRT-2026-00137",
    reporter: "Anesu",
    infrastructure: "Road",
    damage_grade: "Minimal",
    location: "Chiredzi, Zimbabwe",
    date: "11 Jun 2026",
    time: "10:00 AM",
    status: "Resolved",
    photos: ["/mock/photo7.jpg"],
    ai_classification: "Minimal",
  },
];

const STATUS_STYLES: Record<string, string> = {
  "Submitted":    "bg-white text-slate-900 border border-slate-300",
  "Under Review": "bg-slate-200 text-slate-700",
  "Responded":    "bg-sky-400 text-white",
  "Resolved":     "bg-blue-900 text-white",
};

const DAMAGE_STYLES: Record<string, string> = {
  "Minimal":   "bg-green-100 text-green-800",
  "Medium":    "bg-yellow-100 text-yellow-800",
  "Destroyed": "bg-red-100 text-red-800",
};

const DAMAGE_DOT: Record<string, string> = {
  "Minimal":   "bg-green-500",
  "Medium":    "bg-yellow-400",
  "Destroyed": "bg-red-600",
};

export default function COCDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen]         = useState(true);
  const [filterStatus, setFilterStatus]       = useState("All");
  const [filterDamage, setFilterDamage]       = useState("All");
  const [filterInfra, setFilterInfra]         = useState("All");
  const [searchQuery, setSearchQuery]         = useState("");

  function handleLogout() {
    localStorage.removeItem('coc_user');
    router.push('/coc-login');
  }

  // Filter logic
  const filtered = MOCK_REPORTS.filter(r => {
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    const matchDamage = filterDamage === "All" || r.damage_grade === filterDamage;
    const matchInfra  = filterInfra  === "All" || r.infrastructure === filterInfra;
    const matchSearch = searchQuery === "" ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchDamage && matchInfra && matchSearch;
  });

  // Stats
  const stats = {
    total:       MOCK_REPORTS.length,
    submitted:   MOCK_REPORTS.filter(r => r.status === "Submitted").length,
    underReview: MOCK_REPORTS.filter(r => r.status === "Under Review").length,
    responded:   MOCK_REPORTS.filter(r => r.status === "Responded").length,
    resolved:    MOCK_REPORTS.filter(r => r.status === "Resolved").length,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">

      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'} bg-blue-900 flex flex-col transition-all duration-300 flex-shrink-0 sticky top-0 h-screen`}>

        {/* Sidebar header */}
        <div className="px-6 py-5 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center font-black text-blue-900 text-[10px] leading-tight text-center flex-shrink-0">
              UN<br />DP
            </div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-tight leading-none">
                Crisis Operations
              </p>
              <p className="text-blue-300 text-[10px] font-bold tracking-widest mt-0.5">
                Centre
              </p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="px-4 py-5 space-y-1">
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest px-2 mb-3">
            Navigation
          </p>
          <button className="w-full flex items-center gap-3 px-3 py-3 bg-orange-600 text-white rounded-xl font-black uppercase text-xs tracking-wide">
            <LayoutDashboard className="w-4 h-4" />
            All Reports
          </button>
          <Link href="/coc/export" className="w-full flex items-center gap-3 px-3 py-3 text-blue-200 hover:bg-blue-800 rounded-xl font-bold uppercase text-xs tracking-wide transition-colors">
            <FileText className="w-4 h-4" />
            Export Data
          </Link>
        </nav>

        {/* Stats */}
        <div className="px-4 py-4 border-t border-blue-800 flex-grow">
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest px-2 mb-3">
            Overview
          </p>
          <div className="space-y-2">
            {[
              { label: "Total Reports",  value: stats.total,       color: "text-white"       },
              { label: "Submitted",      value: stats.submitted,   color: "text-slate-300"   },
              { label: "Under Review",   value: stats.underReview, color: "text-slate-300"   },
              { label: "Responded",      value: stats.responded,   color: "text-sky-400"     },
              { label: "Resolved",       value: stats.resolved,    color: "text-green-400"   },
            ].map(stat => (
              <div key={stat.label} className="flex items-center justify-between px-3 py-2 bg-blue-800/50 rounded-xl">
                <span className="text-blue-200 text-xs font-semibold">{stat.label}</span>
                <span className={`${stat.color} font-black text-sm`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-4 border-t border-blue-800">
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest px-2 mb-3 flex items-center gap-2">
            <Filter className="w-3 h-3" /> Filters
          </p>

          {/* Status filter */}
          <div className="mb-3">
            <p className="text-blue-300 text-[10px] font-bold uppercase tracking-wide px-1 mb-1.5">Status</p>
            <div className="space-y-1">
              {["All", "Submitted", "Under Review", "Responded", "Resolved"].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterStatus === s
                      ? "bg-orange-600 text-white"
                      : "text-blue-200 hover:bg-blue-800"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Damage filter */}
          <div className="mb-3">
            <p className="text-blue-300 text-[10px] font-bold uppercase tracking-wide px-1 mb-1.5">Damage Grade</p>
            <div className="space-y-1">
              {["All", "Minimal", "Medium", "Destroyed"].map(d => (
                <button
                  key={d}
                  onClick={() => setFilterDamage(d)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterDamage === d
                      ? "bg-orange-600 text-white"
                      : "text-blue-200 hover:bg-blue-800"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Infrastructure filter */}
          <div>
            <p className="text-blue-300 text-[10px] font-bold uppercase tracking-wide px-1 mb-1.5">Infrastructure</p>
            <div className="space-y-1">
              {["All", "Road", "Building", "Bridge", "Water", "Power", "Other"].map(i => (
                <button
                  key={i}
                  onClick={() => setFilterInfra(i)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterInfra === i
                      ? "bg-orange-600 text-white"
                      : "text-blue-200 hover:bg-blue-800"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 bg-red-900/30 border border-red-800/50 text-red-400 hover:bg-red-600 hover:text-white rounded-xl font-black uppercase text-xs tracking-wide transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="flex-grow flex flex-col min-w-0">

        {/* Top header */}
        <header className="bg-blue-900 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-white hover:bg-blue-800 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-white font-black text-lg uppercase tracking-tight">
                Crisis Operations Centre
              </h1>
              <p className="text-blue-300 text-xs font-bold tracking-widest">
                UNDP Staff Portal
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search reports, reporters, locations..."
              className="w-72 px-4 py-2.5 bg-blue-800 border border-blue-700 rounded-xl text-white placeholder:text-blue-400 text-sm outline-none focus:border-orange-500 transition-all"
            />
          </div>
        </header>

        {/* Content area */}
        <main className="flex-grow p-6">

          {/* Page title + count */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-slate-900 font-black text-xl uppercase tracking-tight">
                All Reports
              </h2>
              <p className="text-slate-500 text-sm font-medium mt-0.5">
                Showing {filtered.length} of {MOCK_REPORTS.length} reports
              </p>
            </div>
            <Link
              href="/coc/export"
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-xs rounded-xl transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Export Data
            </Link>
          </div>

          {/* Cards grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertTriangle className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-black uppercase text-sm">No reports match your filters</p>
              <button
                onClick={() => { setFilterStatus("All"); setFilterDamage("All"); setFilterInfra("All"); setSearchQuery(""); }}
                className="mt-4 text-blue-700 text-xs font-black uppercase hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(report => (
                <Link
                  key={report.id}
                  href={`/coc/${report.id}`}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all overflow-hidden group"
                >
                  {/* Photo */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={report.photos[0]}
                      alt="Report photo"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Photo count badge */}
                    {report.photos.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                        +{report.photos.length - 1} more
                      </div>
                    )}
                    {/* No photo fallback */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>

                    {/* Status badge over photo */}
                    <div className="absolute top-2 left-2">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${STATUS_STYLES[report.status]}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>

                  {/* Card details */}
                  <div className="p-4 space-y-3">

                    {/* Report ID + damage */}
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-blue-900 font-black text-sm font-mono tracking-wide">
                        {report.id}
                      </p>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex-shrink-0 flex items-center gap-1 ${DAMAGE_STYLES[report.damage_grade]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${DAMAGE_DOT[report.damage_grade]}`} />
                        {report.damage_grade}
                      </span>
                    </div>

                    {/* Infrastructure type */}
                    <p className="text-slate-700 font-black uppercase text-xs tracking-wide">
                      {report.infrastructure}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      {report.location}
                    </div>

                    {/* Date + time */}
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      {report.date} at {report.time}
                    </div>

                    {/* Reporter */}
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                      <User className="w-3.5 h-3.5 flex-shrink-0" />
                      {report.reporter}
                    </div>

                    {/* AI classification */}
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wide">AI:</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${DAMAGE_STYLES[report.ai_classification]}`}>
                        {report.ai_classification}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}