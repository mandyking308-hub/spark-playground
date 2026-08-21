import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./enterprise-tenancy-extension.sql", import.meta.url), "utf8");
const definitions = sql.replace(/^\s*--.*$/gm, "");

const tables = [
  "enterprise_school_authorisations",
  "enterprise_group_scopes",
  "school_cohorts",
  "school_cohort_memberships",
];

describe("enterprise tenancy database safety", () => {
  test("every enterprise tenancy table enables RLS", () => {
    for (const table of tables) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  test("privilege is represented as explicit grants", () => {
    expect(sql).toContain("enterprise_school_authorisations");
    expect(sql).toContain("granted_by_user_id uuid not null");
    expect(sql).toContain("revoked_at timestamptz");
  });

  test("group admin scope is school-specific", () => {
    expect(sql).toContain("group_admin_user_id uuid not null");
    expect(sql).toContain("school_id uuid not null");
    expect(sql).toContain("unique (group_admin_user_id, school_id)");
  });

  test("there is no blanket authenticated allow policy", () => {
    expect(definitions).not.toMatch(/to\s+authenticated[\s\S]{0,100}using\s*\(\s*true\s*\)/i);
  });

  test("schema does not introduce a cross-school child directory", () => {
    expect(definitions).not.toMatch(/create table[^;]*(cross_school_child|child_directory|pupil_directory)/i);
  });
});
