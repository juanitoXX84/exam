"use client";

import Link from "next/link";
import { RoleName } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { IconChevronDown } from "@/components/nemi/me-icons";

type Props = {
  name: string;
  image: string | null;
  initial: string;
  isAdmin?: boolean;
};

export function ProfileMenu({ name, image, initial, isAdmin = false }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="nemi-profile-menu" ref={rootRef}>
      <button
        type="button"
        className={`nemi-profile-menu-trigger${open ? " is-open" : ""}`}
        aria-label={`Menú de ${name || "cuenta"}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="nemi-profile-menu-avatar">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" />
          ) : (
            <span>{initial}</span>
          )}
        </span>
        <IconChevronDown className="nemi-profile-menu-chevron" />
      </button>

      {open ? (
        <div className="nemi-profile-menu-panel" role="menu">
          <Link
            href="/cuenta"
            role="menuitem"
            className="nemi-profile-menu-item"
            onClick={() => setOpen(false)}
          >
            Mi cuenta
          </Link>
          <Link
            href="/cuenta/editar-perfil"
            role="menuitem"
            className="nemi-profile-menu-item"
            onClick={() => setOpen(false)}
          >
            Editar perfil
          </Link>
          {isAdmin ? (
            <>
              <Link
                href="/admin"
                role="menuitem"
                className="nemi-profile-menu-item"
                onClick={() => setOpen(false)}
              >
                Panel admin
              </Link>
              <Link
                href="/admin/reportes"
                role="menuitem"
                className="nemi-profile-menu-item"
                onClick={() => setOpen(false)}
              >
                Reportes
              </Link>
            </>
          ) : null}
          <form action={logoutAction}>
            <button
              type="submit"
              role="menuitem"
              className="nemi-profile-menu-item is-danger"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
