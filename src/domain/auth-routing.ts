import type { PlatformRole } from "./access-control";

export type AuthenticatedHomeRoute =
  | "/dashboard/child"
  | "/dashboard/parent"
  | "/dashboard/parent-alumni"
  | "/dashboard/teacher"
  | "/dashboard/school"
  | "/dashboard/group"
  | "/dashboard/organisation-admin"
  | "/alumni";

const homeByRole: Record<PlatformRole, AuthenticatedHomeRoute> = {
  child: "/dashboard/child",
  parent: "/dashboard/parent",
  parent_alumni: "/dashboard/parent-alumni",
  teacher: "/dashboard/teacher",
  school_admin: "/dashboard/school",
  group_admin: "/dashboard/group",
  organisation_admin: "/dashboard/organisation-admin",
  alumni: "/alumni",
  mentor: "/alumni",
  platform_admin: "/dashboard/group",
};

const childOnly = new Set([
  "/dashboard/child",
  "/dashboard/creator",
  "/dashboard/creator-podcast",
  "/dashboard/creator-project",
  "/dashboard/shows",
  "/dashboard/show-builder",
  "/dashboard/discover",
  "/dashboard/passport",
  "/dashboard/challenges",
  "/dashboard/challenge-submit",
  "/dashboard/clubs",
  "/dashboard/club-space",
]);

const parentOnly = new Set([
  "/dashboard/parent",
  "/dashboard/parent-community",
  "/dashboard/parent-circle",
  "/dashboard/family-permissions",
]);

const parentAlumniOnly = new Set([
  "/dashboard/parent-alumni",
  "/dashboard/parent-alumni-community",
]);

const parentAdultShared = new Set([
  "/dashboard/parent-directory",
  "/dashboard/parent-event",
]);

const teacherOnly = new Set([
  "/dashboard/teacher",
  "/dashboard/teacher-brief",
  "/dashboard/teacher-review",
]);

const schoolOnly = new Set([
  "/dashboard/school",
  "/dashboard/school-people",
  "/dashboard/staff-roles",
]);

const groupOnly = new Set([
  "/dashboard/group",
  "/dashboard/group-schools",
]);

const organisationOnly = new Set([
  "/dashboard/organisation-admin",
  "/dashboard/organisation-publisher",
]);

const staffSafety = new Set([
  "/dashboard/safeguarding",
  "/dashboard/safeguarding-case",
  "/dashboard/abuse-protection",
  "/dashboard/incident-response",
  "/dashboard/audit",
  "/dashboard/security",
  "/dashboard/configuration-security",
  "/dashboard/provider-governance",
  "/dashboard/release-governance",
  "/dashboard/resilience",
  "/dashboard/supply-chain",
  "/dashboard/upload-safety",
  "/dashboard/web-security",
  "/dashboard/report",
]);

const adultControls = new Set([
  "/dashboard/ai-controls",
  "/dashboard/privacy",
]);

const enterpriseAdministration = new Set([
  "/dashboard/licensing",
]);

const achievementIssuance = new Set([
  "/dashboard/achievement-issuer",
]);

const challengeAdministration = new Set([
  "/dashboard/challenge-builder",
]);

const clubAdministration = new Set([
  "/dashboard/club-builder",
]);

const organisationAdministration = new Set([
  "/dashboard/organisations",
  "/dashboard/partner-safety",
]);

export function authenticatedHomeForRole(role: PlatformRole): AuthenticatedHomeRoute {
  return homeByRole[role];
}

export function canEnterAlumniExperience(role: PlatformRole): boolean {
  return role === "alumni" || role === "mentor" || role === "platform_admin";
}

export function canEnterDashboardPath(role: PlatformRole, pathname: string): boolean {
  if (role === "alumni" || role === "mentor") return false;
  if (pathname === "/dashboard" || pathname === "/dashboard/") return true;

  if (childOnly.has(pathname)) return role === "child";
  if (parentOnly.has(pathname)) return role === "parent";
  if (parentAlumniOnly.has(pathname)) return role === "parent_alumni";
  if (parentAdultShared.has(pathname)) return role === "parent" || role === "parent_alumni";
  if (teacherOnly.has(pathname)) return role === "teacher";
  if (schoolOnly.has(pathname)) return role === "school_admin" || role === "platform_admin";
  if (groupOnly.has(pathname)) return role === "group_admin" || role === "platform_admin";
  if (organisationOnly.has(pathname)) return role === "organisation_admin" || role === "platform_admin";

  if (staffSafety.has(pathname)) {
    return ["teacher", "school_admin", "group_admin", "platform_admin"].includes(role);
  }

  if (adultControls.has(pathname)) {
    return ["parent", "teacher", "school_admin", "group_admin", "platform_admin"].includes(role);
  }

  if (enterpriseAdministration.has(pathname)) {
    return ["school_admin", "group_admin", "platform_admin"].includes(role);
  }

  if (achievementIssuance.has(pathname)) {
    return ["teacher", "school_admin", "platform_admin"].includes(role);
  }

  if (challengeAdministration.has(pathname)) {
    return ["teacher", "school_admin", "group_admin", "organisation_admin", "platform_admin"].includes(role);
  }

  if (clubAdministration.has(pathname)) {
    return ["teacher", "school_admin", "platform_admin"].includes(role);
  }

  if (organisationAdministration.has(pathname)) {
    return ["organisation_admin", "school_admin", "group_admin", "platform_admin"].includes(role);
  }

  // Shared authenticated utilities (notifications, feedback, data rights, etc.)
  // remain available here. Their data access is still independently protected by RLS/server authorization.
  return true;
}
