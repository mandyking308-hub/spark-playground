import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./abuse-protection-extension.sql", import.meta.url), "utf8");
const tables = ["abuse_rate_buckets", "abuse_security_events", "abuse_source_blocks"];

describe("abuse protection schema", () => {
  it("enables RLS on all abuse/security tables", () => {
    for (const table of tables) expect(sql).toContain(`alter table public.${table} enable row level security;`);
  });

  it("contains no blanket authenticated policy", () => {
    expect(sql.toLowerCase()).not.toContain("to authenticated using (true)");
  });

  it("cannot record child-account existence disclosure or child content", () => {
    expect(sql).toContain("account_exists_disclosed boolean not null default false check (account_exists_disclosed = false)");
    expect(sql).toContain("child_content_captured boolean not null default false check (child_content_captured = false)");
  });

  it("has no child lookup or child directory table", () => {
    expect(sql.toLowerCase()).not.toMatch(/create table if not exists public\.(child_lookup|child_directory)/);
  });

  it("uses time-bounded buckets and reviewable source blocks", () => {
    expect(sql).toContain("expires_at timestamptz not null");
    expect(sql).toContain("reviewed_by uuid");
    expect(sql).toContain("revoked_at timestamptz");
  });
});
