import {
  EstablishmentType,
  PriceRange,
  Prisma,
  VerificationStatus,
} from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/format";

export const establishmentInputSchema = z.object({
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  address: z.string().trim().max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .pipe(z.string().email("Correo inválido.").optional()),
  website: z
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .pipe(z.string().url("URL inválida.").optional()),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  priceRange: z.nativeEnum(PriceRange).optional().nullable(),
  averageRating: z.coerce.number().min(0).max(5).optional().nullable(),
  acceptsReservations: z.boolean().default(false),
  isActive: z.boolean().default(true),
  verificationStatus: z
    .nativeEnum(VerificationStatus)
    .default(VerificationStatus.PENDING),
  sourceNote: z.string().trim().max(255).optional().or(z.literal("")),
  categoryIds: z.array(z.string()).default([]),
  type: z.nativeEnum(EstablishmentType).default(EstablishmentType.RESTAURANT),
});

export type EstablishmentInput = z.infer<typeof establishmentInputSchema>;

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

function emptyToNull(value?: string | null) {
  if (!value || value.trim() === "") return null;
  return value.trim();
}

async function uniqueSlug(
  destinationId: string,
  name: string,
  excludeId?: string,
) {
  const base = slugify(name) || "establecimiento";
  let candidate = base;
  let attempt = 1;

  while (true) {
    const existing = await prisma.establishment.findFirst({
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

export type EstablishmentListFilters = {
  priceRange?: PriceRange;
  categorySlug?: string;
  minRating?: number;
  sort?: "rating" | "price_asc" | "price_desc" | "name";
  q?: string;
};

const priceOrder: Record<PriceRange, number> = {
  BUDGET: 1,
  MODERATE: 2,
  EXPENSIVE: 3,
  LUXURY: 4,
};

export async function listActiveEstablishments(
  destinationId: string,
  type: EstablishmentType,
  filters: EstablishmentListFilters = {},
) {
  const where: Prisma.EstablishmentWhereInput = {
    destinationId,
    type,
    isActive: true,
    ...(filters.priceRange ? { priceRange: filters.priceRange } : {}),
    ...(filters.minRating
      ? { averageRating: { gte: filters.minRating } }
      : {}),
    ...(filters.q
      ? {
          OR: [
            { name: { contains: filters.q } },
            { description: { contains: filters.q } },
            { address: { contains: filters.q } },
          ],
        }
      : {}),
    ...(filters.categorySlug
      ? {
          categories: {
            some: {
              category: { slug: filters.categorySlug },
            },
          },
        }
      : {}),
  };

  const needsPriceSort =
    filters.sort === "price_asc" || filters.sort === "price_desc";

  const orderBy: Prisma.EstablishmentOrderByWithRelationInput[] =
    filters.sort === "name"
      ? [{ name: "asc" }]
      : !needsPriceSort
        ? [{ averageRating: "desc" }, { name: "asc" }]
        : [{ name: "asc" }];

  const items = await prisma.establishment.findMany({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      address: true,
      description: true,
      priceRange: true,
      averageRating: true,
      reviewCount: true,
      images: true,
      categories: {
        select: {
          category: { select: { id: true, name: true, slug: true } },
        },
      },
    },
    orderBy,
  });

  if (!needsPriceSort) {
    return items;
  }

  const sorted = [...items];
  sorted.sort(
    (a, b) =>
      (filters.sort === "price_asc" ? 1 : -1) *
      ((a.priceRange ? priceOrder[a.priceRange] : 99) -
        (b.priceRange ? priceOrder[b.priceRange] : 99)),
  );
  return sorted;
}

export async function getActiveEstablishment(
  destinationId: string,
  slug: string,
  type?: EstablishmentType,
) {
  return prisma.establishment.findFirst({
    where: {
      destinationId,
      slug,
      isActive: true,
      ...(type ? { type } : {}),
    },
    include: {
      categories: { include: { category: true } },
      destination: { select: { id: true, name: true, slug: true } },
    },
  });
}

export async function listEstablishmentsForAdmin(
  filters: {
    type?: EstablishmentType;
    types?: EstablishmentType[];
    destinationId?: string;
  } = {},
) {
  const { type, types, destinationId } = filters;
  const typeFilter = types?.length
    ? { type: { in: types } }
    : type
      ? { type }
      : {};

  return prisma.establishment.findMany({
    where: {
      ...typeFilter,
      ...(destinationId ? { destinationId } : {}),
    },
    include: {
      destination: { select: { id: true, name: true, slug: true } },
      categories: { include: { category: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getEstablishmentById(id: string) {
  return prisma.establishment.findUnique({
    where: { id },
    include: {
      destination: { select: { id: true, name: true, slug: true } },
      categories: { include: { category: true } },
    },
  });
}

export async function listRestaurantCategories() {
  return listCategoriesByType(EstablishmentType.RESTAURANT);
}

export async function listCategoriesByType(type: EstablishmentType) {
  return prisma.category.findMany({
    where: {
      OR: [
        { type },
        { AND: [{ isGlobal: true }, { type }] },
      ],
    },
    orderBy: { name: "asc" },
  });
}

export async function listCatalogCategories() {
  return prisma.category.findMany({
    where: {
      type: {
        in: [
          EstablishmentType.RESTAURANT,
          EstablishmentType.LODGING,
          EstablishmentType.ATTRACTION,
        ],
      },
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
}

export async function getRestaurantHubPreview(destinationId: string) {
  return getEstablishmentHubPreview(
    destinationId,
    EstablishmentType.RESTAURANT,
  );
}

export async function getLodgingHubPreview(destinationId: string) {
  return getEstablishmentHubPreview(destinationId, EstablishmentType.LODGING);
}

export async function getAttractionHubPreview(destinationId: string) {
  return getEstablishmentHubPreview(
    destinationId,
    EstablishmentType.ATTRACTION,
  );
}

export async function getEstablishmentHubPreview(
  destinationId: string,
  type: EstablishmentType,
) {
  const [total, latest] = await Promise.all([
    prisma.establishment.count({
      where: {
        destinationId,
        type,
        isActive: true,
      },
    }),
    prisma.establishment.findMany({
      where: {
        destinationId,
        type,
        isActive: true,
      },
      orderBy: { averageRating: "desc" },
      take: 3,
      select: {
        id: true,
        name: true,
        slug: true,
        priceRange: true,
        averageRating: true,
      },
    }),
  ]);

  return { total, latest };
}

export async function createEstablishment(
  destinationId: string,
  input: EstablishmentInput,
): Promise<ServiceResult<{ id: string; slug: string }>> {
  const parsed = establishmentInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const slug = await uniqueSlug(destinationId, data.name);
  const now = new Date();

  try {
    const created = await prisma.establishment.create({
      data: {
        destinationId,
        type: data.type,
        slug,
        name: data.name.trim(),
        description: emptyToNull(data.description),
        address: emptyToNull(data.address),
        phone: emptyToNull(data.phone),
        email: data.email ?? null,
        website: data.website ?? null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        priceRange: data.priceRange ?? null,
        averageRating: data.averageRating ?? 0,
        acceptsReservations: data.acceptsReservations,
        isActive: data.isActive,
        verificationStatus: data.verificationStatus,
        lastVerifiedAt:
          data.verificationStatus === VerificationStatus.VERIFIED ? now : null,
        sourceNote: emptyToNull(data.sourceNote),
        categories: data.categoryIds.length
          ? {
              create: data.categoryIds.map((categoryId) => ({ categoryId })),
            }
          : undefined,
      },
      select: { id: true, slug: true },
    });

    return { ok: true, data: created };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, error: "Ya existe un establecimiento similar." };
    }
    throw error;
  }
}

export async function updateEstablishment(
  id: string,
  input: EstablishmentInput,
): Promise<ServiceResult<{ id: string; slug: string }>> {
  const parsed = establishmentInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.establishment.findUnique({
    where: { id },
    select: { id: true, destinationId: true },
  });
  if (!existing) {
    return { ok: false, error: "El establecimiento no existe." };
  }

  const data = parsed.data;
  const slug = await uniqueSlug(existing.destinationId, data.name, id);
  const now = new Date();

  const updated = await prisma.$transaction(async (tx) => {
    await tx.establishmentCategory.deleteMany({
      where: { establishmentId: id },
    });

    return tx.establishment.update({
      where: { id },
      data: {
        type: data.type,
        slug,
        name: data.name.trim(),
        description: emptyToNull(data.description),
        address: emptyToNull(data.address),
        phone: emptyToNull(data.phone),
        email: data.email ?? null,
        website: data.website ?? null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        priceRange: data.priceRange ?? null,
        averageRating: data.averageRating ?? 0,
        acceptsReservations: data.acceptsReservations,
        isActive: data.isActive,
        verificationStatus: data.verificationStatus,
        lastVerifiedAt:
          data.verificationStatus === VerificationStatus.VERIFIED
            ? now
            : undefined,
        sourceNote: emptyToNull(data.sourceNote),
        categories: data.categoryIds.length
          ? {
              create: data.categoryIds.map((categoryId) => ({ categoryId })),
            }
          : undefined,
      },
      select: { id: true, slug: true },
    });
  });

  return { ok: true, data: updated };
}

export async function deleteEstablishment(
  id: string,
): Promise<ServiceResult<{ id: string }>> {
  try {
    await prisma.establishment.delete({ where: { id } });
    return { ok: true, data: { id } };
  } catch {
    return { ok: false, error: "No se pudo eliminar el establecimiento." };
  }
}
