import Link from "next/link";
import type {
  EstablishmentType,
  PriceRange,
  VerificationStatus,
} from "@prisma/client";
import { VerificationBadge } from "@/components/cultural/badges";
import { FavoriteButton } from "@/components/interactions/favorite-button";
import { ContactPanel } from "@/components/interactions/contact-panel";
import { ReportContentForm } from "@/components/interactions/report-content-form";
import { ReviewsSection } from "@/components/interactions/reviews-section";
import { PlaceDetailTabs } from "@/components/establishments/place-detail-tabs";
import { PlaceMapLinks } from "@/components/establishments/place-map-links";
import { PlaceMiniMap } from "@/components/establishments/place-mini-map";
import { PlaceShareButton } from "@/components/establishments/place-share-button";
import { PlaceCoverImage } from "@/components/establishments/place-cover-image";
import { resolvePlaceCoverImage } from "@/lib/establishments/cover-image";
import {
  PRICE_RANGE_LABELS,
  ratingLabel,
} from "@/lib/establishments/labels";

type ReviewItem = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: { id: string; name: string | null; image: string | null };
};

export type PlaceDetailData = {
  id: string;
  name: string;
  slug: string;
  type: EstablishmentType;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  priceRange?: PriceRange | null;
  averageRating?: number | null;
  verificationStatus: VerificationStatus;
  lastVerifiedAt?: Date | null;
  updatedAt: Date;
  sourceNote?: string | null;
  images?: unknown;
};

type Props = {
  backHref: string;
  destinationSlug: string;
  place: PlaceDetailData;
  categories: string[];
  categorySlugs?: string[];
  reviews: ReviewItem[];
  favorited: boolean;
  isLoggedIn: boolean;
  currentUserId?: string | null;
};

export function PlaceDetailView({
  backHref,
  destinationSlug,
  place,
  categories,
  categorySlugs = [],
  reviews,
  favorited,
  isLoggedIn,
  currentUserId,
}: Props) {
  const description =
    place.description?.trim() || "Sin descripción publicada todavía.";
  const hasCoords = place.latitude != null && place.longitude != null;
  const cover = resolvePlaceCoverImage({
    name: place.name,
    slug: place.slug,
    type: place.type,
    categorySlugs,
    categoryNames: categories,
    images: place.images,
  });
  const meta = [
    ratingLabel(place.averageRating),
    place.priceRange ? PRICE_RANGE_LABELS[place.priceRange] : null,
    ...categories.slice(0, 2),
  ]
    .filter(Boolean)
    .join(" · ");

  const infoPanel = (
    <article className="nemi-place-panel space-y-4">
      <h2 className="nemi-place-panel-title">Descripción</h2>
      <p className="nemi-place-prose">{description}</p>
    </article>
  );

  const reviewsPanel = (
    <article className="nemi-place-panel">
      <ReviewsSection
        establishmentId={place.id}
        reviews={reviews}
        isLoggedIn={isLoggedIn}
        currentUserId={currentUserId}
        standalone
      />
    </article>
  );

  const arrivePanel = (
    <article className="nemi-place-panel space-y-4">
      <h2 className="nemi-place-panel-title">Cómo llegar</h2>
      {place.address ? (
        <p className="nemi-place-prose">{place.address}</p>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          Dirección no publicada todavía.
        </p>
      )}
      {hasCoords ? (
        <PlaceMiniMap
          name={place.name}
          latitude={place.latitude!}
          longitude={place.longitude!}
        />
      ) : null}
      <PlaceMapLinks
        name={place.name}
        address={place.address}
        latitude={place.latitude}
        longitude={place.longitude}
        destinationSlug={destinationSlug}
      />
    </article>
  );

  const contactPanel = (
    <ContactPanel
      establishmentName={place.name}
      phone={place.phone}
      email={place.email}
      website={place.website}
    />
  );

  const sidebar = (
    <>
      <div className="nemi-place-panel space-y-4 text-sm">
        <h2 className="nemi-place-panel-title">Datos</h2>
        <InfoRow icon="pin" label="Dirección" value={place.address} />
        <InfoRow icon="phone" label="Teléfono" value={place.phone} />
        <InfoRow icon="mail" label="Correo" value={place.email} />
        <InfoRow icon="web" label="Web" value={place.website} />
        {hasCoords ? (
          <PlaceMiniMap
            name={place.name}
            latitude={place.latitude!}
            longitude={place.longitude!}
          />
        ) : null}
        <PlaceMapLinks
          name={place.name}
          address={place.address}
          latitude={place.latitude}
          longitude={place.longitude}
          destinationSlug={destinationSlug}
        />
      </div>
      <ReportContentForm
        establishmentId={place.id}
        isLoggedIn={isLoggedIn}
      />
    </>
  );

  return (
    <div className="nemi-place-detail">
      <div className="nemi-place-cover">
        <PlaceCoverImage
          cover={cover}
          className="nemi-place-cover-photo"
          loading="eager"
        />
        <div className="nemi-place-cover-shade" aria-hidden />
        <div className="nemi-container nemi-place-cover-inner">
          <Link href={backHref} className="nemi-place-back">
            ← Volver
          </Link>
          <h1 className="font-display nemi-place-title">{place.name}</h1>
          {meta ? <p className="nemi-place-meta">{meta}</p> : null}
          <div className="nemi-place-cover-actions">
            <FavoriteButton
              establishmentId={place.id}
              initialFavorited={favorited}
              isLoggedIn={isLoggedIn}
              emphasize
            />
            <PlaceShareButton title={place.name} />
            <VerificationBadge
              status={place.verificationStatus}
              updatedAt={place.lastVerifiedAt ?? place.updatedAt}
            />
          </div>
        </div>
      </div>

      <div className="nemi-container nemi-place-body">
        <PlaceDetailTabs
          info={
            <div className="nemi-place-detail-stack">
              {infoPanel}
              {reviewsPanel}
              {contactPanel}
            </div>
          }
          reviews={
            <div className="nemi-place-detail-stack">
              {reviewsPanel}
              {contactPanel}
            </div>
          }
          arrive={arrivePanel}
          sidebar={sidebar}
        />
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: "pin" | "phone" | "mail" | "web";
  label: string;
  value?: string | null;
}) {
  const display = value?.trim();

  return (
    <div className="nemi-place-info-row">
      <span className="nemi-place-info-icon" aria-hidden>
        <InfoGlyph kind={icon} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] tracking-[0.08em] text-[var(--muted)] uppercase">
          {label}
        </p>
        <p
          className={`mt-0.5 break-words ${
            display ? "text-[var(--foreground)]" : "text-[var(--muted)]"
          }`}
        >
          {display || "No dispone"}
        </p>
      </div>
    </div>
  );
}

function InfoGlyph({ kind }: { kind: "pin" | "phone" | "mail" | "web" }) {
  if (kind === "pin") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="10" r="2.2" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "phone") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M7.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 3.5 5.7 2 2 0 0 1 5.5 3.5h2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "mail") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect
          x="3.5"
          y="5.5"
          width="17"
          height="13"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="m4.5 7.5 7.5 6 7.5-6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 12h17M12 3.5c2.8 2.6 4.2 5.5 4.2 8.5S14.8 17.9 12 20.5C9.2 17.9 7.8 15 7.8 12S9.2 6.1 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
