"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { EstablishmentType } from "@prisma/client";
import type { MapMarker, MapMarkerCategory, MapViewConfig } from "@/lib/maps/types";
import { MAP_MARKER_COLORS } from "@/lib/maps/marker-colors";
import { googleMapsSearchUrl } from "@/lib/maps/google";

const DestinationMapCanvas = dynamic(
  () =>
    import("@/components/map/destination-map-canvas").then(
      (mod) => mod.DestinationMapCanvas,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[420px] items-center justify-center text-sm text-[var(--muted)]">
        Cargando mapa…
      </div>
    ),
  },
);

type FilterValue = "ALL" | EstablishmentType;

type Props = {
  markers: MapMarker[];
  config: MapViewConfig;
  destinationSlug: string;
};

const FILTERS: Array<{
  value: FilterValue;
  label: string;
  color?: string;
}> = [
  { value: "ALL", label: "Todos" },
  { value: "RESTAURANT", label: "Restaurantes", color: MAP_MARKER_COLORS.RESTAURANT },
  { value: "LODGING", label: "Hospedaje", color: MAP_MARKER_COLORS.LODGING },
  { value: "ATTRACTION", label: "Turismo", color: MAP_MARKER_COLORS.ATTRACTION },
  { value: "CLINIC", label: "Clínicas", color: MAP_MARKER_COLORS.CLINIC },
  { value: "HOSPITAL", label: "Hospitales", color: MAP_MARKER_COLORS.HOSPITAL },
  { value: "PHARMACY", label: "Farmacias", color: MAP_MARKER_COLORS.PHARMACY },
  { value: "GAS_STATION", label: "Gasolineras", color: MAP_MARKER_COLORS.GAS_STATION },
  { value: "BANK", label: "Bancos", color: MAP_MARKER_COLORS.BANK },
  { value: "OTHER_SERVICE", label: "Otros", color: MAP_MARKER_COLORS.OTHER_SERVICE },
];

function matchesFilter(marker: MapMarker, filter: FilterValue) {
  if (filter === "ALL") return true;
  return marker.type === filter;
}

function markerColor(category: MapMarkerCategory) {
  return MAP_MARKER_COLORS[category];
}

export function DestinationMapPanel({
  markers,
  config,
  destinationSlug,
}: Props) {
  const [filter, setFilter] = useState<FilterValue>("ALL");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return markers.filter((marker) => {
      if (!matchesFilter(marker, filter)) return false;
      if (!q) return true;
      return (
        marker.title.toLowerCase().includes(q) ||
        marker.subtitle?.toLowerCase().includes(q) ||
        marker.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [markers, filter, query]);

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <aside className="nemi-bento flex max-h-[720px] flex-col border border-[var(--border)] bg-[var(--surface-solid)] p-4">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar en el mapa…"
          className="nemi-input"
        />

        <div className="mt-3 flex flex-wrap gap-1.5">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors ${
                filter === item.value
                  ? "border-[rgba(45,212,191,0.45)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {item.color ? (
                <span
                  aria-hidden
                  className="inline-block size-2 shrink-0 rounded-full"
                  style={{ background: item.color }}
                />
              ) : null}
              {item.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs text-[var(--muted)]">
          {filtered.length} punto{filtered.length === 1 ? "" : "s"}
        </p>

        <ul className="mt-3 space-y-2 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <li className="rounded-xl border border-dashed border-[var(--border)] p-3 text-sm text-[var(--muted)]">
              No hay puntos con estos filtros.
            </li>
          ) : (
            filtered.map((marker) => {
              const mapsUrl = googleMapsSearchUrl({
                title: marker.title,
                address: marker.subtitle,
                latitude: marker.latitude,
                longitude: marker.longitude,
              });

              return (
              <li key={marker.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(marker.id)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    selectedId === marker.id
                      ? "border-[rgba(45,212,191,0.4)] bg-[var(--accent-soft)]"
                      : "border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <p className="flex items-center gap-1.5 text-[10px] tracking-[0.12em] text-[var(--muted)] uppercase">
                    <span
                      aria-hidden
                      className="inline-block size-2 shrink-0 rounded-full"
                      style={{ background: markerColor(marker.category) }}
                    />
                    {marker.categoryLabel}
                  </p>
                  <p className="mt-1 text-sm font-medium">{marker.title}</p>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    {marker.href ? (
                      <Link
                        href={marker.href}
                        className="inline-block text-xs text-[var(--accent)]"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Ver ficha
                      </Link>
                    ) : null}
                    {mapsUrl ? (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs text-sky-300"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Google Maps
                      </a>
                    ) : null}
                  </div>
                </button>
              </li>
              );
            })
          )}
        </ul>

        <p className="mt-3 text-[11px] text-[var(--muted)]">
          Destino: {destinationSlug}
        </p>
      </aside>

      <div className="overflow-hidden border border-[var(--border)] bg-[var(--surface-solid)]">
        <div className="h-[560px] overflow-hidden sm:h-[720px]">
          <DestinationMapCanvas
            markers={filtered}
            config={config}
            selectedId={selectedId}
          />
        </div>
      </div>
    </div>
  );
}
