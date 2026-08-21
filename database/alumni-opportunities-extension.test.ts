import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const rawSql = readFileSync(new URL("./alumni-opportunities-extension.sql", import.meta.url), "utf8");
const sql = rawSql.replace(/--.*$/gm, "");

const tables = [
  "alumni_profiles",
  "alumni_opportunity_providers",
  "alumni_opportunities",
  "alumni_applications",
  "alumni_application_portfolio_items",
  "alumni_mentor_profiles",
  "alumni_mentoring_requests",
];

describe("alumni opportunity and mentoring schema safety", () => {
  test("every alumni table enables RLS", () => {
    for (const table of tables) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  test("adult alumni tables contain no under-16 or guardian identity fields", () => {
    expect(sql).not.toMatch(/\b(child_id|child_profile_id|guardian_id|school_child_id|child_email|child_phone)\b/i);
  });

  test("applications disclose portfolio evidence item by item", () => {
    expect(sql).toContain("create table if not exists public.alumni_application_portfolio_items");
    expect(sql).toContain("portfolio_item_id uuid not null");
    expect(sql).toContain("selected_by_alumni_user_id uuid not null");
    expect(sql).not.toMatch(/full_(profile|passport)|all_portfolio/i);
  });

  test("providers and alumni identities carry explicit verification state", () => {
    expect(sql).toContain("alumni_verified boolean not null default false");
    expect(sql).toContain("age_eligibility_verified boolean not null default false");
    expect(sql).toContain("verification_state text not null default 'pending'");
  });

  test("opportunities cannot target below the 16+ environment", () => {
    expect(sql).toContain("minimum_age integer not null default 16 check (minimum_age >= 16)");
  });

  test("a member cannot mentor themselves", () => {
    expect(sql).toContain("check (mentor_user_id <> mentee_user_id)");
  });

  test("there is no blanket authenticated allow policy", () => {
    expect(sql).not.toMatch(/to\s+authenticated[\s\S]{0,100}using\s*\(\s*true\s*\)/i);
  });
});
