import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./release-governance-extension.sql", import.meta.url), "utf8");
const tables = ["release_changes", "feature_flags", "release_reviews", "release_audit_events"];

describe("release governance schema", () => {
  it("enables RLS on all release tables", () => {
    for (const table of tables) expect(sql).toContain(`alter table public.${table} enable row level security;`);
  });

  it("contains no blanket authenticated policy", () => {
    expect(sql.toLowerCase()).not.toContain("to authenticated using (true)");
  });

  it("requires distinct requester and production approver", () => {
    expect(sql).toContain("production_approver <> requested_by");
  });

  it("tracks green tests, security, safety and rollback readiness", () => {
    expect(sql).toContain("tests_passed boolean not null default false");
    expect(sql).toContain("security_checks_passed boolean not null default false");
    expect(sql).toContain("safety_impact_reviewed boolean not null default false");
    expect(sql).toContain("rollback_plan_present boolean not null default false");
  });

  it("keeps child-access feature flags off until approved", () => {
    expect(sql).toContain("enabled boolean not null default false");
    expect(sql).toContain("child_access_expansion = false or enabled = false or approved_change_id is not null");
  });

  it("models mandatory child-safety and after-action review types", () => {
    expect(sql).toContain("'child_safety'");
    expect(sql).toContain("'after_action'");
  });
});
