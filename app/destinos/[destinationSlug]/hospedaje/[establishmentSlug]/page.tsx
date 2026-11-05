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
  if (!destination) return { title: "Hospedaje" };

  const lodging = await getActiveEstablishment(
    destination.id,
    establishmentSlug,
    EstablishmentType.LODGING,
  );

  return { title: lodging ? lodging.name : "Hospedaje" };
}

export default async function LodgingDetailPage({ params }: Props) {
  const { destinationSlug, establishmentSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);
  if (!destination) notFound();

  const lodging = await getActiveEstablishment(
    destination.id,
    establishmentSlug,
    EstablishmentType.LODGING,
  );
  if (!lodging) notFound();

  const session = await auth();
  const categories = lodging.categories.map((item) => item.category.name);
  const categorySlugs = lodging.categories.map((item) => item.category.slug);
  const [favorited, reviews] = await Promise.all([
    session?.user?.id
      ? isFavorite(session.user.id, lodging.id)
      : Promise.resolve(false),
    listVisibleReviews(lodging.id),
  ]);

  return (
    <PlaceDetailView
      backHref={`/destinos/${destination.slug}/hospedaje`}
      destinationSlug={destination.slug}
      place={lodging}
      categories={categories}
      categorySlugs={categorySlugs}
      reviews={reviews}
      favorited={favorited}
      isLoggedIn={!!session?.user}
      currentUserId={session?.user?.id}
    />
  );
}
