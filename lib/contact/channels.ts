/** Normaliza teléfonos MX para enlaces tel: y wa.me (solo dígitos). */
export function digitsOnly(phone: string) {
  return phone.replace(/\D/g, "");
}

/** E.164 aproximado para México: 10 dígitos locales → 52 + número. */
export function toWhatsAppE164(phone: string): string | null {
  const digits = digitsOnly(phone);
  if (!digits || digits === "911") return null;
  if (digits.startsWith("52") && digits.length >= 12) return digits;
  if (digits.length === 10) return `52${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `52${digits.slice(1)}`;
  return digits.length >= 10 ? digits : null;
}

export function telHref(phone: string) {
  const digits = digitsOnly(phone);
  if (!digits) return null;
  if (digits === "911") return "tel:911";
  return `tel:+${digits.startsWith("52") ? digits : digits.length === 10 ? `52${digits}` : digits}`;
}

export function whatsappHref(phone: string, prefilledMessage: string) {
  const e164 = toWhatsAppE164(phone);
  if (!e164) return null;
  return `https://wa.me/${e164}?text=${encodeURIComponent(prefilledMessage)}`;
}

export function contactRequestMessage(establishmentName: string) {
  return `Hola, encontré ${establishmentName} en NEMI y me gustaría consultar disponibilidad / reservar.`;
}
