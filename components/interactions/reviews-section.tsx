"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useState } from "react";
import {
  submitReviewAction,
  type ReviewActionState,
} from "@/app/actions/review";
import { StarRating } from "@/components/interactions/star-rating";
import { formatRelativeTimeEs } from "@/lib/nemi/relative-time";
import { INPUT_LIMITS } from "@/lib/validators/limits";

const initialState: ReviewActionState = {};

type ReviewItem = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: { id: string; name: string | null; image: string | null };
};

type Props = {
  establishmentId: string;
  reviews: ReviewItem[];
  isLoggedIn: boolean;
  currentUserId?: string | null;
  standalone?: boolean;
};

function buildSummary(reviews: ReviewItem[]) {
  let total = 0;
  for (const review of reviews) total += review.rating;
  return {
    count: reviews.length,
    average: reviews.length ? total / reviews.length : 0,
  };
}

export function ReviewsSection({
  establishmentId,
  reviews,
  isLoggedIn,
  currentUserId,
  standalone = false,
}: Props) {
  const ownReview = useMemo(
    () =>
      currentUserId
        ? reviews.find((review) => review.user.id === currentUserId)
        : undefined,
    [reviews, currentUserId],
  );
  const [rating, setRating] = useState(ownReview?.rating ?? 5);
  const [comment, setComment] = useState(ownReview?.comment ?? "");
  const [state, formAction, pending] = useActionState(
    submitReviewAction,
    initialState,
  );
  const router = useRouter();

  const summary = useMemo(() => buildSummary(reviews), [reviews]);
  const hasOwnReview = !!ownReview || !!state.success;
  const submitLabel = hasOwnReview ? "Cambiar reseña" : "Publicar reseña";

  useEffect(() => {
    if (ownReview) {
      setRating(ownReview.rating);
      setComment(ownReview.comment ?? "");
    }
  }, [ownReview]);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <section
      className={
        standalone
          ? "nemi-reviews-section"
          : "nemi-reviews-section border-t border-[var(--border)] pt-6"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm tracking-[0.16em] text-[var(--muted)] uppercase">
          Reseñas
        </h2>
        {reviews.length > 0 ? (
          <div className="nemi-reviews-pill" aria-label={`${summary.average.toFixed(1)} de 5, ${summary.count} reseñas`}>
            <span className="nemi-reviews-pill-score">
              {summary.average.toFixed(1)}
            </span>
            <StarRating value={summary.average} readOnly />
            <span className="nemi-reviews-pill-count">
              {summary.count === 1 ? "1 reseña" : `${summary.count} reseñas`}
            </span>
          </div>
        ) : null}
      </div>

      {reviews.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--muted)]">
          Todavía no hay reseñas visibles.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {reviews.map((review) => (
            <li key={review.id} className="nemi-review-item">
              <div className="flex items-start gap-2.5">
                {review.user.image ? (
                  <img
                    src={review.user.image}
                    alt=""
                    className="nemi-review-item-avatar"
                  />
                ) : (
                  <span className="nemi-review-item-avatar is-fallback">
                    {(review.user.name ?? "U").charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {review.user.name ?? "Viajero NEMI"}
                    </p>
                    <StarRating value={review.rating} readOnly />
                    <time
                      className="text-[11px] text-[var(--muted)]"
                      dateTime={new Date(review.createdAt).toISOString()}
                    >
                      {formatRelativeTimeEs(review.createdAt)}
                    </time>
                  </div>
                  {review.comment ? (
                    <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                      {review.comment}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5">
        {isLoggedIn ? (
          <form action={formAction} className="space-y-3">
            <input
              type="hidden"
              name="establishmentId"
              value={establishmentId}
            />
            <input type="hidden" name="rating" value={rating} />
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-[var(--muted)]">Tu calificación</span>
              <StarRating
                value={rating}
                onChange={setRating}
                label="Tu calificación"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="comment" className="text-sm text-[var(--muted)]">
                Comentario
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={3}
                maxLength={INPUT_LIMITS.reviewCommentMax}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                className="nemi-input min-h-20 resize-y"
                placeholder="Opcional"
              />
            </div>
            {state.error ? (
              <p className="text-sm text-[var(--danger)]">{state.error}</p>
            ) : null}
            {state.fieldErrors?.comment?.[0] ? (
              <p className="text-sm text-[var(--danger)]">
                {state.fieldErrors.comment[0]}
              </p>
            ) : null}
            {state.success ? (
              <p className="text-sm text-[var(--accent)]">
                {ownReview ? "Reseña actualizada." : "Reseña guardada."}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={pending}
              className="nemi-btn nemi-btn-primary"
            >
              {pending ? "Enviando…" : submitLabel}
            </button>
          </form>
        ) : (
          <p className="text-sm text-[var(--muted)]">
            <Link href="/iniciar-sesion" className="text-[var(--accent)]">
              Inicia sesión
            </Link>{" "}
            para dejar una reseña.
          </p>
        )}
      </div>
    </section>
  );
}
