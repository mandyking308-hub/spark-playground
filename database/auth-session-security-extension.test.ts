import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sql = readFileSync(join(import.meta.dir, "auth-session-security-extension.sql"), "utf8");

describe("auth session security schema", () => {
  it("enables RLS on all security tables", () => {
    for (const table of ["session_registry", "step_up_authorisations", "security_events"]) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  it("contains no blanket authenticated policy", () => {
    expect(sql.toLowerCase()).not.toContain("to authenticated");
    expect(sql.toLowerCase()).not.toContain("using (true)");
  });

  it("stores only a hashed provider session identifier", () => {
    expect(sql).toContain("provider_session_hash");
    expect(sql).not.toContain("refresh_token");
    expect(sql).not.toContain("access_token");
    expect(sql).not.toContain("password_hash");
  });

  it("binds revocation reasons to an actual revoked timestamp", () => {
    expect(sql).toContain("revoked_at is null and revocation_reason is null");
    expect(sql).toContain("revoked_at is not null and revocation_reason is not null");
  });

  it("limits step-up authorisation to privileged purposes and ten minutes", () => {
    expect(sql).toContain("'open_safeguarding_record'");
    expect(sql).toContain("'delete_account'");
    expect(sql).toContain("valid_until <= verified_at + interval '10 minutes'");
  });
});
