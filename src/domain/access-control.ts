export type PlatformRole =
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

export type AgeBand = "6_8" | "9_12" | "13_15" | "16_plus" | "adult";

export type Permission =
  | "own_profile:view"
  | "own_profile:edit"
  | "own_portfolio:view"
  | "own_portfolio:edit"
  | "child:create"
  | "child:discover_curated"
  | "child:join_club"
  | "child:submit_challenge"
  | "child:message_known_peer"
  | "linked_child:view"
  | "linked_child:approve_publish"
  | "linked_child:manage_permissions"
  | "adult_community:view"
  | "adult_community:connect"
  | "adult_community:message"
  | "adult_community:create_group"
  | "adult_events:manage"
  | "class:view"
  | "class:manage"
  | "submission:review"
  | "achievement:award"
  | "school:view"
  | "school:manage"
  | "group:view"
  | "group:manage"
  | "organisation:manage"
  | "challenge:create"
  | "content:moderate"
  | "safeguarding:view"
  | "safeguarding:manage"
  | "alumni_community:view"
  | "alumni_community:connect"
  | "opportunity:view"
  | "opportunity:manage"
  | "child_directory:browse"
  | "unrelated_child:message";

const permissionsByRole: Record<PlatformRole, ReadonlySet<Permission>> = {
  child: new Set([
    "own_profile:view",
    "own_profile:edit",
    "own_portfolio:view",
    "own_portfolio:edit",
    "child:create",
    "child:discover_curated",
    "child:join_club",
    "child:submit_challenge",
    "child:message_known_peer",
    "opportunity:view",
  ]),
  parent: new Set([
    "own_profile:view",
    "own_profile:edit",
    "linked_child:view",
    "linked_child:approve_publish",
    "linked_child:manage_permissions",
    "adult_community:view",
    "adult_community:connect",
    "adult_community:message",
    "adult_community:create_group",
    "opportunity:view",
  ]),
  parent_alumni: new Set([
    "own_profile:view",
    "own_profile:edit",
    "adult_community:view",
    "adult_community:connect",
    "adult_community:message",
    "adult_community:create_group",
    "alumni_community:view",
    "alumni_community:connect",
    "opportunity:view",
  ]),
  teacher: new Set([
    "own_profile:view",
    "own_profile:edit",
    "class:view",
    "class:manage",
    "submission:review",
    "achievement:award",
    "challenge:create",
    "content:moderate",
    "safeguarding:view",
  ]),
  school_admin: new Set([
    "own_profile:view",
    "own_profile:edit",
    "school:view",
    "school:manage",
    "class:view",
    "class:manage",
    "challenge:create",
    "content:moderate",
    "safeguarding:view",
    "safeguarding:manage",
  ]),
  group_admin: new Set([
    "own_profile:view",
    "own_profile:edit",
    "group:view",
    "group:manage",
    "school:view",
    "challenge:create",
    "safeguarding:view",
  ]),
  organisation_admin: new Set([
    "own_profile:view",
    "own_profile:edit",
    "organisation:manage",
    "challenge:create",
    "opportunity:manage",
  ]),
  alumni: new Set([
    "own_profile:view",
    "own_profile:edit",
    "own_portfolio:view",
    "own_portfolio:edit",
    "alumni_community:view",
    "alumni_community:connect",
    "opportunity:view",
  ]),
  mentor: new Set([
    "own_profile:view",
    "own_profile:edit",
    "alumni_community:view",
    "alumni_community:connect",
    "opportunity:view",
  ]),
  platform_admin: new Set([
    "own_profile:view",
    "own_profile:edit",
    "school:view",
    "school:manage",
    "group:view",
    "group:manage",
    "organisation:manage",
    "challenge:create",
    "content:moderate",
    "safeguarding:view",
    "safeguarding:manage",
    "adult_events:manage",
    "opportunity:manage",
  ]),
};

/**
 * Deliberately denied to every normal role.
 * Child discovery is content/interest based, not a browsable directory of minors.
 * Adults never receive a generic ability to message unrelated children.
 */
export const hardDeniedPermissions = new Set<Permission>([
  "child_directory:browse",
  "unrelated_child:message",
]);

export function hasPermission(role: PlatformRole, permission: Permission): boolean {
  if (hardDeniedPermissions.has(permission) && role !== "platform_admin") return false;
  return permissionsByRole[role].has(permission);
}

export function isAdultRole(role: PlatformRole): boolean {
  return role !== "child";
}

export function canEnterAdultCommunity(role: PlatformRole): boolean {
  return hasPermission(role, "adult_community:view") || hasPermission(role, "alumni_community:view");
}

export function canEnterChildExperience(role: PlatformRole): boolean {
  return role === "child";
}

export function canDirectlyContactChild(role: PlatformRole, relationship: "own_child" | "known_peer" | "programme" | "none"): boolean {
  if (role === "child") return relationship === "known_peer";
  if (role === "parent") return relationship === "own_child";
  // Teachers, mentors, organisation staff and alumni must use moderated programme workflows,
  // never a generic child DM channel.
  return false;
}
