import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./shows-media-extension.sql", import.meta.url), "utf8");

describe("shows and media database extension", () => {
  test("enables RLS on every new table", () => {
    for (const table of ["shows", "show_episodes", "media_review_records"]) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  test("private originals are the default media storage class", () => {
    expect(sql).toContain("storage_class public.media_storage_class not null default 'private_original'");
  });

  test("public publication requires an explicit approval flag", () => {
    expect(sql).toContain("approved_for_publication boolean not null default false");
  });

  test("documents the safe public publisher boundary", () => {
    expect(sql).toContain("No public policy exposes owner_profile_id as the public publisher identity.");
    expect(sql).toContain("Private originals and review derivatives must never be served as public assets.");
  });
});
