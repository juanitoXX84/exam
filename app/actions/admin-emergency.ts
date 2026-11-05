"use server";

import { EstablishmentType } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac/guards";
import {
  createEmergency,
  deleteEmergency,
  emergencyInputSchema,
  updateEmergency,
} from "@/services/emergency.service";

function parseEmergencyForm(formData: FormData) {
  return emergencyInputSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type") ?? EstablishmentType.HOSPITAL,
    phone: formData.get("phone"),
    address: formData.get("address"),
    notes: formData.get("notes"),
    latitude: formData.get("latitude") || null,
    longitude: formData.get("longitude") || null,
    isOfficial: formData.get("isOfficial") === "on",
    sourceNote: formData.get("sourceNote"),
    isActive: formData.get("isActive") === "on",
  });
}

function revalidateEmergencyPaths(destinationSlug: string) {
  revalidatePath("/admin/destinos");
  revalidatePath(`/admin/destinos/${destinationSlug}`);
  revalidatePath(`/admin/destinos/${destinationSlug}/emergencias`);
  revalidatePath("/destinos");
  revalidatePath(`/destinos/${destinationSlug}/emergencias`);
}

export async function createEmergencyAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const destinationId = String(formData.get("destinationId") ?? "");
  const destinationSlug = String(formData.get("destinationSlug") ?? "");
  if (!destinationId) return;

  const parsed = parseEmergencyForm(formData);
  if (!parsed.success) return;

  const result = await createEmergency(destinationId, parsed.data);
  if (!result.ok) return;

  revalidateEmergencyPaths(destinationSlug);
  redirect(`/admin/destinos/${destinationSlug}/emergencias/${result.data.id}`);
}

export async function updateEmergencyAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = String(formData.get("id") ?? "");
  const destinationSlug = String(formData.get("destinationSlug") ?? "");
  if (!id) return;

  const parsed = parseEmergencyForm(formData);
  if (!parsed.success) return;

  await updateEmergency(id, parsed.data);
  revalidateEmergencyPaths(destinationSlug);
}

export async function deleteEmergencyAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = String(formData.get("id") ?? "");
  const destinationSlug = String(formData.get("destinationSlug") ?? "");
  if (!id) return;

  await deleteEmergency(id);
  revalidateEmergencyPaths(destinationSlug);
  redirect(`/admin/destinos/${destinationSlug}/emergencias`);
}
