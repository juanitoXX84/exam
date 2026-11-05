import Link from "next/link";
import { googleMapsSearchUrl } from "@/lib/maps/google";

type Props = {
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  destinationSlug: string;
};

/** Enlaces para contrastar ubicación: Google Maps (público) y mapa NEMI. */
export function PlaceMapLinks({
  name,
  address,
  latitude,
  longitude,
  destinationSlug,
}: Props) {
  const mapsUrl = googleMapsSearchUrl({
    title: name,
    address,
    latitude,
    longitude,
  });
  const hasNemiCoords = latitude != null && longitude != null;

  if (!mapsUrl && !hasNemiCoords) return null;

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--border)] pt-4">
      {mapsUrl ? (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[var(--accent)]"
        >
          Abrir en Google Maps
          <span aria-hidden>↗</span>
        </a>
      ) : null}
      {hasNemiCoords ? (
        <Link
          href={`/destinos/${destinationSlug}/mapa`}
          className="inline-flex items-center gap-1 text-xs text-[var(--accent)]"
        >
          Ver en mapa NEMI
          <span aria-hidden>↗</span>
        </Link>
      ) : null}
    </div>
  );
}
