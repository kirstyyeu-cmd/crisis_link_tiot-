"use client";

import Link from 'next/link';

const REPORTS = [
  {
    id: 'CRT-2026-12045',
    status: 'Resolved',
    resolved: true,
    date: '2026-05-12',
    location: 'Harare, Zimbabwe',
    summary: 'Bridge collapse near Harare after heavy rains',
    images: ['https://via.placeholder.com/240x160?text=Harare+Bridge', 'https://via.placeholder.com/240x160?text=Harare+Road'],
  },
  {
    id: 'CRT-2026-10978',
    status: 'In progress',
    resolved: false,
    date: '2026-05-14',
    location: 'Bulawayo, Zimbabwe',
    summary: 'Flooded road and damaged drainage in Bulawayo',
    images: ['https://via.placeholder.com/240x160?text=Bulawayo+Road+1', 'https://via.placeholder.com/240x160?text=Bulawayo+Road+2'],
  },
  {
    id: 'CRT-2026-10321',
    status: 'Cleared',
    resolved: true,
    date: '2026-05-09',
    location: 'Mutare, Zimbabwe',
    summary: 'Power line failure repaired in Mutare',
    images: ['https://via.placeholder.com/240x160?text=Mutare+Power', 'https://via.placeholder.com/240x160?text=Mutare+Repair'],
  },
];

export default function MyReportsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Community reports</p>
            <h1 className="text-3xl font-black">My Reports</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">Review past submissions, resolve status, and inspect photo evidence for each report.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/community/report" className="rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700 transition">
              New report
            </Link>
            <Link href="/community/track" className="rounded-2xl border border-slate-700 px-5 py-3 text-sm text-slate-100 hover:bg-slate-800 transition">
              Track report
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          {REPORTS.map(report => (
            <article key={report.id} className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 shadow-xl shadow-slate-950/30">
              <div className="border-b border-slate-800 bg-slate-950/90 px-6 py-5 sm:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Reference</p>
                    <p className="mt-1 text-lg font-semibold text-white">{report.id}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${report.resolved ? 'bg-emerald-500/15 text-emerald-300' : report.status === 'Cleared' ? 'bg-sky-500/15 text-sky-300' : 'bg-orange-500/15 text-orange-300'}`}>
                      {report.status}
                    </span>
                    <button className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 hover:border-orange-500 hover:text-orange-300 transition">
                      Clear
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Date</p>
                    <p className="mt-1 font-medium text-slate-100">{report.date}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Location</p>
                    <p className="mt-1 font-medium text-slate-100">{report.location}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Status</p>
                    <p className="mt-1 font-medium text-slate-100">{report.resolved ? 'Resolved' : 'Ongoing'}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 sm:px-8">
                <p className="text-sm text-slate-300">{report.summary}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {report.images.map((src, index) => (
                    <img key={index} src={src} alt={`${report.summary} photo ${index + 1}`} className="h-44 w-full rounded-3xl object-cover border border-slate-800 bg-slate-800" />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
