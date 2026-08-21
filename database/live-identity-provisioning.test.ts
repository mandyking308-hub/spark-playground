import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./live-identity-provisioning.sql", import.meta.url), "utf8");
const normalized = sql.replace(/\s+/g, " ").toLowerCase();

describe("invitation-first live identity provisioning", () => {
  test("stores token hashes only and bounds invitation lifetime", () => {
    expect(normalized).toContain("token_hash text not null unique");
    expect(normalized).toContain("^[0-9a-f]{64}$");
    expect(normalized).toContain("expires_at <= created_at + interval '7 days'");
    expect(normalized).not.toMatch(/\btoken\s+text\b/);
  });

  test("enables RLS and gives account invitations no ordinary browser grants", () => {
    expect(normalized).toContain("alter table public.account_invitations enable row level security");
    expect(normalized).toContain("revoke all privileges on public.account_invitations from public, anon, authenticated");
    expect(normalized).not.toMatch(/grant\s+(select|insert|update|delete)[^;]+account_invitations[^;]+authenticated/);
  });

  test("uses SECURITY INVOKER only", () => {
    expect(normalized).not.toContain("security definer");
    expect((normalized.match(/security invoker/g) ?? []).length).toBe(3);
  });

  test("browser roles cannot execute provisioning RPCs", () => {
    for (const fn of ["server_issue_account_invitation", "server_claim_account_invitation", "server_revoke_account_invitation"]) {
      expect(normalized).toMatch(new RegExp(`revoke all on function public\\.${fn}[^;]+from public, anon, authenticated`));
      expect(normalized).toMatch(new RegExp(`grant execute on function public\\.${fn}[^;]+to service_role`));
    }
  });

  test("no role self-grants through claim payload", () => {
    expect(normalized).toContain("v_invitation.intended_role");
    expect(normalized).toContain("v_invitation.intended_age_band");
    expect(normalized).not.toMatch(/p_(role|age_band)/);
  });

  test("platform admins can issue only ordinary pilot roles, not platform admin or historical roles", () => {
    expect(normalized).toContain("p_intended_role not in ('parent', 'child', 'teacher', 'school_admin', 'group_admin')");
    expect(normalized).toContain("role requires separate verified transition");
  });

  test("parents may issue child invitations only", () => {
    expect(normalized).toContain("if p_intended_role <> 'child' then");
    expect(normalized).toContain("parent may invite a child only");
    expect(normalized).toContain("v_guardian_sponsor := v_actor.id");
  });

  test("school administrators remain scoped to their own active school", () => {
    expect(normalized).toContain("p_intended_role not in ('child', 'teacher')");
    expect(normalized).toContain("sm.school_id = p_school_id");
    expect(normalized).toContain("sm.role = 'school_admin'");
    expect(normalized).toContain("sm.status = 'active'");
  });

  test("every child invite has a verified parent or school sponsor", () => {
    expect(normalized).toContain("p_intended_role = 'child' and v_guardian_sponsor is null and p_school_id is null");
    expect(normalized).toContain("child invitation requires verified parent or school sponsor");
  });

  test("child claims require under-16 age bands and adult roles require adult", () => {
    expect(normalized).toContain("p_intended_age_band not in ('under_9', 'age_9_12', 'age_13_15')");
    expect(normalized).toContain("p_intended_age_band <> 'adult'");
  });

  test("claim is single-use and checks expiry under row lock", () => {
    expect(normalized).toContain("ai.state = 'pending'");
    expect(normalized).toContain("ai.claimed_at is null");
    expect(normalized).toContain("ai.expires_at > now()");
    expect(normalized).toContain("for update");
    expect(normalized).toContain("set state = 'claimed'");
  });

  test("a parent-sponsored child claim creates only the exact guardian relationship", () => {
    expect(normalized).toContain("v_invitation.guardian_sponsor_profile_id");
    expect(normalized).toContain("parent_profile_id, child_profile_id");
    expect(normalized).toContain("'guardian', 'verified'");
  });
});
