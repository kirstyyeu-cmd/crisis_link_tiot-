'use client';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Loader, AlertTriangle, MapPin, MessageSquare, ChevronDown, CheckCircle } from 'lucide-react';
import { fetchInfrastructure, osmToGeoJSON, InfraType } from '@/lib/overpass';
import type * as GeoJSON from 'geojson';

interface Props {
  lat: number;
  lng: number;
  selectedInfraType: InfraType;
  onFeatureSelect: (feature: {
    osm_id: string;
    infra_type: string;
    coordinates: [number, number];
    readable_name?: string;
  }) => void;
}

function TextLocationFallback({ t }: { t: ReturnType<typeof useTranslations> }) {
  const [expanded, setExpanded] = useState(false);
  const [description, setDescription] = useState('');

  return (
    <div className="border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-900" />
          <span className="text-blue-900 font-black uppercase text-xs tracking-widest">
            {t('report.describeLocation')}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 bg-white space-y-2">
          <p className="text-slate-500 text-xs font-medium leading-relaxed">
            {t('report.describeLocationHint')}
          </p>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={t('report.describeLocationPlaceholder')}
            rows={3}
            className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-900 text-slate-900 text-sm font-medium outline-none resize-none placeholder:text-slate-300 transition-all"
          />
          {description && (
            <p className="text-green-600 text-xs font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {t('report.locationDescSaved')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function InfrastructureMap({ lat, lng, selectedInfraType, onFeatureSelect }: Props) {
  const t            = useTranslations();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map          = useRef<maplibregl.Map | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [selectedName, setSelectedName] = useState<string>('');

  function filterByInfraType(infraType: InfraType) {
    if (!map.current) return;
    const filter: maplibregl.FilterSpecification = ['==', ['get', 'infra_type'], infraType];
    if (map.current.getLayer('infra-fill'))    map.current.setFilter('infra-fill',    filter);
    if (map.current.getLayer('infra-outline')) map.current.setFilter('infra-outline', filter);
    if (map.current.getLayer('infra-line'))    map.current.setFilter('infra-line',    filter);
  }

  function highlightSelected(featureId: string | number) {
    if (!map.current) return;
    if (map.current.getLayer('infra-selected')) {
      map.current.removeLayer('infra-selected');
    }
    map.current.addLayer({
      id:     'infra-selected',
      type:   'fill',
      source: 'infrastructure',
      filter: ['==', ['get', 'osm_id'], featureId],
      paint: {
        'fill-color':   '#e8620a',
        'fill-opacity': 0.8,
      },
    });
  }

  async function loadInfrastructure() {
    if (!map.current) return;
    setLoading(true);
    setError('');
    try {
      const osmData = await fetchInfrastructure(lat, lng);
      const geojson = osmToGeoJSON(osmData);

      map.current.addSource('infrastructure', {
        type: 'geojson',
        data: geojson as unknown as GeoJSON.FeatureCollection,
      });

      map.current.addLayer({
        id: 'infra-fill', type: 'fill', source: 'infrastructure',
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.4 },
      });

      map.current.addLayer({
        id: 'infra-outline', type: 'line', source: 'infrastructure',
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: { 'line-color': ['get', 'color'], 'line-width': 2 },
      });

      map.current.addLayer({
        id: 'infra-line', type: 'line', source: 'infrastructure',
        filter: ['==', ['geometry-type'], 'LineString'],
        paint: { 'line-color': ['get', 'color'], 'line-width': 3 },
      });

      const processClick = (e: maplibregl.MapLayerMouseEvent) => {
        if (!e.features?.length) return;
        const f = e.features[0];
        const props = f.properties || {};
        
        const osmId = props.osm_id ?? '';
        const infraType = props.infra_type ?? '';
        
        let readableName = '';

        if (props.name) {
          readableName = props.name;
        } else if (props.shop) {
          readableName = `${props.shop.replace('_', ' ')} shop`;
        } else if (props.amenity) {
          readableName = props.amenity.replace('_', ' ');
        } else if (props.building && props.building !== 'yes') {
          readableName = `${props.building} building`;
        } else if (props.highway) {
          readableName = `${props.highway.replace('_', ' ')} road`;
        } else if (props.waterway) {
          readableName = `${props.waterway} waterway`;
        } else {
          readableName = `${infraType} Asset`;
        }

        readableName = readableName.charAt(0).toUpperCase() + readableName.slice(1);
        setSelectedName(readableName);

        onFeatureSelect({ 
          osm_id: osmId, 
          infra_type: infraType, 
          coordinates: [e.lngLat.lng, e.lngLat.lat],
          readable_name: readableName
        });
        
        if (osmId) highlightSelected(osmId);
      };

      map.current.on('click', 'infra-fill', processClick);
      map.current.on('click', 'infra-line', processClick);

      map.current.on('mouseenter', 'infra-fill', () => { if (map.current) map.current.getCanvas().style.cursor = 'pointer'; });
      map.current.on('mouseleave', 'infra-fill', () => { if (map.current) map.current.getCanvas().style.cursor = ''; });
      map.current.on('mouseenter', 'infra-line', () => { if (map.current) map.current.getCanvas().style.cursor = 'pointer'; });
      map.current.on('mouseleave', 'infra-line', () => { if (map.current) map.current.getCanvas().style.cursor = ''; });

      filterByInfraType(selectedInfraType);

    } catch {
      setError(t('report.mapError'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors © CARTO',
          },
        },
        layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm' }],
      },
      center: [lng, lat],
      zoom: 16,
    });

    map.current.addControl(new maplibregl.NavigationControl());

    map.current.on('load', async () => {
      await loadInfrastructure();
    });

  }, []);

  useEffect(() => {
    if (!map.current) return;
    filterByInfraType(selectedInfraType);
  }, [selectedInfraType]);

  return (
    <div className="space-y-3">
      {loading && (
        <div className="flex items-center gap-2 px-1">
          <Loader className="w-3 h-3 text-blue-900 animate-spin" />
          <p className="text-slate-500 text-xs font-semibold">{t('report.loadingInfra')}</p>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 px-1">
          <AlertTriangle className="w-3 h-3 text-orange-600" />
          <p className="text-orange-600 text-xs font-semibold">{error}</p>
        </div>
      )}

      <div
        ref={mapContainer}
        className="w-full rounded-2xl border-2 border-slate-200 overflow-hidden"
        style={{ height: '350px' }}
      />

      {selectedName && (
        <div className="mx-1 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-900">
          Selected Target Place: <span className="underline">{selectedName}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 px-1">
        <MapPin className="w-3 h-3 text-slate-400" />
        <p className="text-slate-400 text-xs font-medium">{t('report.mapTip')}</p>
      </div>
      <TextLocationFallback t={t} />
    </div>
  );
}