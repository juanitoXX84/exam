import { EstablishmentType, Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { SERVICE_ESTABLISHMENT_TYPES } from "@/services/services.service";

export const emergencyInputSchema = z.object({
  name: z.string().trim().min(2).max(160),
  type: z.nativeEnum(EstablishmentType),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  address: z.string().trim().max(255).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  isOfficial: z.boolean().default(false),
  sourceNote: z.string().trim().max(255).optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export type EmergencyInput = z.infer<typeof emergencyInputSchema>;

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

function emptyToNull(value?: string | null) {
  if (!value || value.trim() === "") return null;
  return value.trim();
}

export async function listActiveEmergencies(destinationId: string) {
  return prisma.emergencyService.findMany({
    where: {
      destinationId,
      isActive: true,
    },
    orderBy: [{ isOfficial: "desc" }, { type: "asc" }, { name: "asc" }],
  });
}

export async function listEmergenciesForAdmin(destinationId?: string) {
  return prisma.emergencyService.findMany({
    where: destinationId ? { destinationId } : undefined,
    include: {
      destination: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getEmergencyById(id: string) {
  return prisma.emergencyService.findUnique({
    where: { id },
    include: {
      destination: { select: { id: true, name: true, slug: true } },
    },
  });
}

export async function getEmergenciesHubPreview(destinationId: string) {
  const [total, official, latest] = await Promise.all([
    prisma.emergencyService.count({
      where: { destinationId, isActive: true },
    }),
    prisma.emergencyService.count({
      where: { destinationId, isActive: true, isOfficial: true },
    }),
    prisma.emergencyService.findMany({
      where: { destinationId, isActive: true },
      orderBy: [{ isOfficial: "desc" }, { name: "asc" }],
      take: 3,
      select: { id: true, name: true },
    }),
  ]);

  return { total, official, latest };
}

export async function createEmergency(
  destinationId: string,
  input: EmergencyInput,
): Promise<ServiceResult<{ id: string }>> {
  const parsed = emergencyInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  if (
    !(SERVICE_ESTABLISHMENT_TYPES as readonly EstablishmentType[]).includes(
      data.type,
    ) &&
    data.type !== EstablishmentType.OTHER_SERVICE
  ) {
    // Allow common emergency-related types already in SERVICE list.
  }

  try {
    const created = await prisma.emergencyService.create({
      data: {
        destinationId,
        name: data.name.trim(),
        type: data.type,
        phone: emptyToNull(data.phone),
        address: emptyToNull(data.address),
        notes: emptyToNull(data.notes),
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        isOfficial: data.isOfficial,
        sourceNote: emptyToNull(data.sourceNote),
        isActive: data.isActive,
      },
      select: { id: true },
    });
    return { ok: true, data: created };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { ok: false, error: "No se pudo crear el contacto." };
    }
    throw error;
  }
}

export async function updateEmergency(
  id: string,
  input: EmergencyInput,
): Promise<ServiceResult<{ id: string }>> {
  const parsed = emergencyInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  await prisma.emergencyService.update({
    where: { id },
    data: {
      name: data.name.trim(),
      type: data.type,
      phone: emptyToNull(data.phone),
      address: emptyToNull(data.address),
      notes: emptyToNull(data.notes),
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      isOfficial: data.isOfficial,
      sourceNote: emptyToNull(data.sourceNote),
      isActive: data.isActive,
    },
  });

  return { ok: true, data: { id } };
}

export async function deleteEmergency(
  id: string,
): Promise<ServiceResult<{ id: string }>> {
  try {
    await prisma.emergencyService.delete({ where: { id } });
    return { ok: true, data: { id } };
  } catch {
    return { ok: false, error: "No se pudo eliminar el contacto." };
  }
}
