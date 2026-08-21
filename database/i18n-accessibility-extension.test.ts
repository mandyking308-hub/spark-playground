import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const rawSql = readFileSync(new URL("./i18n-accessibility-extension.sql", import.meta.url), "utf8");
const sql = rawSql.replace(/--.*$/gm, "");

const tables = ["translation_catalog_versions", "presentation_preferences"];

describe("i18n and accessibility schema safety", () => {
  test("all i18n/accessibility tables enable RLS", () => {
    for (const table of tables) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  test("translation metadata supports both text directions", () => {
    expect(sql).toContain("text_direction text not null check (text_direction in ('ltr','rtl'))");
  });

  test("presentation preferences include accessible defaults", () => {
    expect(sql).toContain("captions_preferred boolean not null default true");
    expect(sql).toContain("transcripts_preferred boolean not null default true");
    expect(sql).toContain("reduced_motion text not null default 'system'");
  });

  test("presentation preferences do not store legal jurisdiction", () => {
    expect(sql).not.toMatch(/\b(jurisdiction_code|legal_country|consent_country|safeguarding_country)\b/i);
  });

  test("translation catalogs have explicit review state", () => {
    expect(sql).toContain("state text not null default 'draft'");
    expect(sql).toContain("reviewed_by_profile_id uuid references public.profiles(id)");
  });

  test("there is no blanket authenticated allow policy", () => {
    expect(sql).not.toMatch(/to\s+authenticated[\s\S]{0,100}using\s*\(\s*true\s*\)/i);
  });
});
