import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sql = readFileSync(join(process.cwd(), "database/live-family-permission-policies.sql"), "utf8").toLowerCase();

describe("live family permission policies", () => {
  test("child creates only a self-owned pending request", () => {
    expect(sql).toContain("child_profile_id = requested_by_profile_id");
    expect(sql).toContain("and state = 'pending'");
    expect(sql).toContain("auth_user_id = (select auth.uid())");
  });

  test("child withdrawal cannot be used to approve its own request", () => {
    expect(sql).toContain("state = 'withdrawn'");
    expect(sql).not.toMatch(/permission_requests_child_withdraw[\s\S]*with check \([\s\S]*state = 'approved'/);
  });

  test("guardian decision is tied to a verified guardian link and exact request child", () => {
    expect(sql).toContain("gl.id = guardian_link_id");
    expect(sql).toContain("pr.id = request_id");
    expect(sql).toContain("pr.child_profile_id = gl.child_profile_id");
    expect(sql).toContain("gl.status = 'verified'");
    expect(sql).toContain("gl.parent_profile_id = decision_by_profile_id");
  });

  test("guardian browser cannot write requirements or events", () => {
    expect(sql).not.toMatch(/grant\s+(insert|update|delete)[^;]+public\.permission_requirements/);
    expect(sql).not.toMatch(/grant\s+(insert|update|delete)[^;]+public\.permission_events/);
  });

  test("permission decisions are immutable in browser grants", () => {
    expect(sql).not.toMatch(/grant\s+(update|delete)[^;]+public\.permission_decisions/);
  });

  test("contains no anonymous grant or user metadata authorization", () => {
    expect(sql).not.toMatch(/grant\s+[^;]+to\s+anon/);
    expect(sql).not.toContain("user_metadata");
    expect(sql).not.toContain("raw_user_meta_data");
  });
});
