/**
 * Enlace a Google Maps para contrastar la ficha NEMI con datos públicos.
 * Prioriza nombre + dirección (más fiable que solo coordenadas aproximadas).
 */
export function googleMapsSearchUrl(input: {
  title: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}) {
  const named = [input.title, input.address]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");

  if (named) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(named)}`;
  }

  if (
    input.latitude != null &&
    input.longitude != null &&
    Number.isFinite(input.latitude) &&
    Number.isFinite(input.longitude)
  ) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${input.latitude},${input.longitude}`,
    )}`;
  }

  return null;
}
