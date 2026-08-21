import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./provider-data-governance-extension.sql", import.meta.url), "utf8");
const tables = ["provider_approvals", "provider_data_class_grants", "provider_subprocessors", "provider_change_events"];

describe("provider data-governance schema", () => {
  it("enables RLS on all provider governance tables", () => {
    for (const table of tables) expect(sql).toContain(`alter table public.${table} enable row level security;`);
  });

  it("contains no blanket authenticated policy", () => {
    expect(sql.toLowerCase()).not.toContain("to authenticated using (true)");
    expect(sql.toLowerCase()).not.toContain("to authenticated with check (true)");
  });

  it("prohibits child-data training and behavioural advertising by schema", () => {
    expect(sql).toContain("child_data_training_allowed boolean not null default false check (child_data_training_allowed = false)");
    expect(sql).toContain("behavioural_advertising_allowed boolean not null default false check (behavioural_advertising_allowed = false)");
  });

  it("requires versioned region and retention decisions", () => {
    expect(sql).toContain("policy_version text not null");
    expect(sql).toContain("region_code text not null");
    expect(sql).toContain("region_approved boolean not null default false");
    expect(sql).toContain("retention_days integer not null");
  });

  it("uses explicit provider data-class grants", () => {
    expect(sql).toContain("provider_data_class_grants");
    expect(sql).toContain("allowed boolean not null default false");
  });

  it("models subprocessor and region changes for review", () => {
    expect(sql).toContain("provider_subprocessors");
    expect(sql).toContain("change_type in ('region','subprocessor','retention','purpose','terms','incident_contact','revocation')");
  });
});
