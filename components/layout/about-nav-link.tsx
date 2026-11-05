"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AboutNavLink() {
  const pathname = usePathname();
  const active = pathname === "/conocenos";

  return (
    <Link
      href="/conocenos"
      className={`nemi-header-link${active ? " is-active" : ""}`}
      aria-current={active ? "page" : undefined}
    >
      Conócenos
    </Link>
  );
}
