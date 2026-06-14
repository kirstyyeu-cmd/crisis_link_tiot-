'use client';
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
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
  }) => void;
}

export default function InfrastructureMap({ lat, lng, selectedInfraType, onFeatureSelect }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map          = useRef<maplibregl.Map | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // ── Define functions first ──────────────────────────────────────────

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
      filter: ['==', ['id'], featureId],
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

      // Add source
      map.current.addSource('infrastructure', {
        type: 'geojson',
        data: geojson as GeoJSON.FeatureCollection<GeoJSON.Geometry>,
      });
      // Filled polygons — buildings
      map.current.addLayer({
        id:     'infra-fill',
        type:   'fill',
        source: 'infrastructure',
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: {
          'fill-color':   ['get', 'color'],
          'fill-opacity': 0.4,
        },
      });

      // Polygon outlines
      map.current.addLayer({
        id:     'infra-outline',
        type:   'line',
        source: 'infrastructure',
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
        },
      });

      // Lines — roads, bridges, waterways, power
      map.current.addLayer({
        id:     'infra-line',
        type:   'line',
        source: 'infrastructure',
        filter: ['==', ['geometry-type'], 'LineString'],
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 3,
        },
      });

      // Click — polygons
      map.current.on('click', 'infra-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        onFeatureSelect({
          osm_id:      feature.properties?.osm_id ?? '',
          infra_type:  feature.properties?.infra_type ?? '',
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
        if (feature.id !== undefined) highlightSelected(feature.id);
      });

      // Click — lines
      map.current.on('click', 'infra-line', (e) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        onFeatureSelect({
          osm_id:      feature.properties?.osm_id ?? '',
          infra_type:  feature.properties?.infra_type ?? '',
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
        if (feature.id !== undefined) highlightSelected(feature.id);
      });

      // Pointer cursor on hover
      map.current.on('mouseenter', 'infra-fill', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'infra-fill', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
      map.current.on('mouseenter', 'infra-line', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'infra-line', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });

      // Apply initial filter
      filterByInfraType(selectedInfraType);

    } catch (err) {
      setError('Could not load map features. You can still pin your location manually.');
    } finally {
      setLoading(false);
    }
  }

  // ── useEffects after functions ──────────────────────────────────────

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

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div className="space-y-2">
      {loading && (
        <div className="flex items-center gap-2 px-1">
          <div className="w-3 h-3 border-2 border-slate-300 border-t-blue-900 rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-semibold">Loading infrastructure data...</p>
        </div>
      )}
      {error && (
        <p className="text-orange-600 text-xs font-semibold px-1">{error}</p>
      )}
      <div
        ref={mapContainer}
        className="w-full rounded-2xl border-2 border-slate-200 overflow-hidden"
        style={{ height: '350px' }}
      />
      <p className="text-slate-400 text-xs font-medium px-1">
        Tap a highlighted feature on the map to select it
      </p>
    </div>
  );
}