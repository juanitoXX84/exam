import { ReportReason, ReportStatus } from "@prisma/client";

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  CLOSED_PLACE: "El lugar está cerrado",
  WRONG_HOURS: "Horario incorrecto",
  WRONG_ADDRESS: "Dirección incorrecta",
  WRONG_PHONE: "Teléfono incorrecto",
  WRONG_CULTURAL_INFO: "Información cultural incorrecta",
  INAPPROPRIATE_REVIEW: "Reseña inapropiada",
  OTHER: "Otro",
};

export const ESTABLISHMENT_REPORT_REASONS: ReportReason[] = [
  "CLOSED_PLACE",
  "WRONG_HOURS",
  "WRONG_ADDRESS",
  "WRONG_PHONE",
  "OTHER",
];

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  OPEN: "Abierto",
  IN_REVIEW: "En revisión",
  RESOLVED: "Resuelto",
  DISMISSED: "Descartado",
};
