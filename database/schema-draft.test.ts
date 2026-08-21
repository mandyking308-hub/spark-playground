import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const schema = readFileSync(new URL("./schema-draft.sql", import.meta.url), "utf8");

function publicTables(sql: string): string[] {
  return [...sql.matchAll(/create table public\.([a-z0-9_]+)\s*\(/gi)].map((match) => match[1]);
}

describe("schema draft security invariants", () => {
  test("every public table explicitly enables RLS", () => {
    const tables = publicTables(schema);
    expect(tables.length).toBeGreaterThan(20);

    for (const table of tables) {
      expect(schema).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  test("does not contain a blanket authenticated allow-all policy", () => {
    const normalized = schema.replace(/\s+/g, " ").toLowerCase();
    expect(normalized).not.toMatch(/to authenticated using \(\s*true\s*\)/);
    expect(normalized).not.toMatch(/to authenticated with check \(\s*true\s*\)/);
  });

  test("keeps explicit hard-denial design notes for sensitive adult roles", () => {
    expect(schema).toContain("Intentionally NO generic parent-alumni -> child policies.");
    expect(schema).toContain("Intentionally NO generic organisation-admin -> profiles/projects policies.");
    expect(schema).toContain("Intentionally NO generic alumni -> under-16 project/passport policies.");
  });

  test("requires verified guardian status for parent child-project access", () => {
    expect(schema).toContain("gl.status = 'verified'");
  });

  test("AI audit defaults to no prompt retention", () => {
    expect(schema).toContain("prompt_retained boolean not null default false");
  });
});
