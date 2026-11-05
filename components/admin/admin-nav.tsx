"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Inicio", exact: true },
  { href: "/admin/reportes", label: "Reportes" },
  { href: "/admin/resenas", label: "Reseñas" },
  { href: "/admin/destinos", label: "Destinos" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="nemi-admin-nav" aria-label="Administración">
      {LINKS.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`nemi-admin-nav-link${active ? " is-active" : ""}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
