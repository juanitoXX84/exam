import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EstablishmentType } from "@prisma/client";
import { PlaceDetailView } from "@/components/establishments/place-detail-view";
import { auth } from "@/lib/auth/auth";
import { getPublishedDestinationBySlug } from "@/services/destination.service";
import { getActiveEstablishment } from "@/services/establishment.service";
import { isFavorite } from "@/services/favorite.service";
import { listVisibleReviews } from "@/services/review.service";

type Props = {
  params: Promise<{ destinationSlug: string; establishmentSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destinationSlug, establishmentSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);
  if (!destination) return { title: "Lugar turístico" };
  const place = await getActiveEstablishment(
    destination.id,
    establishmentSlug,
    EstablishmentType.ATTRACTION,
  );
  return { title: place ? place.name : "Lugar turístico" };
}

export default async function TourismDetailPage({ params }: Props) {
  const { destinationSlug, establishmentSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);
  if (!destination) notFound();

  const place = await getActiveEstablishment(
    destination.id,
    establishmentSlug,
    EstablishmentType.ATTRACTION,
  );
  if (!place) notFound();

  const session = await auth();
  const categories = place.categories.map((item) => item.category.name);
  const categorySlugs = place.categories.map((item) => item.category.slug);
  const [favorited, reviews] = await Promise.all([
    session?.user?.id
      ? isFavorite(session.user.id, place.id)
      : Promise.resolve(false),
    listVisibleReviews(place.id),
  ]);

  return (
    <PlaceDetailView
      backHref={`/destinos/${destination.slug}/turismo`}
      destinationSlug={destination.slug}
      place={place}
      categories={categories}
      categorySlugs={categorySlugs}
      reviews={reviews}
      favorited={favorited}
      isLoggedIn={!!session?.user}
      currentUserId={session?.user?.id}
    />
  );
}
