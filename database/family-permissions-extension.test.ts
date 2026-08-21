import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const rawSql = readFileSync(new URL("./family-permissions-extension.sql", import.meta.url), "utf8");
const sql = rawSql.replace(/--.*$/gm, "");

const tables = ["permission_requests", "permission_requirements", "permission_decisions", "permission_events"];

describe("family permissions schema safety", () => {
  test("every family permission table enables RLS", () => {
    for (const table of tables) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  test("permission requests are structurally child initiated", () => {
    expect(sql).toContain("requested_by_profile_id uuid not null");
    expect(sql).toContain("check (requested_by_profile_id = child_profile_id)");
  });

  test("guardian decisions require an explicit guardian link", () => {
    expect(sql).toContain("decision_role text not null check (decision_role in ('guardian','school','safety'))");
    expect(sql).toContain("guardian_link_id uuid references public.guardian_links(id)");
    expect(sql).toContain("decision_role = 'guardian' and guardian_link_id is not null");
  });

  test("permission scope uses explicit actions and resource types", () => {
    expect(sql).toContain("'publish_external','join_club','enter_challenge','share_portfolio','alumni_transfer'");
    expect(sql).toContain("'project','club','challenge','passport_item','alumni_transition'");
    expect(sql).not.toMatch(/\b(global_consent|full_child_access|all_projects|wildcard_permission)\b/i);
  });

  test("withdrawal and audit events are first-class records", () => {
    expect(sql).toContain("'pending','approved','denied','withdrawn','expired'");
    expect(sql).toContain("create table if not exists public.permission_events");
    expect(sql).toContain("'requested','approved','denied','withdrawn','expired','policy_checked','safety_checked'");
  });

  test("requirements are separately versioned", () => {
    expect(sql).toContain("jurisdiction_policy_id uuid references public.jurisdiction_policy_versions(id)");
    expect(sql).toContain("policy_version text not null");
    expect(sql).toContain("guardian_required boolean not null default true");
  });

  test("there is no blanket authenticated allow policy", () => {
    expect(sql).not.toMatch(/to\s+authenticated[\s\S]{0,100}using\s*\(\s*true\s*\)/i);
  });
});
