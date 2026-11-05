"use client";

import { useState, type ReactNode } from "react";

type TabId = "info" | "reviews" | "arrive";

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "info", label: "Información" },
  { id: "reviews", label: "Reseñas" },
  { id: "arrive", label: "Cómo llegar" },
];

type Props = {
  info: ReactNode;
  reviews: ReactNode;
  arrive: ReactNode;
  sidebar: ReactNode;
};

export function PlaceDetailTabs({ info, reviews, arrive, sidebar }: Props) {
  const [tab, setTab] = useState<TabId>("info");

  return (
    <div className="nemi-place-detail-body">
      <div className="nemi-place-tabs" role="tablist" aria-label="Secciones del lugar">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`nemi-place-tab${tab === item.id ? " is-active" : ""}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="nemi-place-detail-grid">
        <div className="nemi-place-detail-main" role="tabpanel">
          {tab === "info" ? info : null}
          {tab === "reviews" ? reviews : null}
          {tab === "arrive" ? arrive : null}
        </div>
        <aside className="nemi-place-detail-aside">{sidebar}</aside>
      </div>
    </div>
  );
}
