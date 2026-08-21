import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sql = readFileSync(join(process.cwd(), "database/live-storage-policies.sql"), "utf8").toLowerCase();

describe("live child Storage policies", () => {
  test("quarantine upload is authenticated and self-prefix scoped", () => {
    expect(sql).toContain("create policy child_quarantine_insert_own_prefix");
    expect(sql).toContain("bucket_id = 'child-quarantine'");
    expect(sql).toContain("(storage.foldername(name))[1] = (select auth.uid())::text");
  });

  test("quarantine object locator requires an opaque UUIDv4 filename", () => {
    expect(sql).toContain("storage.filename(name) ~*");
    expect(sql).toContain("[89ab]");
  });

  test("only the object owner can read/delete a quarantine upload", () => {
    expect(sql).toContain("owner_id = (select auth.uid()::text)");
    expect(sql).toContain("create policy child_quarantine_delete_owned");
  });

  test("there is no authenticated update/upsert policy on quarantine", () => {
    expect(sql).not.toMatch(/on\s+storage\.objects\s+for\s+update\s+to\s+authenticated/);
  });

  test("children cannot write sanitized or publication buckets", () => {
    expect(sql).not.toMatch(/for\s+(insert|update|delete)\s+to\s+authenticated[\s\S]{0,300}bucket_id = 'sanitized-media'/);
    expect(sql).not.toMatch(/for\s+(insert|update|delete)\s+to\s+authenticated[\s\S]{0,300}bucket_id = 'publication-media'/);
  });

  test("publication storage has no anonymous read policy", () => {
    expect(sql).not.toMatch(/for\s+select\s+to\s+anon/);
    expect(sql).not.toMatch(/to\s+public/);
  });

  test("does not mutate storage metadata tables directly", () => {
    expect(sql).not.toMatch(/(insert\s+into|update|delete\s+from)\s+storage\.(objects|buckets)/);
  });
});
