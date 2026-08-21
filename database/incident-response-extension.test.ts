import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sql = readFileSync(join(import.meta.dir, "incident-response-extension.sql"), "utf8");

describe("incident response schema", () => {
  it("enables RLS on all incident tables", () => {
    for (const table of ["security_incidents", "incident_actions", "incident_affected_scopes", "incident_notifications"]) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  it("contains no blanket authenticated policy", () => {
    expect(sql.toLowerCase()).not.toContain("to authenticated");
    expect(sql.toLowerCase()).not.toContain("using (true)");
  });

  it("stores affected scope hashes instead of copied raw child records", () => {
    expect(sql).toContain("scope_reference_hash");
    expect(sql).toContain("never passwords, access/refresh tokens or unnecessary raw child content");
  });

  it("keeps notification timing policy-versioned rather than universal", () => {
    expect(sql).toContain("notification_due_at");
    expect(sql).toContain("versioned jurisdiction policy");
    expect(sql).not.toContain("72 hours");
    expect(sql).not.toContain("72 HOURS");
  });

  it("models second-review closure evidence", () => {
    expect(sql).toContain("root_cause_summary");
    expect(sql).toContain("corrective_action_summary");
    expect(sql).toContain("second_reviewer_profile_id");
  });
});
