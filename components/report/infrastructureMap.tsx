'use client';
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

interface Props {
  lat: number;
  lng: number;
  onFeatureSelect: (feature: {
    id: string;
    type: string;
    coordinates: [number, number];
  }) => void;
}

export default function InfrastructureMap({ lat, lng, onFeatureSelect }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Initialise the map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
          },
        ],
      },
      center: [lng, lat],
      zoom: 16,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl());

  }, [lat, lng]);

  return (
    <div
      ref={mapContainer}
      className="w-full rounded-2xl border-2 border-slate-200 overflow-hidden"
      style={{ height: '350px' }}
    />
  );
}