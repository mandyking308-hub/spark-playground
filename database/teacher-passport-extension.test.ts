import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./teacher-passport-extension.sql", import.meta.url), "utf8");
const definitions = sql.replace(/^\s*--.*$/gm, "");

const tables = [
  "teacher_briefs",
  "teacher_brief_submissions",
  "passport_achievement_records",
  "passport_verification_audit",
];

describe("teacher Passport database safety", () => {
  test("every teacher/passport table enables RLS", () => {
    for (const table of tables) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  test("Passport records require evidence and issuer provenance", () => {
    expect(sql).toContain("evidence_id uuid not null");
    expect(sql).toContain("issuer_type text not null");
    expect(sql).toContain("verified_at timestamptz not null");
  });

  test("Passport records are private by default", () => {
    expect(sql).toContain("visibility text not null default 'private'");
  });

  test("verification is auditable and revocable", () => {
    expect(sql).toContain("passport_verification_audit");
    expect(sql).toContain("revoked_at timestamptz");
  });

  test("there is no popularity/ranking schema and no blanket authenticated allow policy", () => {
    expect(definitions).not.toMatch(/\b(likes|follower_count|popularity_score|leaderboard_rank)\b/i);
    expect(definitions).not.toMatch(/to\s+authenticated[\s\S]{0,100}using\s*\(\s*true\s*\)/i);
  });
});
