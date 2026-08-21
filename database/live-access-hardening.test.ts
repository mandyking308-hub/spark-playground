import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sql = readFileSync(join(process.cwd(), "database/live-access-hardening.sql"), "utf8").toLowerCase();

describe("live backend Data API hardening", () => {
  test("removes blanket guardian access to private child projects", () => {
    expect(sql).toContain("drop policy if exists linked_parent_projects_select");
  });

  test("starts browser roles from zero table privileges", () => {
    expect(sql).toContain("revoke all privileges on all tables in schema public from anon");
    expect(sql).toContain("revoke all privileges on all tables in schema public from authenticated");
  });

  test("does not let self profile edits mutate authority fields", () => {
    expect(sql).toContain("grant update (display_name, avatar_path) on public.profiles to authenticated");
    expect(sql).not.toMatch(/grant\s+update\s*\([^)]*(primary_role|age_band|auth_user_id|disabled_at)/);
  });

  test("child project writes cannot set moderation or publication state", () => {
    expect(sql).toContain(
      "grant insert (owner_profile_id, school_id, kind, title, summary) on public.projects to authenticated",
    );
    expect(sql).toContain("grant update (title, summary) on public.projects to authenticated");
    expect(sql).not.toMatch(/grant\s+(insert|update)\s*\([^)]*(state|published_at)/);
  });

  test("sensitive safeguarding and audit tables receive no browser grants", () => {
    expect(sql).not.toMatch(/grant\s+[^;]+on\s+public\.safeguarding_reports\s+to\s+(anon|authenticated)/);
    expect(sql).not.toMatch(/grant\s+[^;]+on\s+public\.moderation_cases\s+to\s+(anon|authenticated)/);
    expect(sql).not.toMatch(/grant\s+[^;]+on\s+public\.audit_log\s+to\s+(anon|authenticated)/);
  });

  test("does not grant browser writes to AI audit or alumni transition data", () => {
    expect(sql).not.toMatch(/grant\s+(insert|update|delete)[^;]+public\.ai_audit_events/);
    expect(sql).not.toMatch(/grant\s+(insert|update|delete)[^;]+public\.portfolio_transition_consents/);
  });

  test("never exposes the service role through client grants", () => {
    expect(sql).not.toMatch(/grant\s+[^;]+to\s+service_role/);
  });
});
