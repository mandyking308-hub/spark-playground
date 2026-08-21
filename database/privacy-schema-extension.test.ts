import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./privacy-schema-extension.sql", import.meta.url), "utf8");

describe("privacy schema extension security", () => {
  test("enables RLS on jurisdiction and preference tables", () => {
    expect(sql).toContain("alter table public.jurisdiction_policy_versions enable row level security;");
    expect(sql).toContain("alter table public.privacy_preferences enable row level security;");
  });

  test("requires verified guardian link for linked child privacy visibility", () => {
    expect(sql).toContain("gl.status = 'verified'");
  });

  test("uses safer preference defaults", () => {
    expect(sql).toContain("location_sharing boolean not null default false");
    expect(sql).toContain("profiling boolean not null default false");
    expect(sql).toContain("ai_enabled boolean not null default false");
    expect(sql).toContain("publishing_requires_parent_approval boolean not null default true");
  });

  test("does not grant authenticated users jurisdiction-policy mutation", () => {
    const normalized = sql.replace(/\s+/g, " ").toLowerCase();
    expect(normalized).not.toMatch(/on public\.jurisdiction_policy_versions for (insert|update|delete|all) to authenticated/);
  });
});
