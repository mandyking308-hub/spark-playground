import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(join(process.cwd(), "supabase/functions/permission-workflow/index.ts"), "utf8");
const deno = readFileSync(join(process.cwd(), "supabase/functions/permission-workflow/deno.json"), "utf8");

describe("permission Edge Function boundary", () => {
  test("pins the Supabase server SDK", () => {
    expect(deno).toContain("npm:@supabase/server@1.4.1");
    expect(deno).not.toContain("@latest");
  });

  test("requires an authenticated user through the server SDK", () => {
    expect(source).toContain('withSupabase({ auth: "user" }');
    expect(source).toContain("ctx.userClaims?.sub");
  });

  test("does not read a service-role or secret key directly", () => {
    expect(source).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(source).not.toContain("SUPABASE_SECRET_KEY");
    expect(source).not.toContain("Deno.env.get");
  });

  test("uses only the three reviewed server RPCs", () => {
    expect(source).toContain('rpc("server_request_project_publication"');
    expect(source).toContain('rpc("server_withdraw_permission_request"');
    expect(source).toContain('rpc("server_record_guardian_decision"');
  });

  test("validates resource identifiers before privileged RPC calls", () => {
    expect(source).toContain("uuidPattern");
    expect(source).toContain("validUuid(body.projectId)");
    expect(source).toContain("validUuid(body.requestId)");
  });

  test("does not echo database error messages to clients", () => {
    expect(source).not.toContain("error.message");
    expect(source).toContain('Request could not be completed');
  });

  test("bounds guardian free-text notes", () => {
    expect(source).toContain("body.decisionNote.length > 2000");
  });

  test("accepts POST only", () => {
    expect(source).toContain('req.method !== "POST"');
    expect(source).toContain("status: 405");
  });
});
