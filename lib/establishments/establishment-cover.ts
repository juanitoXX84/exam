import { EstablishmentType } from "@prisma/client";
import { isServiceEstablishmentType } from "@/lib/establishments/service-cover";

const CATEGORY_COVERS: Record<string, string> = {
  mexicana: "/destinations/slrc/places/ref/mexicana.jpg",
  mariscos: "/destinations/slrc/places/ref/mariscos.jpg",
  "cafe-y-postres": "/destinations/slrc/places/ref/cafe.jpg",
  "comida-rapida": "/destinations/slrc/places/ref/comida-rapida.jpg",
  hotel: "/destinations/slrc/categories/hospedaje.jpg",
  motel: "/destinations/slrc/categories/hospedaje.jpg",
  "otro-alojamiento": "/destinations/slrc/categories/hospedaje.jpg",
  "plaza-parque": "/destinations/slrc/places/ref/plaza-parque.jpg",
  "cultura-local": "/destinations/slrc/places/ref/cultura-local.jpg",
  mirador: "/destinations/slrc/places/ref/mirador.jpg",
};

const TYPE_COVERS: Record<EstablishmentType, string> = {
  RESTAURANT: "/destinations/slrc/categories/restaurantes.jpg",
  LODGING: "/destinations/slrc/categories/hospedaje.jpg",
  ATTRACTION: "/destinations/slrc/categories/turismo.jpg",
  CLINIC: "/destinations/slrc/categories/clinica.jpg",
  HOSPITAL: "/destinations/slrc/categories/hospital.jpg",
  PHARMACY: "/destinations/slrc/categories/farmacia.jpg",
  GAS_STATION: "/destinations/slrc/categories/gasolinera.jpg",
  BANK: "/destinations/slrc/categories/banco.jpg",
  OTHER_SERVICE: "/destinations/slrc/categories/tienda.jpg",
};

/** Portada curada por slug cuando hay foto temática específica. */
const SLUG_COVERS: Record<string, string> = {
  "el-herradero": "/destinations/slrc/places/el-herradero.jpg",
  "el-parianchi": "/destinations/slrc/places/el-parianchi.jpg",
  "pez-gallo": "/destinations/slrc/places/pez-gallo.jpg",
  "nana-tona": "/destinations/slrc/places/nana-tona.jpg",
  "las-cazuelas": "/destinations/slrc/places/las-cazuelas.jpg",
  "hotel-santa-lucia": "/destinations/slrc/places/hotel-santa-lucia.jpg",
  "hotel-san-angel-spa": "/destinations/slrc/places/hotel-san-angel-spa.jpg",
  "hotel-san-antonio": "/destinations/slrc/places/hotel-san-antonio.jpg",
  "653-hotel": "/destinations/slrc/places/653-hotel.jpg",
  "hotel-panda-inn": "/destinations/slrc/places/hotel-panda-inn.jpg",
  "bosque-de-la-ciudad": "/destinations/slrc/places/bosque-de-la-ciudad.jpg",
  "museo-regional": "/destinations/slrc/places/museo-regional.jpg",
  "plaza-benito-juarez": "/destinations/slrc/places/plaza-benito-juarez.jpg",
};

export function establishmentCategoryFallback(
  type: EstablishmentType,
  categorySlugs?: string[],
): string {
  for (const slug of categorySlugs ?? []) {
    const cover = CATEGORY_COVERS[slug];
    if (cover) return cover;
  }
  return TYPE_COVERS[type];
}

export function establishmentCoverPath(
  type: EstablishmentType,
  slug?: string,
  categorySlugs?: string[],
): string {
  if (isServiceEstablishmentType(type)) {
    return TYPE_COVERS[type];
  }

  const trimmed = slug?.trim();
  if (trimmed && SLUG_COVERS[trimmed]) {
    return SLUG_COVERS[trimmed];
  }

  for (const categorySlug of categorySlugs ?? []) {
    const cover = CATEGORY_COVERS[categorySlug];
    if (cover) return cover;
  }

  return TYPE_COVERS[type];
}

export function isCuratedEstablishmentCover(type: EstablishmentType) {
  return (
    type === EstablishmentType.RESTAURANT ||
    type === EstablishmentType.LODGING ||
    type === EstablishmentType.ATTRACTION
  );
}
