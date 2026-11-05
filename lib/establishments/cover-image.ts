import { EstablishmentType } from "@prisma/client";
import {
  establishmentCategoryFallback,
  establishmentCoverPath,
  isCuratedEstablishmentCover,
} from "@/lib/establishments/establishment-cover";
import {
  isServiceEstablishmentType,
  serviceTypeCategoryFallback,
  serviceTypeCoverPath,
} from "@/lib/establishments/service-cover";

export type PlaceCoverImage = {
  src: string;
  fallbackSrc: string;
  kind: "place" | "reference";
  alt: string;
  caption: string;
};

type ResolveInput = {
  name: string;
  slug?: string;
  type: EstablishmentType;
  categorySlugs?: string[];
  categoryNames?: string[];
  images?: unknown;
};

function firstImageFromJson(images: unknown): string | null {
  if (!images) return null;
  if (typeof images === "string" && images.trim()) return images.trim();
  if (Array.isArray(images)) {
    for (const item of images) {
      if (typeof item === "string" && item.trim()) return item.trim();
      if (
        item &&
        typeof item === "object" &&
        "url" in item &&
        typeof (item as { url: unknown }).url === "string"
      ) {
        const url = (item as { url: string }).url.trim();
        if (url) return url;
      }
    }
  }
  return null;
}

function coverResult(
  src: string,
  name: string,
  kind: PlaceCoverImage["kind"],
  fallbackSrc: string,
): PlaceCoverImage {
  return {
    src,
    fallbackSrc,
    kind,
    alt: kind === "place" ? `Foto de ${name}` : `Imagen de referencia para ${name}`,
    caption:
      kind === "place"
        ? "Foto del lugar"
        : "Imagen de referencia (no es foto del local)",
  };
}

function resolveReferenceCover(input: ResolveInput): PlaceCoverImage {
  const slug = input.slug?.trim();
  const categorySlugs = input.categorySlugs ?? [];

  if (isServiceEstablishmentType(input.type)) {
    const src = serviceTypeCoverPath(input.type, slug);
    const fallback = serviceTypeCategoryFallback(input.type, slug);
    return coverResult(src, input.name, "reference", fallback);
  }

  const src = establishmentCoverPath(input.type, slug, categorySlugs);
  const fallback = establishmentCategoryFallback(input.type, categorySlugs);
  return coverResult(src, input.name, "reference", fallback);
}

export function resolvePlaceCoverImage(input: ResolveInput): PlaceCoverImage {
  const own = firstImageFromJson(input.images);
  if (own) {
    const fallback = isServiceEstablishmentType(input.type)
      ? serviceTypeCategoryFallback(input.type, input.slug)
      : establishmentCategoryFallback(input.type, input.categorySlugs);
    return coverResult(own, input.name, "place", fallback);
  }

  if (
    input.slug?.trim() ||
    isServiceEstablishmentType(input.type) ||
    isCuratedEstablishmentCover(input.type) ||
    (input.categorySlugs?.length ?? 0) > 0
  ) {
    return resolveReferenceCover(input);
  }

  const fallback = establishmentCategoryFallback(input.type, input.categorySlugs);
  return coverResult(fallback, input.name, "reference", fallback);
}
