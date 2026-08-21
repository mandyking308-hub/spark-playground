export type ReportSource = "child" | "parent" | "teacher" | "staff" | "system_signal";
export type CaseSeverity = "low" | "medium" | "high" | "critical";
export type SafeguardingRole = "teacher" | "safeguarding_staff" | "school_admin" | "group_safeguarding_admin";

export interface SafeguardingCaseContext {
  schoolId: string;
  assignedReviewerUserIds: string[];
  severity: CaseSeverity;
  escalatedToGroup: boolean;
}

export interface StaffAccessContext {
  userId: string;
  role: SafeguardingRole;
  schoolId: string;
  authorisedSchoolIds?: string[];
}

export function canOpenSafeguardingCase(staff: StaffAccessContext, safeguardingCase: SafeguardingCaseContext): boolean {
  if (staff.role === "group_safeguarding_admin") {
    return Boolean(
      safeguardingCase.escalatedToGroup &&
        staff.authorisedSchoolIds?.includes(safeguardingCase.schoolId),
    );
  }

  if (staff.schoolId !== safeguardingCase.schoolId) return false;
  if (staff.role === "safeguarding_staff" || staff.role === "school_admin") return true;
  return safeguardingCase.assignedReviewerUserIds.includes(staff.userId);
}

export function requiresImmediateEscalation(severity: CaseSeverity): boolean {
  return severity === "critical";
}

export function aiMayCloseCaseWithoutHuman(): false {
  return false;
}

export function caseVisibleToGeneralSchoolStaff(): false {
  return false;
}

export function groupReportingUsesAggregateOnly(): true {
  return true;
}
