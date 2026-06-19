"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  ArrowLeft, Map, List, Filter, X,
  MapPin, Calendar, Building2, AlertTriangle
} from 'lucide-react';

const MOCK_REPORTS = [
  {
    id: "CRT-2026-00142",
    latitude: -17.8252, longitude: 31.0335,
    infrastructure: "Road",     damage_grade: "Destroyed",
    location: "Harare CBD, Zimbabwe",
    description: "Road surface completely collapsed after flooding.",
    date: "13 Jun 2026", time: "09:41 AM", status: "Under Review",
  },
  {
    id: "CRT-2026-00141",
    latitude: -17.8290, longitude: 31.0420,
    infrastructure: "Building", damage_grade: "Medium",
    location: "Avondale, Harare",
    description: "Structural damage to residential building.",
    date: "13 Jun 2026", time: "08:20 AM", status: "Submitted",
  },
  {
    id: "CRT-2026-00140",
    latitude: -17.8180, longitude: 31.0280,
    infrastructure: "Bridge",   damage_grade: "Minimal",
    location: "Borrowdale, Harare",
    description: "Minor cracks on bridge surface.",
    date: "12 Jun 2026", time: "04:15 PM", status: "Resolved",
  },
  {
    id: "CRT-2026-00139",
    latitude: -17.8320, longitude: 31.0190,
    infrastructure: "Water",    damage_grade: "Destroyed",
    location: "Highfield, Harare",
    description: "Water main pipe burst, area without water.",
    date: "12 Jun 2026", time: "11:30 AM", status: "Responded",
  },
  {
    id: "CRT-2026-00138",
    latitude: -17.8150, longitude: 31.0450,
    infrastructure: "Power",    damage_grade: "Medium",
    location: "Eastlea, Harare",
    description: "Power lines down after storm.",
    date: "11 Jun 2026", time: "02:45 PM", status: "Under Review",
  },
];

const DAMAGE_COLORS: Record<string, string> = {
  Minimal:   '#16a34a',
  Medium:    '#d97706',
  Destroyed: '#dc2626',
};

const DAMAGE_BG: Record<string, string> = {
  Minimal:   'bg-green-100 text-green-800',
  Medium:    'bg-yellow-100 text-yellow-800',
  Destroyed: 'bg-red-100 text-red-800',
};

const STATUS_STYLES: Record<string, string> = {
  Submitted:      'bg-white text-slate-900 border border-slate-300',
  'Under Review': 'bg-slate-200 text-slate-700',
  Responded:      'bg-sky-400 text-white',
  Resolved:       'bg-blue-900 text-white',
};

const INFRA_TYPES  = ['All', 'Road', 'Building', 'Bridge', 'Water', 'Power', 'Other'];
const DAMAGE_GRADES = ['All', 'Minimal', 'Medium', 'Destroyed'];

export default function CrisisMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map          = useRef<maplibregl.Map | null>(null);
  const markers      = useRef<maplibregl.Marker[]>([]);

  const [activeTab, setActiveTab]       = useState<'map' | 'reports'>('map');
  const [showFilters, setShowFilters]   = useState(false);
  const [filterDamage, setFilterDamage] = useState('All');
  const [filterInfra, setFilterInfra]   = useState('All');

  const filtered = MOCK_REPORTS.filter(r => {
    const matchDamage = filterDamage === 'All' || r.damage_grade === filterDamage;
    const matchInfra  = filterInfra  === 'All' || r.infrastructure === filterInfra;
    return matchDamage && matchInfra;
  });

  // Init map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors | © Stadia Maps',
          },
        },
        layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm' }],
      },
      center: [31.0335, -17.8252],
      zoom: 12,
    });
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
  }, []);

  // Add markers
  useEffect(() => {
    if (!map.current) return;
    markers.current.forEach(m => m.remove());
    markers.current = [];

    filtered.forEach(report => {
      const color = DAMAGE_COLORS[report.damage_grade] ?? '#94a3b8';
      const el = document.createElement('div');
      el.style.cssText = `
        width: 28px; height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        background: ${color};
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.15s;
      `;
      el.addEventListener('mouseenter', () => { el.style.transform = 'rotate(-45deg) scale(1.2)'; });
      el.addEventListener('mouseleave', () => { el.style.transform = 'rotate(-45deg) scale(1)'; });

      const popup = new maplibregl.Popup({ offset: 25, closeButton: true, maxWidth: '280px' })
        .setHTML(`
          <div style="font-family:sans-serif;padding:4px;">
            <p style="font-weight:800;font-size:13px;color:#1e3a5f;margin:0 0 6px;">${report.id}</p>
            <div style="display:flex;gap:6px;margin-bottom:6px;flex-wrap:wrap;">
              <span style="background:${color}22;color:${color};font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;text-transform:uppercase;">${report.damage_grade}</span>
              <span style="background:#f1f5f9;color:#475569;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;text-transform:uppercase;">${report.infrastructure}</span>
            </div>
            <p style="font-size:11px;color:#64748b;margin:0 0 4px;">📍 ${report.location}</p>
            <p style="font-size:11px;color:#64748b;margin:0 0 8px;">🕐 ${report.date} at ${report.time}</p>
            <p style="font-size:11px;color:#475569;margin:0 0 10px;line-height:1.4;">${report.description}</p>
            <a href="/coc/${report.id}" style="display:block;text-align:center;padding:6px 12px;background:#1e3a5f;color:white;border-radius:8px;font-size:11px;font-weight:700;text-decoration:none;text-transform:uppercase;">
              View Full Report
            </a>
          </div>
        `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([report.longitude, report.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [filtered]);

  function flyToReport(report: typeof MOCK_REPORTS[0]) {
    if (!map.current) return;
    setActiveTab('map');
    setTimeout(() => {
      map.current?.flyTo({ center: [report.longitude, report.latitude], zoom: 15, duration: 1000 });
      const idx = filtered.findIndex(r => r.id === report.id);
      if (idx !== -1) markers.current[idx]?.togglePopup();
    }, 300);
  }

  const activeFilters = [filterDamage !== 'All', filterInfra !== 'All'].filter(Boolean).length;

  return (
    <div className="h-screen flex flex-col bg-slate-900 font-sans overflow-hidden">

      {/* Header */}
      <header className="bg-blue-900 px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-lg z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 text-white hover:bg-blue-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-white font-black text-base uppercase tracking-tight leading-none">Crisis Map</h1>
            <p className="text-blue-300 text-[10px] font-bold tracking-widest">{filtered.length} reports showing</p>
          </div>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black uppercase transition-all ${
            showFilters || activeFilters > 0
              ? 'bg-orange-600 text-white'
              : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Filters
          {activeFilters > 0 && (
            <span className="w-4 h-4 bg-white text-orange-600 rounded-full text-[9px] font-black flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>
      </header>

      {/* Filter dropdown */}
      {showFilters && (
        <div className="bg-blue-950 px-4 py-4 flex-shrink-0 z-10 border-b border-blue-800">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-40">
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">Damage Grade</p>
              <div className="flex gap-1.5 flex-wrap">
                {DAMAGE_GRADES.map(grade => (
                  <button key={grade} onClick={() => setFilterDamage(grade)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filterDamage === grade ? 'bg-orange-600 text-white' : 'bg-blue-900 text-blue-200 hover:bg-blue-800'
                    }`}>
                    {grade}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-40">
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">Infrastructure</p>
              <div className="flex gap-1.5 flex-wrap">
                {INFRA_TYPES.map(type => (
                  <button key={type} onClick={() => setFilterInfra(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filterInfra === type ? 'bg-orange-600 text-white' : 'bg-blue-900 text-blue-200 hover:bg-blue-800'
                    }`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {activeFilters > 0 && (
            <button onClick={() => { setFilterDamage('All'); setFilterInfra('All'); }}
              className="mt-3 text-orange-400 text-xs font-black uppercase hover:text-orange-300 flex items-center gap-1">
              <X className="w-3 h-3" /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Main content */}
      <div className="flex-grow relative overflow-hidden">

        {/* Map view */}
        <div ref={mapContainer} className="absolute inset-0"
          style={{ display: activeTab === 'map' ? 'block' : 'none' }}
        />

        {/* Reports list view */}
        {activeTab === 'reports' && (
          <div className="absolute inset-0 overflow-y-auto bg-slate-50">
            <div className="p-4 space-y-3 max-w-2xl mx-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <AlertTriangle className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-slate-500 font-black uppercase text-sm">No reports match your filters</p>
                  <button onClick={() => { setFilterDamage('All'); setFilterInfra('All'); }}
                    className="mt-4 text-blue-700 text-xs font-black uppercase hover:underline">
                    Clear filters
                  </button>
                </div>
              ) : (
                filtered.map(report => (
                  <div key={report.id} onClick={() => flyToReport(report)}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <p className="text-blue-900 font-black text-sm font-mono tracking-wide">{report.id}</p>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex-shrink-0 ${DAMAGE_BG[report.damage_grade]}`}>
                        {report.damage_grade}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                        <Building2 className="w-3.5 h-3.5 flex-shrink-0" />{report.infrastructure}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />{report.location}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />{report.date} at {report.time}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${STATUS_STYLES[report.status]}`}>
                        {report.status}
                      </span>
                      <p className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
                        <Map className="w-3 h-3" /> Tap to show on map
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom tab bar */}
      <div className="bg-blue-900 flex-shrink-0 z-20 border-t border-blue-800">
        <div className="flex">
          <button onClick={() => setActiveTab('map')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all ${
              activeTab === 'map' ? 'text-orange-400 border-t-2 border-orange-400' : 'text-blue-300 hover:text-white'
            }`}>
            <Map className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-wide">Map</span>
          </button>

          {/* Legend */}
          <div className="flex-1 flex items-center justify-center gap-3 py-3">
            {[
              { color: 'bg-green-500',  label: 'Minimal'   },
              { color: 'bg-yellow-400', label: 'Medium'    },
              { color: 'bg-red-600',    label: 'Destroyed' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-[9px] text-blue-300 font-bold uppercase">{item.label}</span>
              </div>
            ))}
          </div>

          <button onClick={() => setActiveTab('reports')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all relative ${
              activeTab === 'reports' ? 'text-orange-400 border-t-2 border-orange-400' : 'text-blue-300 hover:text-white'
            }`}>
            <List className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-wide">Reports</span>
            {filtered.length > 0 && (
              <span className="absolute top-2 right-6 w-4 h-4 bg-orange-600 rounded-full text-[9px] text-white font-black flex items-center justify-center">
                {filtered.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}