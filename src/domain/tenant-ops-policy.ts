export type EnterpriseRole = "school_admin" | "group_admin" | "teacher";

export interface SchoolScope {
  tenantId: string;
  schoolId: string;
}

export interface GroupAdminScope {
  tenantId: string;
  authorisedSchoolIds: string[];
}

export function canAccessSchoolRecord(
  role: EnterpriseRole,
  requestedSchoolId: string,
  ownSchool: SchoolScope | null,
  groupScope: GroupAdminScope | null,
): boolean {
  if (role === "group_admin") {
    return Boolean(groupScope?.authorisedSchoolIds.includes(requestedSchoolId));
  }
  return Boolean(ownSchool && ownSchool.schoolId === requestedSchoolId);
}

export function canAssignStaffRole(actorRole: EnterpriseRole, targetSchoolId: string, groupScope: GroupAdminScope | null, ownSchool: SchoolScope | null): boolean {
  if (actorRole === "group_admin") return Boolean(groupScope?.authorisedSchoolIds.includes(targetSchoolId));
  if (actorRole === "school_admin") return Boolean(ownSchool?.schoolId === targetSchoolId);
  return false;
}

export function canCreateSchool(actorRole: EnterpriseRole): boolean {
  return actorRole === "group_admin";
}

export function groupAnalyticsCanExposeChildRows(): false {
  return false;
}

export function crossSchoolChildDirectoryEnabled(): false {
  return false;
}

export function schoolRosterRequiresSchoolScope(): true {
  return true;
}
