import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const schema = readFileSync(new URL("./live-core-schema.sql", import.meta.url), "utf8");
const normalized = schema.replace(/\s+/g, " ").toLowerCase();

function publicTables(sql: string): string[] {
  return [...sql.matchAll(/create table public\.([a-z0-9_]+)\s*\(/gi)].map((match) => match[1]);
}

describe("core live Supabase schema", () => {
  test("is transactionally applied", () => {
    expect(normalized.startsWith("-- aurelia core live schema")).toBe(true);
    expect(normalized).toContain(" begin; ");
    expect(normalized.trimEnd()).toEndWith("commit;");
  });

  test("enables RLS on every public table", () => {
    const tables = publicTables(schema);
    expect(tables.length).toBeGreaterThanOrEqual(15);
    for (const table of tables) {
      expect(schema).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  test("contains no SECURITY DEFINER function in the phase-one schema", () => {
    expect(normalized).not.toContain("security definer");
    expect(normalized).toContain("security invoker");
  });

  test("derives project owner from the authenticated profile", () => {
    expect(normalized).toContain("owner_profile_id uuid not null default public.current_profile_id()");
    expect(normalized).toContain("grant insert (school_id, kind, title, summary) on public.projects to authenticated");
    expect(normalized).not.toMatch(/grant insert \([^)]*owner_profile_id[^)]*\) on public\.projects/);
  });

  test("only an under-16 child can create a project", () => {
    expect(normalized).toContain("p.primary_role = 'child'");
    expect(normalized).toContain("p.age_band in ('under_9', 'age_9_12', 'age_13_15')");
  });

  test("browser project writes cannot set publication or moderation state", () => {
    expect(normalized).not.toMatch(/grant (insert|update) \([^)]*(state|published_at)[^)]*\) on public\.projects/);
  });

  test("contains no parent or organisation project-read policy", () => {
    expect(normalized).not.toContain("linked_parent_projects_select");
    expect(normalized).not.toMatch(/create policy [^ ]*(parent|guardian)[^ ]*projects/);
    expect(normalized).not.toMatch(/create policy [^ ]*organisation[^ ]*projects/);
  });

  test("permission workflow is server-written and browser-read only", () => {
    for (const table of [
      "permission_requests",
      "permission_requirements",
      "permission_decisions",
      "permission_events",
    ]) {
      expect(normalized).toContain(`grant select on public.${table} to authenticated`);
      expect(normalized).not.toMatch(
        new RegExp(`grant (insert|update|delete)[^;]*on public\\.${table} to authenticated`),
      );
    }
  });

  test("starts Data API privileges from zero and grants nothing to anon", () => {
    expect(normalized).toContain("revoke all privileges on all tables in schema public from anon");
    expect(normalized).toContain("revoke all privileges on all tables in schema public from authenticated");
    expect(normalized).not.toMatch(/grant [^;]+ to anon/);
  });

  test("self profile updates are column restricted", () => {
    expect(normalized).toContain("grant update (display_name, avatar_path) on public.profiles to authenticated");
    expect(normalized).not.toMatch(/grant update \([^)]*(primary_role|age_band|auth_user_id|disabled_at)/);
  });

  test("guardian relationship visibility never becomes generic child draft access", () => {
    expect(normalized).toContain("gl.status = 'verified'");
    expect(normalized).toContain("verified guardian != draft access");
  });

  test("audit log has RLS but no browser grant", () => {
    expect(normalized).toContain("alter table public.audit_log enable row level security");
    expect(normalized).not.toMatch(/grant [^;]+on public\.audit_log to (anon|authenticated)/);
  });

  test("does not authorize from browser-editable JWT metadata", () => {
    expect(normalized).not.toContain("user_metadata");
    expect(normalized).not.toContain("raw_user_meta_data");
    expect(normalized).toContain("auth.uid()");
  });
});
