"use client";

import {
  contactRequestMessage,
  telHref,
  whatsappHref,
} from "@/lib/contact/channels";

type Props = {
  establishmentName: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  className?: string;
};

export function ContactPanel({
  establishmentName,
  phone,
  email,
  website,
  className,
}: Props) {
  const callLink = phone ? telHref(phone) : null;
  const waLink = phone
    ? whatsappHref(phone, contactRequestMessage(establishmentName))
    : null;
  const hasDirect =
    !!callLink || !!waLink || !!email?.trim() || !!website?.trim();

  return (
    <div
      className={`nemi-place-panel space-y-4${className ? ` ${className}` : ""}`}
    >
      <div>
        <h2 className="font-medium">Contactar</h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Escribe al lugar directo. Verifica horarios y disponibilidad con el
          establecimiento.
        </p>
      </div>

      {hasDirect ? (
        <div className="flex flex-wrap gap-2">
          {callLink ? (
            <a href={callLink} className="nemi-btn nemi-btn-primary text-sm">
              Llamar
            </a>
          ) : null}
          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="nemi-btn nemi-btn-ghost text-sm"
            >
              WhatsApp
            </a>
          ) : null}
          {email?.trim() ? (
            <a
              href={`mailto:${email.trim()}?subject=${encodeURIComponent(`Consulta vía NEMI · ${establishmentName}`)}`}
              className="nemi-btn nemi-btn-ghost text-sm"
            >
              Correo
            </a>
          ) : null}
          {website?.trim() ? (
            <a
              href={website.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="nemi-btn nemi-btn-ghost text-sm"
            >
              Sitio web
            </a>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          Aún no hay teléfono, correo o sitio publicado en esta ficha.
        </p>
      )}
    </div>
  );
}
