"use client";

import { useState } from "react";
import type { PlaceCoverImage } from "@/lib/establishments/cover-image";

type Props = {
  cover: PlaceCoverImage;
  className?: string;
  loading?: "lazy" | "eager";
};

export function PlaceCoverImage({ cover, className, loading = "lazy" }: Props) {
  const [src, setSrc] = useState(cover.src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={cover.alt}
      className={className}
      loading={loading}
      onError={() => {
        if (src !== cover.fallbackSrc) {
          setSrc(cover.fallbackSrc);
        }
      }}
    />
  );
}
