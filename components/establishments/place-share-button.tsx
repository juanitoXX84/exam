"use client";

import { useState } from "react";

export function PlaceShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      // usuario canceló o falló; intentamos copiar
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // sin clipboard
    }
  }

  return (
    <button type="button" onClick={share} className="nemi-btn nemi-btn-ghost">
      {copied ? "Enlace copiado" : "Compartir"}
    </button>
  );
}
