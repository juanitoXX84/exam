import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CulturalSignal } from "@prisma/client";
import {
  CulturalGuideCard,
  CultureSectionHeader,
} from "@/components/cultural/guide-card";
import { CulturePageHero } from "@/components/cultural/culture-page-hero";
import { CulturalSignalFilters } from "@/components/cultural/signal-filters";
import { getDestinationWeather } from "@/lib/weather/open-meteo";
import { getPublishedDestinationBySlug } from "@/services/destination.service";
import { listPublishedCulturalGuides } from "@/services/cultural.service";

const SLRC_COORDS = { latitude: 32.4762, longitude: -114.7638 };
const DEFAULT_TZ = "America/Hermosillo";

type Props = {
  params: Promise<{ destinationSlug: string }>;
  searchParams: Promise<{ senal?: string }>;
};

function parseSignal(value?: string): CulturalSignal | undefined {
  if (!value) return undefined;
  if (
    value === CulturalSignal.AVOID ||
    value === CulturalSignal.CONSIDER ||
    value === CulturalSignal.RECOMMENDED
  ) {
    return value;
  }
  return undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destinationSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);
  return {
    title: destination
      ? `Cultura y reglas · ${destination.name}`
      : "Cultura y reglas",
  };
}

export default async function CulturalGuidesPage({
  params,
  searchParams,
}: Props) {
  const { destinationSlug } = await params;
  const { senal } = await searchParams;
  const destination = await getPublishedDestinationBySlug(destinationSlug);

  if (!destination) {
    notFound();
  }

  const signal = parseSignal(senal);
  const timezone = destination.timezone?.trim() || DEFAULT_TZ;
  const latitude = destination.latitude ?? SLRC_COORDS.latitude;
  const longitude = destination.longitude ?? SLRC_COORDS.longitude;

  const [allGuides, weather] = await Promise.all([
    listPublishedCulturalGuides(destination.id),
    getDestinationWeather(latitude, longitude, timezone),
  ]);

  const guides = signal
    ? allGuides.filter((guide) => guide.signal === signal)
    : allGuides;

  const grouped = {
    AVOID: guides.filter((guide) => guide.signal === CulturalSignal.AVOID),
    CONSIDER: guides.filter((guide) => guide.signal === CulturalSignal.CONSIDER),
    RECOMMENDED: guides.filter(
      (guide) => guide.signal === CulturalSignal.RECOMMENDED,
    ),
  };

  const coverImage =
    destination.coverImage ??
    (destination.slug === "san-luis-rio-colorado"
      ? "/destinations/slrc/cover.jpg"
      : null);

  return (
    <div className="nemi-culture-page">
      <CulturePageHero
        destinationName={destination.name}
        region={destination.region}
        country={destination.country}
        coverImage={coverImage}
        weather={weather}
      />

      <div className="nemi-container">
        <div className="nemi-culture-toolbar">
          <Link
            href={`/destinos/${destination.slug}`}
            className="nemi-back-link text-sm"
          >
            ← Volver a {destination.name}
          </Link>
          <CulturalSignalFilters
            destinationSlug={destination.slug}
            active={signal ?? "ALL"}
          />
        </div>

        {guides.length === 0 ? (
          <div className="nemi-glass rounded-[1.15rem] p-6">
            <p className="font-medium text-[var(--foreground)]">
              Aún no hay guías culturales publicadas
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              No se mostrará contenido inventado. Cuando un administrador
              publique información verificada, aparecerá aquí organizada por
              Evita, Ten en cuenta y Recomendado.
            </p>
          </div>
        ) : (
          <div className="nemi-culture-sections">
            {(
              [
                [CulturalSignal.AVOID, grouped.AVOID],
                [CulturalSignal.CONSIDER, grouped.CONSIDER],
                [CulturalSignal.RECOMMENDED, grouped.RECOMMENDED],
              ] as const
            ).map(([key, items]) =>
              items.length === 0 ? null : (
                <section key={key}>
                  <CultureSectionHeader signal={key} count={items.length} />
                  <div className="nemi-culture-grid">
                    {items.map((guide) => (
                      <CulturalGuideCard
                        key={guide.id}
                        guide={guide}
                        destinationSlug={destination.slug}
                      />
                    ))}
                  </div>
                </section>
              ),
            )}
          </div>
        )}

        <aside className="nemi-culture-cta">
          <div className="nemi-culture-cta-copy">
            <p className="font-display text-xl tracking-tight sm:text-2xl">
              Explora el destino con más contexto
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Vuelve al overview para ver mapa, lugares y servicios de{" "}
              {destination.name}.
            </p>
          </div>
          <Link
            href={`/destinos/${destination.slug}`}
            className="nemi-btn nemi-btn-primary shrink-0"
          >
            Ver destino →
          </Link>
        </aside>

        <p className="nemi-culture-note">
          Orientación editorial. No sustituye normas oficiales ni asesoría
          legal. Verifica requisitos vigentes antes de cruzar o conducir.
        </p>
      </div>
    </div>
  );
}
