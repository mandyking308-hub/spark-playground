import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sql = readFileSync(new URL("./public-intake-live.sql", import.meta.url), "utf8");

describe("public intake live schema", () => {
  test("enables RLS on every intake table", () => {
    expect(sql).toContain("alter table public.public_intake_submissions enable row level security");
    expect(sql).toContain("alter table public.public_intake_rate_limits enable row level security");
  });

  test("gives no table privileges to anonymous or authenticated browser roles", () => {
    expect(sql).toContain("revoke all privileges on public.public_intake_submissions from public, anon, authenticated, service_role");
    expect(sql).toContain("revoke all privileges on public.public_intake_rate_limits from public, anon, authenticated, service_role");
    expect(sql).not.toMatch(/grant\s+(?:select|insert|update|delete)[^;]*\s+to\s+(?:anon|authenticated)/i);
  });

  test("keeps the server role least-privileged", () => {
    expect(sql).toContain("grant select, insert on public.public_intake_submissions to service_role");
    expect(sql).toContain("grant update (status, reviewed_at, closed_at) on public.public_intake_submissions to service_role");
    expect(sql).not.toMatch(/grant\s+delete\s+on\s+public\.public_intake_submissions/i);
  });

  test("stores a hashed quota key rather than a raw network address", () => {
    expect(sql).toContain("key_hash text not null");
    expect(sql).not.toMatch(/\b(ip_address|raw_ip|user_agent)\b/i);
    expect(sql).toContain("window_start < now() - interval '48 hours'");
  });

  test("browser roles cannot execute the quota function", () => {
    expect(sql).toContain("from public, anon, authenticated");
    expect(sql).toContain("to service_role");
  });
});
