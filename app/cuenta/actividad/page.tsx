import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IconCompass, IconHeart, IconStar, IconTrash } from "@/components/nemi/me-icons";
import { auth } from "@/lib/auth/auth";
import { buildAccountActivity } from "@/lib/nemi/activity";
import { formatRelativeTimeEs } from "@/lib/nemi/relative-time";
import { listFavoritesForUser, listFavoriteRemovalsForUser } from "@/services/favorite.service";
import {
  listReviewDeletionsForUser,
  listReviewsForUser,
} from "@/services/review.service";

export const metadata: Metadata = {
  title: "Actividad reciente",
};

export default async function AccountActivityPage() {
  const session = await auth();
  if (!session?.user) redirect("/iniciar-sesion");

  const [favorites, favoriteRemovals, reviews, reviewDeletions] = await Promise.all([
    listFavoritesForUser(session.user.id),
    listFavoriteRemovalsForUser(session.user.id),
    listReviewsForUser(session.user.id),
    listReviewDeletionsForUser(session.user.id),
  ]);

  const activity = buildAccountActivity({
    favorites,
    favoriteRemovals,
    reviews,
    reviewDeletions,
  });

  return (
    <div className="nemi-me nemi-container">
      <Link href="/cuenta" className="nemi-back-link text-sm">
        ← Mi cuenta
      </Link>
      <div className="mt-4 max-w-2xl">
        <section className="nemi-me-block">
          <h1 className="nemi-me-h2">Actividad reciente</h1>
          <p className="nemi-me-lead">Un registro de lo que haces en NEMI.</p>

          {activity.length === 0 ? (
            <div className="nemi-me-empty">
              <span className="nemi-me-empty-icon" aria-hidden>
                <IconCompass />
              </span>
              <p className="nemi-me-empty-title">Sin actividad todavía.</p>
              <p className="nemi-me-empty-copy">
                Cuando guardes lugares, los quites de favoritos, publiques o elimines reseñas, lo verás aquí.
              </p>
            </div>
          ) : (
            <ul className="nemi-me-activity mt-4">
              {activity.map((item) => (
                <li key={item.id}>
                  <span
                    className={`nemi-me-activity-icon kind-${item.kind}`}
                    aria-hidden
                  >
                    {item.kind === "saved" ? (
                      <IconHeart />
                    ) : item.kind === "unsaved" ? (
                      <IconHeart />
                    ) : item.kind === "review_deleted" ? (
                      <IconTrash />
                    ) : (
                      <IconStar />
                    )}
                  </span>
                  <div>
                    <Link href={item.href} className="nemi-me-activity-text">
                      {item.text}
                    </Link>
                    <p className="nemi-me-meta">
                      {formatRelativeTimeEs(item.at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
