import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const routeSource = readFileSync(new URL("./routes/dashboard.invitations.tsx", import.meta.url), "utf8");
const bridgeSource = readFileSync(new URL("./functions/invitations.ts", import.meta.url), "utf8");

describe("invitation administration", () => {
  test("shows raw invitation only as one-time state and never persists it in browser storage", () => {
    expect(routeSource).toContain("copy this code now");
    expect(routeSource).toContain("setNewToken(result.invitationToken)");
    expect(routeSource).not.toMatch(/localStorage\s*\./);
    expect(routeSource).not.toMatch(/sessionStorage\s*\./);
    expect(routeSource).not.toContain("token_hash");
  });

  test("does not let the browser submit child, guardian or issuer profile identity", () => {
    expect(bridgeSource).not.toMatch(/childProfileId|guardianProfileId|issuerProfileId|authUserId/);
    expect(bridgeSource).toContain('action: "issue_invitation"');
    expect(bridgeSource).toContain('action: "list_invitations"');
    expect(bridgeSource).toContain('action: "revoke_invitation"');
  });

  test("limits the UI to parent, school-admin and platform-admin issuing patterns", () => {
    expect(routeSource).toContain('if (actor.role === "parent") return ["child"]');
    expect(routeSource).toContain('if (actor.role === "school_admin") return ["child", "teacher"]');
    expect(routeSource).toContain('return ["parent"]');
  });
});
