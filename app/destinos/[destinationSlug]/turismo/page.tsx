import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EstablishmentType } from "@prisma/client";
import { ListingFilters } from "@/components/establishments/listing-filters";
import { NearbyEstablishmentGrid } from "@/components/geo/nearby-establishment-grid";
import { getPublishedDestinationBySlug } from "@/services/destination.service";
import {
  listActiveEstablishments,
  listCategoriesByType,
} from "@/services/establishment.service";

export const revalidate = 300;

type Props = {
  params: Promise<{ destinationSlug: string }>;
  searchParams: Promise<{
    categoria?: string;
    orden?: string;
    q?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destinationSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);
  return {
    title: destination
      ? `Lugares turísticos · ${destination.name}`
      : "Lugares turísticos",
  };
}

function parseSort(value?: string) {
  if (value === "rating" || value === "name") return value;
  return "rating" as const;
}

export default async function TourismPage({ params, searchParams }: Props) {
  const { destinationSlug } = await params;
  const query = await searchParams;
  const destination = await getPublishedDestinationBySlug(destinationSlug);
  if (!destination) notFound();

  const categories = await listCategoriesByType(EstablishmentType.ATTRACTION);
  const places = await listActiveEstablishments(
    destination.id,
    EstablishmentType.ATTRACTION,
    {
      categorySlug: query.categoria,
      sort: parseSort(query.orden),
      q: query.q?.trim() || undefined,
    },
  );

  return (
    <div className="nemi-container py-12 sm:py-16">
      <Link href={`/destinos/${destination.slug}`} className="nemi-back-link text-sm">
        ← Volver a {destination.name}
      </Link>

      <p className="mt-6 text-xs tracking-[0.2em] text-[var(--muted)] uppercase">
        Explorar
      </p>
      <h1 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">
        Lugares turísticos
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        {places.length} resultado{places.length === 1 ? "" : "s"}
      </p>

      <div className="mt-8">
        <ListingFilters
          basePath={`/destinos/${destination.slug}/turismo`}
          searchPlaceholder="Buscar lugar…"
          active={query}
          chipSection={{
            label: "Tipo de lugar",
            paramKey: "categoria",
            allLabel: "Todos",
            options: categories.map((category) => ({
              value: category.slug,
              label: category.name,
            })),
          }}
        />
      </div>

      {places.length === 0 ? (
        <div className="nemi-bento nemi-bento-glass mt-10 p-6">
          <p className="font-medium">No hay lugares publicados</p>
        </div>
      ) : (
        <div className="mt-8">
          <NearbyEstablishmentGrid
            establishments={places}
            hrefPrefix={`/destinos/${destination.slug}/turismo/`}
          />
        </div>
      )}
    </div>
  );
}
