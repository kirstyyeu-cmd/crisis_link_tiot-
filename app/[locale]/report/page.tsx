"use client";
import {supabase} from '@/lib/supabaseClient';
import { InfraType } from '@/lib/overpass';
import dynamic from 'next/dynamic';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  MapPin,
  Droplets, Camera, Upload, CheckCircle,
  AlertTriangle, Send, Star, Grid3x3,
  Loader, X, Plus, Info, WifiOff,
  Road, Building2, Waves, Zap, MoreHorizontal
} from 'lucide-react';

const InfrastructureMap = dynamic(
  () => import('@/components/report/infrastructureMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
        <div className="flex items-center gap-2">
          <Loader className="w-4 h-4 text-slate-400 animate-spin" />
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wide">Loading map...</p>
        </div>
      </div>
    ),
  }
);

// ── Data ───────────────────────────────────────────────────────────────────
const infraTypes = [
  { name: "Road",     icon: <Road          className="w-6 h-6" /> },
  { name: "Building", icon: <Building2     className="w-6 h-6" /> },
  { name: "Bridge",   icon: <Waves         className="w-6 h-6" /> },
  { name: "Water",    icon: <Droplets      className="w-6 h-6" /> },
  { name: "Power",    icon: <Zap           className="w-6 h-6" /> },
  { name: "Other",    icon: <MoreHorizontal className="w-6 h-6" /> },
]

const damageOptions = [
  { level: "Minimal",   descKey: "report.damageMinimalDesc",  dot: "bg-green-500",  border: "border-green-400",  badge: "bg-green-100 text-green-800"  },
  { level: "Medium",    descKey: "report.damageMediumDesc",   dot: "bg-yellow-400", border: "border-yellow-400", badge: "bg-yellow-100 text-yellow-800" },
  { level: "Destroyed", descKey: "report.damageDestroyedDesc",dot: "bg-red-600",    border: "border-red-400",    badge: "bg-red-100 text-red-800"       },
];

const damageGradeToDb: Record<string, string> = {
  Minimal: "minimal",
  Medium: "partial",
  Destroyed: "destroyed",
};

function generateRef() {
  return "CRT-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 90000) + 10000);
}

// ── Success Modal ──────────────────────────────────────────────────────────
function SuccessModal({ refNumber, infraType, assetName, coordinates, damageGrade, photos, onClose }: {
  refNumber: string; 
  infraType: string; 
  assetName: string;
  coordinates: string;
  damageGrade: string; 
  photos: string[];
  onClose: () => void;
}) {
  const t = useTranslations();
  const grade = damageOptions.find(d => d.level === damageGrade);

  const timelineSteps = [
    { labelKey: "success.step1", subKey: "success.step1Sub", done: true,  active: false },
    { labelKey: "success.step2", subKey: "success.step2Sub", done: false, active: true  },
    { labelKey: "success.step3", subKey: "success.step3Sub", done: false, active: false },
    { labelKey: "success.step4", subKey: "success.step4Sub", done: false, active: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70">
      <div className="w-full max-w-2xl bg-white rounded-t-3xl overflow-hidden"
        style={{ animation: "slideUp 0.35s cubic-bezier(0.32,0.72,0,1)" }}>

        {/* Hero */}
        <div className="bg-blue-900 px-6 pt-8 pb-7 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-white font-black text-2xl uppercase tracking-tight mb-2">
            {t('success.title')}
          </h2>
          <p className="text-blue-200 text-sm font-medium">{t('success.subtitle')}</p>
        </div>

        <div className="px-6 pt-6 pb-2 overflow-y-auto max-h-[60vh]">

          {/* Ref card */}
          <div className="border-2 border-slate-200 rounded-2xl p-5 mb-5">
            <p className="text-blue-900 font-black text-2xl text-center tracking-widest mb-1 font-mono">
              {refNumber}
            </p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center mb-4">
              {t('success.saveRef')}
            </p>
            <hr className="border-slate-100 mb-3" />
            
            <div className="space-y-2.5 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm font-semibold">{t('success.infrastructure')}</span>
                <span className="text-slate-800 text-sm font-bold">{infraType}</span>
              </div>
              {assetName && (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-500 text-sm font-semibold">Target Asset</span>
                  <span className="text-slate-800 text-sm font-bold text-right underline decoration-orange-500 decoration-2">{assetName}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm font-semibold">Coordinates</span>
                <span className="text-slate-800 text-sm font-mono text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{coordinates}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm font-semibold">{t('success.damageGrade')}</span>
                <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${grade?.badge ?? "bg-slate-100 text-slate-600"}`}>
                  {damageGrade || "Not set"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm font-semibold">{t('success.status')}</span>
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                  {t('success.statusSubmitted')}
                </span>
              </div>
            </div>

            {/* Photo Evidence Stamped Grid */}
            {photos.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Stamped Photo Evidence
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {photos.map((src, idx) => (
                    <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      {/* Location Overlay Stamp */}
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/60 backdrop-blur-[2px] p-1.5 rounded-lg text-white flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1 leading-none">
                          <p className="text-[9px] font-black tracking-tight truncate uppercase">
                            {assetName || `${infraType} Asset`}
                          </p>
                          <p className="text-[8px] font-mono text-slate-300 tracking-tighter truncate mt-0.5">
                            {coordinates}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">
            {t('success.progressTitle')}
          </p>
          <div className="relative pl-6 mb-5">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200" />
            {timelineSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 mb-4 relative">
                <div className={`w-4 h-4 rounded-full flex-shrink-0 -ml-6 mt-0.5 z-10 border-2 ${
                  step.done    ? "bg-blue-900 border-blue-900" :
                  step.active  ? "bg-white border-blue-900 ring-4 ring-blue-100" :
                                 "bg-white border-slate-200"
                }`} />
                <div>
                  <p className={`text-sm font-black uppercase tracking-tight ${step.done || step.active ? "text-slate-900" : "text-slate-400"}`}>
                    {t(step.labelKey)}
                  </p>
                  <p className={`text-xs mt-0.5 font-medium ${step.done || step.active ? "text-slate-500" : "text-slate-300"}`}>
                    {t(step.subKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 48hr notice */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-5 flex gap-3 items-start">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              {t('success.noticePrefix')}{' '}
              <span className="text-blue-900 font-black">{t('success.noticeHours')}</span>
              {', '}{t('success.noticeSuffix')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-10 pt-2 space-y-3 bg-white">
          <button onClick={onClose}
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-base rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            {t('success.submitAnother')}
          </button>
          <button onClick={onClose}
            className="w-full py-3.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-black uppercase text-sm rounded-2xl transition-all active:scale-[0.98]">
            {t('success.goHome')}
          </button>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}

// ── Main Report Page ───────────────────────────────────────────────────────
export default function ReportPage() {
  const t = useTranslations();
  const [selectedInfra, setSelectedInfra] = useState("Road");
  const [damageGrade, setDamageGrade]     = useState("");
  const [aiLoading, setAiLoading]         = useState(false);
  const [aiDone, setAiDone]               = useState(false);
  const [photos, setPhotos]               = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [location, setLocation]           = useState("");
  const [selectedAssetName, setSelectedAssetName] = useState("");
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
          setLocation(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
          setGpsLoading(false);
        },
        () => { setGpsLoading(false); },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  function getGPS() {
    if (!navigator.geolocation) { alert(t('report.alertLocation')); return; }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => { setLocation(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`); setGpsLoading(false); },
      () => { alert(t('report.alertLocation')); setGpsLoading(false); }
    );
  }

  function handlePhotos(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 4 - photos.length);
    const urls = newFiles.map(f => URL.createObjectURL(f));
    setPhotos([...photos, ...urls].slice(0, 4));
    setPhotoFiles([...photoFiles, ...newFiles].slice(0, 4));

    if (photos.length + newFiles.length >= 1 && !aiDone) {
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
    setPhotos(photos.filter((_, i) => i !== idx));
    setPhotoFiles(photoFiles.filter((_, i) => i !== idx));
    if (photos.length === 1) { setDamageGrade(""); setAiDone(false); }

  }

  async function handleSubmit() {
    if (!location)           { alert(t('report.alertLocation')); return; }
    if (!selectedInfra)      { alert(t('report.alertInfra'));    return; }
    if (photos.length === 0) { alert(t('report.alertPhoto'));    return; }
    setSubmitting(true);

    if (!navigator.onLine) {
      const queue = JSON.parse(localStorage.getItem("pendingReports") || "[]");
      queue.push({ location, selectedInfra, damageGrade, photoCount: photos.length, timestamp: Date.now() });
      localStorage.setItem("pendingReports", JSON.stringify(queue));
      setOfflineQueue(true);
      setSubmitting(false);
      return;
    }
    const [latStr, lngStr] = location.split(',').map(s => s.trim());
    const latitude = parseFloat(latStr);
    const longitude = parseFloat(lngStr)
    
    const photoUrls: string[] = [];
    for (const file of photoFiles) {
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('report-photos')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Photo upload failed:', uploadError);
        continue; // skip this photo, keep trying the rest
      }

      const { data: urlData } = supabase.storage
        .from('report-photos')
        .getPublicUrl(fileName);

      photoUrls.push(urlData.publicUrl);
    }

    const { data, error } = await supabase
    .from('reports')
    .insert({
      latitude,
      longitude,
      infrastructure_type: selectedInfra,
      damage_classification: damageGradeToDb[damageGrade] || null,
    })
    .select()
    .single();

    setSubmitting(false);
    if (error){
      console.error('Report submission failed:', error);
      alert(t('report.alertLocation')); // temporary — swap for a real error message string
      return;
    }
    setRefNumber(data.id);
    setShowSuccess(true);
  }

  function resetForm() {
    setLocation(""); setSelectedInfra("Road"); setDamageGrade("");
    setSelectedAssetName("");
    setPhotos([]); setAiDone(false); setAiLoading(false);
    setShowSuccess(false); setRefNumber(""); setOfflineQueue(false);
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
            <h1 className="font-black uppercase tracking-tight text-lg">{t('report.title')}</h1>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">{t('report.subtitle')}</p>
          </div>
        </header>

        {/* Offline banner */}
        {offlineQueue && (
          <div className="w-full bg-yellow-400 px-4 py-3 flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-yellow-900 flex-shrink-0" />
            <p className="text-yellow-900 text-xs font-black uppercase">{t('report.offline')}</p>
          </div>
        )}

        {/* GPS capturing banner */}
        {gpsLoading && (
          <div className="w-full bg-blue-800 px-4 py-2 flex items-center justify-center gap-2">
            <Loader className="w-3 h-3 text-white animate-spin" />
            <p className="text-white text-xs font-bold">{t('report.gpsCapturing')}</p>
          </div>
        )}

        <div className="w-full max-w-2xl p-5 space-y-6 bg-white mt-2 rounded-t-3xl flex-grow shadow-inner">

          {/* ── Location */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-900" />
              <h2 className="text-blue-900 font-black uppercase text-sm tracking-widest">
                {t('report.locationLabel')}
              </h2>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder={t('report.locationSearching')}
                className="flex-grow p-4 pr-24 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-900 text-slate-900 font-semibold outline-none"
              />
              <button
                type="button"
                onClick={getGPS}
                disabled={gpsLoading}
                className="absolute right-3 px-3 py-2 bg-white border-2 border-slate-200 text-blue-900 rounded-xl font-bold text-xs uppercase flex items-center gap-1 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50"
              >
                <MapPin className="w-3.5 h-3.5" />
                {gpsLoading ? "…" : t('report.gpsBtn')}
              </button>
            </div>
            {location && !gpsLoading && (
              <p className="text-green-600 text-xs font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {t('report.locationCaptured')}
              </p>
            )}
            {location && location.includes(',') && !gpsLoading && (
              <InfrastructureMap
                lat={parseFloat(location.split(',')[0]) || 0}
                lng={parseFloat(location.split(',')[1]) || 0}
                selectedInfraType={selectedInfra as InfraType}
                onFeatureSelect={(feature: {
                  osm_id: string;
                  infra_type: string;
                  coordinates: [number, number];
                  readable_name?: string;
                }) => {
                  if (feature.readable_name) {
                    setSelectedAssetName(feature.readable_name);
                  }
                  console.log('Selected feature:', feature);
                }}
              />
            )}
          </section>

          {/* ── Infrastructure type */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Grid3x3 className="w-4 h-4 text-blue-900" />
              <h2 className="text-blue-900 font-black uppercase text-sm tracking-widest">
                {t('report.infraTypeLabel')}
              </h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {infraTypes.map(infra => (
                <button
                  key={infra.name}
                  type="button"
                  onClick={() => setSelectedInfra(infra.name)}
                  className={`flex flex-col items-center justify-center p-4 aspect-square border-2 rounded-2xl transition-all ${
                    selectedInfra === infra.name
                      ? "bg-blue-50 border-blue-900 shadow-lg scale-105"
                      : "bg-slate-50 border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <span className={`mb-2 ${selectedInfra === infra.name ? "text-blue-900" : "text-slate-500"}`}>
                    {infra.icon}
                  </span>
                  <span className={`text-[11px] font-bold uppercase tracking-tight ${
                    selectedInfra === infra.name ? "text-blue-900" : "text-slate-600"
                  }`}>
                    {t(`report.infra${infra.name}`)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* ── Photo evidence */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-900" />
              <h2 className="text-blue-900 font-black uppercase text-sm tracking-widest">
                {t('report.photoEvidenceLabel')}
              </h2>
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
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Plus className="w-7 h-7" />
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
                  <Camera className="w-5 h-5" /> {t('report.takePhoto')}
                </button>
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex-1 py-4 bg-blue-900 hover:bg-blue-800 text-white font-bold uppercase text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                  <Upload className="w-5 h-5" /> {t('report.upload')}
                </button>
              </div>
            )}
            <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              {photos.length}/4 {t('report.photoHint')}
            </p>
          </section>

          {/* ── Damage grade */}
          <section className="space-y-4 bg-slate-50 p-5 rounded-3xl border border-slate-100 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-blue-900" />
                <h2 className="text-blue-900 font-black uppercase text-sm tracking-widest">
                  {t('report.damageGradeLabel')}
                </h2>
              </div>
              <span className="text-[10px] font-black uppercase bg-white border border-blue-100 text-blue-700 px-3 py-1 rounded-full tracking-widest">
                {t('report.aiGenerated')}
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium">{t('report.aiNote')}</p>

            {aiLoading ? (
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border-2 border-slate-200">
                <Loader className="w-5 h-5 text-blue-900 animate-spin" />
                <p className="text-slate-500 text-sm font-semibold">{t('report.analysingPhotos')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 pt-1">
                {damageOptions.map(option => (
                  <button
                    key={option.level}
                    type="button"
                    onClick={() => setDamageGrade(option.level)}
                    className={`p-4 bg-white border-2 rounded-2xl text-left flex items-start gap-4 transition-all ${
                      damageGrade === option.level
                        ? `${option.border} shadow-lg scale-[1.02]`
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className={`w-5 h-5 ${option.dot} rounded-full mt-0.5 flex-shrink-0`} />
                    <div className="flex-1">
                      <h4 className={`font-black uppercase text-sm ${damageGrade === option.level ? "text-slate-950" : "text-slate-800"}`}>
                        {t(`report.damage${option.level}`)}
                      </h4>
                      <p className={`text-xs mt-0.5 ${damageGrade === option.level ? "text-slate-700 font-medium" : "text-slate-500"}`}>
                        {t(option.descKey)}
                      </p>
                    </div>
                    {damageGrade === option.level && aiDone && (
                      <span className="text-blue-700 text-[9px] font-black uppercase bg-blue-50 px-3 py-1 rounded-full self-center">
                        {t('report.aiPick')}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {!aiDone && !aiLoading && (
              <p className="text-slate-400 text-xs font-medium text-center pt-1">
                {t('report.uploadToEnable')}
              </p>
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
                <><Loader className="w-5 h-5 animate-spin" /> {t('report.submitting')}</>
              ) : (
                <><Send className="w-5 h-5" /> {t('report.submitBtn')}</>
              )}
            </button>
            <p className="text-center text-slate-400 text-[10px] font-bold uppercase mt-3 tracking-tighter">
              {t('report.authorised')}
            </p>
          </div>
        </div>
      </main>

      {showSuccess && (
        <SuccessModal
          refNumber={refNumber}
          infraType={selectedInfra}
          assetName={selectedAssetName}
          coordinates={location}
          damageGrade={damageGrade}
          photos={photos}
          onClose={resetForm}
        />
      )}
    </>
  );
}