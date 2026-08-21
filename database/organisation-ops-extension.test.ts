import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./organisation-ops-extension.sql", import.meta.url), "utf8");
const definitions = sql.replace(/^\s*--.*$/gm, "");

const tables = [
  "organisation_verifications",
  "organisation_staff_grants",
  "organisation_programmes",
  "organisation_content_items",
  "organisation_programme_metrics",
];

describe("organisation programme database safety", () => {
  test("every organisation table enables RLS", () => {
    for (const table of tables) expect(sql).toContain(`alter table public.${table} enable row level security;`);
  });

  test("partner domain contains no child contact/profile fields", () => {
    expect(definitions).not.toMatch(/\b(child_id|child_profile_id|child_email|child_phone|behavioural_profile)\b/i);
  });

  test("organisation and staff access can be revoked", () => {
    expect(sql).toContain("'suspended','revoked'");
    expect(sql).toContain("revoked_at timestamptz");
  });

  test("programme publishing is explicitly approved", () => {
    expect(sql).toContain("approval_state text not null default 'draft'");
    expect(sql).toContain("approved_by_user_id uuid");
  });

  test("reporting is aggregate and no blanket authenticated allow policy exists", () => {
    expect(sql).toContain("organisation_programme_metrics");
    expect(definitions).not.toMatch(/to\s+authenticated[\s\S]{0,100}using\s*\(\s*true\s*\)/i);
  });
});
