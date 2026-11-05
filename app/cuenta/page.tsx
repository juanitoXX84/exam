import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MeHeroScene } from "@/components/nemi/me-hero-scene";
import {
  IconCompass,
  IconHeart,
  IconStar,
} from "@/components/nemi/me-icons";
import { MyReviewActions } from "@/components/nemi/my-review-actions";
import { RecentActivity } from "@/components/nemi/recent-activity";
import { RecentDestinationsPanel } from "@/components/nemi/recent-destinations-panel";
import { SavedPlacesBoard } from "@/components/nemi/saved-places-board";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { PlaceCoverImage } from "@/components/establishments/place-cover-image";
import { resolvePlaceCoverImage } from "@/lib/establishments/cover-image";
import { establishmentPublicPath } from "@/lib/establishments/paths";
import { buildAccountActivity } from "@/lib/nemi/activity";
import { formatRelativeTimeEs } from "@/lib/nemi/relative-time";
import { listVisitedDestinationsForUser } from "@/lib/nemi/visited-destinations";
import type { NemiSavedPlace } from "@/lib/nemi/saved-place";
import { auth } from "@/lib/auth/auth";
import { listFavoritesForUser, listFavoriteRemovalsForUser } from "@/services/favorite.service";
import { listReviewsForUser, listReviewDeletionsForUser } from "@/services/review.service";

export const metadata: Metadata = {
  title: "Mi NEMI",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/iniciar-sesion");

  const [favorites, favoriteRemovals, reviews, reviewDeletions, visitedDestinations] =
    await Promise.all([
      listFavoritesForUser(session.user.id),
      listFavoriteRemovalsForUser(session.user.id),
      listReviewsForUser(session.user.id),
      listReviewDeletionsForUser(session.user.id),
      listVisitedDestinationsForUser(session.user.id),
    ]);

  const accountName = session.user.name?.trim() || "";
  const displayName =
    accountName && accountName !== "Turista NEMI" ? accountName : "viajero";

  const savedPlaces: NemiSavedPlace[] = favorites.map((favorite) => {
    const item = favorite.establishment;
    return {
      favoriteId: favorite.id,
      establishmentId: item.id,
      name: item.name,
      type: item.type,
      slug: item.slug,
      priceRange: item.priceRange,
      averageRating: item.averageRating,
      reviewCount: item.reviewCount,
      images: item.images,
      categorySlugs: item.categories.map((entry) => entry.category.slug),
      categoryNames: item.categories.map((entry) => entry.category.name),
      destinationName: item.destination.name,
      destinationSlug: item.destination.slug,
      destinationRegion: item.destination.region ?? "",
      country: item.destination.country ?? "",
    };
  });

  const activity = buildAccountActivity({
    favorites,
    favoriteRemovals,
    reviews,
    reviewDeletions,
  });
  const firstName = displayName.split(" ")[0];

  return (
    <div className="nemi-me nemi-container">
        <RevealOnScroll className="nemi-me-hero">
          <div className="nemi-me-hero-inner">
            <div className="nemi-me-hero-copy">
              <p className="nemi-me-kicker">Mi NEMI</p>
              <h1 className="nemi-me-title font-display">Hola, {firstName}</h1>
              <p className="nemi-me-sub">
                Tu espacio para guardar lugares, seguir destinos y revisar lo
                que has compartido.
              </p>
              <div className="nemi-me-hero-stats">
                <HeroStat
                  tone="heart"
                  icon={<IconHeart />}
                  value={savedPlaces.length}
                  label="Lugares"
                  href="#lugares"
                />
                <HeroStat
                  tone="compass"
                  icon={<IconCompass />}
                  value={visitedDestinations.length}
                  label="Destinos"
                  href="#destinos"
                />
                <HeroStat
                  tone="star"
                  icon={<IconStar />}
                  value={reviews.length}
                  label="Reseñas"
                  href="#resenas"
                />
              </div>
            </div>
            <MeHeroScene />
          </div>
        </RevealOnScroll>

        <div className="nemi-me-shell">
          <RevealOnScroll className="nemi-me-main-places">
            <SavedPlacesBoard places={savedPlaces} />
          </RevealOnScroll>

          <aside className="nemi-me-aside">
            <RevealOnScroll delayMs={30}>
              <RecentActivity items={activity} />
            </RevealOnScroll>
            <RevealOnScroll delayMs={40}>
              <RecentDestinationsPanel destinations={visitedDestinations} />
            </RevealOnScroll>
          </aside>

          <div className="nemi-me-main-stack">
            <RevealOnScroll delayMs={50}>
              <section id="resenas" className="nemi-me-block">
                <div className="nemi-me-block-head">
                  <div>
                    <p className="nemi-me-section-eyebrow">Reseñas</p>
                    <h2 className="nemi-me-h2 font-display">Mis reseñas</h2>
                    <p className="nemi-me-lead">
                      Las experiencias que has compartido con otros viajeros.
                    </p>
                  </div>
                  {reviews.length > 0 ? (
                    <Link href="/cuenta/resenas" className="nemi-me-more">
                      Ver todos
                    </Link>
                  ) : null}
                </div>
                {reviews.length === 0 ? (
                  <div className="nemi-me-empty">
                    <span className="nemi-me-empty-icon" aria-hidden>
                      <IconStar />
                    </span>
                    <p className="nemi-me-empty-title">
                      Todavía no has compartido ninguna experiencia.
                    </p>
                    <p className="nemi-me-empty-copy">
                      Tu experiencia puede ayudar a otros viajeros.
                    </p>
                  </div>
                ) : (
                  <div className="nemi-me-reviews">
                    {reviews.slice(0, 3).map((review) => {
                      const href = establishmentPublicPath(
                        review.establishment.destination.slug,
                        review.establishment.type,
                        review.establishment.slug,
                      );
                      const cover = resolvePlaceCoverImage({
                        name: review.establishment.name,
                        slug: review.establishment.slug,
                        type: review.establishment.type,
                        images: review.establishment.images,
                      });
                      return (
                        <article key={review.id} className="nemi-me-review">
                          <PlaceCoverImage
                            cover={cover}
                            className="nemi-me-review-thumb"
                          />
                          <div className="nemi-me-review-body">
                            <p className="nemi-me-review-place">
                              {review.establishment.name}
                            </p>
                            <p className="nemi-me-stars">
                              {"★".repeat(review.rating)}
                              {"☆".repeat(Math.max(0, 5 - review.rating))}
                            </p>
                            {review.comment ? (
                              <p className="nemi-me-review-comment">
                                “{review.comment}”
                              </p>
                            ) : null}
                            <p className="nemi-me-meta">
                              Publicado{" "}
                              {formatRelativeTimeEs(review.updatedAt).toLowerCase()}
                              {!review.isVisible ? " · Oculta" : ""}
                            </p>
                            <MyReviewActions
                              reviewId={review.id}
                              establishmentId={review.establishment.id}
                              href={href}
                              rating={review.rating}
                              comment={review.comment}
                            />
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </RevealOnScroll>
          </div>
        </div>

        <section className="nemi-me-banner">
          <div className="nemi-me-banner-copy">
            <p className="nemi-me-banner-title font-display">
              ¿Listo para tu próxima aventura?
            </p>
            <p className="nemi-me-banner-text">
              Explora destinos y guarda los lugares que quieras tener a mano.
            </p>
          </div>
          <Link href="/#explorar" className="nemi-btn nemi-btn-primary">
            Explorar destinos
          </Link>
        </section>
      </div>
  );
}

function HeroStat({
  tone,
  icon,
  value,
  label,
  href,
}: {
  tone: "heart" | "compass" | "star";
  icon: ReactNode;
  value: number;
  label: string;
  href: string;
}) {
  return (
    <Link href={href} className={`nemi-me-hero-stat tone-${tone}`}>
      <span className="nemi-me-hero-stat-icon" aria-hidden>
        {icon}
      </span>
      <span className="nemi-me-hero-stat-value">{value}</span>
      <span className="nemi-me-hero-stat-label">{label}</span>
    </Link>
  );
}
