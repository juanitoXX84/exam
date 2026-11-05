import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NearbyEmergencyList } from "@/components/geo/nearby-emergency-list";
import { getPublishedDestinationBySlug } from "@/services/destination.service";
import { listActiveEmergencies } from "@/services/emergency.service";

type Props = {
  params: Promise<{ destinationSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destinationSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);
  return {
    title: destination ? `Emergencias · ${destination.name}` : "Emergencias",
  };
}

export default async function EmergenciesPage({ params }: Props) {
  const { destinationSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);

  if (!destination) {
    notFound();
  }

  const emergencies = await listActiveEmergencies(destination.id);
  const official = emergencies.filter((item) => item.isOfficial);
  const other = emergencies.filter((item) => !item.isOfficial);

  return (
    <div className="nemi-container py-12 sm:py-16">
      <Link
        href={`/destinos/${destination.slug}`}
        className="nemi-back-link text-sm"
      >
        ← Volver a {destination.name}
      </Link>

      <p className="mt-6 text-xs tracking-[0.2em] text-[var(--muted)] uppercase">
        Seguridad
      </p>
      <h1 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">
        Emergencias
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
        Contactos clave. Se indica claramente si la fuente está marcada como
        oficial.
      </p>

      {emergencies.length === 0 ? (
        <div className="nemi-bento nemi-bento-glass mt-10 p-6">
          <p className="font-medium">Aún no hay contactos publicados</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            El administrador puede cargarlos desde el panel.
          </p>
        </div>
      ) : (
        <div className="mt-10">
          <NearbyEmergencyList official={official} other={other} />
        </div>
      )}
    </div>
  );
}
