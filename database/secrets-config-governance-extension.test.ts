import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./secrets-config-governance-extension.sql", import.meta.url), "utf8");
const tableNames = ["secret_references", "config_change_requests", "secret_rotation_events", "config_audit_events"];

describe("secrets/configuration governance schema", () => {
  it("enables RLS on every governance table", () => {
    for (const table of tableNames) expect(sql).toContain(`alter table public.${table} enable row level security;`);
  });

  it("contains no blanket authenticated policy", () => {
    expect(sql.toLowerCase()).not.toContain("to authenticated using (true)");
    expect(sql.toLowerCase()).not.toContain("to authenticated with check (true)");
  });

  it("stores provider references rather than secret values", () => {
    expect(sql).toContain("provider_reference text not null");
    expect(sql.toLowerCase()).not.toMatch(/secret_value|raw_secret|private_key\s+text|password\s+text|access_token\s+text|refresh_token\s+text/);
  });

  it("requires distinct requester and approver", () => {
    expect(sql).toContain("approved_by <> requested_by");
    expect(sql).toContain("approved_by <> initiated_by");
  });

  it("requires production approval and step-up authentication", () => {
    expect(sql).toContain("environment <> 'production' or approved_by is not null");
    expect(sql).toContain("environment <> 'production' or step_up_verified_at is not null");
  });

  it("models explicit credential revocation and bounded rotation", () => {
    expect(sql).toContain("revoked_at timestamptz");
    expect(sql).toContain("rotation_deadline timestamptz not null");
    expect(sql).toContain("rotation_deadline > created_at");
  });
});
