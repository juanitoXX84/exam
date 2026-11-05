"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import {
  createEstablishmentReportAction,
  type ReportActionState,
} from "@/app/actions/report";
import {
  ESTABLISHMENT_REPORT_REASONS,
  REPORT_REASON_LABELS,
} from "@/lib/reports/labels";

const initialState: ReportActionState = {};

type Props = {
  establishmentId: string;
  isLoggedIn: boolean;
};

export function ReportContentForm({ establishmentId, isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createEstablishmentReportAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  return (
    <div className="nemi-place-panel nemi-report-card space-y-4">
      <div className="flex items-start gap-3">
        <span className="nemi-report-card-icon" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 8v5m0 3h.01M10.29 3.86 2.82 17.5A2 2 0 0 0 4.53 20h14.94a2 2 0 0 0 1.71-2.5L13.71 3.86a2 2 0 0 0-3.42 0Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="min-w-0">
          <h2 className="font-medium text-[var(--foreground)]">
            ¿Algo no cuadra?
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
            Si ves datos desactualizados o incorrectos, avísanos para revisar la
            ficha.
          </p>
        </div>
      </div>

      {!isLoggedIn ? (
        <Link href="/iniciar-sesion" className="nemi-report-card-btn">
          Inicia sesión para reportar
        </Link>
      ) : !open ? (
        <button
          type="button"
          className="nemi-report-card-btn"
          onClick={() => setOpen(true)}
        >
          Reportar información incorrecta
        </button>
      ) : (
        <form action={formAction} className="nemi-report-card-form space-y-3">
          <input type="hidden" name="establishmentId" value={establishmentId} />
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-[var(--muted)]">Motivo</span>
            <select name="reason" required className="nemi-input">
              {ESTABLISHMENT_REPORT_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {REPORT_REASON_LABELS[reason]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-[var(--muted)]">Detalle (opcional)</span>
            <textarea
              name="description"
              rows={3}
              maxLength={500}
              className="nemi-input min-h-20 resize-y"
              placeholder="Cuéntanos qué está mal…"
            />
          </label>
          {state.error ? (
            <p className="text-sm text-[var(--danger)]">{state.error}</p>
          ) : null}
          {state.success ? (
            <p className="text-sm text-[var(--accent)]">
              Gracias. Revisaremos el reporte.
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={pending}
              className="nemi-report-card-btn"
            >
              {pending ? "Enviando…" : "Enviar reporte"}
            </button>
            <button
              type="button"
              className="nemi-me-action text-xs"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
