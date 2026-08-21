import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./clubs-collaboration-extension.sql", import.meta.url), "utf8");

const tables = ["club_programmes", "club_memberships", "club_updates", "club_project_links"];

describe("club collaboration schema safety", () => {
  test("every club collaboration table enables RLS", () => {
    for (const table of tables) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  test("the collaboration schema does not create direct messages or contact fields", () => {
    expect(sql).not.toMatch(/create table[^;]*direct_messages/i);
    expect(sql).not.toMatch(/\b(phone|email_address|phone_number|contact_details)\b/i);
  });

  test("club updates only allow programme-scoped communication types", () => {
    expect(sql).toContain("'club_post','project_comment','team_update','moderator_notice'");
    expect(sql).not.toContain("'direct_message'");
  });

  test("clubs are closed by default and require a moderator", () => {
    expect(sql).toContain("moderator_required boolean not null default true");
    expect(sql).toContain("is_open boolean not null default false");
  });

  test("there is no blanket authenticated allow policy", () => {
    expect(sql).not.toMatch(/to\s+authenticated[\s\S]{0,100}using\s*\(\s*true\s*\)/i);
  });
});
