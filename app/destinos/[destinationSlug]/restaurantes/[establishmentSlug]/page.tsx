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
  if (!destination) return { title: "Restaurante" };

  const restaurant = await getActiveEstablishment(
    destination.id,
    establishmentSlug,
    EstablishmentType.RESTAURANT,
  );

  return { title: restaurant ? restaurant.name : "Restaurante" };
}

export default async function RestaurantDetailPage({ params }: Props) {
  const { destinationSlug, establishmentSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);
  if (!destination) notFound();

  const restaurant = await getActiveEstablishment(
    destination.id,
    establishmentSlug,
    EstablishmentType.RESTAURANT,
  );
  if (!restaurant) notFound();

  const session = await auth();
  const categories = restaurant.categories.map((item) => item.category.name);
  const categorySlugs = restaurant.categories.map((item) => item.category.slug);
  const [favorited, reviews] = await Promise.all([
    session?.user?.id
      ? isFavorite(session.user.id, restaurant.id)
      : Promise.resolve(false),
    listVisibleReviews(restaurant.id),
  ]);

  return (
    <PlaceDetailView
      backHref={`/destinos/${destination.slug}/restaurantes`}
      destinationSlug={destination.slug}
      place={restaurant}
      categories={categories}
      categorySlugs={categorySlugs}
      reviews={reviews}
      favorited={favorited}
      isLoggedIn={!!session?.user}
      currentUserId={session?.user?.id}
    />
  );
}
