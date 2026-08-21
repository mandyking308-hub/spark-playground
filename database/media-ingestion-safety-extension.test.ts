import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sql = readFileSync(join(import.meta.dir, "media-ingestion-safety-extension.sql"), "utf8");

describe("media ingestion safety schema", () => {
  it("enables RLS on ingestion and finding tables", () => {
    expect(sql).toContain("alter table public.media_ingestion_jobs enable row level security;");
    expect(sql).toContain("alter table public.media_safety_findings enable row level security;");
  });

  it("contains no blanket authenticated policy", () => {
    expect(sql.toLowerCase()).not.toContain("to authenticated");
    expect(sql.toLowerCase()).not.toContain("using (true)");
  });

  it("defaults media to quarantine and not public eligible", () => {
    expect(sql).toContain("ingestion_status public.media_ingestion_status not null default 'quarantined'");
    expect(sql).toContain("public_eligible boolean not null default false");
  });

  it("tracks server-detected MIME, metadata stripping and sanitized lineage", () => {
    expect(sql).toContain("detected_mime_type");
    expect(sql).toContain("metadata_stripped");
    expect(sql).toContain("sanitized_from_asset_id");
    expect(sql).toContain("sanitized_asset_id");
  });

  it("keeps original filename as non-locator metadata only", () => {
    expect(sql).toContain("original_filename_label");
    expect(sql).toContain("never a storage locator");
  });

  it("documents fail-closed scanning and original-file non-publication", () => {
    expect(sql).toContain("scanner errors fail closed");
    expect(sql).toContain("original uploads never become publication assets");
  });
});
