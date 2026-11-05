import Link from "next/link";
import type { EstablishmentListItem } from "@/lib/establishments/listing-types";
import { PlaceCoverImage } from "@/components/establishments/place-cover-image";
import { resolvePlaceCoverImage } from "@/lib/establishments/cover-image";
import { PRICE_RANGE_SHORT } from "@/lib/establishments/labels";
import type { PriceRange } from "@prisma/client";

type Props = {
  establishment: EstablishmentListItem;
  href: string;
};

export function EstablishmentCard({ establishment, href }: Props) {
  const categories = establishment.categories.map((item) => item.category.name);
  const categorySlugs = establishment.categories.map(
    (item) => item.category.slug,
  );
  const cover = resolvePlaceCoverImage({
    name: establishment.name,
    slug: establishment.slug,
    type: establishment.type,
    categorySlugs,
    categoryNames: categories,
    images: establishment.images,
  });
  const rating =
    establishment.averageRating != null && establishment.averageRating > 0
      ? establishment.averageRating.toFixed(1)
      : null;

  return (
    <Link href={href} className="nemi-listing-card group">
      <div className="nemi-listing-card-media">
        <PlaceCoverImage cover={cover} />
        <span className="nemi-listing-card-pin" aria-hidden />
        <span className="nemi-listing-card-route" aria-hidden>
          <svg viewBox="0 0 100 4" preserveAspectRatio="none">
            <path d="M0 2 Q 35 0 55 2 T 100 2" />
          </svg>
        </span>
        {establishment.priceRange ? (
          <span className="nemi-listing-card-price">
            {PRICE_RANGE_SHORT[establishment.priceRange as PriceRange]}
          </span>
        ) : null}
      </div>

      <div className="nemi-listing-card-body">
        <h3 className="nemi-listing-card-title">{establishment.name}</h3>

        <div className="nemi-listing-card-meta">
          {rating ? (
            <span className="nemi-listing-card-rating" aria-label={`${rating} de 5`}>
              ★ {rating}
              {establishment.reviewCount > 0 ? (
                <span className="text-[var(--muted)] font-normal">
                  ({establishment.reviewCount})
                </span>
              ) : null}
            </span>
          ) : (
            <span className="nemi-listing-card-rating is-muted">
              Sin calificación
            </span>
          )}
          {establishment.address?.trim() ? (
            <span className="line-clamp-1">{establishment.address.trim()}</span>
          ) : null}
        </div>

        {establishment.description ? (
          <p className="nemi-listing-card-desc line-clamp-2">
            {establishment.description}
          </p>
        ) : null}

        {categories.length > 0 ? (
          <div className="nemi-listing-card-tags">
            {categories.slice(0, 3).map((name) => (
              <span key={name} className="nemi-listing-card-tag">
                {name}
              </span>
            ))}
          </div>
        ) : null}

        <div className="nemi-listing-card-footer nemi-listing-card-footer--solo">
          <span className="nemi-listing-card-cta">Ver lugar →</span>
        </div>
      </div>
    </Link>
  );
}
