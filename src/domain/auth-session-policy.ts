export type SecurityRole =
  | "child"
  | "parent"
  | "parent_alumni"
  | "teacher"
  | "school_admin"
  | "group_admin"
  | "organisation_admin"
  | "alumni"
  | "mentor"
  | "platform_admin";

export type Workspace =
  | "child"
  | "parent"
  | "parent_alumni"
  | "teacher"
  | "school"
  | "group"
  | "organisation"
  | "alumni"
  | "platform_admin";

export type SessionContext = {
  authenticated: boolean;
  profileVerified: boolean;
  activeRole: SecurityRole;
  age?: number;
  membershipActive?: boolean;
  alumniTransitionComplete?: boolean;
  sessionRevoked?: boolean;
};

const workspaceRoles: Record<Workspace, readonly SecurityRole[]> = {
  child: ["child"],
  parent: ["parent"],
  parent_alumni: ["parent_alumni"],
  teacher: ["teacher"],
  school: ["school_admin"],
  group: ["group_admin"],
  organisation: ["organisation_admin"],
  alumni: ["alumni", "mentor"],
  platform_admin: ["platform_admin"],
};

const membershipRoles: readonly SecurityRole[] = [
  "teacher",
  "school_admin",
  "group_admin",
  "organisation_admin",
  "mentor",
];

export function canEnterWorkspace(context: SessionContext, workspace: Workspace): boolean {
  if (!context.authenticated || !context.profileVerified || context.sessionRevoked) return false;
  if (!workspaceRoles[workspace].includes(context.activeRole)) return false;

  if (membershipRoles.includes(context.activeRole) && context.membershipActive !== true) return false;

  if (workspace === "child") {
    return context.age === undefined || context.age < 16;
  }

  if (workspace === "alumni") {
    return (context.age ?? 0) >= 16 && context.alumniTransitionComplete === true;
  }

  return true;
}

export type SensitiveAction =
  | "change_credentials"
  | "change_guardian_link"
  | "place_retention_hold"
  | "release_retention_hold"
  | "open_safeguarding_record"
  | "change_role_grant"
  | "delete_account"
  | "transfer_to_alumni";

export function requiresStepUpAuthentication(action: SensitiveAction): boolean {
  return [
    "change_credentials",
    "change_guardian_link",
    "place_retention_hold",
    "release_retention_hold",
    "open_safeguarding_record",
    "change_role_grant",
    "delete_account",
    "transfer_to_alumni",
  ].includes(action);
}

export type RevocationReason =
  | "credential_reset"
  | "role_changed"
  | "membership_ended"
  | "guardian_link_revoked"
  | "account_deletion_started"
  | "manual_security_revoke";

export function mustRevokeExistingSessions(reason: RevocationReason): boolean {
  return [
    "credential_reset",
    "role_changed",
    "membership_ended",
    "guardian_link_revoked",
    "account_deletion_started",
    "manual_security_revoke",
  ].includes(reason);
}

export function roleMayBeAcceptedFromClientInput(): false {
  return false;
}

export const SESSION_POLICY = {
  child: { idleMinutes: 30, absoluteHours: 8 },
  parent: { idleMinutes: 30, absoluteHours: 8 },
  adult: { idleMinutes: 30, absoluteHours: 8 },
  staff: { idleMinutes: 15, absoluteHours: 4 },
  platformAdmin: { idleMinutes: 10, absoluteHours: 2 },
} as const;
