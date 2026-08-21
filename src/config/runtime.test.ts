import { describe, expect, test } from "bun:test";

import { resolvePublicRuntimeConfig } from "./runtime";

describe("public runtime configuration", () => {
  test("supports disconnected preview mode", () => {
    expect(resolvePublicRuntimeConfig({})).toEqual({
      supabaseUrl: undefined,
      supabasePublishableKey: undefined,
      backendConnected: false,
    });
  });

  test("requires URL and publishable key together", () => {
    expect(() => resolvePublicRuntimeConfig({ VITE_SUPABASE_URL: "https://example.supabase.co" })).toThrow();
  });

  test("accepts a public Supabase connection", () => {
    expect(
      resolvePublicRuntimeConfig({
        VITE_SUPABASE_URL: "https://example.supabase.co",
        VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
      }).backendConnected,
    ).toBe(true);
  });

  test("rejects service-role or secret credentials in browser env", () => {
    expect(() =>
      resolvePublicRuntimeConfig({ VITE_SUPABASE_SERVICE_ROLE_KEY: "should-never-be-client-side" }),
    ).toThrow(/Forbidden privileged backend credential/);
  });
});
