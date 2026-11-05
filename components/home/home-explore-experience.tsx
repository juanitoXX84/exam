"use client";

import type { ExplorePhase } from "@/components/home/explore-types";
import { CountryFlagReveal } from "@/components/home/country-flag-reveal";
import { HomeAtmosphereVisual } from "@/components/home/home-atmosphere-visual";
import { HeroExplorationVisual } from "@/components/home/hero-exploration-visual";
import { HomeDestinationCarousel } from "@/components/home/home-destination-carousel";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import Link from "next/link";
import { useEffect, useState } from "react";

const MEXICO_DESTINATIONS = [
  {
    id: "slrc",
    name: "San Luis Río Colorado",
    region: "Sonora, México",
    blurb:
      "Puerta del desierto sonorense: orientación turística y cultural para conocer el destino antes de vivirlo.",
    tags: ["Cultura", "Desierto", "Frontera"],
    href: "/destinos/san-luis-rio-colorado",
    available: true as const,
  },
] as const;

/**
 * Home hospitality: hero inmersivo + editorial.
 * Mapamundi exclusivo de Explorar.
 */
export function HomeExploreExperience({
  isLoggedIn = false,
}: {
  isLoggedIn?: boolean;
}) {
  const [phase, setPhase] = useState<ExplorePhase>("idle");

  useEffect(() => {
    function openExplore() {
      setPhase("world");
      if (window.location.hash !== "#explorar") {
        window.history.replaceState(null, "", "#explorar");
      }
    }

    function goHome() {
      setPhase("idle");
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }

    if (window.location.hash === "#explorar") {
      openExplore();
    }

    const onHash = () => {
      if (window.location.hash === "#explorar") openExplore();
      else goHome();
    };

    window.addEventListener("hashchange", onHash);
    window.addEventListener("nemi-explore", openExplore);
    window.addEventListener("nemi-home", goHome);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("nemi-explore", openExplore);
      window.removeEventListener("nemi-home", goHome);
    };
  }, []);

  useEffect(() => {
    if (phase === "idle") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPhase((p) => (p === "mexico" ? "world" : "idle"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  function startExplore() {
    setPhase("world");
    window.history.replaceState(null, "", "#explorar");
    window.dispatchEvent(new Event("nemi-explore"));
  }

  function exitExplore() {
    setPhase("idle");
    window.history.replaceState(null, "", window.location.pathname);
  }

  const expanded = phase !== "idle";

  return (
    <section
      id="explorar"
      className={`nemi-explore nemi-home relative flex flex-1 flex-col overflow-x-clip overflow-y-visible nemi-explore--${phase}${
        expanded ? " nemi-explore--live" : " nemi-home--idle"
      }`}
    >
      {!expanded ? (
        <div className="nemi-home-landing">
          <div className="nemi-home-hero">
            <HomeAtmosphereVisual />
            <div className="nemi-home-hero-veil" aria-hidden />

            <div className="nemi-home-hero-content">
              <h1 className="nemi-home-hero-brand font-display">NEMI</h1>
              <p className="nemi-home-hero-lead">
                Orientación turística y cultural. Conoce el lugar antes de
                vivirlo.
              </p>
              <div className="nemi-home-hero-cta">
                <button
                  type="button"
                  onClick={startExplore}
                  className="nemi-btn nemi-btn-primary"
                >
                  Explorar destinos
                </button>
                <Link
                  href={isLoggedIn ? "/cuenta" : "/iniciar-sesion"}
                  className="nemi-btn nemi-btn-ghost"
                >
                  Mi cuenta
                </Link>
              </div>
            </div>
          </div>

          <section className="nemi-home-intro">
            <RevealOnScroll className="nemi-container nemi-home-intro-inner">
              <div className="nemi-home-ornament" aria-hidden>
                <span />
                <span className="nemi-home-ornament-mark" />
                <span />
              </div>
              <p className="nemi-home-intro-eyebrow">Orientación de viaje</p>
              <h2 className="nemi-home-intro-title font-display">
                Conoce el lugar antes de vivirlo.
              </h2>
              <p className="nemi-home-intro-sub">
                Plataforma de orientación turística y cultural
              </p>
              <p className="nemi-home-intro-body">
                Costumbres, lugares y mapa en un solo recorrido: lo que necesitas
                para llegar con contexto y moverte con claridad.
              </p>
            </RevealOnScroll>
          </section>

          <section className="nemi-home-destination">
            <RevealOnScroll className="nemi-container">
              <HomeDestinationCarousel onExplore={startExplore} />
            </RevealOnScroll>
          </section>

          <section className="nemi-home-paths">
            <div className="nemi-container">
              <RevealOnScroll className="nemi-home-paths-head">
                <h2 className="font-display">Qué puedes hacer</h2>
                <p>Todo lo que ya ofrece NEMI, en un solo recorrido.</p>
              </RevealOnScroll>
              <div className="nemi-home-paths-row">
                <RevealOnScroll delayMs={40}>
                  <article>
                    <h3>Cultura</h3>
                    <p>Costumbres y señales para moverte con respeto.</p>
                  </article>
                </RevealOnScroll>
                <RevealOnScroll delayMs={110}>
                  <article>
                    <h3>Lugares</h3>
                    <p>Comer, dormir y recorrer con fichas reales.</p>
                  </article>
                </RevealOnScroll>
                <RevealOnScroll delayMs={180}>
                  <article>
                    <h3>Mapa</h3>
                    <p>Ubícate y abre cada punto dentro del destino.</p>
                  </article>
                </RevealOnScroll>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="nemi-container relative grid flex-1 items-start gap-6 py-10 lg:py-12">
          <div className="nemi-explore-map-wrap nemi-explore-map-wrap--active relative z-20 col-span-full mx-auto w-full max-w-5xl">
            <div className="nemi-explore-toolbar mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="nemi-explore-kicker">
                  {phase === "mexico" ? "México" : "Elige un país"}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
                  {phase === "mexico" ? "Lugares disponibles" : "Mapa del mundo"}
                </p>
                {phase === "world" ? (
                  <p className="mt-2 max-w-md text-base text-[var(--muted)]">
                    Toca un país resaltado para ver los destinos.
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() =>
                  phase === "mexico" ? setPhase("world") : exitExplore()
                }
                className="nemi-explore-back-btn"
              >
                {phase === "mexico" ? "← Atrás" : "Cerrar"}
              </button>
            </div>

            {phase === "mexico" ? <CountryFlagReveal country="mexico" /> : null}

            {phase === "world" ? (
              <HeroExplorationVisual
                phase={phase}
                onMexicoClick={() => setPhase("mexico")}
              />
            ) : null}

            {phase === "mexico" ? (
              <div className="nemi-explore-cities mt-6">
                <ul className="flex flex-col gap-3">
                  {MEXICO_DESTINATIONS.map((city) => (
                    <li key={city.id}>
                      {city.available ? (
                        <Link
                          href={city.href}
                          className="nemi-explore-city nemi-explore-city--available group"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
                                {city.name}
                              </p>
                              <p className="mt-1 text-base text-[var(--muted)]">
                                {city.region}
                              </p>
                              <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--foreground)]/85">
                                {city.blurb}
                              </p>
                              <div className="nemi-explore-city-meta">
                                {city.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="nemi-explore-chip nemi-explore-chip--accent"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className="nemi-explore-city-cue shrink-0 pt-1 text-base font-semibold text-[var(--accent)]">
                              Entrar →
                            </span>
                          </div>
                        </Link>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-center text-sm text-[var(--muted)]">
                  Más destinos próximamente
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
