"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DESTINATIONS = [
  {
    id: "slrc",
    name: "San Luis Río Colorado",
    region: "Sonora · México",
    body: "Desierto, frontera y cultura sonorense. Explora guías culturales, lugares reales y el mapa del destino.",
    image: "/home/destination.jpg",
    available: true as const,
    href: "/destinos/san-luis-rio-colorado",
  },
  {
    id: "oaxaca",
    name: "Oaxaca",
    region: "Oaxaca · México",
    body: "Tradición viva, mercados y gastronomía: orientación cultural para recorrer la ciudad con respeto y contexto.",
    image: "/home/slide-oaxaca.jpg",
    available: false as const,
  },
  {
    id: "cusco",
    name: "Cusco",
    region: "Cusco · Perú",
    body: "Andes, patrimonio y costumbres locales. Un destino para prepararte antes de subir a la sierra.",
    image: "/home/slide-peru.jpg",
    available: false as const,
  },
  {
    id: "kyoto",
    name: "Kioto",
    region: "Kioto · Japón",
    body: "Templos, etiqueta y ritmo urbano: señales claras para moverte con confianza en un destino de alta cultura.",
    image: "/home/slide-japan.jpg",
    available: false as const,
  },
  {
    id: "amalfi",
    name: "Amalfi",
    region: "Campania · Italia",
    body: "Costa, pueblos y costumbres mediterráneas. Orientación práctica para llegar sabiendo qué esperar.",
    image: "/home/slide-italy.jpg",
    available: false as const,
  },
] as const;

const INTERVAL_MS = 7000;

type Props = {
  onExplore: () => void;
};

/**
 * Carrusel de destinos en home: SLRC activo; el resto próximamente.
 */
export function HomeDestinationCarousel({ onExplore }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % DESTINATIONS.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [active]);

  const dest = DESTINATIONS[active];

  return (
    <div className="nemi-home-destination-grid nemi-home-dest-carousel">
      <div className="nemi-home-destination-visual">
        <div className="nemi-home-destination-frame">
          {DESTINATIONS.map((item, index) => (
            <div
              key={item.id}
              className={`nemi-home-destination-photo${
                index === active ? " is-active" : ""
              }`}
              style={{ backgroundImage: `url(${item.image})` }}
              aria-hidden={index !== active}
            />
          ))}
          <div className="nemi-home-destination-caption">
            <span key={dest.id}>{dest.region}</span>
          </div>
        </div>
      </div>

      <div className="nemi-home-destination-copy">
        <div key={dest.id} className="nemi-home-destination-copy-inner">
          <p className="nemi-home-destination-kicker">Destinos</p>
          <h2 className="nemi-home-destination-title font-display">
            {dest.name}
          </h2>
          <p className="nemi-home-destination-body">{dest.body}</p>

          <div className="nemi-home-destination-actions">
            {dest.available ? (
              <>
                <Link href={dest.href} className="nemi-btn nemi-btn-primary">
                  Abrir destino
                </Link>
                <button
                  type="button"
                  onClick={onExplore}
                  className="nemi-home-text-link"
                >
                  Ver en el mapa →
                </button>
              </>
            ) : (
              <span className="nemi-home-destination-soon">Próximamente</span>
            )}
          </div>
        </div>

        <div
          className="nemi-home-dest-dots"
          role="tablist"
          aria-label="Elegir destino"
        >
          {DESTINATIONS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={item.name}
              className={`nemi-home-dest-dot${
                index === active ? " is-active" : ""
              }`}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
