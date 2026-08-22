import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const authServer = readFileSync(new URL("./auth.ts", import.meta.url), "utf8").toLowerCase();
const serverClient = readFileSync(new URL("../lib/supabase/server-client.ts", import.meta.url), "utf8").toLowerCase();
const dashboard = readFileSync(new URL("../routes/dashboard.tsx", import.meta.url), "utf8").toLowerCase();
const roleControl = readFileSync(new URL("../components/layout/role-switcher.tsx", import.meta.url), "utf8").toLowerCase();

describe("live auth bridge security", () => {
  test("stores the Supabase session in hardened server-managed cookies", () => {
    expect(serverClient).toContain('httponly: true');
    expect(serverClient).toContain('samesite: "lax"');
    expect(serverClient).toContain('secure,');
    expect(serverClient).not.toMatch(/\blocalstorage\s*(?:\.|\[)/);
    expect(serverClient).not.toContain("service_role");
    expect(serverClient).not.toContain("secret_key");
  });

  test("validates the authenticated user server-side before resolving a profile", () => {
    expect(authServer).toContain("supabase.auth.getuser()");
    expect(authServer).toContain('.from("profiles")');
    expect(authServer).toContain('.eq("auth_user_id", user.id)');
    expect(authServer).not.toContain("getsession()");
  });

  test("sign-in never accepts a role, school or profile identifier from the browser", () => {
    expect(authServer).toContain("signinwithpassword");
    expect(authServer).toContain("email:");
    expect(authServer).toContain("password:");
    expect(authServer).not.toMatch(/signininput[\s\S]{0,300}(role|schoolid|profileid|ageband)/);
  });

  test("dashboard access derives from current actor and server-resolved route policy", () => {
    expect(dashboard).toContain("getcurrentactorfn");
    expect(dashboard).toContain("canenterdashboardpath");
    expect(dashboard).toContain("authenticatedhomeforrole");
  });

  test("the old cross-role preview switcher is removed", () => {
    expect(roleControl).not.toContain("preview as");
    expect(roleControl).not.toContain("roles.map");
    expect(roleControl).toContain("verified role");
  });
});
