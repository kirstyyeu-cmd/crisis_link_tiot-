"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, MapPin, Calendar, User, Camera,
  CheckCircle, Clock, AlertTriangle, Download,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// Same mock data — replace with API call when backend ready
const MOCK_REPORTS = [
  {
    id: "CRT-2026-00142",
    reporter: "Kirsty Moyo",
    phone: "+263 77 123 4567",
    anonymous: false,
    infrastructure: "Road",
    damage_grade: "Destroyed",
    ai_classification: "Destroyed",
    ai_confidence: "87%",
    location: "Harare CBD, Zimbabwe",
    gps: "-17.82520, 31.03350",
    utm: "36K 123456 8012345",
    osm_id: "way/123456789",
    description: "Road surface completely collapsed after flooding. Approximately 50 metre stretch is impassable.",
    date: "13 Jun 2026",
    time: "09:41 AM",
    status: "Under Review",
    photos: ["/mock/photo1.jpg", "/mock/photo2.jpg"],
    timeline: [
      { label: "Submitted",    time: "13 Jun, 09:41 AM", done: true,  active: false },
      { label: "Under Review", time: "13 Jun, 10:15 AM", done: true,  active: true  },
      { label: "Responded",    time: "Pending",          done: false, active: false },
      { label: "Resolved",     time: "Pending",          done: false, active: false },
    ],
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

export default function COCReportDetail() {
  const params    = useParams();
  const reportId  = params.id as string;
  const [activePhoto, setActivePhoto] = useState(0);
  const [status, setStatus] = useState("Under Review");

  // TODO: replace with real API call
  // const report = await fetch(`/api/reports/${reportId}`)
  const report = MOCK_REPORTS.find(r => r.id === reportId) ?? MOCK_REPORTS[0];

  return (
    <main className="min-h-screen bg-slate-50 font-sans">

      {/* Header */}
      <header className="bg-blue-900 px-6 py-4 flex items-center gap-4 sticky top-0 z-40 shadow-lg">
        <Link
          href="/coc"
          className="p-2 text-white hover:bg-blue-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-grow">
          <h1 className="text-white font-black text-base uppercase tracking-tight">
            {report.id}
          </h1>
          <p className="text-blue-300 text-xs font-bold tracking-widest">
            Full Report Detail
          </p>
        </div>
        <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-full ${STATUS_STYLES[status]}`}>
          {status}
        </span>
      </header>

      <div className="max-w-3xl mx-auto p-5 space-y-5">

        {/* ── Photo gallery */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="relative h-64 bg-slate-100">
            <img
              src={report.photos[activePhoto]}
              alt="Report photo"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Fallback */}
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 -z-10">
              <Camera className="w-12 h-12 text-slate-300" />
            </div>
            {/* Arrows */}
            {report.photos.length > 1 && (
              <>
                <button
                  onClick={() => setActivePhoto(p => p === 0 ? report.photos.length - 1 : p - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActivePhoto(p => p === report.photos.length - 1 ? 0 : p + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {report.photos.length > 1 && (
            <div className="flex gap-2 p-3">
              {report.photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activePhoto === i ? "border-blue-900" : "border-slate-200"}`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Reporter details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-blue-900 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
            <User className="w-4 h-4" /> Reporter Details
          </p>
          <div className="space-y-3">
            {[
              { label: "Full Name",    value: report.reporter                          },
              { label: "Phone",        value: report.phone                             },
              { label: "Anonymous",    value: report.anonymous ? "Yes" : "No"          },
              { label: "Submitted",    value: `${report.date} at ${report.time}`       },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <span className="text-slate-500 text-sm font-semibold">{label}</span>
                <span className="text-slate-900 text-sm font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Damage details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-blue-900 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Damage Details
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 text-sm font-semibold">Infrastructure</span>
              <span className="text-slate-900 text-sm font-bold">{report.infrastructure}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 text-sm font-semibold">Damage Grade</span>
              <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${DAMAGE_STYLES[report.damage_grade]}`}>
                {report.damage_grade}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 text-sm font-semibold">AI Classification</span>
              <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${DAMAGE_STYLES[report.ai_classification]}`}>
                {report.ai_classification}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 text-sm font-semibold">AI Confidence</span>
              <span className="text-slate-900 text-sm font-bold">{report.ai_confidence}</span>
            </div>
          </div>
        </div>

        {/* ── Location details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-blue-900 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Location
          </p>
          <div className="space-y-3 mb-4">
            {[
              { label: "Address",     value: report.location  },
              { label: "GPS",         value: report.gps       },
              { label: "UTM",         value: report.utm       },
              { label: "OSM ID",      value: report.osm_id    },
              { label: "Description", value: report.description },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
                <span className="text-slate-500 text-sm font-semibold flex-shrink-0">{label}</span>
                <span className="text-slate-900 text-sm font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
          {/* Map placeholder — replace with real MapLibre map */}
          <div className="w-full h-48 bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-xs font-bold uppercase">
                Map view — {report.gps}
              </p>
            </div>
          </div>
        </div>

        {/* ── Status timeline */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-blue-900 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Report Progress
          </p>
          <div className="relative pl-6">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200" />
            {report.timeline.map((step, i) => (
              <div key={i} className="flex items-start gap-4 mb-5 relative">
                <div className={`w-4 h-4 rounded-full flex-shrink-0 -ml-6 mt-0.5 z-10 border-2 ${
                  step.done
                    ? "bg-blue-900 border-blue-900"
                    : step.active
                    ? "bg-white border-blue-900 ring-4 ring-blue-100"
                    : "bg-white border-slate-200"
                }`} />
                <div>
                  <p className={`text-sm font-black uppercase tracking-tight ${step.done || step.active ? "text-slate-900" : "text-slate-400"}`}>
                    {step.label}
                  </p>
                  <p className={`text-xs mt-0.5 font-medium ${step.done || step.active ? "text-slate-500" : "text-slate-300"}`}>
                    {step.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-blue-900 font-black uppercase text-xs tracking-widest mb-4">
            Actions
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setStatus("Responded")}
              className="w-full py-3.5 bg-sky-400 hover:bg-sky-500 text-white font-black uppercase text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Responded
            </button>
            <button
              onClick={() => setStatus("Resolved")}
              className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-black uppercase text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Resolved
            </button>
            <button
              onClick={() => setStatus("Under Review")}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Escalate Report
            </button>
            <button className="w-full py-3.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-black uppercase text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Export This Report
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}