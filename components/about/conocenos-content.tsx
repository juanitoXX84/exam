"use client";

import Link from "next/link";
import { AboutDestinationModules } from "@/components/about/about-destination-modules";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";

const STEPS = [
  {
    title: "Elige un destino",
    copy: "Desde el mapa de la home entras al lugar que te interesa.",
  },
  {
    title: "Revisa la info",
    copy: "Cultura, comida, hospedaje, servicios y turismo en un hub.",
  },
  {
    title: "Abre una ficha",
    copy: "Mapa, teléfono y contacto directo — datos con fuente.",
  },
  {
    title: "Guarda y opina",
    copy: "Favoritos y reseñas con cuenta; explorar no exige registro.",
  },
] as const;

/**
 * Conócenos: misma marca que el home, composición distinta.
 */
export function ConocenosContent({
  isLoggedIn = false,
}: {
  isLoggedIn?: boolean;
}) {
  return (
    <div className="nemi-about">
      <header className="nemi-about-hero">
        <div className="nemi-about-hero-media" aria-hidden />
        <div className="nemi-about-hero-panel">
          <p className="nemi-about-eyebrow">Sobre NEMI</p>
          <h1 className="nemi-about-title font-display">
            Orientación turística
            <span>y cultural.</span>
          </h1>
          <p className="nemi-about-lead">
            Ayudamos a entender un destino antes de llegar: costumbres, lugares
            reales y mapa — sin ruido ni promesas vacías.
          </p>
          <Link href="/#explorar" className="nemi-about-hero-link">
            Ir a explorar →
          </Link>
        </div>
      </header>

      <section className="nemi-about-story">
        <RevealOnScroll className="nemi-container nemi-about-story-grid">
          <div>
            <h2 className="font-display">Qué hacemos</h2>
            <p>
              NEMI no es una agencia ni un listado genérico. Es una guía para
              llegar con contexto: qué costumbres importan, dónde comer o
              hospedarte, y cómo ubicarte.
            </p>
          </div>
          <aside className="nemi-about-story-aside">
            <p className="font-display">
              “Conoce el lugar antes de vivirlo.”
            </p>
            <span>La idea detrás de cada destino</span>
          </aside>
        </RevealOnScroll>
      </section>

      <section className="nemi-about-how" aria-labelledby="about-how">
        <div className="nemi-container">
          <RevealOnScroll className="nemi-about-how-head">
            <h2 id="about-how" className="font-display">
              Cómo funciona
            </h2>
            <p>Un recorrido corto, de punta a punta.</p>
          </RevealOnScroll>

          <ol className="nemi-about-how-list">
            {STEPS.map((step, index) => (
              <li key={step.title} className="nemi-about-how-item">
                <RevealOnScroll delayMs={index * 60}>
                  <span className="nemi-about-how-num" aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </RevealOnScroll>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="nemi-about-modules" aria-labelledby="about-modules">
        <div className="nemi-container">
          <RevealOnScroll className="nemi-about-modules-head">
            <div>
              <h2 id="about-modules" className="font-display">
                En cada destino
              </h2>
              <p>
                Pasa el cursor sobre un módulo para ver qué incluye dentro del
                hub.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delayMs={50}>
            <AboutDestinationModules />
          </RevealOnScroll>
        </div>
      </section>

      <section className="nemi-about-scope" aria-label="Alcance de NEMI">
        <RevealOnScroll className="nemi-container nemi-about-scope-grid">
          <article>
            <h3>Somos</h3>
            <p>Guía cultural, directorio de viaje y mapa de referencia.</p>
          </article>
          <article>
            <h3>No somos</h3>
            <p>
              Agencia, reservas con pago ni servicio de emergencia oficial.
            </p>
          </article>
          <article>
            <h3>Hoy</h3>
            <p>San Luis Río Colorado — más destinos en camino.</p>
          </article>
        </RevealOnScroll>
      </section>

      <footer className="nemi-about-footer">
        <RevealOnScroll className="nemi-container nemi-about-footer-row">
          <div>
            <p className="nemi-about-eyebrow">Siguiente paso</p>
            <h2 className="font-display">Empieza por el mapa.</h2>
          </div>
          <div className="nemi-about-footer-actions">
            <Link href="/#explorar" className="nemi-btn nemi-btn-primary">
              Explorar destinos
            </Link>
            <Link
              href={isLoggedIn ? "/cuenta" : "/registro"}
              className="nemi-btn nemi-btn-ghost"
            >
              {isLoggedIn ? "Mi cuenta" : "Crear cuenta"}
            </Link>
          </div>
        </RevealOnScroll>
      </footer>
    </div>
  );
}
