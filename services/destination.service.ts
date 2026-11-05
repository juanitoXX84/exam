import { DestinationStatus } from "@prisma/client";
import { cache } from "react";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/format";

export const destinationInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones."),
  region: z.string().trim().max(80).optional().or(z.literal("")),
  country: z.string().trim().min(2).max(80),
  countryCode: z.string().trim().length(2, "Código de país de 2 letras."),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  coverImage: z.string().trim().max(255).optional().or(z.literal("")),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  timezone: z.string().trim().max(64).optional().or(z.literal("")),
  status: z.nativeEnum(DestinationStatus),
});

export type DestinationInput = z.infer<typeof destinationInputSchema>;

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

function emptyToNull(value?: string | null) {
  if (!value || value.trim() === "") return null;
  return value.trim();
}

const fetchPublishedDestination = cache(async (slug: string) =>
  prisma.destination.findFirst({
    where: {
      slug,
      status: DestinationStatus.PUBLISHED,
    },
  }),
);

/** Dedupe en el mismo request (metadata + página). */
export const getPublishedDestinationBySlug = fetchPublishedDestination;

export async function listPublishedDestinations() {
  return prisma.destination.findMany({
    where: { status: DestinationStatus.PUBLISHED },
    select: { id: true, name: true, country: true, slug: true },
    orderBy: { name: "asc" },
  });
}

export const getDestinationBySlug = cache(async (slug: string) =>
  prisma.destination.findUnique({
    where: { slug },
  }),
);

export async function listDestinationsForAdmin() {
  return prisma.destination.findMany({
    orderBy: [{ country: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: {
          establishments: true,
          culturalGuides: true,
          emergencyServices: true,
        },
      },
    },
  });
}

export async function getDestinationAdminStats(destinationId: string) {
  const [establishments, guides, emergencies] = await Promise.all([
    prisma.establishment.groupBy({
      by: ["type"],
      where: { destinationId },
      _count: { type: true },
    }),
    prisma.culturalGuide.count({ where: { destinationId } }),
    prisma.emergencyService.count({ where: { destinationId } }),
  ]);

  return { establishments, guides, emergencies };
}

export async function createDestination(
  input: DestinationInput,
): Promise<ServiceResult<{ id: string; slug: string }>> {
  const parsed = destinationInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.name);

  try {
    const created = await prisma.destination.create({
      data: {
        name: data.name.trim(),
        slug,
        region: emptyToNull(data.region),
        country: data.country.trim(),
        countryCode: data.countryCode.trim().toUpperCase(),
        description: emptyToNull(data.description),
        coverImage: emptyToNull(data.coverImage),
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        timezone: emptyToNull(data.timezone),
        status: data.status,
      },
      select: { id: true, slug: true },
    });
    return { ok: true, data: created };
  } catch {
    return { ok: false, error: "No se pudo crear el destino (¿slug duplicado?)." };
  }
}

export async function updateDestination(
  id: string,
  input: DestinationInput,
): Promise<ServiceResult<{ id: string; slug: string }>> {
  const parsed = destinationInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const updated = await prisma.destination.update({
      where: { id },
      data: {
        name: data.name.trim(),
        slug: data.slug.trim(),
        region: emptyToNull(data.region),
        country: data.country.trim(),
        countryCode: data.countryCode.trim().toUpperCase(),
        description: emptyToNull(data.description),
        coverImage: emptyToNull(data.coverImage),
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        timezone: emptyToNull(data.timezone),
        status: data.status,
      },
      select: { id: true, slug: true },
    });
    return { ok: true, data: updated };
  } catch {
    return { ok: false, error: "No se pudo actualizar el destino." };
  }
}
