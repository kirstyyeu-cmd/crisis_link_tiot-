"use client";
import dynamic from 'next/dynamic';
import React, { useState, useRef, useEffect } from 'react';
// ── Icons ──────────────────────────────────────
const InfrastructureMap = dynamic(
  () => import('@/components/report/infrastructureMap'),
  {
    ssr: false,
    loading: () => (
      <div className='w-full h-64 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200'>
        <p className='text-slate-400 text-sm font-bold uppercase tracking-wide'>
          Loading map.....
        </p>

      </div>
    ),
  }
)
const DropletIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C12 2 5 10 5 14a7 7 0 0014 0c0-4-7-12-7-12z" />
  </svg>
);
const CameraIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 011.664.89l.812 1.22A2 2 0 0110.07 10h3.86a2 2 0 011.664-.89l.812-1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────
const infraTypes = [
  { name: "Road",     icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21l4-18 4 18M5 15h14M3 9h18" /></svg> },
  { name: "Building", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-2M5 21H3m2 0h2m0-10h4m-4 4h4m4-4h.01M15 15h.01" /></svg> },
  { name: "Bridge",   icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 19V10m16 9V10M4 10a8 8 0 0016 0M4 10H2m20 0h-2m-7 9V10" /></svg> },
  { name: "Water",    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C12 2 5 10 5 14a7 7 0 0014 0c0-4-7-12-7-12z" /></svg> },
  { name: "Power",    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  { name: "Other",    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg> },
];

const damageOptions = [
  { level: "Minimal",   desc: "Minor damage, still functional",  dot: "bg-green-500",  border: "border-green-400",  badge: "bg-green-100 text-green-800"  },
  { level: "Medium",    desc: "Significant damage, limited use", dot: "bg-yellow-400", border: "border-yellow-400", badge: "bg-yellow-100 text-yellow-800" },
  { level: "Destroyed", desc: "Total loss, not functional",      dot: "bg-red-600",    border: "border-red-400",    badge: "bg-red-100 text-red-800"       },
];

function generateRef() {
  return "CRT-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 90000) + 10000);
}

// ── Timeline steps ─────────────────────────────────────────────────────────
const timelineSteps = [
  { label: "Submitted",    sub: "Just now — report received",      done: true,  active: false },
  { label: "Under review", sub: "A responder is being assigned",   done: false, active: true  },
  { label: "Responded",    sub: "Action taken on the ground",      done: false, active: false },
  { label: "Resolved",     sub: "Issue has been fully addressed",  done: false, active: false },
];

// ── Success Modal ──────────────────────────────────────────────────────────
function SuccessModal({ refNumber, infraType, damageGrade, photoCount, onClose }: {
  refNumber: string; infraType: string; damageGrade: string; photoCount: number; onClose: () => void;
}) {
  const grade = damageOptions.find(d => d.level === damageGrade);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70">
      <div className="w-full max-w-2xl bg-white rounded-t-3xl overflow-hidden" style={{ animation: "slideUp 0.35s cubic-bezier(0.32,0.72,0,1)" }}>

        {/* Hero */}
        <div className="bg-blue-900 px-6 pt-8 pb-7 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <CheckIcon />
          </div>
          <h2 className="text-white font-black text-2xl uppercase tracking-tight mb-2">Report Submitted!</h2>
          <p className="text-blue-200 text-sm font-medium">Your report has been received and is under review.</p>
        </div>

        <div className="px-6 pt-6 pb-2 overflow-y-auto max-h-[60vh]">

          {/* Ref card */}
          <div className="border-2 border-slate-200 rounded-2xl p-5 mb-5">
            <p className="text-blue-900 font-black text-2xl text-center tracking-widest mb-1 font-mono">{refNumber}</p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center mb-4">Save this to track your report</p>
            <hr className="border-slate-100 mb-3" />
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm font-semibold">Infrastructure</span>
                <span className="text-slate-800 text-sm font-bold">{infraType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm font-semibold">Photos attached</span>
                <span className="text-slate-800 text-sm font-bold">{photoCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm font-semibold">Damage grade</span>
                <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${grade?.badge ?? "bg-slate-100 text-slate-600"}`}>{damageGrade || "Not set"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm font-semibold">Status</span>
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-100 text-blue-800">Submitted</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">Report progress</p>
          <div className="relative pl-6 mb-5">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200" />
            {timelineSteps.map(step => (
              <div key={step.label} className="flex items-start gap-4 mb-4 relative">
                <div className={`w-4 h-4 rounded-full flex-shrink-0 -ml-6 mt-0.5 z-10 border-2 ${step.done ? "bg-blue-900 border-blue-900" : step.active ? "bg-white border-blue-900 ring-4 ring-blue-100" : "bg-white border-slate-200"}`} />
                <div>
                  <p className={`text-sm font-black uppercase tracking-tight ${step.done || step.active ? "text-slate-900" : "text-slate-400"}`}>{step.label}</p>
                  <p className={`text-xs mt-0.5 font-medium ${step.done || step.active ? "text-slate-500" : "text-slate-300"}`}>{step.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 48hr notice */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-5 flex gap-3 items-start">
            <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              If no response within <span className="text-blue-900 font-black">48 hours</span>, your report will be automatically re-escalated to a senior responder.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-10 pt-2 space-y-3 bg-white">
          <button onClick={onClose} className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-base rounded-2xl transition-all active:scale-[0.98]">
            Submit another report
          </button>
          <button onClick={onClose} className="w-full py-3.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-black uppercase text-sm rounded-2xl transition-all active:scale-[0.98]">
            Go to home
          </button>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}

// ── Main Report Page ───────────────────────────────────────────────────────
export default function ReportPage() {
  const [selectedInfra, setSelectedInfra] = useState("Road");
  const [damageGrade, setDamageGrade]     = useState("");
  const [aiLoading, setAiLoading]         = useState(false);
  const [aiDone, setAiDone]               = useState(false);
  const [photos, setPhotos]               = useState<string[]>([]);
  const [location, setLocation]           = useState("");
  const [gpsLoading, setGpsLoading]       = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [showSuccess, setShowSuccess]     = useState(false);
  const [refNumber, setRefNumber]         = useState("");
  const [offlineQueue, setOfflineQueue]   = useState(false);

  const fileRef   = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  // Auto-capture GPS on mount
  useEffect(() => {

    if (!navigator.geolocation) return;
    const timer = setTimeout(() => {
        
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(
          `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`
          );

          setGpsLoading(false);

        },

        () => {
          setGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }

        );

        }, 0);
        return () => clearTimeout(timer);
  }, []);



  function getGPS() {
    if (!navigator.geolocation) { alert("Geolocation not supported."); return; }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => { setLocation(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`); setGpsLoading(false); },
      () => { alert("Could not get location. Please type it manually."); setGpsLoading(false); }
    );
  }

  function handlePhotos(files: FileList | null) {
    if (!files) return;
    const urls = Array.from(files).slice(0, 4 - photos.length).map(f => URL.createObjectURL(f));
    const updated = [...photos, ...urls].slice(0, 4);
    setPhotos(updated);
    if (updated.length >= 1 && !aiDone) {
      setAiLoading(true);
      setDamageGrade("");
      setTimeout(() => {
        const grades = ["Minimal", "Medium", "Destroyed"];
        setDamageGrade(grades[Math.floor(Math.random() * grades.length)]);
        setAiLoading(false);
        setAiDone(true);
      }, 2000);
    }
  }

  function removePhoto(idx: number) {
    const updated = photos.filter((_, i) => i !== idx);
    setPhotos(updated);
    if (updated.length === 0) { setDamageGrade(""); setAiDone(false); }
  }

  async function handleSubmit() {
    if (!location)           { alert("Please allow location access or type a location."); return; }
    if (!selectedInfra)      { alert("Please select an infrastructure type.");            return; }
    if (photos.length === 0) { alert("Please upload at least one photo.");                return; }
    setSubmitting(true);

    if (!navigator.onLine) {
      // Save offline
      const queue = JSON.parse(localStorage.getItem("pendingReports") || "[]");
      queue.push({ location, selectedInfra, damageGrade, photoCount: photos.length, timestamp: Date.now() });
      localStorage.setItem("pendingReports", JSON.stringify(queue));
      setOfflineQueue(true);
      setSubmitting(false);
      return;
    }

    // TODO: replace with real API call
    // await fetch('/api/reports', { method: 'POST', body: formData });
    await new Promise(r => setTimeout(r, 1400));
    setRefNumber(generateRef());
    setSubmitting(false);
    setShowSuccess(true);
  }

  function resetForm() {
    setLocation(""); setSelectedInfra("Road"); setDamageGrade("");
    setPhotos([]); setAiDone(false); setAiLoading(false);
    setShowSuccess(false); setRefNumber(""); setOfflineQueue(false);
    // re-capture GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setLocation(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
      });
    }
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50 flex flex-col items-center">

        {/* Header */}
        <header className="w-full bg-blue-900 p-5 text-white flex items-center gap-4 shadow-lg sticky top-0 z-40">
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center font-black text-blue-900 text-xs leading-tight text-center shadow">
            UN<br />DP
          </div>
          <div>
            <h1 className="font-black uppercase tracking-tight text-lg">Report an Incident</h1>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Crisis Impact Reporter</p>
          </div>
        </header>

        {/* Offline banner */}
        {offlineQueue && (
          <div className="w-full bg-yellow-400 px-4 py-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-900 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-yellow-900 text-xs font-black uppercase">You are offline — report saved locally and will sync when connected</p>
          </div>
        )}

        {/* GPS capturing banner */}
        {gpsLoading && (
          <div className="w-full bg-blue-800 px-4 py-2 flex items-center justify-center gap-2">
            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <p className="text-white text-xs font-bold">Capturing your location…</p>
          </div>
        )}

        <div className="w-full max-w-2xl p-5 space-y-6 bg-white mt-2 rounded-t-3xl flex-grow shadow-inner">

          {/* ── Location */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-blue-900"><DropletIcon /></span>
              <h2 className="text-blue-900 font-black uppercase text-sm tracking-widest">Location</h2>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Searching for your location…"
                className="flex-grow p-4 pr-24 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-900 text-slate-900 font-semibold outline-none"
              />
             
              <button
                type="button"
                onClick={getGPS}
                disabled={gpsLoading}
                className="absolute right-3 px-3 py-2 bg-white border-2 border-slate-200 text-blue-900 rounded-xl font-bold text-xs uppercase flex items-center gap-1 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50"
              >
                <DropletIcon />
                {gpsLoading ? "…" : "GPS"}
              </button>
            </div>
            {location && !gpsLoading && (
              <p className="text-green-600 text-xs font-bold flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                Location captured automatically
              </p>
            )}
            {location && location.includes(',') && !gpsLoading && (
              <InfrastructureMap 
                lat={parseFloat(location.split(',')[0]) || 0 }
                lng={parseFloat(location.split(',')[1]) || 0 }
                onFeatureSelect={(feature) => {
                  console.log('Selected feature:', feature);
                }}
              />    
            )}
          </section>

          {/* ── Infrastructure type */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <h2 className="text-blue-900 font-black uppercase text-sm tracking-widest">Infrastructure Type</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {infraTypes.map(infra => (
                <button
                  key={infra.name}
                  type="button"
                  onClick={() => setSelectedInfra(infra.name)}
                  className={`flex flex-col items-center justify-center p-4 aspect-square border-2 rounded-2xl transition-all ${selectedInfra === infra.name ? "bg-blue-50 border-blue-900 shadow-lg scale-105" : "bg-slate-50 border-slate-200 hover:border-blue-300"}`}
                >
                  <span className={`mb-2 ${selectedInfra === infra.name ? "text-blue-900" : "text-slate-500"}`}>{infra.icon}</span>
                  <span className={`text-[11px] font-bold uppercase tracking-tight ${selectedInfra === infra.name ? "text-blue-900" : "text-slate-600"}`}>{infra.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ── Photo evidence */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <CameraIcon />
              <h2 className="text-blue-900 font-black uppercase text-sm tracking-widest">Photo Evidence</h2>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-slate-300 relative bg-slate-100">
                  {photos[i] ? (
                    <>
                      <img src={photos[i]} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-red-700 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <input ref={cameraRef} type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={e => handlePhotos(e.target.files)} />
            <input ref={fileRef}   type="file" accept="image/*" multiple           className="hidden" onChange={e => handlePhotos(e.target.files)} />

            {photos.length < 4 && (
              <div className="flex gap-3">
                <button type="button" onClick={() => cameraRef.current?.click()}
                  className="flex-1 py-4 bg-blue-900 hover:bg-blue-800 text-white font-bold uppercase text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                  <CameraIcon /> Take Photo
                </button>
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex-1 py-4 bg-blue-900 hover:bg-blue-800 text-white font-bold uppercase text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                  <UploadIcon /> Upload
                </button>
              </div>
            )}
            <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              {photos.length}/4 photos • JPG or PNG • max 10 MB each
            </p>
          </section>

          {/* ── Damage grade */}
          <section className="space-y-4 bg-slate-50 p-5 rounded-3xl border border-slate-100 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <h2 className="text-blue-900 font-black uppercase text-sm tracking-widest">Damage Grade</h2>
              </div>
              <span className="text-[10px] font-black uppercase bg-white border border-blue-100 text-blue-700 px-3 py-1 rounded-full tracking-widest">AI Generated</span>
            </div>
            <p className="text-slate-600 text-sm font-medium">Our AI analyses your uploaded photos and auto-suggests a grade. You can tap to override.</p>

            {aiLoading ? (
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border-2 border-slate-200">
                <div className="w-5 h-5 border-2 border-slate-200 border-t-blue-900 rounded-full animate-spin" />
                <p className="text-slate-500 text-sm font-semibold">Analysing photos…</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 pt-1">
                {damageOptions.map(option => (
                  <button
                    key={option.level}
                    type="button"
                    onClick={() => setDamageGrade(option.level)}
                    className={`p-4 bg-white border-2 rounded-2xl text-left flex items-start gap-4 transition-all ${damageGrade === option.level ? `${option.border} shadow-lg scale-[1.02]` : "border-slate-200 hover:border-slate-300"}`}
                  >
                    <span className={`w-5 h-5 ${option.dot} rounded-full mt-0.5 flex-shrink-0`} />
                    <div className="flex-1">
                      <h4 className={`font-black uppercase text-sm ${damageGrade === option.level ? "text-slate-950" : "text-slate-800"}`}>{option.level}</h4>
                      <p className={`text-xs mt-0.5 ${damageGrade === option.level ? "text-slate-700 font-medium" : "text-slate-500"}`}>{option.desc}</p>
                    </div>
                    {damageGrade === option.level && aiDone && (
                      <span className="text-blue-700 text-[9px] font-black uppercase bg-blue-50 px-3 py-1 rounded-full self-center">AI pick</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {!aiDone && !aiLoading && (
              <p className="text-slate-400 text-xs font-medium text-center pt-1">Upload a photo above to enable AI classification</p>
            )}
          </section>

          {/* ── Submit */}
          <div className="pt-2 pb-10">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-5 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-black uppercase text-xl rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {submitting ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit Official Report
                </>
              )}
            </button>
            <p className="text-center text-slate-400 text-[10px] font-bold uppercase mt-3 tracking-tighter">
              Authorized UNDP field reporter access only
            </p>
          </div>
        </div>
      </main>

      {showSuccess && (
        <SuccessModal
          refNumber={refNumber}
          infraType={selectedInfra}
          damageGrade={damageGrade}
          photoCount={photos.length}
          onClose={resetForm}
        />
      )}
    </>
  );
}
