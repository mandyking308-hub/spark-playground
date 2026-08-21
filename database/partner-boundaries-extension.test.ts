import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sql = readFileSync(join(import.meta.dir, "partner-boundaries-extension.sql"), "utf8");

describe("partner boundary schema", () => {
  it("enables RLS on every partner table", () => {
    for (const table of [
      "partner_programmes",
      "partner_submission_access_grants",
      "partner_feedback_requests",
      "partner_aggregate_reports",
    ]) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  it("contains no blanket authenticated policy", () => {
    expect(sql.toLowerCase()).not.toContain("to authenticated");
    expect(sql.toLowerCase()).not.toContain("using (true)");
  });

  it("does not add direct child contact fields to partner tables", () => {
    expect(sql).not.toContain("child_email");
    expect(sql).not.toContain("child_phone");
    expect(sql).not.toContain("child_address");
    expect(sql).not.toContain("precise_location");
  });

  it("ties submission access to a permission request and expiry", () => {
    expect(sql).toContain("sharing_permission_request_id");
    expect(sql).toContain("expires_at timestamptz not null");
    expect(sql).toContain("expires_at > granted_at");
  });

  it("moderates partner feedback before delivery", () => {
    expect(sql).toContain("pending_moderation");
    expect(sql).toContain("moderated_by_profile_id");
  });

  it("enforces minimum aggregate reporting cohort", () => {
    expect(sql).toContain("cohort_size integer not null check (cohort_size >= 10)");
  });
});
