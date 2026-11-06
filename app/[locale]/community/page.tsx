"use client";
import React, { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Home, PlusCircle, ClipboardList, Bell, RefreshCw, CheckCircle, WifiOff, LogOut,
  Route, Building2, Droplets, Zap, Landmark, MapPin, Camera, Search, Truck,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

type Report = {
  id: string;
  reference_no: string;
  infrastructure_type: string;
  damage_level: string;
  status: string;
  submitted_at: string;
};

type Notice = {
  id: string;
  title: string;
  message: string;
  status: string | null;
  is_read: boolean;
  created_at: string;
};

type Loaded = { reports: Report[] | null; notices: Notice[] | null; failed: boolean };

const tabs = [
  { id: 'home',          label: 'Home',       icon: Home },
  { id: 'my-reports',    label: 'My reports', icon: ClipboardList },
  { id: 'report',        label: 'Report',     icon: PlusCircle },
  { id: 'notifications', label: 'Alerts',     icon: Bell },
];

const typeLabels: Record<string, string> = {
  road: 'Road', building: 'Building', bridge: 'Bridge',
  water: 'Water', power: 'Power', other: 'Other',
};
const typeIcons: Record<string, React.ElementType> = {
  road: Route, building: Building2, bridge: Landmark,
  water: Droplets, power: Zap, other: MapPin,
};
const damageLabels: Record<string, string> = {
  minimal: 'Minimal', medium: 'Medium', destroyed: 'Destroyed',
};

// The reporter sees four stages, even though reports have more internal statuses
const STAGES = ['Submitted', 'Under review', 'Responded', 'Resolved'];
const stageColors = [
  'bg-slate-100 text-slate-700',
  'bg-yellow-100 text-yellow-800',
  'bg-sky-100 text-sky-800',
  'bg-green-100 text-green-800',
];
function stageOf(status: string): number {
  if (status === 'submitted') return 0;
  if (status === 'responded') return 2;
  if (status === 'resolved') return 3;
  return 1; // under_review, assigned, accepted
}

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

// Tracks whether the device is online
function subscribeOnline(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

// Security rules in the database make sure this only returns the signed-in user's own data
async function fetchAll(): Promise<Loaded> {
  const [r, n] = await Promise.all([
    supabase
      .from('reports')
      .select('id, reference_no, infrastructure_type, damage_level, status, submitted_at')
      .order('submitted_at', { ascending: false }),
    supabase
      .from('notifications')
      .select('id, title, message, status, is_read, created_at')
      .order('created_at', { ascending: false })
      .limit(30),
  ]);
  return {
    reports: r.data as Report[] | null,
    notices: n.data as Notice[] | null,
    failed: Boolean(r.error || n.error),
  };
}

function Progress({ stage }: { stage: number }) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {STAGES.map((label, i) => (
        <div key={label}>
          <div
            className={`h-1.5 rounded-full ${
              i < stage
                ? 'bg-blue-900'
                : i === stage
                ? stage === 3 ? 'bg-green-600' : 'bg-orange-500'
                : 'bg-slate-200'
            }`}
          />
          <p className={`mt-1 text-[10px] font-bold leading-tight ${i <= stage ? 'text-slate-800' : 'text-slate-400'}`}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

function ReportCard({ report }: { report: Report }) {
  const stage = stageOf(report.status);
  const Icon = typeIcons[report.infrastructure_type] ?? MapPin;
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-blue-900" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-blue-900 font-black text-sm font-mono truncate">{report.reference_no}</span>
            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full whitespace-nowrap ${stageColors[stage]}`}>
              {STAGES[stage]}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {typeLabels[report.infrastructure_type] ?? report.infrastructure_type}
            {' • '}
            {damageLabels[report.damage_level] ?? report.damage_level} damage
            {' • '}
            {timeAgo(report.submitted_at)}
          </p>
        </div>
      </div>
      <Progress stage={stage} />
    </div>
  );
}

export default function CommunityHome() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [ready, setReady] = useState(false);
  const [fullName, setFullName] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loadError, setLoadError] = useState('');
  const online = useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);

  const applyData = useCallback((res: Loaded) => {
    setLoadError(res.failed ? 'Could not load your reports. Please try again.' : '');
    if (res.reports) setReports(res.reports);
    if (res.notices) setNotices(res.notices);
  }, []);

  // Require a signed-in community member
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/com_login');
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', session.user.id)
        .single();
      if (profile?.role !== 'reporter') {
        await supabase.auth.signOut();
        router.replace('/com_login');
        return;
      }
      const res = await fetchAll();
      if (!cancelled) {
        applyData(res);
        setFullName(profile.full_name ?? '');
        setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, [router, applyData]);

  // Refresh the data whenever the user switches tab
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    fetchAll().then((res) => {
      if (!cancelled) applyData(res);
    });
    return () => { cancelled = true; };
  }, [activeTab, ready, applyData]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/com_login');
  }

  async function markAllRead() {
    await supabase.from('notifications').update({ is_read: true }).eq('is_read', false);
    applyData(await fetchAll());
  }

  if (!ready) return <main className="min-h-screen bg-blue-900" />;

  const firstName = fullName.split(' ')[0];
  const initials = fullName
    ? fullName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'CM';

  const unreadCount = notices.filter((n) => !n.is_read).length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;
  const inProgressCount = reports.length - resolvedCount;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">

      {/* Top bar */}
      <header className="bg-blue-900 sticky top-0 z-40 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-white font-black text-lg uppercase tracking-tight leading-none">
              Crisis <span className="text-orange-400">Link</span>
            </h1>
            <p className="text-blue-300 text-[10px] font-bold tracking-widest mt-1 uppercase">
              Community portal
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-orange-600 rounded-full flex items-center justify-center text-white font-black text-xs">
              {initials}
            </div>
            <button onClick={handleSignOut} aria-label="Sign out" className="p-2">
              <LogOut className="w-5 h-5 text-blue-300 hover:text-white" />
            </button>
          </div>
        </div>
        {!online && (
          <div className="bg-yellow-400 py-1.5 text-center text-slate-900 font-black text-[10px] uppercase tracking-tight">
            <span className="inline-flex items-center gap-2">
              <WifiOff className="w-3 h-3" />
              You are offline. Showing the last loaded data.
            </span>
          </div>
        )}
      </header>

      {/* Content */}
      <div className="flex-grow w-full max-w-2xl mx-auto pb-28">

        {loadError && (
          <p role="alert" className="mx-4 mt-4 text-red-600 text-xs font-bold text-center">{loadError}</p>
        )}

        {/* HOME */}
        {activeTab === 'home' && (
          <div className="p-4 space-y-6">

            {/* Welcome */}
            <section className="bg-blue-900 rounded-3xl p-5 shadow-lg">
              <h2 className="text-white text-2xl font-black">
                {firstName ? `Good day, ${firstName}` : 'Good day'}
              </h2>
              <p className="text-blue-200 text-sm mt-1">
                Report a crisis and follow it until it is resolved.
              </p>
              <Link
                href="/report"
                className="mt-5 w-full bg-orange-600 hover:bg-orange-700 text-white font-black uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
              >
                <PlusCircle className="w-5 h-5" />
                Create new report
              </Link>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-3 gap-3">
              {[
                { label: 'My reports',  value: reports.length,  color: 'text-blue-900' },
                { label: 'In progress', value: inProgressCount, color: 'text-orange-600' },
                { label: 'Resolved',    value: resolvedCount,   color: 'text-green-600' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-3 text-center border border-slate-100 shadow-sm">
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase mt-0.5">{stat.label}</p>
                </div>
              ))}
            </section>

            {/* Latest report */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-blue-900 font-black uppercase text-sm tracking-widest">Latest report</h3>
                {reports.length > 1 && (
                  <button onClick={() => setActiveTab('my-reports')} className="text-blue-700 text-xs font-black uppercase hover:underline">
                    View all
                  </button>
                )}
              </div>
              {reports[0] ? (
                <ReportCard report={reports[0]} />
              ) : (
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                  <p className="text-slate-600 text-sm font-medium">
                    You have not submitted any reports yet. When you do, you can follow its progress here.
                  </p>
                </div>
              )}
            </section>

            {/* How it works */}
            <section className="space-y-3">
              <h3 className="text-blue-900 font-black uppercase text-sm tracking-widest">How reporting works</h3>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
                {[
                  { icon: Camera, title: 'Report', text: 'Take photos, share the location and choose the damage level.' },
                  { icon: Search, title: 'Review', text: 'The Operations Center checks your report and sends it to the right responder.' },
                  { icon: Truck, title: 'Respond', text: 'The responder takes action, and you get an alert at every step.' },
                ].map((step, i) => (
                  <div key={step.title} className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-black text-sm">
                        {i + 1}. {step.title}
                      </p>
                      <p className="text-slate-500 text-xs font-medium mt-0.5 leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* MY REPORTS */}
        {activeTab === 'my-reports' && (
          <div className="p-4 space-y-4">
            <h2 className="text-blue-900 font-black uppercase text-sm tracking-widest">
              My reports ({reports.length})
            </h2>

            {reports.length === 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center space-y-3">
                <p className="text-slate-600 text-sm font-medium">You have not submitted any reports yet.</p>
                <Link href="/report" className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-xs px-5 py-3 rounded-xl">
                  Create new report
                </Link>
              </div>
            )}

            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}

        {/* ALERTS */}
        {activeTab === 'notifications' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-blue-900 font-black uppercase text-sm tracking-widest">Alerts</h2>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-blue-700 text-xs font-black uppercase hover:underline">
                  Mark all as read
                </button>
              )}
            </div>

            {notices.length === 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                <p className="text-slate-600 text-sm font-medium">
                  No alerts yet. Updates about your reports will appear here.
                </p>
              </div>
            )}

            {notices.map((n) => (
              <div key={n.id} className={`bg-white rounded-2xl p-4 border shadow-sm flex gap-3 ${n.is_read ? 'border-slate-100' : 'border-blue-200'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  n.status === 'resolved' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {n.status === 'resolved'
                    ? <CheckCircle className="w-4 h-4 text-green-600" />
                    : <RefreshCw className="w-4 h-4 text-orange-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-black tracking-tight ${n.is_read ? 'text-slate-700' : 'text-slate-900'}`}>
                      {n.title}
                    </p>
                    {!n.is_read && <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-slate-500 text-xs font-medium mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-slate-400 text-[10px] font-bold mt-1.5 uppercase">{timeAgo(n.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-2xl mx-auto grid grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isReport = tab.id === 'report';
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => (isReport ? router.push('/report') : setActiveTab(tab.id))}
                className="relative flex flex-col items-center gap-1 py-2.5 transition-colors"
              >
                {isActive && <span className="absolute top-0 h-0.5 w-8 bg-orange-500 rounded-full" />}
                {isReport ? (
                  <span className="w-9 h-9 -mt-0.5 rounded-full bg-orange-600 flex items-center justify-center shadow">
                    <Icon className="w-5 h-5 text-white" />
                  </span>
                ) : (
                  <Icon className={`w-6 h-6 ${isActive ? 'text-blue-900' : 'text-slate-400'}`} />
                )}
                <span className={`text-[10px] font-black uppercase tracking-wide ${
                  isReport ? 'text-orange-600' : isActive ? 'text-blue-900' : 'text-slate-400'
                }`}>
                  {tab.label}
                </span>
                {tab.id === 'notifications' && unreadCount > 0 && (
                  <span className="absolute top-1.5 right-6 w-4 h-4 bg-orange-500 rounded-full text-[9px] text-white font-black flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}