import { describe, expect, test } from "bun:test";

import { DEDICATED_AURELIA_PUBLIC_RUNTIME, resolvePublicRuntimeConfig } from "./runtime";

describe("public runtime configuration", () => {
  test("supports disconnected preview mode at the pure resolver boundary", () => {
    expect(resolvePublicRuntimeConfig({})).toEqual({
      supabaseUrl: undefined,
      supabasePublishableKey: undefined,
      supabaseProjectRef: undefined,
      backendConnected: false,
    });
  });

  test("pins the application fallback to the dedicated Aurelia project", () => {
    expect(DEDICATED_AURELIA_PUBLIC_RUNTIME.backendConnected).toBe(true);
    expect(DEDICATED_AURELIA_PUBLIC_RUNTIME.supabaseProjectRef).toBe("boybpjenlqtchsvhncgl");
    expect(DEDICATED_AURELIA_PUBLIC_RUNTIME.supabaseUrl).toBe("https://boybpjenlqtchsvhncgl.supabase.co");
    expect(DEDICATED_AURELIA_PUBLIC_RUNTIME.supabasePublishableKey).toMatch(/^sb_publishable_/);
  });

  test("requires URL, publishable key and dedicated project ref together", () => {
    expect(() => resolvePublicRuntimeConfig({ VITE_SUPABASE_URL: "https://example.supabase.co" })).toThrow();
    expect(() =>
      resolvePublicRuntimeConfig({
        VITE_SUPABASE_URL: "https://example.supabase.co",
        VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
      }),
    ).toThrow();
  });

  test("accepts only a matching dedicated Supabase project", () => {
    expect(
      resolvePublicRuntimeConfig({
        VITE_SUPABASE_URL: "https://aureliaref.supabase.co",
        VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
        VITE_SUPABASE_PROJECT_REF: "aureliaref",
      }).backendConnected,
    ).toBe(true);
  });

  test("rejects a URL for any other Supabase project", () => {
    expect(() =>
      resolvePublicRuntimeConfig({
        VITE_SUPABASE_URL: "https://wrongref.supabase.co",
        VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
        VITE_SUPABASE_PROJECT_REF: "approvedref",
      }),
    ).toThrow(/does not match/);
  });

  test("rejects service-role or secret credentials in browser env", () => {
    expect(() =>
      resolvePublicRuntimeConfig({ VITE_SUPABASE_SERVICE_ROLE_KEY: "should-never-be-client-side" }),
    ).toThrow(/Forbidden privileged backend credential/);
  });
});
