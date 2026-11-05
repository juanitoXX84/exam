"use server";

import { recordDestinationVisit } from "@/lib/nemi/visited-destinations";
import { auth } from "@/lib/auth/auth";

export async function recordDestinationVisitAction(destinationId: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  await recordDestinationVisit(session.user.id, destinationId);
}
