"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import type { MapMarker, MapViewConfig } from "@/lib/maps/types";
import { MAP_MARKER_COLORS } from "@/lib/maps/marker-colors";
import "leaflet/dist/leaflet.css";

type Props = {
  markers: MapMarker[];
  config: MapViewConfig;
};

function createDotIcon(category: MapMarker["category"]) {
  const color = MAP_MARKER_COLORS[category];
  return L.divIcon({
    className: "nemi-leaflet-marker",
    html: `<svg width="22" height="28" viewBox="0 0 28 36" aria-hidden="true">
      <path d="M14 1.5C7.1 1.5 1.5 7.1 1.5 14c0 9.2 12.5 20 12.5 20S26.5 23.2 26.5 14C26.5 7.1 20.9 1.5 14 1.5Z"
        fill="${color}" stroke="#0f0e0c" stroke-width="1.5"/>
      <circle cx="14" cy="14" r="3.8" fill="#0f0e0c"/>
    </svg>`,
    iconSize: [22, 28],
    iconAnchor: [11, 28],
  });
}

function FitPreview({
  markers,
  fallback,
}: {
  markers: MapMarker[];
  fallback: MapViewConfig;
}) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();

    if (markers.length === 0) {
      map.setView(
        [fallback.center.latitude, fallback.center.longitude],
        Math.max(fallback.zoom - 1, 12),
      );
      return;
    }

    if (markers.length === 1) {
      map.setView([markers[0].latitude, markers[0].longitude], 14);
      return;
    }

    const bounds = L.latLngBounds(
      markers.map((m) => [m.latitude, m.longitude] as [number, number]),
    );
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 14 });
  }, [map, markers, fallback]);

  return null;
}

/**
 * Mini mapa oscuro de SLRC para el overview (solo vista previa).
 */
export function DestinationMapPreviewCanvas({ markers, config }: Props) {
  const icons = useMemo(() => {
    const cache = new Map<MapMarker["category"], L.DivIcon>();
    for (const marker of markers) {
      if (!cache.has(marker.category)) {
        cache.set(marker.category, createDotIcon(marker.category));
      }
    }
    return cache;
  }, [markers]);

  return (
    <MapContainer
      center={[config.center.latitude, config.center.longitude]}
      zoom={config.zoom}
      className="nemi-map-preview-canvas h-full w-full"
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      doubleClickZoom={false}
      scrollWheelZoom={false}
      boxZoom={false}
      keyboard={false}
      touchZoom={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OSM &copy; CARTO'
      />
      <FitPreview markers={markers} fallback={config} />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.latitude, marker.longitude]}
          icon={icons.get(marker.category) ?? createDotIcon(marker.category)}
          interactive={false}
        />
      ))}
    </MapContainer>
  );
}
