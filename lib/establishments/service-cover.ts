import { EstablishmentType } from "@prisma/client";

const SERVICE_TYPES = new Set<EstablishmentType>([
  EstablishmentType.PHARMACY,
  EstablishmentType.HOSPITAL,
  EstablishmentType.CLINIC,
  EstablishmentType.GAS_STATION,
  EstablishmentType.BANK,
  EstablishmentType.OTHER_SERVICE,
]);

function otherServiceCategory(slug?: string) {
  const key = slug?.toLowerCase() ?? "";
  if (key.includes("bodega") || key.includes("walmart") || key.includes("aurrera")) {
    return "/destinations/slrc/categories/supermercado.jpg";
  }
  return "/destinations/slrc/categories/tienda.jpg";
}

/** Imagen de referencia por servicio (no foto del local). */
export function serviceTypeCoverPath(
  type: EstablishmentType,
  slug?: string,
): string {
  if (slug?.trim()) {
    return `/destinations/slrc/services/${slug.trim()}.jpg`;
  }

  return serviceTypeCategoryFallback(type, slug);
}

export function serviceTypeCategoryFallback(
  type: EstablishmentType,
  slug?: string,
): string {
  switch (type) {
    case EstablishmentType.PHARMACY:
      return "/destinations/slrc/categories/farmacia.jpg";
    case EstablishmentType.HOSPITAL:
      return "/destinations/slrc/categories/hospital.jpg";
    case EstablishmentType.CLINIC:
      return "/destinations/slrc/categories/clinica.jpg";
    case EstablishmentType.GAS_STATION:
      return "/destinations/slrc/categories/gasolinera.jpg";
    case EstablishmentType.BANK:
      return "/destinations/slrc/categories/banco.jpg";
    case EstablishmentType.OTHER_SERVICE:
      return otherServiceCategory(slug);
    default:
      return "/destinations/slrc/categories/servicios.jpg";
  }
}

export function isServiceEstablishmentType(type: EstablishmentType) {
  return SERVICE_TYPES.has(type);
}
