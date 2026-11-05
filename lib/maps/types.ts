import { EstablishmentType } from "@prisma/client";

/**
 * Contrato de mapas de NEMI.
 * Implementación actual: Leaflet + OpenStreetMap.
 */

export type MapCoordinates = {
  latitude: number;
  longitude: number;
};

export type MapMarkerCategory =
  | "RESTAURANT"
  | "LODGING"
  | "ATTRACTION"
  | "CLINIC"
  | "HOSPITAL"
  | "PHARMACY"
  | "GAS_STATION"
  | "BANK"
  | "OTHER_SERVICE"
  | "OTHER";

export type MapMarker = MapCoordinates & {
  id: string;
  title: string;
  subtitle?: string;
  type: EstablishmentType;
  category: MapMarkerCategory;
  categoryLabel: string;
  href?: string;
  priceLabel?: string;
  ratingLabel?: string;
};

export type MapViewConfig = {
  center: MapCoordinates;
  zoom: number;
};

export type MapProviderName = "leaflet-osm";

export const ACTIVE_MAP_PROVIDER: MapProviderName = "leaflet-osm";

/** Centro por defecto de SLRC si el destino no tiene coordenadas. */
export const DEFAULT_DESTINATION_CENTER: MapCoordinates = {
  latitude: 32.4769,
  longitude: -114.7654,
};
