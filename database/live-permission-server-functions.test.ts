import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./live-permission-server-functions.sql", import.meta.url), "utf8");
const normalized = sql.replace(/\s+/g, " ").toLowerCase();

describe("server-only permission workflow SQL", () => {
  test("all workflow functions are SECURITY INVOKER", () => {
    expect(normalized).not.toContain("security definer");
    expect((normalized.match(/security invoker/g) ?? []).length).toBe(4);
  });

  test("browser roles cannot execute workflow RPCs", () => {
    for (const fn of [
      "server_request_project_publication",
      "server_withdraw_permission_request",
      "server_record_guardian_decision",
    ]) {
      expect(normalized).toMatch(new RegExp(`revoke all on function public\\.${fn}[^;]+from public, anon, authenticated`));
      expect(normalized).toMatch(new RegExp(`grant execute on function public\\.${fn}[^;]+to service_role`));
    }
  });

  test("publication request validates authenticated child and project ownership", () => {
    expect(normalized).toContain("p.auth_user_id = p_auth_user_id");
    expect(normalized).toContain("p.primary_role = 'child'");
    expect(normalized).toContain("pr.owner_profile_id = v_child_profile_id");
    expect(normalized).toContain("pr.state in ('draft', 'rejected')");
  });

  test("publication request fails safer when jurisdiction policy is missing", () => {
    expect(normalized).toContain("v_policy_version := 'safe-default-v1'");
    expect(normalized).toContain("true, false, true");
  });

  test("publication request is idempotent for an existing pending project request", () => {
    expect(normalized).toContain("v_existing_request_id");
    expect(normalized).toContain("req.state = 'pending'");
    expect(normalized).toContain("return query select v_existing_request_id, 'pending'::text");
  });

  test("guardian decision requires the exact verified live relationship", () => {
    expect(normalized).toContain("gl.parent_profile_id = v_parent_profile_id");
    expect(normalized).toContain("gl.child_profile_id = v_child_profile_id");
    expect(normalized).toContain("gl.status = 'verified'");
    expect(normalized).toContain("gl.revoked_at is null");
  });

  test("guardian decisions are immutable", () => {
    expect(normalized).toContain("raise exception 'guardian decision is immutable'");
  });

  test("a denial does not publish and returns the project to draft", () => {
    expect(normalized).toContain("set state = 'denied'");
    expect(normalized).toContain("set state = 'draft', updated_at = now()");
    expect(normalized).not.toMatch(/set state = 'published'/);
  });

  test("workflow writes an audit event for each action", () => {
    expect(normalized).toContain("publication_request_created");
    expect(normalized).toContain("permission_request_withdrawn");
    expect(normalized).toContain("guardian_permission_approved");
    expect(normalized).toContain("guardian_permission_denied");
  });
});
