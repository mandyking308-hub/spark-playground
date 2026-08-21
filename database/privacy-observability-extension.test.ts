import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sql = readFileSync(join(import.meta.dir, "privacy-observability-extension.sql"), "utf8");

describe("privacy-safe observability schema", () => {
  it("enables RLS on all observability tables", () => {
    for (const table of ["telemetry_policy_versions", "telemetry_events", "telemetry_daily_aggregates"]) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  it("contains no blanket authenticated policy", () => {
    expect(sql.toLowerCase()).not.toContain("to authenticated");
    expect(sql.toLowerCase()).not.toContain("using (true)");
  });

  it("does not model child or content fields in telemetry events", () => {
    const eventTable = sql.slice(sql.indexOf("create table public.telemetry_events"), sql.indexOf("create table public.telemetry_daily_aggregates"));
    for (const forbidden of ["child_profile_id", "email", "full_ip", "precise_location", "project_title", "project_body", "search_term", "ai_prompt", "chat_text", "safeguarding_summary"]) {
      expect(eventTable).not.toContain(forbidden);
    }
  });

  it("caps diagnostic retention at 90 days", () => {
    expect(sql).toContain("retention_days > 0 and retention_days <= 90");
  });

  it("documents route normalization and no raw request bodies", () => {
    expect(sql).toContain("IDs removed and query strings stripped");
    expect(sql).toContain("no raw request/response bodies");
  });

  it("separates long-lived incident evidence from general telemetry", () => {
    expect(sql).toContain("incident/audit lifecycle, not general telemetry");
  });
});
