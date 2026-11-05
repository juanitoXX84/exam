import {
  CulturalNormKind,
  CulturalSignal,
  ImportanceLevel,
  VerificationStatus,
} from "@prisma/client";

export const CULTURAL_SIGNAL_LABELS: Record<
  CulturalSignal,
  { label: string; short: string; tone: "avoid" | "consider" | "recommended" }
> = {
  AVOID: { label: "Evita", short: "Evita", tone: "avoid" },
  CONSIDER: { label: "Ten en cuenta", short: "Ten en cuenta", tone: "consider" },
  RECOMMENDED: { label: "Recomendado", short: "Recomendado", tone: "recommended" },
};

export const CULTURAL_NORM_LABELS: Record<CulturalNormKind, string> = {
  LAW: "Ley / regulación",
  SOCIAL_NORM: "Norma social",
  CUSTOM: "Costumbre",
  SAFETY: "Recomendación de seguridad",
};

export const IMPORTANCE_LABELS: Record<ImportanceLevel, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  CRITICAL: "Crítica",
};

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  PENDING: "Pendiente",
  VERIFIED: "Verificada",
  REPORTED: "Reportada",
};
