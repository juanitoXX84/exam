"use server";

import { ReportReason, ReportStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { AuthError, requirePermission, requireRole } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import {
  createEstablishmentReportForUser,
  updateReportStatusForAdmin,
} from "@/services/report.service";

export type ReportActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function createEstablishmentReportAction(
  _prev: ReportActionState,
  formData: FormData,
): Promise<ReportActionState> {
  try {
    const session = await requirePermission(PERMISSIONS["reports:create"]);
    const establishmentId = String(formData.get("establishmentId") ?? "");
    if (!establishmentId) {
      return { error: "Falta el establecimiento." };
    }

    const result = await createEstablishmentReportForUser(
      session.user.id,
      establishmentId,
      {
        reason: String(formData.get("reason") ?? "") as ReportReason,
        description: String(formData.get("description") ?? ""),
      },
    );

    if (!result.ok) {
      return { error: result.error, fieldErrors: result.fieldErrors };
    }

    revalidatePath("/destinos");
    revalidatePath("/admin/reportes");
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message };
    }
    throw error;
  }
}

export async function resolveReportAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const reportId = String(formData.get("reportId") ?? "");
  if (!reportId) return;

  await updateReportStatusForAdmin(reportId, ReportStatus.RESOLVED, true);
  revalidatePath("/admin/reportes");
  revalidatePath("/destinos");
}

export async function dismissReportAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const reportId = String(formData.get("reportId") ?? "");
  if (!reportId) return;

  await updateReportStatusForAdmin(reportId, ReportStatus.DISMISSED);
  revalidatePath("/admin/reportes");
}

export async function markReportReviewingAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const reportId = String(formData.get("reportId") ?? "");
  if (!reportId) return;

  await updateReportStatusForAdmin(reportId, ReportStatus.IN_REVIEW);
  revalidatePath("/admin/reportes");
}
