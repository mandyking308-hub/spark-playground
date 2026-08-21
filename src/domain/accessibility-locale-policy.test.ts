import { describe, expect, test } from "bun:test";

import { directionForLocale, resolveLocale } from "@/config/locales";
import {
  jurisdictionFromLocale,
  mediaAccessibilityDefaults,
  resolveLanguagePresentation,
  shouldUseSafeTranslationFallback,
} from "./accessibility-locale-policy";

describe("locale and accessibility foundations", () => {
  test("unknown locales safely fall back to English UK", () => {
    expect(resolveLocale("xx-YY").code).toBe("en-GB");
    expect(resolveLanguagePresentation("xx-YY").locale).toBe("en-GB");
  });

  test("RTL locales expose RTL direction without changing jurisdiction", () => {
    expect(directionForLocale("ar-AE")).toBe("rtl");
    expect(resolveLanguagePresentation("ar-AE").direction).toBe("rtl");
  });

  test("locale can never be used to infer legal jurisdiction", () => {
    expect(() => jurisdictionFromLocale()).toThrow("Locale must never be used to infer legal jurisdiction.");
  });

  test("foundation-only translation packs use the safe fallback path", () => {
    expect(shouldUseSafeTranslationFallback("fr-FR")).toBe(true);
    expect(shouldUseSafeTranslationFallback("en-GB")).toBe(false);
  });

  test("accessible media defaults prefer captions and transcripts and no sound autoplay", () => {
    expect(mediaAccessibilityDefaults()).toEqual({
      captionsPreferred: true,
      transcriptsPreferred: true,
      autoplayWithSound: false,
    });
  });
});
