import { EstablishmentType } from "@prisma/client";

export function establishmentPublicPath(
  destinationSlug: string,
  type: EstablishmentType,
  slug: string,
) {
  switch (type) {
    case EstablishmentType.RESTAURANT:
      return `/destinos/${destinationSlug}/restaurantes/${slug}`;
    case EstablishmentType.LODGING:
      return `/destinos/${destinationSlug}/hospedaje/${slug}`;
    case EstablishmentType.ATTRACTION:
      return `/destinos/${destinationSlug}/turismo/${slug}`;
    default:
      return `/destinos/${destinationSlug}/servicios/${slug}`;
  }
}
