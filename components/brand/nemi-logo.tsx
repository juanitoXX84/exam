"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  /** Tamaño del isotipo en px (el texto escala con él). */
  size?: number;
  /** Mostrar wordmark NEMI junto al símbolo. */
  showText?: boolean;
  /** Animación de entrada (círculo → aguja → texto). */
  animated?: boolean;
  className?: string;
  /** Si se pasa href, envuelve en Link. */
  href?: string;
};

/**
 * Logo oficial NEMI — brújula geométrica + wordmark.
 * Completo: showText={true}. Isotipo: showText={false}.
 */
export function NemiLogo({
  size = 28,
  showText = true,
  animated = true,
  className = "",
  href,
}: Props) {
  const [enterDone, setEnterDone] = useState(!animated);
  const textSize = Math.max(14, Math.round(size * 0.62));
  const gap = Math.max(8, Math.round(size * 0.32));

  useEffect(() => {
    if (!animated) {
      setEnterDone(true);
      return;
    }
    setEnterDone(false);
    const timer = window.setTimeout(() => setEnterDone(true), 1300);
    return () => window.clearTimeout(timer);
  }, [animated]);

  const content = (
    <span
      className={`nemi-logo ${animated && !enterDone ? "nemi-logo--animated" : ""} ${className}`.trim()}
      style={{ gap }}
    >
      <svg
        className="nemi-logo-mark"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={showText ? true : undefined}
        role={showText ? undefined : "img"}
        aria-label={showText ? undefined : "NEMI"}
      >
        <circle
          className="nemi-logo-ring"
          cx="24"
          cy="24"
          r="20"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />

        <g
          className="nemi-logo-ticks"
          stroke="currentColor"
          strokeLinecap="round"
        >
          <path d="M24 5.2 V9.8" strokeWidth="1.55" />
          <path d="M24 38.2 V42.8" strokeWidth="1.15" opacity="0.5" />
          <path d="M5.2 24 H9.8" strokeWidth="1.15" opacity="0.5" />
          <path d="M38.2 24 H42.8" strokeWidth="1.15" opacity="0.5" />
        </g>

        <circle
          className="nemi-logo-north"
          cx="24"
          cy="5.2"
          r="1.4"
          fill="var(--accent)"
        />

        {/*
          Aguja geométrica con lectura sutil de “N”:
          tip norte teal + cuerpo claro + diagonal fina.
        */}
        <g className="nemi-logo-needle">
          <path
            d="M19.5 29.5 L28.5 18.5"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
            opacity="0.32"
          />
          <path
            d="M24 40.2 L19.4 25.4 L24 27.2 L28.6 25.4 Z"
            fill="currentColor"
            opacity="0.4"
          />
          <path
            d="M24 7.5 L28.8 24.2 L24 22.2 L19.2 24.2 Z"
            fill="currentColor"
            opacity="0.92"
          />
          <path
            d="M24 7.5 L26.6 17.8 L24 16.6 L22.6 18.2 Z"
            fill="var(--accent)"
          />
          <circle cx="24" cy="24" r="2.15" fill="currentColor" />
          <circle cx="24" cy="24" r="1.05" fill="var(--accent)" />
        </g>
      </svg>

      {showText ? (
        <span
          className="nemi-logo-wordmark"
          style={{ fontSize: textSize }}
        >
          NEMI
        </span>
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="nemi-logo-link inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
