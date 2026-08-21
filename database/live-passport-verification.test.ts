import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const schema = readFileSync(new URL("./live-passport-verification.sql", import.meta.url), "utf8");
const server = readFileSync(new URL("./live-passport-server-functions.sql", import.meta.url), "utf8");
const normalized = `${schema}\n${server}`.replace(/\s+/g, " ").toLowerCase();

describe("live Teacher to Passport verification", () => {
  test("enables RLS on every live Passport table", () => {
    for (const table of [
      "teacher_cohort_assignments",
      "learning_briefs",
      "learning_brief_submissions",
      "passport_achievements",
      "passport_verification_events",
    ]) {
      expect(normalized).toContain(`alter table public.${table} enable row level security`);
    }
  });

  test("teacher access is tied to an active non-revoked cohort assignment", () => {
    expect(normalized).toContain("tca.teacher_profile_id = public.current_profile_id()");
    expect(normalized).toContain("tca.revoked_at is null");
    expect(normalized).toContain("tca.ends_at is null or tca.ends_at > now()");
  });

  test("child can submit only their own editable project into their own open cohort brief", () => {
    expect(normalized).toContain("child_profile_id = public.current_profile_id()");
    expect(normalized).toContain("lb.state = 'open'");
    expect(normalized).toContain("cm.profile_id = public.current_profile_id()");
    expect(normalized).toContain("p.owner_profile_id = public.current_profile_id()");
    expect(normalized).toContain("p.state in ('draft', 'rejected')");
  });

  test("browser cannot write Passport achievements or verification events", () => {
    expect(normalized).toContain("revoke all privileges on public.passport_achievements from anon, authenticated");
    expect(normalized).toContain("revoke all privileges on public.passport_verification_events from anon, authenticated");
    expect(normalized).not.toMatch(/grant\s+(insert|update|delete)[^;]+passport_achievements[^;]+authenticated/);
    expect(normalized).not.toMatch(/grant\s+(insert|update|delete)[^;]+passport_verification_events[^;]+authenticated/);
  });

  test("Passport defaults private and has no popularity schema", () => {
    expect(normalized).toContain("visibility public.passport_visibility not null default 'private'");
    expect(normalized).not.toMatch(/\b(likes|followers|popularity_score|leaderboard|trending_score)\b/);
  });

  test("verified guardian can read active Passport record without project read grant", () => {
    expect(normalized).toContain("gl.parent_profile_id = public.current_profile_id()");
    expect(normalized).toContain("gl.status = 'verified'");
    expect(normalized).toContain("gl.revoked_at is null");
    expect(schema).not.toContain("grant select on public.projects");
  });

  test("server workflows use SECURITY INVOKER and are browser-inaccessible", () => {
    expect(server.toLowerCase()).not.toContain("security definer");
    expect((server.toLowerCase().match(/security invoker/g) ?? []).length).toBe(3);
    for (const fn of [
      "server_set_submission_review_state",
      "server_issue_passport_achievement",
      "server_revoke_passport_achievement",
    ]) {
      expect(normalized).toMatch(new RegExp(`revoke all on function public\\.${fn}[^;]+from public, anon, authenticated`));
      expect(normalized).toMatch(new RegExp(`grant execute on function public\\.${fn}[^;]+to service_role`));
    }
  });

  test("SECURITY INVOKER workflows receive explicit narrow service-role table privileges", () => {
    expect(normalized).toContain("grant select, update on public.learning_brief_submissions to service_role");
    expect(normalized).toContain("grant select, insert, update on public.passport_achievements to service_role");
    expect(normalized).toContain("grant insert on public.passport_verification_events to service_role");
    expect(normalized).toContain("grant insert on public.audit_log to service_role");
    expect(server.toLowerCase()).not.toMatch(/grant\s+(insert|update|delete)[^;]+to authenticated/);
  });

  test("verification rechecks teacher assignment and evidence ownership", () => {
    expect(normalized).toContain("teacher assignment does not cover submission");
    expect(normalized).toContain("v_project.owner_profile_id <> v_submission.child_profile_id");
    expect(normalized).toContain("submission evidence does not belong to child");
  });

  test("issued achievement is private and evidence-backed", () => {
    expect(normalized).toContain("evidence_project_id");
    expect(normalized).toContain("evidence_submission_id");
    expect(normalized).toContain("'teacher'");
    expect(normalized).toContain("'private'");
    expect(normalized).toContain("passport_achievement_issued");
  });

  test("verified submission cannot be silently downgraded", () => {
    expect(normalized).toContain("if v_submission.review_state = 'verified' then raise exception 'verified submission cannot be downgraded'");
  });

  test("revocation requires issuer or active school administrator and a reason", () => {
    expect(normalized).toContain("revocation reason required");
    expect(normalized).toContain("v_actor.id <> v_achievement.issuer_profile_id");
    expect(normalized).toContain("sm.role = 'school_admin'");
    expect(normalized).toContain("passport_achievement_revoked");
  });
});
