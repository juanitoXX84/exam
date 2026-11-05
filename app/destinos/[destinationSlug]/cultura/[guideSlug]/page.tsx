import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CulturalNormBadge,
  CulturalSignalBadge,
  ImportanceLabel,
  VerificationBadge,
} from "@/components/cultural/badges";
import { getPublishedDestinationBySlug } from "@/services/destination.service";
import { getPublishedCulturalGuide } from "@/services/cultural.service";

type Props = {
  params: Promise<{ destinationSlug: string; guideSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destinationSlug, guideSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);
  if (!destination) return { title: "Guía cultural" };

  const guide = await getPublishedCulturalGuide(destination.id, guideSlug);
  return { title: guide ? guide.title : "Guía cultural" };
}

export default async function CulturalGuideDetailPage({ params }: Props) {
  const { destinationSlug, guideSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);

  if (!destination) {
    notFound();
  }

  const guide = await getPublishedCulturalGuide(destination.id, guideSlug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="nemi-container py-12 sm:py-16">
      <Link
        href={`/destinos/${destination.slug}/cultura`}
        className="nemi-back-link text-sm"
      >
        ← Volver a cultura
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <CulturalSignalBadge signal={guide.signal} />
        <CulturalNormBadge normKind={guide.normKind} />
      </div>

      <h1 className="font-display mt-4 max-w-3xl text-3xl tracking-tight sm:text-4xl">
        {guide.title}
      </h1>

      <div className="mt-4">
        <VerificationBadge
          status={guide.verificationStatus}
          updatedAt={guide.lastVerifiedAt ?? guide.updatedAt}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <article className="nemi-glass space-y-6 rounded-[1.1rem] p-6">
          {guide.summary ? (
            <p className="text-lg leading-relaxed text-[var(--foreground)]">
              {guide.summary}
            </p>
          ) : null}

          <section>
            <h2 className="text-sm tracking-[0.16em] text-[var(--muted)] uppercase">
              Descripción
            </h2>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed text-[var(--muted)]">
              {guide.description}
            </p>
          </section>

          {guide.context ? (
            <section>
              <h2 className="text-sm tracking-[0.16em] text-[var(--muted)] uppercase">
                Contexto
              </h2>
              <p className="mt-2 whitespace-pre-wrap leading-relaxed text-[var(--muted)]">
                {guide.context}
              </p>
            </section>
          ) : null}

          {guide.whatToDo ? (
            <section>
              <h2 className="text-sm tracking-[0.16em] text-[var(--muted)] uppercase">
                Qué hacer
              </h2>
              <p className="mt-2 whitespace-pre-wrap leading-relaxed text-[var(--muted)]">
                {guide.whatToDo}
              </p>
            </section>
          ) : null}

          {guide.whatToAvoid ? (
            <section>
              <h2 className="text-sm tracking-[0.16em] text-[var(--muted)] uppercase">
                Qué evitar
              </h2>
              <p className="mt-2 whitespace-pre-wrap leading-relaxed text-[var(--muted)]">
                {guide.whatToAvoid}
              </p>
            </section>
          ) : null}
        </article>

        <aside className="nemi-card h-fit space-y-4 p-5 text-sm">
          <div>
            <p className="text-[var(--muted)]">Importancia</p>
            <p className="mt-1">
              <ImportanceLabel importance={guide.importance} />
            </p>
          </div>
          <div className="border-t border-[var(--border)] pt-4">
            <p className="text-[var(--muted)]">Fuente</p>
            <p className="mt-1">{guide.source ?? "Sin fuente registrada"}</p>
          </div>
          <div className="border-t border-[var(--border)] pt-4">
            <p className="text-[var(--muted)]">Destino</p>
            <p className="mt-1">{destination.name}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
