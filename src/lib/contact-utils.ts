import type { ContactType } from "@/types";

const IG_USERNAME_RE = /^@?[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])?$/;
const PHONE_RE = /^\+?[\d][\d\s-]{7,}$/;

export function detectContactType(value: string): ContactType | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (PHONE_RE.test(trimmed)) return "phone";
  if (IG_USERNAME_RE.test(trimmed)) return "instagram";
  return null;
}

export function isValidInstagram(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return IG_USERNAME_RE.test(trimmed);
}

export function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return PHONE_RE.test(trimmed);
}

export function formatContact(value: string, type: ContactType): string {
  const trimmed = value.trim();
  if (type === "instagram") {
    return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
  }
  return trimmed;
}

export function getWhatsAppUrl(value: string): string {
  const digits = value.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}`;
}

export function getInstagramUrl(value: string): string {
  const username = value.replace(/^@/, "");
  return `https://instagram.com/${username}`;
}

export function getContactActionUrl(value: string, type: ContactType): string {
  return type === "phone" ? getWhatsAppUrl(value) : getInstagramUrl(value);
}
