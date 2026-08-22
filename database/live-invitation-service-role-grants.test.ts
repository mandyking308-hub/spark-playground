import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./live-invitation-service-role-grants.sql", import.meta.url), "utf8")
  .replace(/\s+/g, " ")
  .toLowerCase();

describe("live invitation service-role grants", () => {
  test("removes destructive and metadata privileges", () => {
    expect(sql).toContain("revoke delete, references, trigger, truncate on public.account_invitations from service_role");
  });

  test("removes broad table update before restoring narrow mutable columns", () => {
    expect(sql).toContain("revoke update on public.account_invitations from service_role");
    expect(sql).toContain("grant update (state, claimed_by_auth_user_id, claimed_at, revoked_at) on public.account_invitations to service_role");
  });

  test("retains only the reads and inserts required by server workflows", () => {
    expect(sql).toContain("grant select, insert on public.account_invitations to service_role");
    expect(sql).not.toMatch(/grant\s+(delete|truncate|trigger|references)/);
  });
});
