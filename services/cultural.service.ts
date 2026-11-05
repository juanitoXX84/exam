import {
  CulturalNormKind,
  CulturalSignal,
  ImportanceLevel,
  Prisma,
  VerificationStatus,
} from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/format";
import { z } from "zod";

export const culturalGuideInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres.")
    .max(160),
  summary: z.string().trim().max(280).optional().or(z.literal("")),
  description: z
    .string()
    .trim()
    .min(20, "La descripción debe tener al menos 20 caracteres."),
  context: z.string().trim().optional().or(z.literal("")),
  whatToDo: z.string().trim().optional().or(z.literal("")),
  whatToAvoid: z.string().trim().optional().or(z.literal("")),
  signal: z.nativeEnum(CulturalSignal),
  normKind: z.nativeEnum(CulturalNormKind),
  importance: z.nativeEnum(ImportanceLevel).default(ImportanceLevel.MEDIUM),
  source: z.string().trim().max(255).optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
  verificationStatus: z
    .nativeEnum(VerificationStatus)
    .default(VerificationStatus.PENDING),
});

export type CulturalGuideInput = z.infer<typeof culturalGuideInputSchema>;

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

function emptyToNull(value?: string | null) {
  if (!value || value.trim() === "") return null;
  return value.trim();
}

async function uniqueSlugForDestination(
  destinationId: string,
  title: string,
  excludeId?: string,
) {
  const base = slugify(title) || "guia-cultural";
  let candidate = base;
  let attempt = 1;

  while (true) {
    const existing = await prisma.culturalGuide.findFirst({
      where: {
        destinationId,
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) return candidate;
    attempt += 1;
    candidate = `${base}-${attempt}`;
  }
}

export async function listPublishedCulturalGuides(
  destinationId: string,
  signal?: CulturalSignal,
) {
  return prisma.culturalGuide.findMany({
    where: {
      destinationId,
      isPublished: true,
      ...(signal ? { signal } : {}),
    },
    orderBy: [{ signal: "asc" }, { importance: "desc" }, { updatedAt: "desc" }],
  });
}

/** Vista previa para el hub tipo bento (sin inventar contenido). */
export async function getCulturalHubPreview(destinationId: string) {
  const [total, signalGroups, latest] = await Promise.all([
    prisma.culturalGuide.count({
      where: { destinationId, isPublished: true },
    }),
    prisma.culturalGuide.groupBy({
      by: ["signal"],
      where: { destinationId, isPublished: true },
      _count: { signal: true },
    }),
    prisma.culturalGuide.findMany({
      where: { destinationId, isPublished: true },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        summary: true,
        signal: true,
        slug: true,
      },
    }),
  ]);

  const counts = { avoid: 0, consider: 0, recommended: 0 };
  for (const group of signalGroups) {
    if (group.signal === CulturalSignal.AVOID) {
      counts.avoid = group._count.signal;
    } else if (group.signal === CulturalSignal.CONSIDER) {
      counts.consider = group._count.signal;
    } else if (group.signal === CulturalSignal.RECOMMENDED) {
      counts.recommended = group._count.signal;
    }
  }

  return {
    total,
    counts,
    latest,
  };
}

export async function getPublishedCulturalGuide(
  destinationId: string,
  guideSlug: string,
) {
  return prisma.culturalGuide.findFirst({
    where: {
      destinationId,
      slug: guideSlug,
      isPublished: true,
    },
  });
}

export async function listCulturalGuidesForAdmin(destinationId?: string) {
  return prisma.culturalGuide.findMany({
    where: destinationId ? { destinationId } : undefined,
    include: {
      destination: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCulturalGuideById(id: string) {
  return prisma.culturalGuide.findUnique({
    where: { id },
    include: {
      destination: {
        select: { id: true, name: true, slug: true },
      },
    },
  });
}

export async function createCulturalGuide(
  destinationId: string,
  input: CulturalGuideInput,
): Promise<ServiceResult<{ id: string; slug: string }>> {
  const parsed = culturalGuideInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const slug = await uniqueSlugForDestination(destinationId, data.title);
  const now = new Date();

  try {
    const guide = await prisma.culturalGuide.create({
      data: {
        destinationId,
        title: data.title.trim(),
        slug,
        summary: emptyToNull(data.summary),
        description: data.description.trim(),
        context: emptyToNull(data.context),
        whatToDo: emptyToNull(data.whatToDo),
        whatToAvoid: emptyToNull(data.whatToAvoid),
        signal: data.signal,
        normKind: data.normKind,
        importance: data.importance,
        source: emptyToNull(data.source),
        isPublished: data.isPublished,
        publishedAt: data.isPublished ? now : null,
        verificationStatus: data.verificationStatus,
        lastVerifiedAt:
          data.verificationStatus === VerificationStatus.VERIFIED ? now : null,
      },
      select: { id: true, slug: true },
    });

    return { ok: true, data: guide };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, error: "Ya existe una guía con un slug similar." };
    }
    throw error;
  }
}

export async function updateCulturalGuide(
  id: string,
  input: CulturalGuideInput,
): Promise<ServiceResult<{ id: string; slug: string }>> {
  const parsed = culturalGuideInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.culturalGuide.findUnique({
    where: { id },
    select: { id: true, destinationId: true, isPublished: true, publishedAt: true },
  });

  if (!existing) {
    return { ok: false, error: "La guía no existe." };
  }

  const data = parsed.data;
  const slug = await uniqueSlugForDestination(
    existing.destinationId,
    data.title,
    id,
  );
  const now = new Date();

  const guide = await prisma.culturalGuide.update({
    where: { id },
    data: {
      title: data.title.trim(),
      slug,
      summary: emptyToNull(data.summary),
      description: data.description.trim(),
      context: emptyToNull(data.context),
      whatToDo: emptyToNull(data.whatToDo),
      whatToAvoid: emptyToNull(data.whatToAvoid),
      signal: data.signal,
      normKind: data.normKind,
      importance: data.importance,
      source: emptyToNull(data.source),
      isPublished: data.isPublished,
      publishedAt: data.isPublished
        ? existing.publishedAt ?? now
        : existing.publishedAt,
      verificationStatus: data.verificationStatus,
      lastVerifiedAt:
        data.verificationStatus === VerificationStatus.VERIFIED
          ? now
          : undefined,
    },
    select: { id: true, slug: true },
  });

  return { ok: true, data: guide };
}

export async function deleteCulturalGuide(id: string): Promise<ServiceResult<{ id: string }>> {
  try {
    await prisma.culturalGuide.delete({ where: { id } });
    return { ok: true, data: { id } };
  } catch {
    return { ok: false, error: "No se pudo eliminar la guía." };
  }
}
