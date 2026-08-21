import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sw = readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"));
const offline = readFileSync(new URL("../public/offline.html", import.meta.url), "utf8");
const root = readFileSync(new URL("./routes/__root.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

describe("PWA and mobile safety foundations", () => {
  test("the app exposes install metadata without disabling zoom", () => {
    expect(manifest.display).toBe("standalone");
    expect(root).toContain('rel: "manifest"');
    expect(root).toContain("viewport-fit=cover");
    expect(root).not.toMatch(/maximum-scale=1|user-scalable=no/i);
  });

  test("the service worker ignores all non-GET requests", () => {
    expect(sw).toContain('if (request.method !== "GET") return;');
  });

  test("navigation responses are network-authoritative and never written to cache", () => {
    const start = sw.indexOf('if (request.mode === "navigate")');
    const end = sw.indexOf("if (!isSafeStaticPath", start);
    const navigationBlock = sw.slice(start, end);
    expect(navigationBlock).toContain('fetch(request).catch(() => caches.match("/offline.html"))');
    expect(navigationBlock).not.toContain("cache.put");
  });

  test("there is deliberately no Background Sync replay handler", () => {
    expect(sw).not.toContain('addEventListener("sync"');
    expect(sw).not.toContain('addEventListener("periodicsync"');
  });

  test("the offline fallback is data-free and transparent about sensitive actions", () => {
    expect(offline).toContain("Nothing sensitive has been queued to send later");
    expect(offline).not.toMatch(/child_name|profile_id|project_id|guardian_id/i);
  });

  test("coarse-pointer controls receive mobile touch target support", () => {
    expect(styles).toContain("@media (pointer: coarse)");
    expect(styles).toContain("min-block-size: 44px");
    expect(styles).toContain("touch-action: manipulation");
  });
});
