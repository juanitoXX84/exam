"use server";

import { DestinationStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac/guards";
import {
  createDestination,
  destinationInputSchema,
  updateDestination,
} from "@/services/destination.service";

function parseDestinationForm(formData: FormData) {
  return destinationInputSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    region: formData.get("region"),
    country: formData.get("country"),
    countryCode: formData.get("countryCode"),
    description: formData.get("description"),
    coverImage: formData.get("coverImage"),
    latitude: formData.get("latitude") || null,
    longitude: formData.get("longitude") || null,
    timezone: formData.get("timezone"),
    status: formData.get("status") ?? DestinationStatus.DRAFT,
  });
}

export async function createDestinationAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const parsed = parseDestinationForm(formData);
  if (!parsed.success) return;

  const result = await createDestination(parsed.data);
  if (!result.ok) return;

  revalidatePath("/admin/destinos");
  revalidatePath("/destinos");
  redirect(`/admin/destinos/${result.data.slug}`);
}

export async function updateDestinationAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const parsed = parseDestinationForm(formData);
  if (!parsed.success) return;

  const result = await updateDestination(id, parsed.data);
  if (!result.ok) return;

  revalidatePath("/admin/destinos");
  revalidatePath(`/admin/destinos/${result.data.slug}`);
  revalidatePath("/destinos");
  revalidatePath(`/destinos/${result.data.slug}`);
}
