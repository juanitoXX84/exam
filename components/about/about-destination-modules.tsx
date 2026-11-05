"use client";

import { useState } from "react";

const MODULES = [
  {
    name: "Cultura",
    tagline: "Contexto antes de llegar",
    copy: "Guías sobre costumbres, normas locales y tradiciones para visitar con respeto y entender el lugar.",
    points: ["Normas y etiqueta local", "Historia y tradiciones", "Contenido editorial verificado"],
  },
  {
    name: "Restaurantes",
    tagline: "Dónde comer con criterio",
    copy: "Fichas con tipo de cocina, rango de precios, reseñas y formas de contacto directo.",
    points: ["Filtros por precio y cocina", "Reseñas de viajeros", "Teléfono y WhatsApp"],
  },
  {
    name: "Hospedaje",
    tagline: "Dónde quedarte",
    copy: "Opciones de alojamiento con descripción, ubicación y enlaces para comparar antes de reservar fuera.",
    points: ["Hoteles y otros alojamientos", "Ubicación en mapa", "Contacto del establecimiento"],
  },
  {
    name: "Turismo",
    tagline: "Qué visitar",
    copy: "Atracciones, miradores y puntos de interés para armar tu recorrido con información clara.",
    points: ["Lugares de interés", "Descripción y horarios cuando hay", "Enlace a Google Maps"],
  },
  {
    name: "Servicios",
    tagline: "Lo práctico del viaje",
    copy: "Farmacias, bancos, gasolineras y otros servicios útiles durante tu estancia.",
    points: ["Catálogo por tipo", "Datos de contacto", "Fuente citada en la ficha"],
  },
  {
    name: "Mapa",
    tagline: "Todo en un vistazo",
    copy: "Visualiza lugares por categoría, abre fichas o salta a Google Maps desde el mismo mapa.",
    points: ["Marcadores por categoría", "Búsqueda integrada", "Ver ficha desde el mapa"],
  },
  {
    name: "Emergencias",
    tagline: "Contactos importantes",
    copy: "Números oficiales y de apoyo con fuente citada. No sustituye al 911 ni servicios locales.",
    points: ["Fuentes oficiales destacadas", "Teléfonos y direcciones", "Separación oficial / otros"],
  },
] as const;

export function AboutDestinationModules() {
  const [active, setActive] = useState(0);
  const current = MODULES[active];

  return (
    <div className="nemi-about-dest-layout">
      <ul
        className="nemi-about-index-list"
        role="listbox"
        aria-label="Módulos del destino"
        aria-activedescendant={`about-module-${active}`}
      >
        {MODULES.map((item, index) => (
          <li
            key={item.name}
            id={`about-module-${index}`}
            role="option"
            aria-selected={active === index}
            className={active === index ? "is-active" : undefined}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            tabIndex={0}
          >
            <span className="nemi-about-index-num">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="nemi-about-index-name">{item.name}</span>
          </li>
        ))}
      </ul>

      <div className="nemi-about-dest-panel" aria-live="polite">
        <div key={current.name} className="nemi-about-dest-panel-inner">
          <p className="nemi-about-dest-panel-num">
            {String(active + 1).padStart(2, "0")}
          </p>
          <h3 className="nemi-about-dest-panel-title">{current.name}</h3>
          <p className="nemi-about-dest-panel-tagline">{current.tagline}</p>
          <p className="nemi-about-dest-panel-copy">{current.copy}</p>
          <ul className="nemi-about-dest-panel-points">
            {current.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
