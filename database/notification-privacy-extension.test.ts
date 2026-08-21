import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sql = readFileSync(join(import.meta.dir, "notification-privacy-extension.sql"), "utf8");

describe("notification privacy schema", () => {
  it("enables RLS on all notification tables", () => {
    for (const table of ["notification_events", "notification_preferences", "notification_deliveries"]) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  it("contains no blanket authenticated policy", () => {
    expect(sql.toLowerCase()).not.toContain("to authenticated");
    expect(sql.toLowerCase()).not.toContain("using (true)");
  });

  it("separates secure payload from external template selection", () => {
    expect(sql).toContain("secure_payload jsonb");
    expect(sql).toContain("safe_template_key text not null");
    expect(sql).toContain("secure_payload is rendered only after authenticated in-app access");
  });

  it("does not model engagement-bait categories", () => {
    expect(sql).not.toContain("'streak'");
    expect(sql).not.toContain("'popularity'");
    expect(sql).not.toContain("'trending'");
  });

  it("documents adult-only safeguarding delivery and child quiet-hour protection", () => {
    expect(sql).toContain("safeguarding notifications target verified parent/staff recipients only");
    expect(sql).toContain("quiet hours are respected for children");
  });
});
