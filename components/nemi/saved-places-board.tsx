"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toggleFavoriteAction } from "@/app/actions/favorite";
import { IconHeart } from "@/components/nemi/me-icons";
import { PlaceCoverImage } from "@/components/establishments/place-cover-image";
import { resolvePlaceCoverImage } from "@/lib/establishments/cover-image";
import {
  ESTABLISHMENT_TYPE_LABELS,
  PRICE_RANGE_SHORT,
} from "@/lib/establishments/labels";
import { establishmentPublicPath } from "@/lib/establishments/paths";
import {
  matchesPlaceFilter,
  type NemiSavedPlace,
  type PlaceFilter,
} from "@/lib/nemi/saved-place";

const FILTERS: Array<{ value: PlaceFilter; label: string }> = [
  { value: "ALL", label: "Todos" },
  { value: "RESTAURANT", label: "Restaurantes" },
  { value: "LODGING", label: "Hospedaje" },
  { value: "ATTRACTION", label: "Turismo" },
  { value: "SERVICES", label: "Servicios" },
];

type Props = {
  places: NemiSavedPlace[];
};

export function SavedPlacesBoard({ places }: Props) {
  const [filter, setFilter] = useState<PlaceFilter>("ALL");

  const visible = useMemo(
    () => places.filter((place) => matchesPlaceFilter(place.type, filter)),
    [places, filter],
  );

  return (
    <section id="lugares" className="nemi-me-block">
      <div className="nemi-me-block-head">
        <div>
          <p className="nemi-me-section-eyebrow">Favoritos</p>
          <h2 className="nemi-me-h2 font-display">Mis lugares</h2>
          <p className="nemi-me-lead">
            Los lugares que has guardado para consultar después.
          </p>
        </div>
        {places.length > 0 ? (
          <Link href="/cuenta/favoritos" className="nemi-me-more">
            Ver todos
          </Link>
        ) : null}
      </div>

      {places.length > 0 ? (
        <div className="nemi-me-filters" role="tablist" aria-label="Filtrar lugares">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={filter === item.value}
              className={`nemi-me-chip${filter === item.value ? " is-active" : ""}`}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      {places.length === 0 ? (
        <EmptyPlaces />
      ) : visible.length === 0 ? (
        <p className="nemi-me-empty-copy">
          No hay lugares guardados en esta categoría.
        </p>
      ) : (
        <div className="nemi-me-places">
          {visible.map((place) => {
            const href = establishmentPublicPath(
              place.destinationSlug,
              place.type,
              place.slug,
            );
            const cover = resolvePlaceCoverImage({
              name: place.name,
              slug: place.slug,
              type: place.type,
              categorySlugs: place.categorySlugs,
              categoryNames: place.categoryNames,
              images: place.images,
            });
            const location = [place.destinationName, place.destinationRegion]
              .filter(Boolean)
              .join(", ");
            const rating =
              place.averageRating && place.averageRating > 0
                ? place.averageRating.toFixed(1)
                : null;

            return (
              <article key={place.favoriteId} className="nemi-me-place">
                <div className="nemi-me-place-media">
                  <Link href={href}>
                    <PlaceCoverImage cover={cover} />
                  </Link>
                  <form action={toggleFavoriteAction} className="nemi-me-heart">
                    <input
                      type="hidden"
                      name="establishmentId"
                      value={place.establishmentId}
                    />
                    <button type="submit" aria-label={`Quitar ${place.name} de favoritos`}>
                      <IconHeart />
                    </button>
                  </form>
                </div>
                <div className="nemi-me-place-body">
                  <p className="nemi-me-place-cat">
                    {ESTABLISHMENT_TYPE_LABELS[place.type]}
                  </p>
                  <h3 className="nemi-me-place-name">
                    <Link href={href}>{place.name}</Link>
                  </h3>
                  <p className="nemi-me-meta">{location}</p>
                  <p className="nemi-me-place-stats">
                    {rating ? (
                      <>
                        <span className="nemi-me-stars" aria-label={`${rating} de 5`}>
                          ★ {rating}
                        </span>
                        {place.reviewCount > 0 ? (
                          <span>({place.reviewCount})</span>
                        ) : null}
                      </>
                    ) : (
                      <span>Sin calificación</span>
                    )}
                    {place.priceRange ? (
                      <span className="nemi-me-price">
                        {PRICE_RANGE_SHORT[place.priceRange]}
                      </span>
                    ) : null}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function EmptyPlaces() {
  return (
    <div className="nemi-me-empty">
      <span className="nemi-me-empty-icon" aria-hidden>
        <IconHeart />
      </span>
      <p className="nemi-me-empty-title">No tienes lugares guardados todavía.</p>
      <p className="nemi-me-empty-copy">
        Explora destinos y guarda los lugares que quieras tener a mano.
      </p>
    </div>
  );
}
