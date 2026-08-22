import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../supabase/functions/public-intake/index.ts", import.meta.url), "utf8");
const denoConfig = readFileSync(new URL("../supabase/functions/public-intake/deno.json", import.meta.url), "utf8");

describe("public intake Edge Function", () => {
  test("uses pinned publishable-key authorization", () => {
    expect(denoConfig).toContain("jsr:@supabase/server@1.4.1");
    expect(source).toContain('withSupabase({ auth: "publishable" }');
  });

  test("does not read or embed privileged credentials", () => {
    expect(source).not.toMatch(/SERVICE_ROLE|SECRET_KEY|SUPABASE_SECRET|Deno\.env\.get/);
  });

  test("never stores the raw network address", () => {
    expect(source).toContain('req.headers.get("x-forwarded-for")');
    expect(source).toContain("sha256Hex");
    const insertSection = source.split('.from("public_intake_submissions")')[1] ?? "";
    expect(insertSection).not.toContain("forwarded");
    expect(insertSection).not.toContain("source");
    expect(source).not.toContain("console.log");
  });

  test("uses an hourly server-side quota and bounded payloads", () => {
    expect(source).toContain('rpc(\n        "server_consume_public_intake_quota"');
    expect(source).toContain("message.length < 20");
    expect(source).toContain('kind === "safeguarding" ? 8000 : 4000');
    expect(source).toContain("p_limit: kind === \"safeguarding\" ? 15 : 8");
  });

  test("allows anonymous safeguarding reports but requires reply permission for enquiries", () => {
    expect(source).toContain('kind === "enquiry" && (email === null || !contactPermitted)');
    expect(source).toContain('kind === "safeguarding" ? "safeguarding_report" : "general_enquiry"');
  });

  test("returns only an opaque submission reference", () => {
    expect(source).toContain("reference: `AUR-${String(data.id).slice(0, 8).toUpperCase()}`");
    expect(source).not.toContain("return Response.json({ data: data");
  });
});
