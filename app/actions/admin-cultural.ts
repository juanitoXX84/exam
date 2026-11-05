"use server";

import {
  CulturalNormKind,
  CulturalSignal,
  ImportanceLevel,
  VerificationStatus,
} from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac/guards";
import {
  createCulturalGuide,
  culturalGuideInputSchema,
  deleteCulturalGuide,
  updateCulturalGuide,
} from "@/services/cultural.service";

function parseCulturalForm(formData: FormData) {
  return culturalGuideInputSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    context: formData.get("context"),
    whatToDo: formData.get("whatToDo"),
    whatToAvoid: formData.get("whatToAvoid"),
    signal: formData.get("signal") ?? CulturalSignal.CONSIDER,
    normKind: formData.get("normKind") ?? CulturalNormKind.CUSTOM,
    importance: formData.get("importance") ?? ImportanceLevel.MEDIUM,
    source: formData.get("source"),
    isPublished: formData.get("isPublished") === "on",
    verificationStatus:
      formData.get("verificationStatus") ?? VerificationStatus.PENDING,
  });
}

function revalidateCulturalPaths(destinationSlug: string) {
  revalidatePath("/admin/destinos");
  revalidatePath(`/admin/destinos/${destinationSlug}`);
  revalidatePath(`/admin/destinos/${destinationSlug}/cultura`);
  revalidatePath("/destinos");
  revalidatePath(`/destinos/${destinationSlug}/cultura`);
}

export async function createCulturalGuideAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const destinationId = String(formData.get("destinationId") ?? "");
  const destinationSlug = String(formData.get("destinationSlug") ?? "");
  if (!destinationId) return;

  const parsed = parseCulturalForm(formData);
  if (!parsed.success) return;

  const result = await createCulturalGuide(destinationId, parsed.data);
  if (!result.ok) return;

  revalidateCulturalPaths(destinationSlug);
  redirect(`/admin/destinos/${destinationSlug}/cultura/${result.data.id}`);
}

export async function updateCulturalGuideAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = String(formData.get("id") ?? "");
  const destinationSlug = String(formData.get("destinationSlug") ?? "");
  if (!id) return;

  const parsed = parseCulturalForm(formData);
  if (!parsed.success) return;

  await updateCulturalGuide(id, parsed.data);
  revalidateCulturalPaths(destinationSlug);
}

export async function deleteCulturalGuideAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = String(formData.get("id") ?? "");
  const destinationSlug = String(formData.get("destinationSlug") ?? "");
  if (!id) return;

  await deleteCulturalGuide(id);
  revalidateCulturalPaths(destinationSlug);
  redirect(`/admin/destinos/${destinationSlug}/cultura`);
}
