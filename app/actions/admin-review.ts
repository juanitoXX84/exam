"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac/guards";
import { deleteReviewForAdmin } from "@/services/review.service";

export async function deleteReviewAdminAction(formData: FormData) {
  const session = await requireRole(["ADMIN"]);
  const reviewId = String(formData.get("reviewId") ?? "");
  if (!reviewId) return;

  await deleteReviewForAdmin(reviewId, session.user.id);
  revalidatePath("/admin/resenas");
  revalidatePath("/destinos");
}
