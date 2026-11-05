"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";

/** Abre el modo explorar en home. */
export function ExploreNavLink() {
  const pathname = usePathname();
  const [exploring, setExploring] = useState(false);

  useEffect(() => {
    function syncExploreState() {
      setExploring(
        pathname === "/" &&
          (window.location.hash === "#explorar" ||
            document.querySelector(".nemi-explore--live") != null),
      );
    }

    syncExploreState();
    window.addEventListener("hashchange", syncExploreState);
    window.addEventListener("nemi-explore", syncExploreState);
    window.addEventListener("nemi-home", syncExploreState);
    return () => {
      window.removeEventListener("hashchange", syncExploreState);
      window.removeEventListener("nemi-explore", syncExploreState);
      window.removeEventListener("nemi-home", syncExploreState);
    };
  }, [pathname]);

  function openExplore(e: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") return;

    e.preventDefault();
    window.dispatchEvent(new Event("nemi-explore"));
    window.history.replaceState(null, "", "#explorar");
    document.getElementById("explorar")?.scrollIntoView({ behavior: "smooth" });
    setExploring(true);
  }

  return (
    <Link
      href="/#explorar"
      className={`nemi-header-link${exploring ? " is-active" : ""}`}
      onClick={openExplore}
      aria-current={exploring ? "page" : undefined}
    >
      Explorar
    </Link>
  );
}
