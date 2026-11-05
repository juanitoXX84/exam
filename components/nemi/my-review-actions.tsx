"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import {
  deleteReviewAction,
  submitReviewAction,
  type ReviewActionState,
} from "@/app/actions/review";
import { INPUT_LIMITS } from "@/lib/validators/limits";

type Props = {
  reviewId: string;
  establishmentId: string;
  href: string;
  rating: number;
  comment: string | null;
};

export function MyReviewActions({
  reviewId,
  establishmentId,
  href,
  rating,
  comment,
}: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <ReviewEditForm
        establishmentId={establishmentId}
        rating={rating}
        comment={comment}
        onCancel={() => setEditing(false)}
        onSaved={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="nemi-me-review-actions">
      <button
        type="button"
        className="nemi-me-action"
        onClick={() => setEditing(true)}
      >
        Editar
      </button>
      <Link href={href} className="nemi-me-action">
        Ver lugar
      </Link>
      <form
        className="nemi-me-action-form"
        action={deleteReviewAction}
        onSubmit={(event) => {
          if (!window.confirm("¿Eliminar esta reseña?")) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="reviewId" value={reviewId} />
        <button type="submit" className="nemi-me-action is-danger">
          Eliminar
        </button>
      </form>
    </div>
  );
}

const initialState: ReviewActionState = {};

function ReviewEditForm({
  establishmentId,
  rating,
  comment,
  onCancel,
  onSaved,
}: {
  establishmentId: string;
  rating: number;
  comment: string | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    submitReviewAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) onSaved();
  }, [state.success, onSaved]);

  return (
    <form className="nemi-me-review-form" action={formAction}>
      <input type="hidden" name="establishmentId" value={establishmentId} />
      <label className="nemi-me-field">
        <span>Valoración</span>
        <select name="rating" defaultValue={String(rating)} className="nemi-input">
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} ★
            </option>
          ))}
        </select>
      </label>
      <label className="nemi-me-field">
        <span>Comentario</span>
        <textarea
          name="comment"
          rows={3}
          maxLength={INPUT_LIMITS.reviewCommentMax}
          defaultValue={comment ?? ""}
          className="nemi-input min-h-20 resize-y"
        />
      </label>
      {state.error ? (
        <p className="text-sm text-[var(--danger)]">{state.error}</p>
      ) : null}
      <div className="nemi-me-review-actions">
        <button type="submit" disabled={pending} className="nemi-me-action">
          {pending ? "Guardando…" : "Guardar"}
        </button>
        <button type="button" className="nemi-me-action" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
