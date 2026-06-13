export type InfraType = 'Building' | 'Road' | 'Bridge' | 'Water' | 'Power' | 'Other';

export const infraColors: Record<InfraType, string> = {
  Building: '#1e3a5f',
  Road:     '#e67e22',
  Bridge:   '#8e44ad',
  Water:    '#2980b9',
  Power:    '#f1c40f',
  Other:    '#7f8c8d',
};

interface OverpassElement {
  type:      'node' | 'way' | 'relation';
  id:        number;
  geometry?: { lat: number; lon: number }[];
  tags?:     Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

export async function fetchInfrastructure(lat: number, lng: number): Promise<OverpassResponse> {
  const query = `
    [out:json];
    (
      way["building"](around:500, ${lat}, ${lng});
      relation["building"](around:500, ${lat}, ${lng});
      way["highway"](around:500, ${lat}, ${lng});
      way["bridge"="yes"](around:500, ${lat}, ${lng});
      way["man_made"="bridge"](around:500, ${lat}, ${lng});
      way["waterway"](around:500, ${lat}, ${lng});
      way["natural"="water"](around:500, ${lat}, ${lng});
      way["power"](around:500, ${lat}, ${lng});
      node["power"](around:500, ${lat}, ${lng});
    );
    out geom;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) throw new Error('Overpass API request failed');

  return response.json();
}

export function osmToGeoJSON(osmData: OverpassResponse) {
  const features: {
    type: string;
    id: string;
    geometry: {
      type: string;
      coordinates: number[][] | number[][][];
    };
    properties: Record<string, string>;
  }[] = [];

  osmData.elements.forEach((element: OverpassElement) => {
    if (!element.geometry) return;

    const tags      = element.tags ?? {};
    let infraType: InfraType = 'Other';

    if (tags.building)                                              infraType = 'Building';
    else if (tags.highway)                                          infraType = 'Road';
    else if (tags.bridge === 'yes' || tags.man_made === 'bridge')   infraType = 'Bridge';
    else if (tags.waterway || tags.natural === 'water')             infraType = 'Water';
    else if (tags.power)                                            infraType = 'Power';

    if (element.type === 'way' && element.geometry) {
      const coordinates = element.geometry.map(
        (point: { lat: number; lon: number }) => [point.lon, point.lat]
      );

      const first = coordinates[0];
      const last  = coordinates[coordinates.length - 1];
      const isPolygon = first[0] === last[0] && first[1] === last[1];

      features.push({
        type: 'Feature',
        id:   `${element.type}/${element.id}`,
        geometry: {
          type:        isPolygon ? 'Polygon' : 'LineString',
          coordinates: isPolygon ? [coordinates] : coordinates,
        },
        properties: {
          osm_id:     `${element.type}/${element.id}`,
          infra_type: infraType,
          color:      infraColors[infraType],
          ...tags,
        },
      });
    }
  });

  return { type: 'FeatureCollection', features };
}
