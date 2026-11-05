import Link from "next/link";
import { DestinationStatus } from "@prisma/client";
import { listDestinationsForAdmin } from "@/services/destination.service";

export const metadata = { title: "Destinos · Admin" };

const STATUS_LABELS: Record<DestinationStatus, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
};

export default async function AdminDestinationsPage() {
  const destinations = await listDestinationsForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 nemi-admin-header !mb-4">
        <div>
          <p className="nemi-admin-kicker">Contenido</p>
          <h2 className="nemi-admin-title !text-2xl">Destinos</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Cada destino agrupa sus secciones: restaurantes, hospedaje, cultura, etc.
          </p>
        </div>
        <Link href="/admin/destinos/nuevo" className="nemi-btn nemi-btn-primary">
          + Nuevo destino
        </Link>
      </div>

      <div className="nemi-admin-grid nemi-admin-grid--2">
        {destinations.map((destination) => (
          <Link
            key={destination.id}
            href={`/admin/destinos/${destination.slug}`}
            className="nemi-admin-card"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="nemi-admin-card-title">{destination.name}</p>
              <span className="nemi-admin-badge is-active">
                {STATUS_LABELS[destination.status]}
              </span>
            </div>
            <p className="nemi-admin-card-desc">
              {destination.region ? `${destination.region}, ` : ""}
              {destination.country}
            </p>
            <p className="nemi-admin-card-meta">
              {destination._count.establishments} lugares ·{" "}
              {destination._count.culturalGuides} guías ·{" "}
              {destination._count.emergencyServices} emergencias
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
