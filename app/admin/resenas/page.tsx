import Link from "next/link";
import { deleteReviewAdminAction } from "@/app/actions/admin-review";
import { establishmentPublicPath } from "@/lib/establishments/paths";
import { formatRelativeTimeEs } from "@/lib/nemi/relative-time";
import { listReviewsForAdmin } from "@/services/review.service";

export const metadata = { title: "Reseñas · Admin" };

export default async function AdminReviewsPage() {
  const reviews = await listReviewsForAdmin();

  return (
    <div>
      <div className="nemi-admin-header !mb-4">
        <p className="nemi-admin-kicker">Moderación</p>
        <h2 className="nemi-admin-title !text-2xl">Reseñas</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {reviews.length} reseña{reviews.length === 1 ? "" : "s"} en total.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="nemi-admin-panel">
          <p className="font-medium">No hay reseñas</p>
        </div>
      ) : (
        <div className="nemi-admin-list">
          {reviews.map((review) => {
            const place = review.establishment;
            const href = place
              ? establishmentPublicPath(
                  place.destination.slug,
                  place.type,
                  place.slug,
                )
              : null;

            return (
              <article key={review.id} className="nemi-admin-list-item">
                <div className="min-w-0 flex-1">
                  {href && place ? (
                    <Link href={href} className="nemi-admin-list-title hover:underline">
                      {place.name}
                    </Link>
                  ) : (
                    <p className="nemi-admin-list-title">Establecimiento</p>
                  )}
                  <p className="nemi-admin-list-meta">
                    {place?.destination.name} ·{" "}
                    {review.user.name ?? review.user.email}
                  </p>
                  <p className="nemi-admin-stars mt-2 text-sm">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(Math.max(0, 5 - review.rating))}
                  </p>
                  {review.comment ? (
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      “{review.comment}”
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    {formatRelativeTimeEs(review.createdAt)}
                    {!review.isVisible ? " · Oculta" : ""}
                  </p>
                </div>

                <form action={deleteReviewAdminAction}>
                  <input type="hidden" name="reviewId" value={review.id} />
                  <button
                    type="submit"
                    className="nemi-btn nemi-btn-glass nemi-admin-btn-danger !py-1.5 text-xs"
                  >
                    Eliminar
                  </button>
                </form>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
