import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NearbyEstablishmentGrid } from "@/components/geo/nearby-establishment-grid";
import { ListingFilters } from "@/components/establishments/listing-filters";
import { SERVICE_TYPE_OPTIONS } from "@/services/services.service";
import { getPublishedDestinationBySlug } from "@/services/destination.service";
import {
  isServiceEstablishmentType,
  listActiveServices,
} from "@/services/services.service";

export const revalidate = 300;

type Props = {
  params: Promise<{ destinationSlug: string }>;
  searchParams: Promise<{ tipo?: string; q?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destinationSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);
  return {
    title: destination ? `Servicios · ${destination.name}` : "Servicios",
  };
}

export default async function ServicesPage({ params, searchParams }: Props) {
  const { destinationSlug } = await params;
  const query = await searchParams;
  const destination = await getPublishedDestinationBySlug(destinationSlug);

  if (!destination) {
    notFound();
  }

  const typeFilter = isServiceEstablishmentType(query.tipo ?? "")
    ? query.tipo
    : undefined;

  const services = await listActiveServices(
    destination.id,
    typeFilter as never,
    query.q?.trim() || undefined,
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
        Acceso rápido
      </p>
      <h1 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">
        Servicios
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        {services.length} resultado{services.length === 1 ? "" : "s"}
      </p>

      <div className="mt-8">
        <ListingFilters
          basePath={`/destinos/${destination.slug}/servicios`}
          searchPlaceholder="Buscar servicio…"
          active={query}
          chipSection={{
            label: "Tipo de servicio",
            paramKey: "tipo",
            allLabel: "Todos",
            options: SERVICE_TYPE_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            })),
          }}
        />
      </div>

      {services.length === 0 ? (
        <div className="nemi-bento nemi-bento-glass mt-10 p-6">
          <p className="font-medium">No hay servicios para mostrar</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Ajusta filtros o publica servicios verificados desde el admin.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <NearbyEstablishmentGrid
            establishments={services}
            hrefPrefix={`/destinos/${destination.slug}/servicios/`}
          />
        </div>
      )}
    </div>
  );
}
