import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getEstablishmentSection,
  ADMIN_DESTINATION_SECTIONS,
} from "@/lib/admin/sections";
import { ESTABLISHMENT_TYPE_LABELS } from "@/lib/establishments/labels";
import { CULTURAL_SIGNAL_LABELS } from "@/lib/cultural/labels";
import { getDestinationBySlug } from "@/services/destination.service";
import { listEstablishmentsForAdmin } from "@/services/establishment.service";
import { listCulturalGuidesForAdmin } from "@/services/cultural.service";
import { listEmergenciesForAdmin } from "@/services/emergency.service";

type Props = {
  params: Promise<{ slug: string; section: string }>;
};

function getSectionMeta(sectionKey: string) {
  return ADMIN_DESTINATION_SECTIONS.find((item) => item.key === sectionKey);
}

export async function generateMetadata({ params }: Props) {
  const { section } = await params;
  const meta = getSectionMeta(section);
  return { title: meta ? `${meta.label} · Admin` : "Sección" };
}

export default async function AdminSectionListPage({ params }: Props) {
  const { slug, section } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const meta = getSectionMeta(section);
  if (!meta) notFound();

  const establishmentSection = getEstablishmentSection(section);

  return (
    <div>
      <Link
        href={`/admin/destinos/${destination.slug}`}
        className="nemi-back-link text-sm"
      >
        ← {destination.name}
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4 nemi-admin-header !mb-4 mt-6">
        <div>
          <p className="nemi-admin-kicker">{destination.name}</p>
          <h2 className="nemi-admin-title !text-2xl">{meta.label}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{meta.description}</p>
        </div>
        <Link
          href={`/admin/destinos/${destination.slug}/${section}/nuevo`}
          className="nemi-btn nemi-btn-primary"
        >
          + Agregar
        </Link>
      </div>

      {establishmentSection ? (
        <EstablishmentList
          destinationId={destination.id}
          destinationSlug={destination.slug}
          sectionKey={section}
          types={establishmentSection.types}
        />
      ) : section === "cultura" ? (
        <CulturalList destinationId={destination.id} destinationSlug={destination.slug} />
      ) : section === "emergencias" ? (
        <EmergencyList destinationId={destination.id} destinationSlug={destination.slug} />
      ) : null}
    </div>
  );
}

async function EstablishmentList({
  destinationId,
  destinationSlug,
  sectionKey,
  types,
}: {
  destinationId: string;
  destinationSlug: string;
  sectionKey: string;
  types: import("@prisma/client").EstablishmentType[];
}) {
  const items = await listEstablishmentsForAdmin({ destinationId, types });

  if (items.length === 0) {
    return (
      <div className="nemi-admin-panel">
        <p className="font-medium">Sin elementos</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Agrega el primero con el botón de arriba.
        </p>
      </div>
    );
  }

  return (
    <div className="nemi-admin-list">
      {items.map((item) => (
        <article key={item.id} className="nemi-admin-list-item">
          <div>
            <Link
              href={`/admin/destinos/${destinationSlug}/${sectionKey}/${item.id}`}
              className="nemi-admin-list-title hover:underline"
            >
              {item.name}
            </Link>
            <p className="nemi-admin-list-meta">
              {ESTABLISHMENT_TYPE_LABELS[item.type]}
              {item.address ? ` · ${item.address}` : ""}
            </p>
            {!item.isActive ? (
              <span className="nemi-admin-badge is-danger mt-2">Inactivo</span>
            ) : null}
          </div>
          <Link
            href={`/admin/destinos/${destinationSlug}/${sectionKey}/${item.id}`}
            className="nemi-btn nemi-btn-glass !py-1.5 text-xs"
          >
            Editar
          </Link>
        </article>
      ))}
    </div>
  );
}

async function CulturalList({
  destinationId,
  destinationSlug,
}: {
  destinationId: string;
  destinationSlug: string;
}) {
  const items = await listCulturalGuidesForAdmin(destinationId);

  if (items.length === 0) {
    return (
      <div className="nemi-admin-panel">
        <p className="font-medium">Sin guías culturales</p>
      </div>
    );
  }

  return (
    <div className="nemi-admin-list">
      {items.map((item) => (
        <article key={item.id} className="nemi-admin-list-item">
          <div>
            <Link
              href={`/admin/destinos/${destinationSlug}/cultura/${item.id}`}
              className="nemi-admin-list-title hover:underline"
            >
              {item.title}
            </Link>
            <p className="nemi-admin-list-meta">
              {CULTURAL_SIGNAL_LABELS[item.signal].label}
              {item.isPublished ? " · Publicada" : " · Borrador"}
            </p>
          </div>
          <Link
            href={`/admin/destinos/${destinationSlug}/cultura/${item.id}`}
            className="nemi-btn nemi-btn-glass !py-1.5 text-xs"
          >
            Editar
          </Link>
        </article>
      ))}
    </div>
  );
}

async function EmergencyList({
  destinationId,
  destinationSlug,
}: {
  destinationId: string;
  destinationSlug: string;
}) {
  const items = await listEmergenciesForAdmin(destinationId);

  if (items.length === 0) {
    return (
      <div className="nemi-admin-panel">
        <p className="font-medium">Sin contactos de emergencia</p>
      </div>
    );
  }

  return (
    <div className="nemi-admin-list">
      {items.map((item) => (
        <article key={item.id} className="nemi-admin-list-item">
          <div>
            <Link
              href={`/admin/destinos/${destinationSlug}/emergencias/${item.id}`}
              className="nemi-admin-list-title hover:underline"
            >
              {item.name}
            </Link>
            <p className="nemi-admin-list-meta">
              {item.phone ?? "Sin teléfono"}
              {item.isOfficial ? " · Oficial" : ""}
            </p>
          </div>
          <Link
            href={`/admin/destinos/${destinationSlug}/emergencias/${item.id}`}
            className="nemi-btn nemi-btn-glass !py-1.5 text-xs"
          >
            Editar
          </Link>
        </article>
      ))}
    </div>
  );
}
