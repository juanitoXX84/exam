import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { INPUT_LIMITS } from "@/lib/validators/limits";

export const reviewInputSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z
    .string()
    .trim()
    .max(
      INPUT_LIMITS.reviewCommentMax,
      `El comentario no puede superar ${INPUT_LIMITS.reviewCommentMax} caracteres.`,
    )
    .optional()
    .or(z.literal("")),
});

export type ReviewInput = z.infer<typeof reviewInputSchema>;

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

async function recalculateRating(establishmentId: string) {
  const aggregate = await prisma.review.aggregate({
    where: { establishmentId, isVisible: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.establishment.update({
    where: { id: establishmentId },
    data: {
      averageRating: aggregate._avg.rating ?? 0,
      reviewCount: aggregate._count.rating,
    },
  });
}

export async function listReviewsForAdmin() {
  return prisma.review.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      establishment: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          destination: { select: { slug: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteReviewForAdmin(
  reviewId: string,
  adminUserId: string,
): Promise<ServiceResult<{ id: string }>> {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: {
      id: true,
      userId: true,
      establishmentId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!review) {
    return { ok: false, error: "No encontramos esa reseña." };
  }

  await prisma.$transaction([
    prisma.reviewDeletion.create({
      data: {
        userId: review.userId,
        establishmentId: review.establishmentId,
        reviewCreatedAt: review.createdAt,
        reviewUpdatedAt: review.updatedAt,
      },
    }),
    prisma.review.delete({ where: { id: review.id } }),
  ]);

  await recalculateRating(review.establishmentId);
  return { ok: true, data: { id: review.id } };
}

export async function deleteReviewForUser(
  userId: string,
  reviewId: string,
): Promise<ServiceResult<{ id: string }>> {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, userId },
    select: {
      id: true,
      establishmentId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!review) {
    return { ok: false, error: "No encontramos esa reseña." };
  }

  await prisma.$transaction([
    prisma.reviewDeletion.create({
      data: {
        userId,
        establishmentId: review.establishmentId,
        reviewCreatedAt: review.createdAt,
        reviewUpdatedAt: review.updatedAt,
      },
    }),
    prisma.review.delete({ where: { id: review.id } }),
  ]);
  await recalculateRating(review.establishmentId);
  return { ok: true, data: { id: review.id } };
}

export async function listReviewDeletionsForUser(userId: string) {
  return prisma.reviewDeletion.findMany({
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
    orderBy: { deletedAt: "desc" },
  });
}

export async function listVisibleReviews(establishmentId: string) {
  return prisma.review.findMany({
    where: { establishmentId, isVisible: true },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listReviewsForUser(userId: string) {
  return prisma.review.findMany({
    where: { userId },
    include: {
      establishment: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          images: true,
          destination: {
            select: { slug: true, name: true, country: true },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function upsertReview(
  userId: string,
  establishmentId: string,
  input: ReviewInput,
): Promise<ServiceResult<{ id: string }>> {
  const parsed = reviewInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa la reseña.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const comment =
    parsed.data.comment && parsed.data.comment.trim() !== ""
      ? parsed.data.comment.trim()
      : null;

  const review = await prisma.review.upsert({
    where: {
      userId_establishmentId: { userId, establishmentId },
    },
    update: {
      rating: parsed.data.rating,
      comment,
      isVisible: true,
    },
    create: {
      userId,
      establishmentId,
      rating: parsed.data.rating,
      comment,
    },
    select: { id: true },
  });

  await recalculateRating(establishmentId);
  return { ok: true, data: review };
}
