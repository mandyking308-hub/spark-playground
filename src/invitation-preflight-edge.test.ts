import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const edge = readFileSync(new URL("../supabase/functions/invitation-preflight/index.ts", import.meta.url), "utf8");
const config = readFileSync(new URL("../supabase/functions/invitation-preflight/deno.json", import.meta.url), "utf8");
const normalized = edge.replace(/\s+/g, " ").toLowerCase();

describe("invitation preflight Edge Function", () => {
  test("requires the project publishable key rather than an unauthenticated open handler", () => {
    expect(normalized).toContain('withsupabase({ auth: "publishable" }');
    expect(config).toContain("jsr:@supabase/server@1.4.1");
  });

  test("accepts POST only and bounds the opaque token shape", () => {
    expect(normalized).toContain('req.method !== "post"');
    expect(edge).toContain("/^[A-Za-z0-9_-]{40,80}$/");
  });

  test("hashes the token before database lookup", () => {
    expect(normalized).toContain('crypto.subtle.digest("sha-256"');
    expect(normalized).toContain('.eq("token_hash", tokenhash)');
    expect(normalized).not.toContain('.eq("token_hash", body.invitationtoken)');
  });

  test("accepts only live pending non-revoked invitations", () => {
    expect(normalized).toContain('.eq("state", "pending")');
    expect(normalized).toContain('.is("revoked_at", null)');
    expect(normalized).toContain('.gt("expires_at"');
  });

  test("returns validity only and never discloses role, school, child or sponsor data", () => {
    expect(normalized).toContain("valid: boolean(data)");
    expect(normalized).not.toMatch(/select\("[^"]*(role|school|cohort|group|guardian|child|profile)/);
    expect(normalized).not.toMatch(/response\.json\([^)]*(role|school|cohort|group|guardian|child|profile)/);
  });

  test("does not expose privileged credentials from source", () => {
    expect(normalized).not.toMatch(/deno\.env|getenv|service_role|secret_key/);
  });
});
