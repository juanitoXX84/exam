import { DestinationStatus, EstablishmentType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

export const tripInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres.")
      .max(80, "El nombre es demasiado largo."),
    destinationName: z
      .string()
      .trim()
      .min(2, "Indica un destino.")
      .max(80, "El destino es demasiado largo."),
    startDate: z.string().optional().or(z.literal("")),
    endDate: z.string().optional().or(z.literal("")),
    placeIds: z.array(z.string()).optional(),
  })
  .refine(
    (value) => {
      if (!value.startDate || !value.endDate) return true;
      return value.endDate >= value.startDate;
    },
    {
      message: "La fecha final debe ser igual o posterior a la de inicio.",
      path: ["endDate"],
    },
  );

export type TripInput = z.infer<typeof tripInputSchema>;

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

function parseDate(value?: string) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function listTripsForUser(userId: string) {
  return prisma.trip.findMany({
    where: { userId },
    include: {
      destination: {
        select: { slug: true, name: true, country: true, coverImage: true },
      },
      places: {
        include: {
          establishment: {
            select: { id: true, type: true, name: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTrip(
  userId: string,
  input: TripInput,
): Promise<ServiceResult<{ id: string }>> {
  const parsed = tripInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los datos del viaje.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const startDate = parseDate(parsed.data.startDate);
  const endDate = parseDate(parsed.data.endDate);
  const requestedIds = [...new Set(parsed.data.placeIds ?? [])];

  const [matchedDestination, favoritePlaces] = await Promise.all([
    prisma.destination.findFirst({
      where: {
        status: DestinationStatus.PUBLISHED,
        name: parsed.data.destinationName,
      },
      select: { id: true },
    }),
    requestedIds.length
      ? prisma.favorite.findMany({
          where: {
            userId,
            establishmentId: { in: requestedIds },
          },
          select: { establishmentId: true },
        })
      : Promise.resolve([]),
  ]);

  const allowedIds = new Set(favoritePlaces.map((item) => item.establishmentId));
  const placeIds = requestedIds.filter((id) => allowedIds.has(id));

  const trip = await prisma.trip.create({
    data: {
      userId,
      name: parsed.data.name,
      destinationName: parsed.data.destinationName,
      destinationId: matchedDestination?.id ?? null,
      startDate,
      endDate,
      places: placeIds.length
        ? {
            create: placeIds.map((establishmentId) => ({ establishmentId })),
          }
        : undefined,
    },
    select: { id: true },
  });

  return { ok: true, data: trip };
}

export async function deleteTripForUser(
  userId: string,
  tripId: string,
): Promise<ServiceResult<{ id: string }>> {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId },
    select: { id: true },
  });

  if (!trip) {
    return { ok: false, error: "No encontramos ese viaje." };
  }

  await prisma.trip.delete({ where: { id: trip.id } });
  return { ok: true, data: { id: trip.id } };
}

export function countPlacesByType(
  places: Array<{ establishment: { type: EstablishmentType } }>,
) {
  const counts = {
    restaurants: 0,
    lodging: 0,
    tourism: 0,
    services: 0,
  };

  for (const place of places) {
    if (place.establishment.type === EstablishmentType.RESTAURANT) {
      counts.restaurants += 1;
    } else if (place.establishment.type === EstablishmentType.LODGING) {
      counts.lodging += 1;
    } else if (place.establishment.type === EstablishmentType.ATTRACTION) {
      counts.tourism += 1;
    } else {
      counts.services += 1;
    }
  }

  return counts;
}

export async function getTripDetailForUser(userId: string, tripId: string) {
  return prisma.trip.findFirst({
    where: { id: tripId, userId },
    include: {
      destination: {
        select: { slug: true, name: true, country: true, coverImage: true },
      },
      places: {
        include: {
          establishment: {
            select: {
              id: true,
              name: true,
              type: true,
              slug: true,
              address: true,
              latitude: true,
              longitude: true,
              destination: { select: { slug: true, name: true } },
            },
          },
        },
      },
    },
  });
}
