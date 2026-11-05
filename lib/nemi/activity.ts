import { EstablishmentType } from "@prisma/client";
import { establishmentPublicPath } from "@/lib/establishments/paths";

export type NemiActivityKind = "saved" | "unsaved" | "reviewed" | "review_deleted";

export type NemiActivity = {
  id: string;
  kind: NemiActivityKind;
  text: string;
  href: string;
  at: string;
};

type ActivitySource = {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  establishment: {
    name: string;
    slug: string;
    type: EstablishmentType;
    destination: { slug: string };
  };
};

type ReviewDeletionSource = {
  id: string;
  deletedAt: Date;
  reviewCreatedAt?: Date | null;
  reviewUpdatedAt?: Date | null;
  establishment: {
    name: string;
    slug: string;
    type: EstablishmentType;
    destination: { slug: string };
  };
};

type FavoriteRemovalSource = {
  id: string;
  removedAt: Date;
  favoriteCreatedAt?: Date | null;
  establishment: {
    name: string;
    slug: string;
    type: EstablishmentType;
    destination: { slug: string };
  };
};

function reviewActivityText(
  name: string,
  createdAt: Date,
  updatedAt?: Date | null,
) {
  const updated =
    updatedAt != null && updatedAt.getTime() - createdAt.getTime() > 120_000;
  return updated
    ? `Actualizaste una reseña de ${name}`
    : `Publicaste una reseña de ${name}`;
}

function reviewActivityAt(createdAt: Date, updatedAt?: Date | null) {
  return (updatedAt ?? createdAt).toISOString();
}

export function buildAccountActivity(input: {
  favorites: ActivitySource[];
  favoriteRemovals?: FavoriteRemovalSource[];
  reviews: ActivitySource[];
  reviewDeletions?: ReviewDeletionSource[];
}): NemiActivity[] {
  const items: NemiActivity[] = [];

  for (const favorite of input.favorites) {
    items.push({
      id: `saved-${favorite.id}`,
      kind: "saved",
      text: `Guardaste ${favorite.establishment.name}`,
      href: establishmentPublicPath(
        favorite.establishment.destination.slug,
        favorite.establishment.type,
        favorite.establishment.slug,
      ),
      at: favorite.createdAt.toISOString(),
    });
  }

  for (const removal of input.favoriteRemovals ?? []) {
    if (removal.favoriteCreatedAt) {
      items.push({
        id: `saved-removed-${removal.id}`,
        kind: "saved",
        text: `Guardaste ${removal.establishment.name}`,
        href: establishmentPublicPath(
          removal.establishment.destination.slug,
          removal.establishment.type,
          removal.establishment.slug,
        ),
        at: removal.favoriteCreatedAt.toISOString(),
      });
    }

    items.push({
      id: `unsaved-${removal.id}`,
      kind: "unsaved",
      text: `Quitaste ${removal.establishment.name} de favoritos`,
      href: establishmentPublicPath(
        removal.establishment.destination.slug,
        removal.establishment.type,
        removal.establishment.slug,
      ),
      at: removal.removedAt.toISOString(),
    });
  }

  for (const review of input.reviews) {
    items.push({
      id: `reviewed-${review.id}`,
      kind: "reviewed",
      text: reviewActivityText(
        review.establishment.name,
        review.createdAt,
        review.updatedAt,
      ),
      href: establishmentPublicPath(
        review.establishment.destination.slug,
        review.establishment.type,
        review.establishment.slug,
      ),
      at: reviewActivityAt(review.createdAt, review.updatedAt),
    });
  }

  for (const deletion of input.reviewDeletions ?? []) {
    if (deletion.reviewCreatedAt) {
      items.push({
        id: `reviewed-deleted-${deletion.id}`,
        kind: "reviewed",
        text: reviewActivityText(
          deletion.establishment.name,
          deletion.reviewCreatedAt,
          deletion.reviewUpdatedAt,
        ),
        href: establishmentPublicPath(
          deletion.establishment.destination.slug,
          deletion.establishment.type,
          deletion.establishment.slug,
        ),
        at: reviewActivityAt(
          deletion.reviewCreatedAt,
          deletion.reviewUpdatedAt,
        ),
      });
    }

    items.push({
      id: `review-deleted-${deletion.id}`,
      kind: "review_deleted",
      text: `Eliminaste tu reseña de ${deletion.establishment.name}`,
      href: establishmentPublicPath(
        deletion.establishment.destination.slug,
        deletion.establishment.type,
        deletion.establishment.slug,
      ),
      at: deletion.deletedAt.toISOString(),
    });
  }

  return items.sort((a, b) => (a.at < b.at ? 1 : -1));
}
