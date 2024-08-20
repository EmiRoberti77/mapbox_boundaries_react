import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface BoundaryProps {
  id: string;
  name: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN!;

const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [boundaries, setBoundaries] = useState<BoundaryProps[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initializeMap = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-123.0, 49.25], // Adjusted to better center the polygons
      zoom: 10, // Increased zoom level to ensure the polygons are visible
    });

    initializeMap.on('load', () => {
      setMap(initializeMap);
      fetchBoundaries(initializeMap);
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const fetchBoundaries = (map: mapboxgl.Map) => {
    // Mock data with correct coordinates format
    const mockBoundaries: BoundaryProps[] = [
      {
        id: 'b1',
        name: 'Boundary 1',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-123.0, 49.2],
              [-123.0, 49.3],
              [-122.9, 49.3],
              [-122.9, 49.2],
              [-123.0, 49.2], // Closing the polygon by repeating the first coordinate
            ],
          ],
        },
      },
      {
        id: 'b2',
        name: 'Boundary 2',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-123.05, 49.25],
              [-123.05, 49.35],
              [-122.95, 49.35],
              [-122.95, 49.25],
              [-123.05, 49.25], // Closing the polygon
            ],
          ],
        },
      },
      {
        id: 'b3',
        name: 'Boundary 3',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-123.1, 49.3],
              [-123.1, 49.4],
              [-122.98, 49.4],
              [-122.98, 49.3],
              [-123.1, 49.3], // Closing the polygon
            ],
          ],
        },
      },
      {
        id: 'b4',
        name: 'Boundary 4',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-123.1, 49.2],
              [-123.1, 49.25],
              [-122.95, 49.25],
              [-122.95, 49.2],
              [-123.1, 49.2], // Closing the polygon
            ],
          ],
        },
      },
      {
        id: 'b5',
        name: 'Boundary 5',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-122.95, 49.15],
              [-123.05, 49.15],
              [-123.05, 49.2],
              [-122.95, 49.2],
              [-122.95, 49.15], // Closing the polygon
            ],
          ],
        },
      },
      {
        id: 'b6',
        name: 'Boundary 6',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-123.08, 49.22],
              [-123.08, 49.3],
              [-122.98, 49.3],
              [-122.98, 49.22],
              [-123.08, 49.22], // Closing the polygon
            ],
          ],
        },
      },
    ];

    setBoundaries(mockBoundaries);

    const geojsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
      type: 'FeatureCollection',
      features: mockBoundaries.map((boundary) => ({
        type: 'Feature',
        properties: {
          id: boundary.id,
          name: boundary.name,
        },
        geometry: {
          type: boundary.geometry.type,
          coordinates: boundary.geometry.coordinates,
        },
      })),
    };

    const sourceSpec: mapboxgl.GeoJSONSourceSpecification = {
      type: 'geojson',
      data: geojsonData,
    };

    console.log('Adding source and layers');

    map.addSource('boundaries', sourceSpec);

    map.addLayer({
      id: 'boundaries-layer',
      type: 'fill',
      source: 'boundaries',
      layout: {},
      paint: {
        'fill-color': '#888888',
        'fill-opacity': 0.4,
      },
    });

    map.addLayer({
      id: 'boundaries-outline',
      type: 'line',
      source: 'boundaries',
      layout: {},
      paint: {
        'line-color': '#000000',
        'line-width': 2,
      },
    });

    map.on('click', 'boundaries-layer', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['boundaries-layer'],
      });

      if (features.length > 0) {
        const clickedFeature = features[0];
        const boundaryId = clickedFeature.properties?.id;

        if (boundaryId) {
          console.log(`Boundary clicked: ${boundaryId}`);
          fetchBoundaryInfo(boundaryId);
        }
      }
    });

    map.on('mouseenter', 'boundaries-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'boundaries-layer', () => {
      map.getCanvas().style.cursor = '';
    });
  };

  const fetchBoundaryInfo = async (boundaryId: string) => {
    try {
      console.log(`Fetching info for boundary ID: ${boundaryId}`);
      const response = await fetch(
        `https://api.example.com/boundaries/${boundaryId}`
      );
      const data = await response.json();
      console.log('Boundary Info:', data);
    } catch (error) {
      console.error('Error fetching boundary info:', error);
    }
  };

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }} />
  );
};

export default Map;
