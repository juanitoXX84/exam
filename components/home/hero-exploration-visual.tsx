"use client";

import type { ExplorePhase } from "@/components/home/explore-types";
import { useState } from "react";

type Props = {
  phase?: ExplorePhase;
  onMexicoClick?: () => void;
  /** Resalta México también en idle (home). */
  preview?: boolean;
};

/** Path #mx del world-map.svg (mismo viewBox). */
const MEXICO_PATH =
  "M133.847,433.982l4.175,13.146l-1.945,1.089l0.216,2.61l3.674,2.827v5.229l4.538,4.356l-1.945-12.847l-2.593-8.497l0.648-5.877l2.161,0.217l0.865,1.962l-0.865,5.005l11.237,21.99v7.841l9.077,10.666l9.94,4.573l4.106-2.396l5.835,4.789l3.458-3.483l-1.513-3.925l4.97-1.521l1.513,0.873l1.513-1.521h2.377l4.322-7.624l-2.161-1.962l-8.428,1.962l-1.945,5.662L182.106,480l-5.834-2.396l-2.593-8.271l1.962-10.434l-4.011-2.498l-1.91-10.02l-1.599-0.683l-2.922,2.965l-3.354-1.789l-1.313-6.682l-13.286-1.393l-6.863-5.16L133.847,433.982L133.847,433.982z";

const MAP_VIEWBOX = "30.767 241.591 784.077 458.627";

type ActiveCountry = {
  id: string;
  label: string;
  path: string;
  labelX: number;
  labelY: number;
  /** Bandera oficial del país */
  flagSrc: string;
  /** Destino real disponible (o resumen) */
  highlight: string;
  highlightNote: string;
  onSelect?: () => void;
};

/**
 * Mapamundi hero. Solo países activos resaltan y son clicables.
 * Al hover: bandera + destino real disponible.
 * Mapa: Al MacDonald / Fritz Lekschas — CC BY-SA 3.0
 */
export function HeroExplorationVisual({
  phase = "idle",
  onMexicoClick,
  preview = false,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const expanded = phase !== "idle";
  const showPin = phase === "mexico";
  const interactive = phase === "world" || (preview && Boolean(onMexicoClick));
  const showHighlight = interactive || phase === "idle";

  const countries: ActiveCountry[] = [
    {
      id: "mexico",
      label: "México",
      path: MEXICO_PATH,
      labelX: 168,
      labelY: 422,
      flagSrc: "/flags/mexico.svg",
      highlight: "Cultura viva, cocina y paisajes únicos.",
      highlightNote: "1 destino disponible",
      onSelect: onMexicoClick,
    },
  ];

  const hovered = countries.find((c) => c.id === hoveredId) ?? null;

  return (
    <div
      className={`nemi-hero-map relative mx-auto w-full ${
        expanded
          ? "nemi-hero-map--expanded max-w-5xl"
          : "max-w-[720px] lg:max-w-none"
      }`}
    >
      <aside
        className={`nemi-country-preview${hovered ? " is-visible" : ""}`}
        aria-hidden={!hovered}
      >
        {hovered ? (
          <>
            <div className="nemi-country-preview-flag">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hovered.flagSrc}
                alt={`Bandera de ${hovered.label}`}
                draggable={false}
              />
            </div>
            <div className="nemi-country-preview-copy">
              <p className="nemi-country-preview-kicker">{hovered.label}</p>
              <p className="nemi-country-preview-title font-display">
                {hovered.highlight}
              </p>
              <p className="nemi-country-preview-hint">{hovered.highlightNote}</p>
            </div>
          </>
        ) : null}
      </aside>

      <div className="nemi-hero-map-glow absolute inset-0" />
      <div className="nemi-hero-map-glow-hot absolute inset-0" />

      <div className="nemi-hero-map-stage relative">
        <div className="nemi-hero-map-float relative z-[1]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/world-map.svg"
            alt="Mapamundi NEMI"
            className="nemi-hero-map-img relative h-auto w-full select-none"
            draggable={false}
          />

          {showHighlight ? (
            <svg
              className={`nemi-country-layer absolute inset-0 h-full w-full${
                interactive ? " nemi-country-layer--interactive" : ""
              }`}
              viewBox={MAP_VIEWBOX}
              preserveAspectRatio="xMidYMid meet"
              aria-hidden={interactive ? undefined : true}
            >
              <defs>
                <linearGradient
                  id="nemi-mexico-flag"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#006847" />
                  <stop offset="33%" stopColor="#006847" />
                  <stop offset="33%" stopColor="#f4f4f4" />
                  <stop offset="66%" stopColor="#f4f4f4" />
                  <stop offset="66%" stopColor="#ce1126" />
                  <stop offset="100%" stopColor="#ce1126" />
                </linearGradient>
                {countries.map((country) => (
                  <clipPath
                    key={`clip-${country.id}`}
                    id={`nemi-clip-${country.id}`}
                  >
                    <path d={country.path} />
                  </clipPath>
                ))}
              </defs>

              {countries.map((country) => (
                <g
                  key={country.id}
                  className={`nemi-country-hot${
                    hoveredId === country.id ? " is-hovered" : ""
                  }`}
                >
                  <g clipPath={`url(#nemi-clip-${country.id})`}>
                    <path d={country.path} className="nemi-country-hot-fill" />
                  </g>

                  <path d={country.path} className="nemi-country-hot-edge" />

                  <text
                    x={country.labelX}
                    y={country.labelY}
                    className="nemi-mx-silhouette-label"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {country.label}
                  </text>

                  {interactive ? (
                    <path
                      d={country.path}
                      className="nemi-mx-silhouette"
                      role="button"
                      tabIndex={0}
                      aria-label={`Seleccionar ${country.label}`}
                      onMouseEnter={() => setHoveredId(country.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setHoveredId(country.id)}
                      onBlur={() => setHoveredId(null)}
                      onClick={country.onSelect}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          country.onSelect?.();
                        }
                      }}
                    />
                  ) : null}
                </g>
              ))}
            </svg>
          ) : null}
        </div>

        {showPin ? (
          <>
            <div className="nemi-hero-map-hotspot absolute z-[2]" />
            <div className="nemi-hero-map-pin absolute z-[3]">
              <span className="nemi-hero-map-pin-ring" />
              <span className="nemi-hero-map-pin-ring nemi-hero-map-pin-ring-b" />
              <span className="nemi-hero-map-pin-dot" />
              <span className="nemi-hero-map-pin-label">SLRC</span>
            </div>
          </>
        ) : null}

        <div className="nemi-hero-map-vignette pointer-events-none absolute inset-0 z-[1]" />
      </div>

      {phase !== "world" && phase !== "idle" ? (
        <div className="relative z-[2] mt-3 flex items-end justify-between gap-3 px-1">
          <p className="text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase sm:text-xs">
            {phase === "mexico"
              ? "1 destino disponible"
              : "Orientación multi-destino"}
          </p>
          {phase === "mexico" ? (
            <p className="text-[10px] text-[var(--muted)] opacity-60">México</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
