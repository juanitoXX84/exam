"use server";

import { revalidatePath } from "next/cache";
import { AuthError, requireSession } from "@/lib/rbac/guards";
import { createTrip, deleteTripForUser } from "@/services/trip.service";

export type TripActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function createTripAction(
  _prev: TripActionState,
  formData: FormData,
): Promise<TripActionState> {
  try {
    const session = await requireSession();
    const result = await createTrip(session.user.id, {
      name: String(formData.get("name") ?? ""),
      destinationName: String(formData.get("destinationName") ?? ""),
      startDate: String(formData.get("startDate") ?? ""),
      endDate: String(formData.get("endDate") ?? ""),
      placeIds: formData.getAll("placeIds").map((value) => String(value)),
    });

    if (!result.ok) {
      return { error: result.error, fieldErrors: result.fieldErrors };
    }

    revalidatePath("/cuenta");
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function deleteTripAction(formData: FormData) {
  const session = await requireSession();
  const tripId = String(formData.get("tripId") ?? "");
  if (!tripId) return;

  await deleteTripForUser(session.user.id, tripId);
  revalidatePath("/cuenta");
}
