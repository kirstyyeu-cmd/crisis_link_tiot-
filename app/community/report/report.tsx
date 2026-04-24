'use client';
import { useState, useRef } from 'react';

// ── icons ────────────────────────────────────────────────────────────────────
const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
);
const IconCamera = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const IconUpload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
  </svg>
);
const IconX = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconSparkle = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconCheck = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ── damage types ──────────────────────────────────────────────────────────────
const INFRA_TYPES = [
  { id: 'road',     emoji: '🛣️', label: 'Road' },
  { id: 'building', emoji: '🏠', label: 'Building' },
  { id: 'bridge',   emoji: '🌉', label: 'Bridge' },
  { id: 'water',    emoji: '💧', label: 'Water' },
  { id: 'power',    emoji: '⚡', label: 'Power' },
  { id: 'other',    emoji: '📦', label: 'Other' },
];

const DAMAGE_GRADES = [
  { id: 'minimal',   label: 'Minimal',             color: '#16a34a', bg: '#dcfce7', desc: 'Minor damage, still functional' },
  { id: 'partial',   label: 'Partial',             color: '#d97706', bg: '#fef3c7', desc: 'Significant damage, limited use' },
  { id: 'destroyed', label: 'Completely Destroyed', color: '#dc2626', bg: '#fee2e2', desc: 'Total loss, not functional' },
];

// ── helper ────────────────────────────────────────────────────────────────────
function generateRef() {
  return 'CRT-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 90000) + 10000);
}

// ── Success overlay ───────────────────────────────────────────────────────────
function SuccessOverlay({ refNum, infraType, damageGrade, photoCount, onClose }) {
  const grade = DAMAGE_GRADES.find(g => g.id === damageGrade);
  const infra  = INFRA_TYPES.find(t => t.id === infraType);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(10,22,40,0.82)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: '0 0 0 0',
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        width: '100%', maxWidth: 480,
        background: '#fff',
        borderRadius: '24px 24px 0 0',
        overflow: 'hidden',
        animation: 'slideUp 0.35s cubic-bezier(0.32,0.72,0,1)',
      }}>
        {/* hero */}
        <div style={{ background: '#1a5276', padding: '32px 24px 28px', textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <IconCheck />
          </div>
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 600, margin: '0 0 6px', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.4 }}>
            Report Submitted!
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, margin: 0 }}>
            Your report has been received and is under review.
          </p>
        </div>

        <div style={{ padding: '20px 20px 28px' }}>
          {/* ref card */}
          <div style={{
            border: '0.5px solid #e2e8f0',
            borderRadius: 14, padding: '14px 16px', marginBottom: 16,
          }}>
            <p style={{ fontSize: 22, fontWeight: 600, color: '#1a5276', textAlign: 'center', letterSpacing: 2, margin: '0 0 2px', fontFamily: "'Barlow Condensed', sans-serif" }}>
              {refNum}
            </p>
            <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', margin: '0 0 14px' }}>
              Save this reference number to track your report
            </p>
            <hr style={{ border: 'none', borderTop: '0.5px solid #f1f5f9', margin: '0 0 10px' }} />
            {[
              { l: 'Infrastructure', v: infra?.label ?? '—' },
              { l: 'Photos attached', v: `${photoCount}` },
              { l: 'Status', v: 'Submitted', chip: true, chipColor: '#1a5276', chipBg: '#e6f1fb' },
            ].map(({ l, v, chip, chipColor, chipBg }) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '0.5px solid #f8fafc', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>{l}</span>
                {chip
                  ? <span style={{ background: chipBg, color: chipColor, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{v}</span>
                  : <span style={{ fontWeight: 500 }}>{v}</span>}
              </div>
            ))}
            {grade && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>Damage grade</span>
                <span style={{ background: grade.bg, color: grade.color, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                  {grade.label}
                </span>
              </div>
            )}
          </div>

          {/* timeline */}
          <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Report progress</p>
          <div style={{ position: 'relative', paddingLeft: 22, marginBottom: 16 }}>
            <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 1.5, background: '#e2e8f0' }} />
            {[
              { title: 'Submitted', sub: 'Just now — report received', done: true, active: false },
              { title: 'Under review', sub: 'A responder is being assigned', done: false, active: true },
              { title: 'Responded', sub: 'Action taken on the ground', done: false, active: false },
              { title: 'Resolved', sub: 'Issue fully addressed', done: false, active: false },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 15, height: 15, borderRadius: '50%', flexShrink: 0,
                  marginLeft: -22, marginTop: 1, position: 'relative', zIndex: 1,
                  background: s.done ? '#1a5276' : '#fff',
                  border: `2px solid ${s.done ? '#1a5276' : s.active ? '#1a5276' : '#e2e8f0'}`,
                  boxShadow: s.active ? '0 0 0 3px rgba(26,82,118,0.15)' : 'none',
                }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: s.done || s.active ? '#0f172a' : '#94a3b8' }}>{s.title}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* info note */}
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px', marginBottom: 18, display: 'flex', gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="#94a3b8"/>
            </svg>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              If no response is received within <strong>48 hours</strong>, your report will be automatically re-escalated.
            </p>
          </div>

          {/* actions */}
          <button onClick={onClose} style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none',
            background: '#1a5276', color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', marginBottom: 10,
          }}>
            Submit another report
          </button>
          <button onClick={onClose} style={{
            width: '100%', padding: '12px', borderRadius: 10,
            border: '0.5px solid #e2e8f0', background: '#fff',
            color: '#64748b', fontSize: 13, cursor: 'pointer',
          }}>
            Go to home
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
    </div>
  );
}

// ── Main Report Page ──────────────────────────────────────────────────────────
export default function ReportPage() {
  const [location, setLocation]       = useState('');
  const [gpsLoading, setGpsLoading]   = useState(false);
  const [infraType, setInfraType]     = useState('');
  const [damageGrade, setDamageGrade] = useState('');
  const [aiLoading, setAiLoading]     = useState(false);
  const [aiDone, setAiDone]           = useState(false);
  const [photos, setPhotos]           = useState([]);   // { url, file }
  const [submitting, setSubmitting]   = useState(false);
  const [success, setSuccess]         = useState(false);
  const [refNum, setRefNum]           = useState('');
  const fileRef  = useRef();
  const cameraRef = useRef();

  // GPS
  function getGPS() {
    if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLocation(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        setGpsLoading(false);
      },
      () => { alert('Could not get location. Please type it manually.'); setGpsLoading(false); }
    );
  }

  // Photo add
  function addPhotos(files) {
    const incoming = Array.from(files).slice(0, 4 - photos.length);
    const mapped = incoming.map(f => ({ url: URL.createObjectURL(f), file: f }));
    const updated = [...photos, ...mapped].slice(0, 4);
    setPhotos(updated);
    // Simulate AI classification when first photo added
    if (updated.length >= 1 && !aiDone) {
      setAiLoading(true);
      setDamageGrade('');
      setTimeout(() => {
        const grades = ['minimal', 'partial', 'destroyed'];
        setDamageGrade(grades[Math.floor(Math.random() * grades.length)]);
        setAiLoading(false);
        setAiDone(true);
      }, 2200);
    }
  }

  function removePhoto(idx) {
    const updated = photos.filter((_, i) => i !== idx);
    setPhotos(updated);
    if (updated.length === 0) { setDamageGrade(''); setAiDone(false); }
  }

  // Submit
  async function handleSubmit(e) {
    e.preventDefault();
    if (!location)  { alert('Please add a location.'); return; }
    if (!infraType) { alert('Please select an infrastructure type.'); return; }
    if (photos.length === 0) { alert('Please upload at least one photo.'); return; }
    setSubmitting(true);
    // TODO: replace with real API call
    // await fetch('/api/reports', { method: 'POST', body: formData });
    await new Promise(r => setTimeout(r, 1400));
    setRefNum(generateRef());
    setSubmitting(false);
    setSuccess(true);
  }

  function resetForm() {
    setLocation(''); setInfraType(''); setDamageGrade('');
    setAiDone(false); setAiLoading(false); setPhotos([]);
    setSuccess(false); setRefNum('');
  }

  const grade = DAMAGE_GRADES.find(g => g.id === damageGrade);

  return (
    <>
      <div style={{
        minHeight: '100vh',
        background: '#f0f4f8',
        fontFamily: "'Barlow', sans-serif",
      }}>
        {/* ── top bar */}
        <div style={{
          background: '#1a5276',
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: '#009edb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 9, lineHeight: 1.2, textAlign: 'center' }}>UN<br/>DP</span>
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: 15, margin: 0, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.4 }}>REPORT AN INCIDENT</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, margin: 0 }}>Crisis Impact Reporter</p>
          </div>
        </div>

        {/* ── form */}
        <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 40px' }}>

          {/* ── SECTION: Location */}
          <div style={cardStyle}>
            <SectionLabel icon={<IconPin />} text="Location" />
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Search address or landmark…"
                style={inputStyle}
              />
              {location && (
                <button type="button" onClick={() => setLocation('')}
                  style={{ position: 'absolute', right: 44, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <IconX />
                </button>
              )}
              <button type="button" onClick={getGPS} disabled={gpsLoading}
                style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  background: gpsLoading ? '#e2e8f0' : '#1a5276',
                  border: 'none', borderRadius: 8, padding: '6px 8px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                  color: '#fff', fontSize: 11, fontWeight: 600,
                  transition: 'background 0.15s',
                }}>
                {gpsLoading
                  ? <span style={{ fontSize: 11, color: '#64748b' }}>…</span>
                  : <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                      </svg>
                      GPS
                    </>
                }
              </button>
            </div>
            {location && (
              <p style={{ fontSize: 11, color: '#16a34a', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Location captured
              </p>
            )}
          </div>

          {/* ── SECTION: Infrastructure type */}
          <div style={cardStyle}>
            <SectionLabel icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            } text="Infrastructure type" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {INFRA_TYPES.map(t => (
                <button key={t.id} type="button" onClick={() => setInfraType(t.id)}
                  style={{
                    padding: '12px 6px', borderRadius: 10, cursor: 'pointer',
                    border: `1.5px solid ${infraType === t.id ? '#1a5276' : '#e2e8f0'}`,
                    background: infraType === t.id ? '#e6f1fb' : '#fff',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                    transition: 'all 0.15s',
                  }}>
                  <span style={{ fontSize: 22 }}>{t.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: infraType === t.id ? '#1a5276' : '#475569' }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── SECTION: Photos */}
          <div style={cardStyle}>
            <SectionLabel icon={<IconCamera />} text="Photo evidence" />
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px', lineHeight: 1.5 }}>
              Upload up to 4 photos. Our AI will automatically analyse them and suggest a damage grade.
            </p>

            {/* thumb grid */}
            {photos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
                {photos.map((p, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', border: '0.5px solid #e2e8f0' }}>
                    <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => removePhoto(i)}
                      style={{
                        position: 'absolute', top: 4, right: 4,
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'rgba(0,0,0,0.55)', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                      }}>
                      <IconX />
                    </button>
                  </div>
                ))}
                {Array.from({ length: 4 - photos.length }).map((_, i) => (
                  <div key={`empty-${i}`} style={{
                    aspectRatio: '1', borderRadius: 10, border: '1.5px dashed #cbd5e1',
                    background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#cbd5e1', fontSize: 20,
                  }}>+</div>
                ))}
              </div>
            )}

            {/* upload buttons */}
            {photos.length < 4 && (
              <div style={{ display: 'flex', gap: 8 }}>
                <input ref={cameraRef} type="file" accept="image/*" capture="environment" multiple style={{ display: 'none' }} onChange={e => addPhotos(e.target.files)} />
                <input ref={fileRef}   type="file" accept="image/*" multiple           style={{ display: 'none' }} onChange={e => addPhotos(e.target.files)} />
                <button type="button" onClick={() => cameraRef.current.click()}
                  style={{ ...uploadBtnStyle, background: '#1a5276', color: '#fff', border: 'none' }}>
                  <IconCamera /><span style={{ fontSize: 13 }}>Take photo</span>
                </button>
                <button type="button" onClick={() => fileRef.current.click()}
                  style={{ ...uploadBtnStyle, background: '#fff', color: '#475569', border: '0.5px solid #e2e8f0' }}>
                  <IconUpload /><span style={{ fontSize: 13 }}>Upload</span>
                </button>
              </div>
            )}

            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
              {photos.length}/4 photos • JPG or PNG • max 10 MB each
            </p>
          </div>

          {/* ── SECTION: AI Damage Grade */}
          <div style={{ ...cardStyle, border: `1.5px solid ${aiDone ? (grade?.color ?? '#e2e8f0') : '#e2e8f0'}`, transition: 'border-color 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <SectionLabel icon={<IconSparkle />} text="Damage grade" noMargin />
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
                background: '#e6f1fb', color: '#1a5276', padding: '3px 8px', borderRadius: 20,
              }}>AI Generated</span>
            </div>

            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px', lineHeight: 1.5 }}>
              Our AI analyses your uploaded photos and automatically suggests a damage grade. You can override it if needed.
            </p>

            {aiLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px', background: '#f8fafc', borderRadius: 10 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: '2px solid #e2e8f0', borderTopColor: '#1a5276',
                  animation: 'spin 0.8s linear infinite', flexShrink: 0,
                }} />
                <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>Analysing photos…</p>
              </div>
            )}

            {!aiLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DAMAGE_GRADES.map(g => (
                  <button key={g.id} type="button" onClick={() => setDamageGrade(g.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                      borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                      border: `1.5px solid ${damageGrade === g.id ? g.color : '#e2e8f0'}`,
                      background: damageGrade === g.id ? g.bg : '#fff',
                      transition: 'all 0.15s',
                    }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: g.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: '#0f172a' }}>{g.label}</p>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0' }}>{g.desc}</p>
                    </div>
                    {damageGrade === g.id && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={g.color}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                    )}
                    {damageGrade === g.id && aiDone && (
                      <span style={{ fontSize: 10, background: '#e6f1fb', color: '#1a5276', padding: '2px 7px', borderRadius: 20, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        AI pick
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {!aiDone && !aiLoading && (
              <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 10 }}>
                Upload a photo above to enable AI classification
              </p>
            )}
          </div>

          {/* ── Submit */}
          <button type="submit" disabled={submitting}
            style={{
              width: '100%', padding: '15px', borderRadius: 12, border: 'none',
              background: submitting ? '#334155' : '#1a5276',
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5,
              transition: 'background 0.2s',
              boxShadow: '0 4px 14px rgba(26,82,118,0.35)',
            }}>
            {submitting
              ? <>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                  Submitting…
                </>
              : <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  SUBMIT REPORT
                </>
            }
          </button>
        </form>
      </div>

      {/* ── Success overlay */}
      {success && (
        <SuccessOverlay
          refNum={refNum}
          infraType={infraType}
          damageGrade={damageGrade}
          photoCount={photos.length}
          onClose={resetForm}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@300;400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg) } }
        * { box-sizing: border-box; }
        input::placeholder { color: #cbd5e1; }
        input:focus { outline: none; border-color: #1a5276 !important; }
        button:active { transform: scale(0.98); }
      `}</style>
    </>
  );
}

// ── tiny helpers ──────────────────────────────────────────────────────────────
function SectionLabel({ icon, text, noMargin }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: noMargin ? 0 : 14, color: '#1a5276' }}>
      {icon}
      <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.3, textTransform: 'uppercase' }}>{text}</span>
    </div>
  );
}

const cardStyle = {
  background: '#fff',
  borderRadius: 14,
  padding: '18px 16px',
  marginBottom: 14,
  border: '0.5px solid #e2e8f0',
};

const inputStyle = {
  width: '100%', padding: '11px 80px 11px 14px',
  borderRadius: 10, border: '0.5px solid #e2e8f0',
  fontSize: 14, color: '#0f172a', background: '#fff',
  fontFamily: "'Barlow', sans-serif",
};

const uploadBtnStyle = {
  flex: 1, padding: '11px 12px', borderRadius: 10,
  cursor: 'pointer', display: 'flex', alignItems: 'center',
  justifyContent: 'center', gap: 8, fontWeight: 500,
};