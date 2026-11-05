"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  IconCulture,
  IconMap,
  IconServices,
} from "@/components/destination/module-icons";

const TABS: Array<{
  id: "resumen" | "cultura" | "explorar-lugares" | "mapa";
  label: string;
  icon: ReactNode;
}> = [
  {
    id: "resumen",
    label: "Resumen",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden>
        <path
          d="M4 6.5h16M4 12h10M4 17.5h14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "cultura",
    label: "Cultura",
    icon: <IconCulture className="size-4" />,
  },
  {
    id: "explorar-lugares",
    label: "Lugares",
    icon: <IconServices className="size-4" />,
  },
  {
    id: "mapa",
    label: "Mapa",
    icon: <IconMap className="size-4" />,
  },
];

type TabId = (typeof TABS)[number]["id"];

/**
 * Nav tipo mockup: tabs con underline activo.
 */
export function DestinationSectionNav() {
  const [active, setActive] = useState<TabId>("resumen");

  useEffect(() => {
    const sections = TABS.map((t) => document.getElementById(t.id)).filter(
      Boolean,
    ) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = visible[0]?.target.id as TabId | undefined;
        if (id) setActive(id);
      },
      {
        rootMargin: "-18% 0px -55% 0px",
        threshold: [0.1, 0.35, 0.6],
      },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function goTo(id: TabId) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="nemi-dest-nav" aria-label="Secciones del destino">
      <div className="nemi-container">
        <div className="nemi-dest-nav-track">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`nemi-dest-nav-tab${active === tab.id ? " is-active" : ""}`}
              onClick={() => goTo(tab.id)}
              aria-current={active === tab.id ? "true" : undefined}
            >
              <span className="nemi-dest-nav-tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
