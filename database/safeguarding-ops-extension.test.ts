import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./safeguarding-ops-extension.sql", import.meta.url), "utf8");
const definitions = sql.replace(/^\s*--.*$/gm, "");

const tables = [
  "safety_reports",
  "safeguarding_cases",
  "safeguarding_case_assignments",
  "safeguarding_evidence",
  "safeguarding_case_events",
];

describe("safeguarding operations database safety", () => {
  test("every safeguarding table enables RLS", () => {
    for (const table of tables) expect(sql).toContain(`alter table public.${table} enable row level security;`);
  });

  test("critical case closure requires recorded escalation", () => {
    expect(sql).toContain("severity <> 'critical' or state <> 'closed' or critical_escalated_at is not null");
  });

  test("case assignments and audit events are explicit", () => {
    expect(sql).toContain("safeguarding_case_assignments");
    expect(sql).toContain("safeguarding_case_events");
    expect(sql).toContain("'viewed'");
    expect(sql).toContain("'severity_changed'");
    expect(sql).toContain("'closed'");
  });

  test("there is no blanket authenticated allow policy", () => {
    expect(definitions).not.toMatch(/to\s+authenticated[\s\S]{0,100}using\s*\(\s*true\s*\)/i);
  });

  test("reporter role cannot masquerade as a safeguarding admin role", () => {
    const reporterRoleDefinition = definitions.match(/reporter_role text not null check \(reporter_role in \(([^)]*)\)\)/i)?.[1] ?? "";
    expect(reporterRoleDefinition).not.toContain("school_admin");
    expect(reporterRoleDefinition).not.toContain("group_safeguarding_admin");
  });
});
