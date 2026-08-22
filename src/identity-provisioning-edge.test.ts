import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../supabase/functions/identity-provisioning/index.ts", import.meta.url), "utf8");
const denoConfig = readFileSync(new URL("../supabase/functions/identity-provisioning/deno.json", import.meta.url), "utf8");

describe("identity provisioning Edge Function", () => {
  test("pins the Supabase server SDK", () => {
    expect(denoConfig).toContain("jsr:@supabase/server@1.4.1");
  });

  test("requires authenticated user context", () => {
    expect(source).toContain('withSupabase({ auth: "user" }');
    expect(source).toContain("(ctx.userClaims as { sub?: string } | undefined)?.sub");
  });

  test("does not read privileged credentials directly", () => {
    expect(source).not.toMatch(/SERVICE_ROLE|SECRET_KEY|SUPABASE_SECRET/);
    expect(source).not.toContain("Deno.env.get");
  });

  test("generates a cryptographically random token and stores only its SHA-256 hash", () => {
    expect(source).toContain("crypto.getRandomValues");
    expect(source).toContain('crypto.subtle.digest("SHA-256"');
    expect(source).toContain("p_token_hash: tokenHash");
    expect(source).toContain("invitationToken: rawToken");
  });

  test("never accepts historical, organisation or platform-admin role values from Edge input", () => {
    expect(source).toContain('type PilotRole = "child" | "parent" | "teacher" | "school_admin" | "group_admin"');
    expect(source).not.toMatch(/PilotRole[^\n]+platform_admin/);
    expect(source).not.toMatch(/PilotRole[^\n]+parent_alumni/);
  });

  test("bounds invitation lifetime to seven days", () => {
    expect(source).toContain("ttlHours > 168");
    expect(source).toContain("ttlHours < 1");
  });

  test("claim derives role and scope from the hashed invitation rather than claim payload", () => {
    expect(source).toContain('body.action === "claim_invitation"');
    expect(source).toContain("p_token_hash: tokenHash");
    const claimSection = source.split('body.action === "claim_invitation"')[1]?.split('body.action === "revoke_invitation"')[0] ?? "";
    expect(claimSection).not.toContain("p_intended_role");
    expect(claimSection).not.toContain("p_intended_age_band");
  });

  test("lists only invitations issued by the authenticated actor", () => {
    const listSection = source.split('body.action === "list_invitations"')[1]?.split('body.action === "issue_invitation"')[0] ?? "";
    expect(listSection).toContain('.eq("issued_by_profile_id", actor.id)');
    expect(listSection).toContain('select("id,intended_role,intended_age_band,school_id,cohort_id,education_group_id,state,expires_at,created_at")');
    expect(listSection).not.toContain("token_hash");
    expect(listSection).not.toContain("invitationToken");
  });

  test("returns generic errors without provider detail", () => {
    expect(source).toContain('error: "Request could not be completed"');
    expect(source).not.toContain("error.message");
  });
});
