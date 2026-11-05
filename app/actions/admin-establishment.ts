"use server";

import {
  EstablishmentType,
  PriceRange,
  VerificationStatus,
} from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac/guards";
import {
  createEstablishment,
  deleteEstablishment,
  establishmentInputSchema,
  updateEstablishment,
} from "@/services/establishment.service";

function parseEstablishmentForm(formData: FormData) {
  const categoryIds = formData
    .getAll("categoryIds")
    .map(String)
    .filter(Boolean);

  return establishmentInputSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    website: formData.get("website"),
    latitude: formData.get("latitude") || null,
    longitude: formData.get("longitude") || null,
    priceRange: formData.get("priceRange") || null,
    type: formData.get("type") ?? EstablishmentType.RESTAURANT,
    acceptsReservations: formData.get("acceptsReservations") === "on",
    isActive: formData.get("isActive") === "on",
    verificationStatus:
      formData.get("verificationStatus") ?? VerificationStatus.PENDING,
    sourceNote: formData.get("sourceNote"),
    categoryIds,
  });
}

function revalidateEstablishmentPaths(
  destinationSlug: string,
  sectionKey: string,
) {
  revalidatePath("/admin/destinos");
  revalidatePath(`/admin/destinos/${destinationSlug}`);
  revalidatePath(`/admin/destinos/${destinationSlug}/${sectionKey}`);
  revalidatePath("/destinos");
  revalidatePath(`/destinos/${destinationSlug}`);
  revalidatePath(`/destinos/${destinationSlug}/${sectionKey}`);
}

export async function createEstablishmentAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const destinationId = String(formData.get("destinationId") ?? "");
  const destinationSlug = String(formData.get("destinationSlug") ?? "");
  const sectionKey = String(formData.get("sectionKey") ?? "restaurantes");
  if (!destinationId) return;

  const parsed = parseEstablishmentForm(formData);
  if (!parsed.success) return;

  const result = await createEstablishment(destinationId, parsed.data);
  if (!result.ok) return;

  revalidateEstablishmentPaths(destinationSlug, sectionKey);
  redirect(
    `/admin/destinos/${destinationSlug}/${sectionKey}/${result.data.id}`,
  );
}

export async function updateEstablishmentAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = String(formData.get("id") ?? "");
  const destinationSlug = String(formData.get("destinationSlug") ?? "");
  const sectionKey = String(formData.get("sectionKey") ?? "restaurantes");
  if (!id) return;

  const parsed = parseEstablishmentForm(formData);
  if (!parsed.success) return;

  const result = await updateEstablishment(id, parsed.data);
  if (!result.ok) return;

  revalidateEstablishmentPaths(destinationSlug, sectionKey);
}

export async function deleteEstablishmentAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = String(formData.get("id") ?? "");
  const destinationSlug = String(formData.get("destinationSlug") ?? "");
  const sectionKey = String(formData.get("sectionKey") ?? "restaurantes");
  if (!id) return;

  await deleteEstablishment(id);
  revalidateEstablishmentPaths(destinationSlug, sectionKey);
  redirect(`/admin/destinos/${destinationSlug}/${sectionKey}`);
}
