import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./live-passport-performance-hardening.sql", import.meta.url), "utf8");
const normalized = sql.replace(/\s+/g, " ").toLowerCase();

describe("live Passport advisor hardening", () => {
  test("adds covering indexes for every Passport foreign key flagged by advisors", () => {
    for (const index of [
      "idx_brief_submissions_project",
      "idx_brief_submissions_reviewed_by",
      "idx_brief_submissions_school",
      "idx_learning_briefs_created_by",
      "idx_learning_briefs_school",
      "idx_passport_evidence_project",
      "idx_passport_evidence_submission",
      "idx_passport_issuer",
      "idx_passport_school",
      "idx_passport_events_achievement",
      "idx_passport_events_actor",
      "idx_teacher_assignments_assigned_by",
      "idx_teacher_assignments_cohort",
      "idx_teacher_assignments_school",
    ]) {
      expect(normalized).toContain(`create index if not exists ${index}`);
    }
  });

  test("combines child and assigned-teacher submission reads without broadening access", () => {
    expect(normalized).toContain("drop policy if exists brief_submissions_child_select");
    expect(normalized).toContain("drop policy if exists brief_submissions_teacher_select");
    expect(normalized).toContain("child_profile_id = public.current_profile_id()");
    expect(normalized).toContain("tca.teacher_profile_id = public.current_profile_id()");
    expect(normalized).toContain("tca.revoked_at is null");
  });

  test("combines Passport subject/guardian/issuer reads while keeping guardian verification", () => {
    expect(normalized).toContain("drop policy if exists passport_child_guardian_select");
    expect(normalized).toContain("drop policy if exists passport_issuer_select");
    expect(normalized).toContain("gl.parent_profile_id = public.current_profile_id()");
    expect(normalized).toContain("gl.status = 'verified'");
    expect(normalized).toContain("gl.revoked_at is null");
    expect(normalized).toContain("issuer_profile_id = public.current_profile_id()");
  });

  test("does not create new write grants or anonymous access", () => {
    expect(normalized).not.toMatch(/grant\s+(insert|update|delete)/);
    expect(normalized).not.toMatch(/\bto anon\b/);
  });
});
