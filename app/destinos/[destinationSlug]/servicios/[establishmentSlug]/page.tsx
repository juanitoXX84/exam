import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceDetailView } from "@/components/establishments/place-detail-view";
import { ESTABLISHMENT_TYPE_LABELS } from "@/lib/establishments/labels";
import { auth } from "@/lib/auth/auth";
import { getPublishedDestinationBySlug } from "@/services/destination.service";
import { getActiveEstablishment } from "@/services/establishment.service";
import { isFavorite } from "@/services/favorite.service";
import { listVisibleReviews } from "@/services/review.service";
import { isServiceEstablishmentType } from "@/services/services.service";

type Props = {
  params: Promise<{ destinationSlug: string; establishmentSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destinationSlug, establishmentSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);
  if (!destination) return { title: "Servicio" };

  const service = await getActiveEstablishment(
    destination.id,
    establishmentSlug,
  );

  return { title: service ? service.name : "Servicio" };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { destinationSlug, establishmentSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);

  if (!destination) {
    notFound();
  }

  const service = await getActiveEstablishment(
    destination.id,
    establishmentSlug,
  );

  if (!service || !isServiceEstablishmentType(service.type)) {
    notFound();
  }

  const session = await auth();
  const [favorited, reviews] = await Promise.all([
    session?.user?.id
      ? isFavorite(session.user.id, service.id)
      : Promise.resolve(false),
    listVisibleReviews(service.id),
  ]);

  return (
    <PlaceDetailView
      backHref={`/destinos/${destination.slug}/servicios`}
      destinationSlug={destination.slug}
      place={service}
      categories={[ESTABLISHMENT_TYPE_LABELS[service.type]]}
      reviews={reviews}
      favorited={favorited}
      isLoggedIn={!!session?.user}
      currentUserId={session?.user?.id}
    />
  );
}
