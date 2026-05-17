"use client";

import { useState } from 'react';
import Link from 'next/link';

const TRACKED_REPORT = {
  id: 'CRT-2026-12045',
  status: 'Under review',
  date: '2026-05-12',
  location: 'Victoria Falls, Zimbabwe',
  resolved: false,
  note: 'Your report is being reviewed by the response team and will be updated soon.',
  images: ['https://via.placeholder.com/240x160?text=Victoria+Falls+1', 'https://via.placeholder.com/240x160?text=Victoria+Falls+2'],
};

export default function TrackReportPage() {
  const [ref, setRef] = useState('');
  const [tracked, setTracked] = useState(false);

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setTracked(Boolean(ref.trim()));
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/20">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Track report</p>
            <h1 className="mt-2 text-3xl font-black">Where is your report?</h1>
            <p className="mt-2 text-slate-400">Enter your report reference number to see the latest status and photo evidence.</p>
          </div>

          <form onSubmit={handleTrack} className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="flex-1">
              <span className="sr-only">Report reference</span>
              <input
                value={ref}
                onChange={e => setRef(e.target.value)}
                placeholder="Enter reference number"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200/20"
              />
            </label>
            <button type="submit" className="rounded-2xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700 transition">
              Track
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
            <Link href="/community/report" className="rounded-full border border-slate-700 px-4 py-2 hover:border-orange-500 hover:text-orange-300 transition">
              Submit new report
            </Link>
            <Link href="/community/my-reports" className="rounded-full border border-slate-700 px-4 py-2 hover:border-orange-500 hover:text-orange-300 transition">
              View past reports
            </Link>
          </div>
        </div>

        {tracked && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Reference</p>
                <p className="mt-1 text-xl font-semibold text-white">{TRACKED_REPORT.id}</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-orange-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
                {TRACKED_REPORT.status}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Date</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">{TRACKED_REPORT.date}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Location</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">{TRACKED_REPORT.location}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Resolved</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">{TRACKED_REPORT.resolved ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-300">{TRACKED_REPORT.note}</p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {TRACKED_REPORT.images.map((src, idx) => (
                <img key={idx} src={src} alt={`Tracked report photo ${idx + 1}`} className="h-48 w-full rounded-3xl object-cover border border-slate-800" />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
