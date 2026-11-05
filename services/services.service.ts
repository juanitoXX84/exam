import { EstablishmentType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { ESTABLISHMENT_TYPE_LABELS } from "@/lib/establishments/labels";

export const SERVICE_ESTABLISHMENT_TYPES = [
  EstablishmentType.CLINIC,
  EstablishmentType.HOSPITAL,
  EstablishmentType.PHARMACY,
  EstablishmentType.GAS_STATION,
  EstablishmentType.BANK,
  EstablishmentType.OTHER_SERVICE,
] as const;

export type ServiceEstablishmentType =
  (typeof SERVICE_ESTABLISHMENT_TYPES)[number];

export function isServiceEstablishmentType(
  value: string,
): value is ServiceEstablishmentType {
  return (SERVICE_ESTABLISHMENT_TYPES as readonly string[]).includes(value);
}

export const SERVICE_TYPE_OPTIONS = SERVICE_ESTABLISHMENT_TYPES.map((type) => ({
  value: type,
  label: ESTABLISHMENT_TYPE_LABELS[type],
}));

export async function listActiveServices(
  destinationId: string,
  typeFilter?: ServiceEstablishmentType,
  q?: string,
) {
  return prisma.establishment.findMany({
    where: {
      destinationId,
      isActive: true,
      type: typeFilter
        ? typeFilter
        : { in: [...SERVICE_ESTABLISHMENT_TYPES] },
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
              { address: { contains: q } },
              { phone: { contains: q } },
            ],
          }
        : {}),
    },
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
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
}

export async function getServicesHubPreview(destinationId: string) {
  const [total, latest] = await Promise.all([
    prisma.establishment.count({
      where: {
        destinationId,
        isActive: true,
        type: { in: [...SERVICE_ESTABLISHMENT_TYPES] },
      },
    }),
    prisma.establishment.findMany({
      where: {
        destinationId,
        isActive: true,
        type: { in: [...SERVICE_ESTABLISHMENT_TYPES] },
      },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { id: true, name: true, slug: true, type: true },
    }),
  ]);

  return { total, latest };
}
