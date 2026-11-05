import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EstablishmentType, PriceRange } from "@prisma/client";
import { NearbyEstablishmentGrid } from "@/components/geo/nearby-establishment-grid";
import { ListingFilters } from "@/components/establishments/listing-filters";
import { getPublishedDestinationBySlug } from "@/services/destination.service";
import {
  listActiveEstablishments,
  listCategoriesByType,
} from "@/services/establishment.service";

export const revalidate = 300;

type Props = {
  params: Promise<{ destinationSlug: string }>;
  searchParams: Promise<{
    precio?: string;
    categoria?: string;
    orden?: string;
    min?: string;
    q?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destinationSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);
  return {
    title: destination ? `Hospedaje · ${destination.name}` : "Hospedaje",
  };
}

function parsePrice(value?: string): PriceRange | undefined {
  if (!value) return undefined;
  return Object.values(PriceRange).includes(value as PriceRange)
    ? (value as PriceRange)
    : undefined;
}

function parseSort(value?: string) {
  if (
    value === "rating" ||
    value === "price_asc" ||
    value === "price_desc" ||
    value === "name"
  ) {
    return value;
  }
  return "rating" as const;
}

export default async function LodgingPage({ params, searchParams }: Props) {
  const { destinationSlug } = await params;
  const query = await searchParams;
  const destination = await getPublishedDestinationBySlug(destinationSlug);

  if (!destination) {
    notFound();
  }

  const categories = await listCategoriesByType(EstablishmentType.LODGING);
  const lodgings = await listActiveEstablishments(
    destination.id,
    EstablishmentType.LODGING,
    {
      priceRange: parsePrice(query.precio),
      categorySlug: query.categoria,
      minRating: query.min ? Number(query.min) : undefined,
      sort: parseSort(query.orden),
      q: query.q?.trim() || undefined,
    },
  );

  return (
    <div className="nemi-container py-12 sm:py-16">
      <Link
        href={`/destinos/${destination.slug}`}
        className="nemi-back-link text-sm"
      >
        ← Volver a {destination.name}
      </Link>

      <p className="mt-6 text-xs tracking-[0.2em] text-[var(--muted)] uppercase">
        Catálogo
      </p>
      <h1 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">
        Hospedaje
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
        {lodgings.length} resultado{lodgings.length === 1 ? "" : "s"}
      </p>

      <div className="mt-8">
        <ListingFilters
          basePath={`/destinos/${destination.slug}/hospedaje`}
          searchPlaceholder="Buscar hospedaje…"
          active={query}
          showPrice
          chipSection={{
            label: "Tipo de alojamiento",
            paramKey: "categoria",
            allLabel: "Todos",
            options: categories.map((category) => ({
              value: category.slug,
              label: category.name,
            })),
          }}
        />
      </div>

      {lodgings.length === 0 ? (
        <div className="nemi-bento nemi-bento-glass mt-10 p-6">
          <p className="font-medium">No hay hospedaje para mostrar</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Ajusta filtros o publica alojamientos verificados desde el panel
            admin.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <NearbyEstablishmentGrid
            establishments={lodgings}
            hrefPrefix={`/destinos/${destination.slug}/hospedaje/`}
          />
        </div>
      )}
    </div>
  );
}
