import Link from "next/link";
import { notFound } from "next/navigation";
import { EstablishmentForm } from "@/components/admin/establishment-form";
import { CulturalGuideForm } from "@/components/admin/cultural-guide-form";
import { EmergencyForm } from "@/components/admin/emergency-form";
import {
  getEstablishmentSection,
  ADMIN_DESTINATION_SECTIONS,
} from "@/lib/admin/sections";
import { getDestinationBySlug } from "@/services/destination.service";
import { listCatalogCategories } from "@/services/establishment.service";

type Props = {
  params: Promise<{ slug: string; section: string }>;
};

function getSectionMeta(sectionKey: string) {
  return ADMIN_DESTINATION_SECTIONS.find((item) => item.key === sectionKey);
}

export async function generateMetadata({ params }: Props) {
  const { section } = await params;
  const meta = getSectionMeta(section);
  return { title: meta ? `Nuevo · ${meta.label}` : "Nuevo" };
}

export default async function AdminSectionNewPage({ params }: Props) {
  const { slug, section } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const meta = getSectionMeta(section);
  if (!meta) notFound();

  const establishmentSection = getEstablishmentSection(section);
  const categories = establishmentSection
    ? await listCatalogCategories()
    : [];

  return (
    <div>
      <Link
        href={`/admin/destinos/${destination.slug}/${section}`}
        className="nemi-back-link text-sm"
      >
        ← {meta.label}
      </Link>

      <div className="nemi-admin-header !mb-4 mt-6">
        <p className="nemi-admin-kicker">{destination.name}</p>
        <h2 className="nemi-admin-title !text-2xl">Agregar · {meta.label}</h2>
      </div>

      <div className="nemi-admin-panel">
        {establishmentSection ? (
          <EstablishmentForm
            destinationId={destination.id}
            destinationSlug={destination.slug}
            sectionKey={section}
            allowedTypes={establishmentSection.types}
            categories={categories}
          />
        ) : section === "cultura" ? (
          <CulturalGuideForm
            destinationId={destination.id}
            destinationSlug={destination.slug}
          />
        ) : section === "emergencias" ? (
          <EmergencyForm
            destinationId={destination.id}
            destinationSlug={destination.slug}
          />
        ) : null}
      </div>
    </div>
  );
}
