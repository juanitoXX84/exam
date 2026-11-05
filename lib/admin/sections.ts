import { EstablishmentType } from "@prisma/client";
import { SERVICE_ESTABLISHMENT_TYPES } from "@/services/services.service";

export type AdminEstablishmentSection = {
  key: string;
  label: string;
  description: string;
  types: EstablishmentType[];
};

export const ADMIN_ESTABLISHMENT_SECTIONS: AdminEstablishmentSection[] = [
  {
    key: "restaurantes",
    label: "Restaurantes",
    description: "Lugares para comer",
    types: [EstablishmentType.RESTAURANT],
  },
  {
    key: "hospedaje",
    label: "Hospedaje",
    description: "Hoteles y alojamiento",
    types: [EstablishmentType.LODGING],
  },
  {
    key: "turismo",
    label: "Lugares turísticos",
    description: "Atracciones y puntos de interés",
    types: [EstablishmentType.ATTRACTION],
  },
  {
    key: "servicios",
    label: "Servicios",
    description: "Farmacias, gasolineras, bancos, clínicas…",
    types: [...SERVICE_ESTABLISHMENT_TYPES],
  },
];

export const ADMIN_DESTINATION_SECTIONS = [
  ...ADMIN_ESTABLISHMENT_SECTIONS,
  {
    key: "cultura",
    label: "Cultura y reglas",
    description: "Guías culturales y normas locales",
    kind: "cultural" as const,
  },
  {
    key: "emergencias",
    label: "Emergencias",
    description: "Contactos de emergencia y seguridad",
    kind: "emergency" as const,
  },
];

export function getEstablishmentSection(key: string) {
  return ADMIN_ESTABLISHMENT_SECTIONS.find((section) => section.key === key);
}

export function defaultTypeForSection(key: string): EstablishmentType {
  const section = getEstablishmentSection(key);
  return section?.types[0] ?? EstablishmentType.OTHER_SERVICE;
}
