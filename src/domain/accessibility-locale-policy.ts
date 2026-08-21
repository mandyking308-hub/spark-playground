import { DEFAULT_LOCALE, directionForLocale, isTranslationReady, resolveLocale } from "@/config/locales";

export interface AccessibilityPreferences {
  locale: string;
  textScale: "default" | "large" | "extra_large";
  reducedMotion: "system" | "reduce" | "full";
  highContrast: "system" | "on" | "off";
  captionsPreferred: boolean;
  transcriptsPreferred: boolean;
}

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  locale: DEFAULT_LOCALE,
  textScale: "default",
  reducedMotion: "system",
  highContrast: "system",
  captionsPreferred: true,
  transcriptsPreferred: true,
};

export function resolveLanguagePresentation(locale: string | null | undefined) {
  const resolved = resolveLocale(locale);
  return {
    locale: resolved.code,
    direction: directionForLocale(resolved.code),
    translationReady: isTranslationReady(resolved.code),
  } as const;
}

export function jurisdictionFromLocale(): never {
  throw new Error("Locale must never be used to infer legal jurisdiction.");
}

export function shouldUseSafeTranslationFallback(locale: string | null | undefined): boolean {
  return !isTranslationReady(locale);
}

export function mediaAccessibilityDefaults() {
  return {
    captionsPreferred: true,
    transcriptsPreferred: true,
    autoplayWithSound: false,
  } as const;
}
