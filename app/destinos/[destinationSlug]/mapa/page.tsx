import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DestinationMapPanel } from "@/components/map/destination-map-panel";
import { getPublishedDestinationBySlug } from "@/services/destination.service";
import {
  getDestinationMapConfig,
  listMapMarkersForDestination,
} from "@/services/map.service";

type Props = {
  params: Promise<{ destinationSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destinationSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);
  return {
    title: destination ? `Mapa · ${destination.name}` : "Mapa",
  };
}

export default async function DestinationMapPage({ params }: Props) {
  const { destinationSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);

  if (!destination) {
    notFound();
  }

  const [markers, config] = await Promise.all([
    listMapMarkersForDestination(destination.id, destination.slug),
    getDestinationMapConfig(destination.id),
  ]);

  return (
    <div className="nemi-container py-12 sm:py-16">
      <Link
        href={`/destinos/${destination.slug}`}
        className="nemi-back-link text-sm"
      >
        ← Volver a {destination.name}
      </Link>

      <p className="mt-6 text-xs tracking-[0.2em] text-[var(--muted)] uppercase">
        Exploración
      </p>
      <h1 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">
        Mapa
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
        Visualiza restaurantes y otros puntos con coordenadas. Selecciona un
        marcador o una ficha de la lista para ver el resumen.
      </p>

      <div className="mt-8">
        <DestinationMapPanel
          markers={markers}
          config={config}
          destinationSlug={destination.slug}
        />
      </div>
    </div>
  );
}
