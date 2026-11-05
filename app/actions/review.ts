"use server";

import { revalidatePath } from "next/cache";
import { AuthError, requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { upsertReview, deleteReviewForUser } from "@/services/review.service";

export type ReviewActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function submitReviewAction(
  _prev: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  try {
    const session = await requirePermission(PERMISSIONS["reviews:create"]);
    const establishmentId = String(formData.get("establishmentId") ?? "");
    if (!establishmentId) {
      return { error: "Falta el establecimiento." };
    }

    const result = await upsertReview(session.user.id, establishmentId, {
      rating: Number(formData.get("rating") ?? 0),
      comment: String(formData.get("comment") ?? ""),
    });

    if (!result.ok) {
      return { error: result.error, fieldErrors: result.fieldErrors };
    }

    revalidatePath("/destinos");
    revalidatePath("/cuenta");
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function deleteReviewAction(formData: FormData) {
  const session = await requirePermission(PERMISSIONS["reviews:create"]);
  const reviewId = String(formData.get("reviewId") ?? "");
  if (!reviewId) return;

  await deleteReviewForUser(session.user.id, reviewId);
  revalidatePath("/cuenta");
  revalidatePath("/destinos");
}
