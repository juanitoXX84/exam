import Link from "next/link";
import type { CulturalSignal } from "@prisma/client";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { DestinationMapPreview } from "@/components/map/destination-map-preview";
import { CULTURAL_SIGNAL_LABELS } from "@/lib/cultural/labels";
import type { MapMarker, MapViewConfig } from "@/lib/maps/types";
import {
  IconCulture,
  IconEmergency,
  IconLodging,
  IconMap,
  IconRestaurant,
  IconServices,
  IconTourism,
} from "@/components/destination/module-icons";

type CulturalPreview = {
  total: number;
  counts: { avoid: number; consider: number; recommended: number };
  latest: Array<{
    id: string;
    title: string;
    summary: string | null;
    signal: CulturalSignal;
    slug: string;
  }>;
};

type PlacePreview = {
  total: number;
  latest: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

type Props = {
  destinationSlug: string;
  destinationName: string;
  cultural: CulturalPreview;
  restaurants: PlacePreview;
  lodging: PlacePreview;
  services: PlacePreview;
  attractions: PlacePreview;
  emergencies: {
    total: number;
    official: number;
    latest: Array<{
      id: string;
      name: string;
    }>;
  };
  map: {
    total: number;
    markers: MapMarker[];
    config: MapViewConfig;
  };
};

/**
 * Overview editorial del destino (estilo home hospitality).
 */
export function DestinationOverview({
  destinationSlug,
  destinationName,
  cultural,
  restaurants,
  lodging,
  services,
  attractions,
  emergencies,
  map,
}: Props) {
  const base = `/destinos/${destinationSlug}`;
  const culturePreview = cultural.latest.slice(0, 3);

  const paths = [
    {
      href: `${base}/restaurantes`,
      title: "Restaurantes",
      hint:
        restaurants.total > 0
          ? `${restaurants.total} lugares`
          : "Dónde comer",
      icon: <IconRestaurant className="size-5" />,
      image: "/destinations/slrc/categories/restaurantes.jpg",
    },
    {
      href: `${base}/hospedaje`,
      title: "Hospedaje",
      hint: lodging.total > 0 ? `${lodging.total} lugares` : "Dónde dormir",
      icon: <IconLodging className="size-5" />,
      image: "/destinations/slrc/categories/hospedaje.jpg",
    },
    {
      href: `${base}/servicios`,
      title: "Servicios",
      hint: services.total > 0 ? `${services.total} puntos` : "Lo práctico",
      icon: <IconServices className="size-5" />,
      image: "/destinations/slrc/categories/servicios.jpg",
    },
    {
      href: `${base}/turismo`,
      title: "Turismo",
      hint:
        attractions.total > 0
          ? `${attractions.total} lugares`
          : "Qué visitar",
      icon: <IconTourism className="size-5" />,
      image: "/destinations/slrc/categories/turismo.jpg",
    },
    {
      href: `${base}/emergencias`,
      title: "Emergencias",
      hint:
        emergencies.official > 0
          ? `${emergencies.official} oficiales`
          : emergencies.total > 0
            ? `${emergencies.total} contactos`
            : "Ayuda",
      icon: <IconEmergency className="size-5" />,
      image: "/destinations/slrc/categories/emergencias.jpg",
    },
  ];

  return (
    <div className="nemi-dest-overview">
      <section id="cultura" className="nemi-dest-culture">
        <div className="nemi-container nemi-dest-culture-grid">
          <RevealOnScroll className="nemi-dest-culture-intro">
            <p className="nemi-dest-band-eyebrow">
              <IconCulture className="size-4" /> Cultura
            </p>
            <h2 className="font-display">Lee el lugar antes de llegar</h2>
            <p>
              Costumbres y señales locales para moverte con respeto en{" "}
              {destinationName}.
            </p>
            <p className="nemi-dest-culture-legend" aria-label="Resumen de señales">
              <span className="nemi-dest-culture-legend-item nemi-dest-culture-legend-item--avoid">
                <strong>{cultural.counts.avoid}</strong> evitar
              </span>
              <span className="nemi-dest-culture-legend-item nemi-dest-culture-legend-item--consider">
                <strong>{cultural.counts.consider}</strong> precaución
              </span>
              <span className="nemi-dest-culture-legend-item nemi-dest-culture-legend-item--recommended">
                <strong>{cultural.counts.recommended}</strong> seguro
              </span>
            </p>
            <Link href={`${base}/cultura`} className="nemi-dest-text-link">
              Ver guías culturales →
            </Link>
          </RevealOnScroll>

          <RevealOnScroll delayMs={50} className="nemi-dest-culture-side">
            {culturePreview.length > 0 ? (
              <ul className="nemi-dest-culture-list">
                {culturePreview.map((guide) => {
                  const meta = CULTURAL_SIGNAL_LABELS[guide.signal];
                  return (
                    <li key={guide.id}>
                      <Link
                        href={`${base}/cultura/${guide.slug}`}
                        className={`nemi-dest-culture-item nemi-dest-culture-item--${meta.tone}`}
                      >
                        <span className="nemi-dest-culture-signal" aria-hidden />
                        <span className="nemi-dest-culture-item-body">
                          <span className="nemi-dest-culture-item-kicker">
                            {meta.short}
                          </span>
                          <span className="nemi-dest-culture-item-title">
                            {guide.title}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="nemi-dest-culture-empty">
                Sin guías publicadas todavía
              </p>
            )}
          </RevealOnScroll>
        </div>
      </section>

      <section id="explorar-lugares" className="nemi-dest-paths">
        <div className="nemi-container">
          <RevealOnScroll className="nemi-dest-paths-head">
            <p className="nemi-dest-band-eyebrow">
              <IconTourism className="size-4" /> Lugares
            </p>
            <h2 className="font-display">Come, duerme y recorre</h2>
            <p>Elige un camino dentro de {destinationName}.</p>
          </RevealOnScroll>
          <div className="nemi-dest-paths-row">
            {paths.map((item, index) => (
              <RevealOnScroll key={item.href} delayMs={40 + index * 50}>
                <Link href={item.href} className="nemi-dest-path">
                  <div
                    className="nemi-dest-path-photo"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="nemi-dest-path-copy">
                    <span className="nemi-dest-path-icon">{item.icon}</span>
                    <h3>{item.title}</h3>
                    <p>{item.hint}</p>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="mapa" className="nemi-dest-map-band">
        <div className="nemi-container">
          <RevealOnScroll className="nemi-dest-map-head">
            <div className="nemi-dest-map-head-copy">
              <p className="nemi-dest-band-eyebrow">
                <IconMap className="size-4" /> Mapa
              </p>
              <h2 className="font-display">Todo el destino a la vista</h2>
              <p>
                {map.total > 0
                  ? `${map.total} puntos de interés listos para ubicar.`
                  : "Explora lugares cuando haya puntos publicados."}
              </p>
            </div>
            <Link href={`${base}/mapa`} className="nemi-btn nemi-btn-primary">
              Abrir mapa
            </Link>
          </RevealOnScroll>

          <RevealOnScroll delayMs={40}>
            <div className="nemi-dest-map-stage">
              <DestinationMapPreview
                markers={map.markers}
                config={map.config}
              />
              <Link
                href={`${base}/mapa`}
                className="nemi-dest-map-stage-link"
                aria-label="Abrir mapa completo"
              />
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}

/** @deprecated Prefer DestinationOverview */
export const DestinationBento = DestinationOverview;
