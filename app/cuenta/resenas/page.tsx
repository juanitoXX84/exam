import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IconStar } from "@/components/nemi/me-icons";
import { MyReviewActions } from "@/components/nemi/my-review-actions";
import { PlaceCoverImage } from "@/components/establishments/place-cover-image";
import { resolvePlaceCoverImage } from "@/lib/establishments/cover-image";
import { establishmentPublicPath } from "@/lib/establishments/paths";
import { auth } from "@/lib/auth/auth";
import { formatRelativeTimeEs } from "@/lib/nemi/relative-time";
import { listReviewsForUser } from "@/services/review.service";

export const metadata: Metadata = {
  title: "Mis reseñas",
};

export default async function AccountReviewsPage() {
  const session = await auth();
  if (!session?.user) redirect("/iniciar-sesion");

  const reviews = await listReviewsForUser(session.user.id);

  return (
    <div className="nemi-me nemi-container">
      <Link href="/cuenta" className="nemi-back-link text-sm">
        ← Mi cuenta
      </Link>
      <div className="mt-4 max-w-2xl">
        <section className="nemi-me-block">
          <h1 className="nemi-me-h2">Mis reseñas</h1>
          <p className="nemi-me-lead">
            Las experiencias que has compartido con otros viajeros.
          </p>

          {reviews.length === 0 ? (
            <div className="nemi-me-empty">
              <span className="nemi-me-empty-icon" aria-hidden>
                <IconStar />
              </span>
              <p className="nemi-me-empty-title">
                Todavía no has compartido ninguna experiencia.
              </p>
              <p className="nemi-me-empty-copy">
                Visita un lugar y deja tu reseña para ayudar a otros viajeros.
              </p>
            </div>
          ) : (
            <div className="nemi-me-reviews mt-4">
              {reviews.map((review) => {
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
                        Publicado {formatRelativeTimeEs(review.updatedAt).toLowerCase()}
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
      </div>
    </div>
  );
}
