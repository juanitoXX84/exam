import type { Establishment, Category, EstablishmentType, PriceRange } from "@prisma/client";

/** Campos mínimos para tarjetas de listado (menos datos desde la BD). */
export type EstablishmentListItem = {
  id: string;
  name: string;
  slug: string;
  type: EstablishmentType;
  address: string | null;
  description: string | null;
  priceRange: PriceRange | null;
  averageRating: number | null;
  reviewCount: number;
  images: Establishment["images"];
  categories: Array<{ category: Pick<Category, "id" | "name" | "slug"> }>;
};
