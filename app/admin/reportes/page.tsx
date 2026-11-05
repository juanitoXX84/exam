import Link from "next/link";
import {
  dismissReportAction,
  markReportReviewingAction,
  resolveReportAction,
} from "@/app/actions/report";
import { REPORT_REASON_LABELS, REPORT_STATUS_LABELS } from "@/lib/reports/labels";
import { establishmentPublicPath } from "@/lib/establishments/paths";
import { formatRelativeTimeEs } from "@/lib/nemi/relative-time";
import { listReportsForAdmin } from "@/services/report.service";

export const metadata = { title: "Reportes · Admin" };

export default async function AdminReportsPage() {
  const reports = await listReportsForAdmin();

  return (
    <div>
      <div className="nemi-admin-header !mb-4">
        <p className="nemi-admin-kicker">Moderación</p>
        <h2 className="nemi-admin-title !text-2xl">Reportes</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Información incorrecta reportada por usuarios.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="nemi-admin-panel">
          <p className="font-medium">No hay reportes</p>
        </div>
      ) : (
        <div className="nemi-admin-list">
          {reports.map((report) => {
            const place = report.establishment;
            const href = place
              ? establishmentPublicPath(
                  place.destination.slug,
                  place.type,
                  place.slug,
                )
              : null;

            return (
              <article key={report.id} className="nemi-admin-list-item !block">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    {href && place ? (
                      <Link href={href} className="nemi-admin-list-title hover:underline">
                        {place.name}
                      </Link>
                    ) : (
                      <p className="nemi-admin-list-title">Establecimiento</p>
                    )}
                    <p className="nemi-admin-list-meta">
                      {REPORT_REASON_LABELS[report.reason]}
                    </p>
                  </div>
                  <span className="nemi-admin-badge">
                    {REPORT_STATUS_LABELS[report.status]}
                  </span>
                </div>

                {report.description ? (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {report.description}
                  </p>
                ) : null}

                <p className="mt-2 text-xs text-[var(--muted)]">
                  {report.reporter.name ?? report.reporter.email} ·{" "}
                  {formatRelativeTimeEs(report.createdAt)}
                </p>

                {report.status === "OPEN" || report.status === "IN_REVIEW" ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {report.status === "OPEN" ? (
                      <form action={markReportReviewingAction}>
                        <input type="hidden" name="reportId" value={report.id} />
                        <button type="submit" className="nemi-btn nemi-btn-glass !py-1.5 text-xs">
                          En revisión
                        </button>
                      </form>
                    ) : null}
                    <form action={resolveReportAction}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <button type="submit" className="nemi-btn nemi-btn-glass !py-1.5 text-xs">
                        Resolver y verificar
                      </button>
                    </form>
                    <form action={dismissReportAction}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <button
                        type="submit"
                        className="nemi-btn nemi-btn-glass nemi-admin-btn-danger !py-1.5 text-xs"
                      >
                        Descartar
                      </button>
                    </form>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
