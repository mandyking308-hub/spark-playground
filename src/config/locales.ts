export type TextDirection = "ltr" | "rtl";

export interface SupportedLocale {
  code: string;
  label: string;
  nativeLabel: string;
  direction: TextDirection;
  translationState: "foundation" | "ready";
}

export const DEFAULT_LOCALE = "en-GB";

export const SUPPORTED_LOCALES: readonly SupportedLocale[] = [
  { code: "en-GB", label: "English (UK)", nativeLabel: "English (UK)", direction: "ltr", translationState: "ready" },
  { code: "en-US", label: "English (US)", nativeLabel: "English (US)", direction: "ltr", translationState: "foundation" },
  { code: "fr-FR", label: "French", nativeLabel: "Français", direction: "ltr", translationState: "foundation" },
  { code: "es-ES", label: "Spanish", nativeLabel: "Español", direction: "ltr", translationState: "foundation" },
  { code: "pt-PT", label: "Portuguese", nativeLabel: "Português", direction: "ltr", translationState: "foundation" },
  { code: "ar-AE", label: "Arabic", nativeLabel: "العربية", direction: "rtl", translationState: "foundation" },
  { code: "zh-CN", label: "Simplified Chinese", nativeLabel: "简体中文", direction: "ltr", translationState: "foundation" },
  { code: "hi-IN", label: "Hindi", nativeLabel: "हिन्दी", direction: "ltr", translationState: "foundation" },
] as const;

export function findSupportedLocale(code: string | null | undefined): SupportedLocale | undefined {
  if (!code) return undefined;
  const normalised = code.trim().toLowerCase();
  return SUPPORTED_LOCALES.find((locale) => locale.code.toLowerCase() === normalised);
}

export function resolveLocale(code: string | null | undefined): SupportedLocale {
  return findSupportedLocale(code) ?? SUPPORTED_LOCALES[0];
}

export function directionForLocale(code: string | null | undefined): TextDirection {
  return resolveLocale(code).direction;
}

export function isTranslationReady(code: string | null | undefined): boolean {
  return resolveLocale(code).translationState === "ready";
}
