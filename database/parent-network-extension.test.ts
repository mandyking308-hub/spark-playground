import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./parent-network-extension.sql", import.meta.url), "utf8");
const definitions = sql.replace(/^\s*--.*$/gm, "");

const tables = [
  "parent_network_profiles",
  "parent_connections",
  "parent_circles",
  "parent_circle_memberships",
  "parent_circle_posts",
  "parent_events",
  "parent_event_rsvps",
];

describe("parent network database separation", () => {
  test("every adult-network table enables RLS", () => {
    for (const table of tables) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  test("adult network table definitions carry no child identifiers", () => {
    expect(definitions).not.toMatch(/\b(child_id|guardian_link_id|child_profile_id|child_contact|child_portfolio_id|pupil_id)\b/i);
  });

  test("adult profiles require verification and opt in before visibility", () => {
    expect(sql).toContain("verified_adult boolean not null default false");
    expect(sql).toContain("community_opt_in boolean not null default false");
    expect(sql).toContain("visible boolean not null default false");
  });

  test("events default to adult only", () => {
    expect(sql).toContain("is_adult_only boolean not null default true");
  });

  test("there is no blanket authenticated allow policy", () => {
    expect(definitions).not.toMatch(/to\s+authenticated[\s\S]{0,100}using\s*\(\s*true\s*\)/i);
  });
});
