import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Módulo en preparación",
};

type Props = {
  params: Promise<{ destinationSlug: string; section: string }>;
};

const SECTION_LABELS: Record<string, string> = {
  cultura: "Cultura y reglas",
  mapa: "Mapa",
  restaurantes: "Restaurantes",
  hospedaje: "Hospedaje",
  servicios: "Servicios",
  turismo: "Lugares turísticos",
  emergencias: "Emergencias",
};

export default async function DestinationSectionPlaceholder({ params }: Props) {
  const { destinationSlug, section } = await params;
  const label = SECTION_LABELS[section] ?? section;

  return (
    <div className="nemi-container py-12 sm:py-16">
      <Link
        href={`/destinos/${destinationSlug}`}
        className="nemi-back-link text-sm"
      >
        ← Volver al destino
      </Link>
      <p className="mt-6 text-xs tracking-[0.18em] text-[var(--muted)] uppercase">
        {destinationSlug}
      </p>
      <h1 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">
        {label}
      </h1>
      <div className="nemi-glass mt-8 max-w-xl rounded-[var(--radius)] p-5">
        <p className="leading-relaxed text-[var(--muted)]">
          Módulo preparado en la arquitectura de rutas. Se implementará en una
          etapa posterior sin inventar contenido.
        </p>
      </div>
    </div>
  );
}
