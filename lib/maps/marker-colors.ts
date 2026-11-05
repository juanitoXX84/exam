import type { MapMarkerCategory } from "@/lib/maps/types";

/** Colores de pin por categoría — legibles sobre tiles CARTO dark. */
export const MAP_MARKER_COLORS: Record<MapMarkerCategory, string> = {
  RESTAURANT: "#2dd4bf",
  LODGING: "#c4a882",
  ATTRACTION: "#6ea8d6",
  CLINIC: "#d4a0c4",
  HOSPITAL: "#e07a6a",
  PHARMACY: "#7cb87a",
  GAS_STATION: "#d4894a",
  BANK: "#8eb0d0",
  OTHER_SERVICE: "#b8a078",
  OTHER: "#9a9084",
};
