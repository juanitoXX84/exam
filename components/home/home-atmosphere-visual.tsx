"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  {
    src: "/home/hero.jpg",
    place: "México",
    detail: "Desierto sonorense",
  },
  {
    src: "/home/slide-japan.jpg",
    place: "Japón",
    detail: "Templos y montañas",
  },
  {
    src: "/home/slide-peru.jpg",
    place: "Perú",
    detail: "Andes y patrimonio",
  },
  {
    src: "/home/slide-italy.jpg",
    place: "Italia",
    detail: "Costa mediterránea",
  },
  {
    src: "/home/slide-colombia.jpg",
    place: "Colombia",
    detail: "Caribe y costa",
  },
] as const;

const INTERVAL_MS = 6500;

/**
 * Fondo del hero: carrusel de paisajes por país (crossfade).
 */
export function HomeAtmosphereVisual() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [active]);

  const current = SLIDES[active];

  return (
    <>
      <div className="nemi-atmosphere" aria-hidden>
        {SLIDES.map((slide, index) => (
          <div
            key={slide.src}
            className={`nemi-atmosphere-slide${
              index === active ? " is-active" : ""
            }`}
            style={{ backgroundImage: `url(${slide.src})` }}
          />
        ))}
        <div className="nemi-atmosphere-wash" />
        <div className="nemi-atmosphere-grain" />
      </div>

      <p className="nemi-atmosphere-place" aria-hidden>
        <span className="nemi-atmosphere-place-name">{current.place}</span>
        <span className="nemi-atmosphere-place-detail">{current.detail}</span>
      </p>
      <div
        className="nemi-atmosphere-dots"
        role="tablist"
        aria-label="Elegir paisaje"
      >
        {SLIDES.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={`${slide.place}: ${slide.detail}`}
            className={`nemi-atmosphere-dot${
              index === active ? " is-active" : ""
            }`}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </>
  );
}
