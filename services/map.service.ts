import { EstablishmentType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  PRICE_RANGE_SHORT,
  ratingLabel,
} from "@/lib/establishments/labels";
import { ESTABLISHMENT_TYPE_LABELS } from "@/lib/establishments/labels";
import {
  DEFAULT_DESTINATION_CENTER,
  type MapMarker,
  type MapMarkerCategory,
  type MapViewConfig,
} from "@/lib/maps/types";

function toMarkerCategory(type: EstablishmentType): MapMarkerCategory {
  switch (type) {
    case EstablishmentType.RESTAURANT:
      return "RESTAURANT";
    case EstablishmentType.LODGING:
      return "LODGING";
    case EstablishmentType.ATTRACTION:
      return "ATTRACTION";
    case EstablishmentType.CLINIC:
      return "CLINIC";
    case EstablishmentType.HOSPITAL:
      return "HOSPITAL";
    case EstablishmentType.PHARMACY:
      return "PHARMACY";
    case EstablishmentType.GAS_STATION:
      return "GAS_STATION";
    case EstablishmentType.BANK:
      return "BANK";
    case EstablishmentType.OTHER_SERVICE:
      return "OTHER_SERVICE";
    default:
      return "OTHER";
  }
}

function detailPath(destinationSlug: string, type: EstablishmentType, slug: string) {
  if (type === EstablishmentType.RESTAURANT) {
    return `/destinos/${destinationSlug}/restaurantes/${slug}`;
  }
  if (type === EstablishmentType.LODGING) {
    return `/destinos/${destinationSlug}/hospedaje/${slug}`;
  }
  if (type === EstablishmentType.ATTRACTION) {
    return `/destinos/${destinationSlug}/turismo/${slug}`;
  }
  return `/destinos/${destinationSlug}/servicios/${slug}`;
}

export async function listMapMarkersForDestination(
  destinationId: string,
  destinationSlug: string,
  typeFilter?: EstablishmentType,
  limit?: number,
) {
  const establishments = await prisma.establishment.findMany({
    where: {
      destinationId,
      isActive: true,
      latitude: { not: null },
      longitude: { not: null },
      ...(typeFilter ? { type: typeFilter } : {}),
    },
    orderBy: { name: "asc" },
    ...(limit ? { take: limit } : {}),
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      address: true,
      latitude: true,
      longitude: true,
      priceRange: true,
      averageRating: true,
    },
  });

  const markers: MapMarker[] = establishments.map((item) => ({
    id: item.id,
    title: item.name,
    subtitle: item.address ?? undefined,
    latitude: item.latitude as number,
    longitude: item.longitude as number,
    type: item.type,
    category: toMarkerCategory(item.type),
    categoryLabel: ESTABLISHMENT_TYPE_LABELS[item.type],
    href: detailPath(destinationSlug, item.type, item.slug),
    priceLabel: item.priceRange
      ? PRICE_RANGE_SHORT[item.priceRange]
      : undefined,
    ratingLabel: ratingLabel(item.averageRating),
  }));

  return markers;
}

export async function getDestinationMapConfig(
  destinationId: string,
): Promise<MapViewConfig> {
  const destination = await prisma.destination.findUnique({
    where: { id: destinationId },
    select: { latitude: true, longitude: true },
  });

  if (destination?.latitude != null && destination.longitude != null) {
    return {
      center: {
        latitude: destination.latitude,
        longitude: destination.longitude,
      },
      zoom: 13,
    };
  }

  return {
    center: DEFAULT_DESTINATION_CENTER,
    zoom: 13,
  };
}

const MAP_HUB_PREVIEW_LIMIT = 24;

export async function getMapHubPreview(
  destinationId: string,
  destinationSlug: string,
) {
  const [total, markers, config] = await Promise.all([
    prisma.establishment.count({
      where: {
        destinationId,
        isActive: true,
        latitude: { not: null },
        longitude: { not: null },
      },
    }),
    listMapMarkersForDestination(
      destinationId,
      destinationSlug,
      undefined,
      MAP_HUB_PREVIEW_LIMIT,
    ),
    getDestinationMapConfig(destinationId),
  ]);

  return {
    total,
    markers,
    config,
  };
}
