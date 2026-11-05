import { prisma } from "@/lib/db/prisma";

export async function isFavorite(userId: string, establishmentId: string) {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_establishmentId: { userId, establishmentId },
    },
    select: { id: true },
  });
  return !!favorite;
}

export async function toggleFavorite(userId: string, establishmentId: string) {
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_establishmentId: { userId, establishmentId },
    },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.favoriteRemoval.create({
        data: {
          userId,
          establishmentId,
          favoriteCreatedAt: existing.createdAt,
        },
      }),
      prisma.favorite.delete({ where: { id: existing.id } }),
    ]);
    return { favorited: false };
  }

  await prisma.favorite.create({
    data: { userId, establishmentId },
  });
  return { favorited: true };
}

export async function listFavoritesForUser(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: {
      establishment: {
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
          categories: { include: { category: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listFavoriteRemovalsForUser(userId: string) {
  return prisma.favoriteRemoval.findMany({
    where: { userId },
    include: {
      establishment: {
        select: {
          name: true,
          slug: true,
          type: true,
          destination: { select: { slug: true } },
        },
      },
    },
    orderBy: { removedAt: "desc" },
  });
}
