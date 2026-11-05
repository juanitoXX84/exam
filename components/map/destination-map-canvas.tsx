"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import type { MapMarker, MapViewConfig } from "@/lib/maps/types";
import { MAP_MARKER_COLORS } from "@/lib/maps/marker-colors";
import { googleMapsSearchUrl } from "@/lib/maps/google";
import "leaflet/dist/leaflet.css";

type Props = {
  markers: MapMarker[];
  config: MapViewConfig;
  selectedId?: string | null;
  userPosition?: { latitude: number; longitude: number } | null;
};

function createMarkerIcon(category: MapMarker["category"], active = false) {
  const color = MAP_MARKER_COLORS[category];
  const w = active ? 34 : 26;
  const h = active ? 42 : 34;
  const pulse = active
    ? `<span style="
        position:absolute;left:50%;bottom:2px;transform:translateX(-50%);
        width:18px;height:18px;border-radius:50%;
        background:${color};opacity:0.35;
        animation:nemi-map-pulse 1.4s ease-out infinite;
      "></span>`
    : "";

  return L.divIcon({
    className: "nemi-leaflet-marker",
    html: `<span style="position:relative;display:block;width:${w}px;height:${h}px;">
      ${pulse}
      <svg width="${w}" height="${h}" viewBox="0 0 28 36" aria-hidden="true">
        <path d="M14 1.5C7.1 1.5 1.5 7.1 1.5 14c0 9.2 12.5 20 12.5 20S26.5 23.2 26.5 14C26.5 7.1 20.9 1.5 14 1.5Z"
          fill="${color}" stroke="#0f0e0c" stroke-width="1.6"/>
        <circle cx="14" cy="14" r="4.2" fill="#0f0e0c"/>
      </svg>
    </span>`,
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h + 4],
  });
}

function FitToMarkers({
  markers,
  fallback,
}: {
  markers: MapMarker[];
  fallback: MapViewConfig;
}) {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0) {
      map.setView(
        [fallback.center.latitude, fallback.center.longitude],
        fallback.zoom,
      );
      return;
    }

    if (markers.length === 1) {
      map.setView([markers[0].latitude, markers[0].longitude], 14);
      return;
    }

    const bounds = L.latLngBounds(
      markers.map(
        (marker) => [marker.latitude, marker.longitude] as [number, number],
      ),
    );
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [map, markers, fallback]);

  return null;
}

function FocusSelected({
  markers,
  selectedId,
}: {
  markers: MapMarker[];
  selectedId?: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedId) return;
    const marker = markers.find((item) => item.id === selectedId);
    if (!marker) return;
    map.flyTo([marker.latitude, marker.longitude], 15, { duration: 0.6 });
  }, [map, markers, selectedId]);

  return null;
}

export function DestinationMapCanvas({ markers, config, selectedId, userPosition }: Props) {
  const icons = useMemo(() => {
    const cache = new Map<string, L.DivIcon>();
    for (const marker of markers) {
      const key = `${marker.category}-${marker.id === selectedId}`;
      if (!cache.has(key)) {
        cache.set(
          key,
          createMarkerIcon(marker.category, marker.id === selectedId),
        );
      }
    }
    return cache;
  }, [markers, selectedId]);

  return (
    <MapContainer
      center={[config.center.latitude, config.center.longitude]}
      zoom={config.zoom}
      className="nemi-map-canvas h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
      />
      <FitToMarkers markers={markers} fallback={config} />
      <FocusSelected markers={markers} selectedId={selectedId} />

      {userPosition ? (
        <Marker
          position={[userPosition.latitude, userPosition.longitude]}
          icon={L.divIcon({
            className: "nemi-leaflet-marker",
            html: `<span style="
              display:block;width:18px;height:18px;border-radius:999px;
              background:#6ea8d6;border:3px solid #f2ebe0;
              box-shadow:0 0 0 5px rgba(110,168,214,0.35);
            "></span>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          })}
        >
          <Popup>Tu ubicación</Popup>
        </Marker>
      ) : null}

      {markers.map((marker) => {
        const mapsUrl = googleMapsSearchUrl({
          title: marker.title,
          address: marker.subtitle,
          latitude: marker.latitude,
          longitude: marker.longitude,
        });

        return (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            icon={
              icons.get(`${marker.category}-${marker.id === selectedId}`) ??
              createMarkerIcon(marker.category)
            }
          >
            <Popup className="nemi-map-popup">
              <div className="min-w-[168px] space-y-1.5 p-0.5">
                <p className="text-[10px] tracking-[0.12em] text-[var(--muted)] uppercase">
                  {marker.categoryLabel}
                </p>
                <p className="font-display text-base leading-snug text-[var(--foreground)]">
                  {marker.title}
                </p>
                {marker.subtitle ? (
                  <p className="text-xs text-[var(--muted)]">{marker.subtitle}</p>
                ) : null}
                <p className="text-xs text-[var(--muted)]">
                  {[marker.ratingLabel, marker.priceLabel]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                  {marker.href ? (
                    <Link
                      href={marker.href}
                      className="inline-flex text-xs font-medium underline"
                    >
                      Ver ficha
                    </Link>
                  ) : null}
                  {mapsUrl ? (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex text-xs font-medium underline"
                    >
                      Google Maps
                    </a>
                  ) : null}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
