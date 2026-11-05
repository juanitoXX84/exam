import { EstablishmentType, type PriceRange } from "@prisma/client";

export type NemiSavedPlace = {
  favoriteId: string;
  establishmentId: string;
  name: string;
  type: EstablishmentType;
  slug: string;
  priceRange?: PriceRange | null;
  averageRating?: number | null;
  images?: unknown;
  categorySlugs: string[];
  categoryNames: string[];
  destinationName: string;
  destinationSlug: string;
  destinationRegion: string;
  country: string;
  reviewCount: number;
};

export type PlaceFilter = "ALL" | "RESTAURANT" | "LODGING" | "ATTRACTION" | "SERVICES";

const SERVICE_TYPES: EstablishmentType[] = [
  EstablishmentType.CLINIC,
  EstablishmentType.HOSPITAL,
  EstablishmentType.PHARMACY,
  EstablishmentType.GAS_STATION,
  EstablishmentType.BANK,
  EstablishmentType.OTHER_SERVICE,
];

export function matchesPlaceFilter(type: EstablishmentType, filter: PlaceFilter) {
  if (filter === "ALL") return true;
  if (filter === "SERVICES") return SERVICE_TYPES.includes(type);
  return type === filter;
}
