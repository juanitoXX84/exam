import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EstablishmentType, PriceRange } from "@prisma/client";
import { NearbyEstablishmentGrid } from "@/components/geo/nearby-establishment-grid";
import { ListingFilters } from "@/components/establishments/listing-filters";
import { getPublishedDestinationBySlug } from "@/services/destination.service";
import {
  listActiveEstablishments,
  listRestaurantCategories,
} from "@/services/establishment.service";

export const revalidate = 300;

type Props = {
  params: Promise<{ destinationSlug: string }>;
  searchParams: Promise<{
    precio?: string;
    categoria?: string;
    q?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destinationSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);
  return {
    title: destination
      ? `Restaurantes · ${destination.name}`
      : "Restaurantes",
  };
}

function parsePrice(value?: string): PriceRange | undefined {
  if (!value) return undefined;
  return Object.values(PriceRange).includes(value as PriceRange)
    ? (value as PriceRange)
    : undefined;
}

export default async function RestaurantsPage({ params, searchParams }: Props) {
  const { destinationSlug } = await params;
  const query = await searchParams;
  const destination = await getPublishedDestinationBySlug(destinationSlug);

  if (!destination) {
    notFound();
  }

  const categories = await listRestaurantCategories();
  const restaurants = await listActiveEstablishments(
    destination.id,
    EstablishmentType.RESTAURANT,
    {
      priceRange: parsePrice(query.precio),
      categorySlug: query.categoria,
      sort: "rating",
      q: query.q?.trim() || undefined,
    },
  );

  return (
    <div className="nemi-container py-12 sm:py-16">
      <Link
        href={`/destinos/${destination.slug}`}
        className="nemi-back-link nemi-back-link--truncate text-sm"
        title={`Volver a ${destination.name}`}
      >
        ← Volver a {destination.name}
      </Link>

      <p className="mt-6 text-xs tracking-[0.2em] text-[var(--muted)] uppercase">
        Catálogo
      </p>
      <h1 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">
        Restaurantes
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        {restaurants.length} resultado{restaurants.length === 1 ? "" : "s"}
      </p>

      <div className="mt-8">
        <ListingFilters
          basePath={`/destinos/${destination.slug}/restaurantes`}
          searchPlaceholder="Buscar restaurante…"
          active={query}
          showPrice
          chipSection={{
            label: "Tipo de cocina",
            paramKey: "categoria",
            allLabel: "Todas",
            options: categories.map((category) => ({
              value: category.slug,
              label: category.name,
            })),
          }}
        />
      </div>

      {restaurants.length === 0 ? (
        <div className="nemi-bento nemi-bento-glass mt-10 p-6">
          <p className="font-medium">No hay restaurantes para mostrar</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Ajusta filtros o espera a que se publiquen establecimientos
            verificados.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <NearbyEstablishmentGrid
            establishments={restaurants}
            hrefPrefix={`/destinos/${destination.slug}/restaurantes/`}
          />
        </div>
      )}
    </div>
  );
}
