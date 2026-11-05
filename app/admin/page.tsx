import { getAdminDashboardStats } from "@/services/admin-stats.service";
import Link from "next/link";

export default async function AdminHomePage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="space-y-6">
      <div className="nemi-admin-grid nemi-admin-grid--3">
        <Link href="/admin/reportes" className="nemi-admin-card">
          <p className="nemi-admin-card-title">Reportes</p>
          <p className="nemi-admin-card-desc">
            Información incorrecta reportada por usuarios.
          </p>
          <p className="nemi-admin-card-meta">
            {stats.openReports} abiertos · {stats.totalReports} total
          </p>
        </Link>

        <Link href="/admin/resenas" className="nemi-admin-card">
          <p className="nemi-admin-card-title">Reseñas</p>
          <p className="nemi-admin-card-desc">
            Ver y eliminar reseñas de establecimientos.
          </p>
          <p className="nemi-admin-card-meta">{stats.totalReviews} reseñas</p>
        </Link>

        <Link href="/admin/destinos" className="nemi-admin-card">
          <p className="nemi-admin-card-title">Destinos</p>
          <p className="nemi-admin-card-desc">
            Países y ciudades: editar secciones y agregar contenido.
          </p>
          <p className="nemi-admin-card-meta">
            {stats.totalDestinations} destino
            {stats.totalDestinations === 1 ? "" : "s"}
          </p>
        </Link>
      </div>

      <section className="nemi-admin-panel">
        <h2 className="font-medium">Acceso rápido</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Desde <Link href="/admin/destinos" className="text-[var(--accent)]">Destinos</Link> puedes
          editar restaurantes, hospedaje, turismo, servicios, cultura y emergencias
          de cada lugar.
        </p>
      </section>
    </div>
  );
}
