import type { PlatformRole } from "./access-control";

export type OnboardingPath =
  | "family_parent"
  | "child_via_guardian"
  | "child_via_school"
  | "teacher"
  | "school_admin"
  | "group_admin"
  | "parent_alumni"
  | "alumni_16_plus"
  | "organisation_admin";

export type RoleRequestStatus = "requested" | "verified" | "rejected" | "revoked";

export interface RoleRequest {
  requestedRole: PlatformRole;
  path: OnboardingPath;
  status: RoleRequestStatus;
}

export function requestedRoleForPath(path: OnboardingPath): PlatformRole {
  const mapping: Record<OnboardingPath, PlatformRole> = {
    family_parent: "parent",
    child_via_guardian: "child",
    child_via_school: "child",
    teacher: "teacher",
    school_admin: "school_admin",
    group_admin: "group_admin",
    parent_alumni: "parent_alumni",
    alumni_16_plus: "alumni",
    organisation_admin: "organisation_admin",
  };

  return mapping[path];
}

export function requiresExternalVerification(path: OnboardingPath): boolean {
  return [
    "child_via_guardian",
    "child_via_school",
    "teacher",
    "school_admin",
    "group_admin",
    "parent_alumni",
    "alumni_16_plus",
    "organisation_admin",
  ].includes(path);
}

export function canSelfGrantRequestedRole(_request: RoleRequest): boolean {
  return false;
}

export function childAccountHasValidSponsor(input: {
  parentVerified: boolean;
  schoolInvitationVerified: boolean;
}): boolean {
  return input.parentVerified || input.schoolInvitationVerified;
}
