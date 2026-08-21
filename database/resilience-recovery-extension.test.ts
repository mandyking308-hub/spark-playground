import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sql = readFileSync(join(import.meta.dir, "resilience-recovery-extension.sql"), "utf8");

describe("resilience and recovery schema", () => {
  it("enables RLS on every recovery table", () => {
    for (const table of [
      "backup_catalog",
      "deletion_tombstones",
      "restore_requests",
      "restore_verification_checks",
      "recovery_policy_targets",
      "recovery_test_runs",
    ]) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  it("contains no blanket authenticated policy", () => {
    expect(sql.toLowerCase()).not.toContain("to authenticated");
    expect(sql.toLowerCase()).not.toContain("using (true)");
  });

  it("stores provider backup references rather than backup bytes or keys", () => {
    expect(sql).toContain("provider_reference_hash");
    expect(sql).not.toContain("backup_bytes");
    expect(sql).not.toContain("encryption_key text");
    expect(sql).toContain("backup bytes, encryption keys and raw auth-provider secrets are never stored");
  });

  it("prevents one person requesting and approving the same restore", () => {
    expect(sql).toContain("approved_by_profile_id <> requested_by_profile_id");
  });

  it("models deletion tombstones so restore cannot resurrect deleted data", () => {
    expect(sql).toContain("create table public.deletion_tombstones");
    expect(sql).toContain("deletion_request_id");
    expect(sql).toContain("data_class public.data_lifecycle_class");
    expect(sql).toContain("deletion_tombstones are replayed");
  });

  it("keeps recovery targets positive and versioned", () => {
    expect(sql).toContain("policy_version text not null unique");
    expect(sql).toContain("recovery_point_minutes integer not null check (recovery_point_minutes > 0)");
    expect(sql).toContain("recovery_time_minutes integer not null check (recovery_time_minutes > 0)");
  });
});
