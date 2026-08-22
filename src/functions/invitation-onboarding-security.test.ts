import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const auth = readFileSync(new URL("./auth.ts", import.meta.url), "utf8");
const joinPage = readFileSync(new URL("../routes/auth.join.tsx", import.meta.url), "utf8");
const normalized = auth.replace(/\s+/g, " ").toLowerCase();

describe("invitation-only onboarding security", () => {
  test("join input contains identity data and opaque invitation only, never authority fields", () => {
    const inputBlock = normalized.match(/const joininput = z\.object\(\{([\s\S]*?)\}\);/)?.[1] ?? "";
    expect(inputBlock).toContain("invitationtoken:");
    expect(inputBlock).toContain("email:");
    expect(inputBlock).toContain("password:");
    expect(inputBlock).toContain("displayname:");
    expect(inputBlock).not.toMatch(/role|school|cohort|group|guardian|child|profile|ageband/);
  });

  test("preflight happens before any sign-in or sign-up call", () => {
    const handler = normalized.indexOf("export const joinwithinvitationfn");
    const preflight = normalized.indexOf("invitationisclaimable", handler);
    const signIn = normalized.indexOf("signinwithpassword", handler);
    const signUp = normalized.indexOf("signup(", handler);
    expect(preflight).toBeGreaterThan(handler);
    expect(signIn).toBeGreaterThan(preflight);
    expect(signUp).toBeGreaterThan(preflight);
  });

  test("invalid or expired invitation returns before account creation", () => {
    expect(normalized).toContain('if (!(await invitationisclaimable(supabase, data.invitationtoken))) { return { ok: false, error: "that invitation is invalid or has expired." }');
  });

  test("claim payload never accepts role, tenant, child or sponsor authority", () => {
    const claimBlock = normalized.match(/async function claiminvitation\([\s\S]*?supabase\.functions\.invoke\("identity-provisioning", \{ body: \{([\s\S]*?)\}, \}\);/)?.[1] ?? "";
    expect(claimBlock).toContain('action: "claim_invitation"');
    expect(claimBlock).toContain("invitationtoken:");
    expect(claimBlock).toContain("displayname:");
    expect(claimBlock).toContain("countrycode:");
    expect(claimBlock).not.toMatch(/role|school|cohort|group|guardian|child|profile|ageband/);
  });

  test("an unconfirmed signup does not claim the invitation", () => {
    const confirmation = normalized.indexOf("if (!signupdata.session)");
    const claim = normalized.lastIndexOf("await claiminvitation");
    expect(confirmation).toBeGreaterThan(0);
    expect(claim).toBeGreaterThan(confirmation);
    expect(normalized.slice(confirmation, claim)).toContain("confirmationrequired: true");
  });

  test("claim failure signs the session out instead of leaving partial workspace access", () => {
    expect(normalized).toContain(
      "!(await claiminvitation(supabase, data))) { await supabase.auth.signout()",
    );

  });

  test("the join UI has no role or workspace selector", () => {
    const ui = joinPage.toLowerCase();
    expect(ui).not.toMatch(/name=["'](?:role|schoolid|cohortid|educationgroupid|ageband)["']/);
    expect(ui).not.toContain("selecttrigger");
    expect(ui).toContain("the invitation decides access");
  });
});
