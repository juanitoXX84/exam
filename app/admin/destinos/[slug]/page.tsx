import Link from "next/link";
import { notFound } from "next/navigation";
import { DestinationForm } from "@/components/admin/destination-form";
import { ADMIN_DESTINATION_SECTIONS } from "@/lib/admin/sections";
import {
  getDestinationAdminStats,
  getDestinationBySlug,
} from "@/services/destination.service";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  return { title: destination ? `${destination.name} · Admin` : "Destino" };
}

export default async function AdminDestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const stats = await getDestinationAdminStats(destination.id);
  const countByType = new Map(
    stats.establishments.map((item) => [item.type, item._count.type]),
  );

  return (
    <div>
      <Link href="/admin/destinos" className="nemi-back-link text-sm">
        ← Destinos
      </Link>

      <div className="nemi-admin-header !mb-4 mt-6">
        <p className="nemi-admin-kicker">{destination.country}</p>
        <h2 className="nemi-admin-title !text-2xl">{destination.name}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Edita la información del destino y administra cada sección.
        </p>
        <Link
          href={`/destinos/${destination.slug}`}
          className="mt-2 inline-block text-sm text-[var(--accent)] hover:underline"
        >
          Ver sitio público →
        </Link>
      </div>

      <div className="nemi-admin-panel">
        <h3 className="font-medium">Información del destino</h3>
        <div className="mt-4">
          <DestinationForm destination={destination} />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 font-medium">Secciones</h3>
        <div className="nemi-admin-grid nemi-admin-grid--2">
          {ADMIN_DESTINATION_SECTIONS.map((section) => {
            const href = `/admin/destinos/${destination.slug}/${section.key}`;
            let meta = "";

            if ("types" in section) {
              const total = section.types.reduce(
                (sum, type) => sum + (countByType.get(type) ?? 0),
                0,
              );
              meta = `${total} elemento${total === 1 ? "" : "s"}`;
            } else if (section.key === "cultura") {
              meta = `${stats.guides} guía${stats.guides === 1 ? "" : "s"}`;
            } else if (section.key === "emergencias") {
              meta = `${stats.emergencies} contacto${stats.emergencies === 1 ? "" : "s"}`;
            }

            return (
              <Link key={section.key} href={href} className="nemi-admin-card">
                <p className="nemi-admin-card-title">{section.label}</p>
                <p className="nemi-admin-card-desc">{section.description}</p>
                <p className="nemi-admin-card-meta">{meta}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
