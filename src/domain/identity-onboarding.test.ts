import { describe, expect, test } from "bun:test";

import {
  canSelfGrantRequestedRole,
  childAccountHasValidSponsor,
  requestedRoleForPath,
  requiresExternalVerification,
} from "./identity-onboarding";

describe("identity onboarding", () => {
  test("onboarding paths request the expected role", () => {
    expect(requestedRoleForPath("family_parent")).toBe("parent");
    expect(requestedRoleForPath("child_via_school")).toBe("child");
    expect(requestedRoleForPath("parent_alumni")).toBe("parent_alumni");
    expect(requestedRoleForPath("alumni_16_plus")).toBe("alumni");
  });

  test("privileged and historical roles require verification", () => {
    expect(requiresExternalVerification("teacher")).toBe(true);
    expect(requiresExternalVerification("school_admin")).toBe(true);
    expect(requiresExternalVerification("group_admin")).toBe(true);
    expect(requiresExternalVerification("parent_alumni")).toBe(true);
    expect(requiresExternalVerification("organisation_admin")).toBe(true);
  });

  test("a role request can never grant itself authorization", () => {
    expect(
      canSelfGrantRequestedRole({
        requestedRole: "group_admin",
        path: "group_admin",
        status: "requested",
      }),
    ).toBe(false);
  });

  test("child account requires a verified parent or school invitation", () => {
    expect(childAccountHasValidSponsor({ parentVerified: false, schoolInvitationVerified: false })).toBe(false);
    expect(childAccountHasValidSponsor({ parentVerified: true, schoolInvitationVerified: false })).toBe(true);
    expect(childAccountHasValidSponsor({ parentVerified: false, schoolInvitationVerified: true })).toBe(true);
  });
});
