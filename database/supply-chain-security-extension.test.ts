import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./supply-chain-security-extension.sql", import.meta.url), "utf8");
const tables = ["dependency_reviews", "dependency_exceptions", "ci_component_reviews", "supply_chain_audit_events"];

describe("supply-chain security schema", () => {
  it("enables RLS on every supply-chain table", () => {
    for (const table of tables) expect(sql).toContain(`alter table public.${table} enable row level security;`);
  });

  it("contains no blanket authenticated policy", () => {
    expect(sql.toLowerCase()).not.toContain("to authenticated using (true)");
    expect(sql.toLowerCase()).not.toContain("to authenticated with check (true)");
  });

  it("records lockfile and provenance metadata", () => {
    expect(sql).toContain("lockfile_hash text not null");
    expect(sql).toContain("provenance_reference text");
    expect(sql).toContain("resolved_version text not null");
  });

  it("keeps vulnerability exceptions time-bounded", () => {
    expect(sql).toContain("expires_at timestamptz not null");
    expect(sql).toContain("expires_at > created_at");
  });

  it("tracks immutable CI component references", () => {
    expect(sql).toContain("immutable_reference text not null");
  });

  it("does not store registry credentials", () => {
    expect(sql.toLowerCase()).not.toMatch(/registry_password|registry_token|npm_token|access_token\s+text|secret\s+text/);
  });
});
