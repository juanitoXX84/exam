import {
  ReportReason,
  ReportStatus,
  ReportTargetType,
  VerificationStatus,
} from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { ESTABLISHMENT_REPORT_REASONS } from "@/lib/reports/labels";

export const reportInputSchema = z.object({
  reason: z.nativeEnum(ReportReason),
  description: z
    .string()
    .trim()
    .max(500, "La descripción es demasiado larga.")
    .optional()
    .or(z.literal("")),
});

export type ReportInput = z.infer<typeof reportInputSchema>;

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createEstablishmentReportForUser(
  userId: string,
  establishmentId: string,
  input: ReportInput,
): Promise<ServiceResult<{ id: string }>> {
  const parsed = reportInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa el reporte.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!ESTABLISHMENT_REPORT_REASONS.includes(parsed.data.reason)) {
    return { ok: false, error: "Motivo de reporte no válido." };
  }

  const establishment = await prisma.establishment.findFirst({
    where: { id: establishmentId, isActive: true },
    select: { id: true },
  });

  if (!establishment) {
    return { ok: false, error: "No encontramos ese lugar." };
  }

  const report = await prisma.$transaction(async (tx) => {
    const created = await tx.report.create({
      data: {
        reporterId: userId,
        targetType: ReportTargetType.ESTABLISHMENT,
        reason: parsed.data.reason,
        description: parsed.data.description?.trim() || null,
        establishmentId,
        status: ReportStatus.OPEN,
      },
      select: { id: true },
    });

    await tx.establishment.update({
      where: { id: establishmentId },
      data: { verificationStatus: VerificationStatus.REPORTED },
    });

    return created;
  });

  return { ok: true, data: report };
}

export async function listReportsForAdmin() {
  return prisma.report.findMany({
    where: { targetType: ReportTargetType.ESTABLISHMENT },
    include: {
      reporter: { select: { name: true, email: true } },
      establishment: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          verificationStatus: true,
          destination: { select: { slug: true, name: true } },
        },
      },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
}

export async function updateReportStatusForAdmin(
  reportId: string,
  status: ReportStatus,
  markVerified = false,
): Promise<ServiceResult<{ id: string }>> {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { id: true, establishmentId: true },
  });

  if (!report) {
    return { ok: false, error: "Reporte no encontrado." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.report.update({
      where: { id: reportId },
      data: { status },
    });

    if (report.establishmentId && markVerified) {
      await tx.establishment.update({
        where: { id: report.establishmentId },
        data: {
          verificationStatus: VerificationStatus.VERIFIED,
          lastVerifiedAt: new Date(),
        },
      });
    }
  });

  return { ok: true, data: { id: reportId } };
}
