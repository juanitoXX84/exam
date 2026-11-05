import { PriceRange, EstablishmentType, VerificationStatus } from "@prisma/client";

export const PRICE_RANGE_LABELS: Record<PriceRange, string> = {
  BUDGET: "$ Económico",
  MODERATE: "$$ Moderado",
  EXPENSIVE: "$$$ Elevado",
  LUXURY: "$$$$ Premium",
};

export const PRICE_RANGE_SHORT: Record<PriceRange, string> = {
  BUDGET: "$",
  MODERATE: "$$",
  EXPENSIVE: "$$$",
  LUXURY: "$$$$",
};

export const ESTABLISHMENT_TYPE_LABELS: Record<EstablishmentType, string> = {
  RESTAURANT: "Restaurante",
  LODGING: "Hospedaje",
  ATTRACTION: "Lugar turístico",
  CLINIC: "Clínica",
  HOSPITAL: "Hospital",
  PHARMACY: "Farmacia",
  GAS_STATION: "Gasolinera",
  BANK: "Banco / cajero",
  OTHER_SERVICE: "Otro servicio",
};

export { VERIFICATION_LABELS } from "@/lib/cultural/labels";

export function ratingLabel(value: number | null | undefined) {
  if (value == null || value <= 0) return "Sin calificación";
  return `${value.toFixed(1)} ★`;
}

export function isVerifiedStatus(status: VerificationStatus) {
  return status === VerificationStatus.VERIFIED;
}
