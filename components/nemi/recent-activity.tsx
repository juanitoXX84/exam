"use client";

import Link from "next/link";
import { IconCompass, IconHeart, IconStar, IconTrash } from "@/components/nemi/me-icons";
import { formatRelativeTimeEs } from "@/lib/nemi/relative-time";
import type { NemiActivity } from "@/lib/nemi/activity";

const PREVIEW = 4;

type Props = {
  items: NemiActivity[];
};

export function RecentActivity({ items }: Props) {
  const visible = items.slice(0, PREVIEW);

  if (items.length === 0) {
    return (
      <section id="actividad" className="nemi-me-block">
        <div className="nemi-me-block-head">
          <div>
            <p className="nemi-me-section-eyebrow">Actividad</p>
            <h2 className="nemi-me-h2 font-display">Actividad reciente</h2>
            <p className="nemi-me-lead">Un registro de lo que haces en NEMI.</p>
          </div>
        </div>
        <div className="nemi-me-empty">
          <span className="nemi-me-empty-icon" aria-hidden>
            <IconCompass />
          </span>
          <p className="nemi-me-empty-title">Sin actividad todavía.</p>
          <p className="nemi-me-empty-copy">
            Cuando guardes lugares, los quites de favoritos, publiques o elimines reseñas, lo verás aquí.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="actividad" className="nemi-me-block">
      <div className="nemi-me-block-head">
        <div>
          <p className="nemi-me-section-eyebrow">Actividad</p>
          <h2 className="nemi-me-h2 font-display">Actividad reciente</h2>
          <p className="nemi-me-lead">Un registro de lo que haces en NEMI.</p>
        </div>
        {items.length > 0 ? (
          <Link href="/cuenta/actividad" className="nemi-me-more">
            Ver todos
          </Link>
        ) : null}
      </div>
      <ul className="nemi-me-activity">
        {visible.map((item) => (
          <li key={item.id}>
            <span className={`nemi-me-activity-icon kind-${item.kind}`} aria-hidden>
              {item.kind === "saved" ? (
                <IconHeart />
              ) : item.kind === "unsaved" ? (
                <IconHeart />
              ) : item.kind === "review_deleted" ? (
                <IconTrash />
              ) : (
                <IconStar />
              )}
            </span>
            <div>
              <Link href={item.href} className="nemi-me-activity-text">
                {item.text}
              </Link>
              <p className="nemi-me-meta">{formatRelativeTimeEs(item.at)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
