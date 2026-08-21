import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./live-identity-invoker-hardening.sql", import.meta.url), "utf8");
const normalized = sql.replace(/\s+/g, " ").toLowerCase();

describe("live identity SECURITY INVOKER hardening", () => {
  test("grants service role only the provisioning table operations it needs", () => {
    expect(normalized).toContain("grant select, insert on public.account_invitations to service_role");
    expect(normalized).toContain("grant update (state, claimed_by_auth_user_id, claimed_at, revoked_at) on public.account_invitations to service_role");
    expect(normalized).toContain("grant select, insert on public.profiles to service_role");
    expect(normalized).toContain("grant insert on public.guardian_links to service_role");
    expect(normalized).not.toMatch(/grant\s+(insert|update|delete)[^;]+to authenticated/);
  });

  test("keeps invitation function SECURITY INVOKER and browser inaccessible", () => {
    expect(normalized).toContain("security invoker");
    expect(normalized).not.toContain("security definer");
    expect(normalized).toMatch(/revoke all on function public\.server_issue_account_invitation[^;]+from public, anon, authenticated/);
    expect(normalized).toMatch(/grant execute on function public\.server_issue_account_invitation[^;]+to service_role/);
  });

  test("parent identity invitations cannot carry school, cohort or group membership scope", () => {
    expect(normalized).toContain("p_intended_role = 'parent'");
    expect(normalized).toContain("p_school_id is not null or p_cohort_id is not null or p_education_group_id is not null");
    expect(normalized).toContain("parent invitation must not carry tenant membership scope");
  });

  test("parent-sponsored child invitations remain family scoped", () => {
    expect(normalized).toContain("parent-sponsored child invitation must be family-scoped");
    expect(normalized).toContain("v_guardian_sponsor := v_actor.id");
  });
});
