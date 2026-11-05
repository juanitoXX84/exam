"use server";

import { revalidatePath } from "next/cache";
import { requirePermission, requireSession } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { toggleFavorite } from "@/services/favorite.service";

export async function toggleFavoriteAction(formData: FormData) {
  const session = await requirePermission(PERMISSIONS["favorites:manage"]);
  const establishmentId = String(formData.get("establishmentId") ?? "");
  if (!establishmentId) return;

  await toggleFavorite(session.user.id, establishmentId);
  revalidatePath("/cuenta");
  revalidatePath("/cuenta/favoritos");
  revalidatePath("/destinos");
}

export async function requireAuthSession() {
  return requireSession();
}
