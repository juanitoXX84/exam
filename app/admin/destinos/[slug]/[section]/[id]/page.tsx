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
import {
  getEstablishmentById,
  listCatalogCategories,
} from "@/services/establishment.service";
import { getCulturalGuideById } from "@/services/cultural.service";
import { getEmergencyById } from "@/services/emergency.service";

type Props = {
  params: Promise<{ slug: string; section: string; id: string }>;
};

function getSectionMeta(sectionKey: string) {
  return ADMIN_DESTINATION_SECTIONS.find((item) => item.key === sectionKey);
}

export async function generateMetadata({ params }: Props) {
  const { section } = await params;
  const meta = getSectionMeta(section);
  return { title: meta ? `Editar · ${meta.label}` : "Editar" };
}

export default async function AdminSectionEditPage({ params }: Props) {
  const { slug, section, id } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const meta = getSectionMeta(section);
  if (!meta) notFound();

  const establishmentSection = getEstablishmentSection(section);

  if (establishmentSection) {
    const establishment = await getEstablishmentById(id);
    if (!establishment || establishment.destinationId !== destination.id) {
      notFound();
    }

    const categories = await listCatalogCategories();

    return (
      <EditShell
        backHref={`/admin/destinos/${destination.slug}/${section}`}
        kicker={destination.name}
        title={`Editar · ${establishment.name}`}
      >
        <EstablishmentForm
          destinationId={destination.id}
          destinationSlug={destination.slug}
          sectionKey={section}
          allowedTypes={establishmentSection.types}
          categories={categories}
          establishment={establishment}
        />
      </EditShell>
    );
  }

  if (section === "cultura") {
    const guide = await getCulturalGuideById(id);
    if (!guide || guide.destinationId !== destination.id) notFound();

    return (
      <EditShell
        backHref={`/admin/destinos/${destination.slug}/cultura`}
        kicker={destination.name}
        title={`Editar · ${guide.title}`}
      >
        <CulturalGuideForm
          destinationId={destination.id}
          destinationSlug={destination.slug}
          guide={guide}
        />
      </EditShell>
    );
  }

  if (section === "emergencias") {
    const emergency = await getEmergencyById(id);
    if (!emergency || emergency.destinationId !== destination.id) notFound();

    return (
      <EditShell
        backHref={`/admin/destinos/${destination.slug}/emergencias`}
        kicker={destination.name}
        title={`Editar · ${emergency.name}`}
      >
        <EmergencyForm
          destinationId={destination.id}
          destinationSlug={destination.slug}
          emergency={emergency}
        />
      </EditShell>
    );
  }

  notFound();
}

function EditShell({
  backHref,
  kicker,
  title,
  children,
}: {
  backHref: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Link href={backHref} className="nemi-back-link text-sm">
        ← Volver al listado
      </Link>
      <div className="nemi-admin-header !mb-4 mt-6">
        <p className="nemi-admin-kicker">{kicker}</p>
        <h2 className="nemi-admin-title !text-2xl">{title}</h2>
      </div>
      <div className="nemi-admin-panel">{children}</div>
    </div>
  );
}
