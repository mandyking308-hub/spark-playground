import { describe, expect, it } from "bun:test";

import {
  canEnterWorkspace,
  mustRevokeExistingSessions,
  requiresStepUpAuthentication,
  roleMayBeAcceptedFromClientInput,
  SESSION_POLICY,
} from "./auth-session-policy";

describe("authentication and session policy", () => {
  it("never accepts role authority from client input", () => {
    expect(roleMayBeAcceptedFromClientInput()).toBe(false);
  });

  it("blocks unauthenticated, unverified and revoked sessions", () => {
    expect(canEnterWorkspace({ authenticated: false, profileVerified: true, activeRole: "child", age: 12 }, "child")).toBe(false);
    expect(canEnterWorkspace({ authenticated: true, profileVerified: false, activeRole: "child", age: 12 }, "child")).toBe(false);
    expect(canEnterWorkspace({ authenticated: true, profileVerified: true, activeRole: "child", age: 12, sessionRevoked: true }, "child")).toBe(false);
  });

  it("prevents role crossover between child, parent and staff workspaces", () => {
    expect(canEnterWorkspace({ authenticated: true, profileVerified: true, activeRole: "child", age: 12 }, "parent")).toBe(false);
    expect(canEnterWorkspace({ authenticated: true, profileVerified: true, activeRole: "parent" }, "teacher")).toBe(false);
    expect(canEnterWorkspace({ authenticated: true, profileVerified: true, activeRole: "teacher", membershipActive: true }, "child")).toBe(false);
  });

  it("requires active membership for delegated staff and mentor roles", () => {
    expect(canEnterWorkspace({ authenticated: true, profileVerified: true, activeRole: "teacher", membershipActive: false }, "teacher")).toBe(false);
    expect(canEnterWorkspace({ authenticated: true, profileVerified: true, activeRole: "teacher", membershipActive: true }, "teacher")).toBe(true);
  });

  it("requires age 16+ and completed transition for Alumni", () => {
    expect(canEnterWorkspace({ authenticated: true, profileVerified: true, activeRole: "alumni", age: 15, alumniTransitionComplete: true }, "alumni")).toBe(false);
    expect(canEnterWorkspace({ authenticated: true, profileVerified: true, activeRole: "alumni", age: 16, alumniTransitionComplete: false }, "alumni")).toBe(false);
    expect(canEnterWorkspace({ authenticated: true, profileVerified: true, activeRole: "alumni", age: 16, alumniTransitionComplete: true }, "alumni")).toBe(true);
  });

  it("requires step-up authentication for sensitive security and lifecycle actions", () => {
    for (const action of [
      "change_credentials",
      "change_guardian_link",
      "place_retention_hold",
      "release_retention_hold",
      "open_safeguarding_record",
      "change_role_grant",
      "delete_account",
      "transfer_to_alumni",
    ] as const) {
      expect(requiresStepUpAuthentication(action)).toBe(true);
    }
  });

  it("revokes sessions when authority or account security changes", () => {
    for (const reason of [
      "credential_reset",
      "role_changed",
      "membership_ended",
      "guardian_link_revoked",
      "account_deletion_started",
      "manual_security_revoke",
    ] as const) {
      expect(mustRevokeExistingSessions(reason)).toBe(true);
    }
  });

  it("uses stricter session windows for staff and platform administrators", () => {
    expect(SESSION_POLICY.staff.idleMinutes).toBeLessThan(SESSION_POLICY.child.idleMinutes);
    expect(SESSION_POLICY.platformAdmin.absoluteHours).toBeLessThan(SESSION_POLICY.parent.absoluteHours);
  });
});
