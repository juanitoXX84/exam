import { DestinationStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export type VisitedDestination = {
  slug: string;
  name: string;
  country: string;
  region: string | null;
  coverImage: string | null;
  visitedAt: Date;
};

export async function recordDestinationVisit(
  userId: string,
  destinationId: string,
) {
  await prisma.destinationVisit.upsert({
    where: {
      userId_destinationId: { userId, destinationId },
    },
    create: { userId, destinationId },
    update: { visitedAt: new Date() },
  });
}

export async function listVisitedDestinationsForUser(
  userId: string,
): Promise<VisitedDestination[]> {
  const visits = await prisma.destinationVisit.findMany({
    where: {
      userId,
      destination: { status: DestinationStatus.PUBLISHED },
    },
    include: {
      destination: {
        select: {
          slug: true,
          name: true,
          country: true,
          region: true,
          coverImage: true,
        },
      },
    },
    orderBy: { visitedAt: "desc" },
  });

  return visits.map((visit) => ({
    slug: visit.destination.slug,
    name: visit.destination.name,
    country: visit.destination.country,
    region: visit.destination.region,
    coverImage: visit.destination.coverImage,
    visitedAt: visit.visitedAt,
  }));
}
