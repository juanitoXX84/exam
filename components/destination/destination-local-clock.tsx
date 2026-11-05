"use client";

import { useEffect, useState } from "react";

type Props = {
  timezone: string;
};

/**
 * Hora local del destino, actualizada cada segundo.
 */
export function DestinationLocalClock({ timezone }: Props) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("es-MX", {
        timeZone: timezone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());

    setTime(format());
    const id = window.setInterval(() => setTime(format()), 1000);
    return () => window.clearInterval(id);
  }, [timezone]);

  if (!time) {
    return <span className="nemi-dest-hero-live-time">—</span>;
  }

  return <span className="nemi-dest-hero-live-time">{time}</span>;
}
