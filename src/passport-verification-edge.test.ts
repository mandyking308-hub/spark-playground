import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../supabase/functions/passport-verification/index.ts", import.meta.url), "utf8");
const denoConfig = readFileSync(new URL("../supabase/functions/passport-verification/deno.json", import.meta.url), "utf8");

describe("Passport verification Edge Function", () => {
  test("pins the server SDK and requires authenticated user context", () => {
    expect(denoConfig).toContain("jsr:@supabase/server@1.4.1");
    expect(source).toContain('withSupabase({ auth: "user" }');
    expect(source).toContain("ctx.userClaims?.sub");
  });

  test("does not read or expose privileged credentials", () => {
    expect(source).not.toMatch(/SERVICE_ROLE|SECRET_KEY|SUPABASE_SECRET/);
    expect(source).not.toContain("Deno.env.get");
  });

  test("review state cannot be set to verified through the generic review action", () => {
    expect(source).toContain('type ReviewState = "in_review" | "revision_requested" | "closed"');
    expect(source).not.toMatch(/type ReviewState[^\n]+verified/);
  });

  test("achievement issuance accepts evidence submission id but no child, school, issuer or visibility authority", () => {
    const issueSection = source.split('body.action === "issue_achievement"')[1]?.split('body.action === "revoke_achievement"')[0] ?? "";
    expect(issueSection).toContain("p_submission_id: body.submissionId");
    expect(issueSection).not.toContain("p_child_profile_id");
    expect(issueSection).not.toContain("p_school_id");
    expect(issueSection).not.toContain("p_issuer_profile_id");
    expect(issueSection).not.toContain("p_visibility");
  });

  test("uses only the three server-owned Passport RPCs", () => {
    expect(source).toContain('rpc("server_set_submission_review_state"');
    expect(source).toContain('rpc("server_issue_passport_achievement"');
    expect(source).toContain('rpc("server_revoke_passport_achievement"');
  });

  test("bounds all human-entered achievement and revocation text", () => {
    expect(source).toContain("title.length > 180");
    expect(source).toContain("optionalBoundedText(body.description, 4000)");
    expect(source).toContain("optionalBoundedText(body.verificationNote, 2000)");
    expect(source).toContain("reason.length > 2000");
  });

  test("returns generic external errors instead of database detail", () => {
    expect(source).toContain('error: "Request could not be completed"');
    expect(source).not.toContain("error.message");
  });
});
