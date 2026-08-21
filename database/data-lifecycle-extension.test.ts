import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sql = readFileSync(join(import.meta.dir, "data-lifecycle-extension.sql"), "utf8");

describe("data lifecycle schema", () => {
  it("enables RLS on every lifecycle table", () => {
    for (const table of [
      "data_rights_requests",
      "data_rights_request_items",
      "retention_holds",
      "alumni_transfer_selections",
      "data_lifecycle_events",
    ]) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  it("contains no blanket authenticated policy", () => {
    expect(sql.toLowerCase()).not.toContain("to authenticated");
    expect(sql.toLowerCase()).not.toContain("using (true)");
  });

  it("restricts retention holds to narrow safety/compliance classes", () => {
    expect(sql).toContain("data_class in ('consent_history', 'moderation', 'safeguarding', 'audit')");
    expect(sql).toContain("retain_until > created_at");
    expect(sql).not.toContain("'projects', 'safeguarding'");
  });

  it("requires policy version and human-readable retention reason", () => {
    expect(sql).toContain("char_length(trim(reason)) >= 8");
    expect(sql).toContain("char_length(trim(policy_version)) > 0");
  });

  it("models Alumni transfer as explicit Passport selections", () => {
    expect(sql).toContain("source_passport_item_id");
    expect(sql).toContain("consent_record_id");
    expect(sql).not.toContain("transfer_all");
    expect(sql).not.toContain("guardian_link_id");
  });

  it("keeps a per-class processing record for deletion/export/retention outcomes", () => {
    expect(sql).toContain("data_rights_request_items");
    expect(sql).toContain("('export', 'delete', 'retain', 'transfer')");
    expect(sql).toContain("('pending', 'completed', 'held', 'excluded', 'failed')");
  });
});
