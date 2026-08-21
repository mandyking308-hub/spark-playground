import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const root = readFileSync(new URL("./routes/__root.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

describe("global accessibility foundations", () => {
  test("the root shell exposes a keyboard skip link and focus target", () => {
    expect(root).toContain('href="#main-content"');
    expect(root).toContain('id="main-content"');
    expect(root).toContain('tabIndex={-1}');
  });

  test("the root language and direction come from locale configuration", () => {
    expect(root).toContain("lang={DEFAULT_LOCALE}");
    expect(root).toContain("dir={directionForLocale(DEFAULT_LOCALE)}");
  });

  test("visible keyboard focus is globally defined", () => {
    expect(styles).toContain(":focus-visible");
    expect(styles).toContain("outline: 3px solid var(--color-ring)");
  });

  test("reduced motion is honoured at operating-system level", () => {
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styles).toContain("animation-duration: 0.01ms !important");
    expect(styles).toContain("transition-duration: 0.01ms !important");
  });

  test("browser text scaling is not disabled", () => {
    expect(styles).toContain("text-size-adjust: 100%");
    expect(root).not.toMatch(/maximum-scale=1|user-scalable=no/i);
  });
});
