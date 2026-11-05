"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { NemiLogo } from "@/components/brand/nemi-logo";

type Props = {
  size?: number;
  showText?: boolean;
  animated?: boolean;
};

/**
 * Logo que siempre lleva al inicio visual de NEMI.
 * En home, si el mapa de explorar está abierto, lo cierra.
 */
export function HomeLogoLink({
  size = 30,
  showText = true,
  animated = true,
}: Props) {
  const pathname = usePathname();

  function goHome(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") return;

    event.preventDefault();
    window.dispatchEvent(new Event("nemi-home"));
    window.history.replaceState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Link
      href="/"
      onClick={goHome}
      className="nemi-logo-link inline-flex items-center"
      aria-label="NEMI — inicio"
    >
      <NemiLogo size={size} showText={showText} animated={animated} />
    </Link>
  );
}
