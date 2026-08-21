export type AchievementKind = "project" | "certificate" | "skill" | "leadership" | "volunteering" | "award";

export interface TeacherAchievementContext {
  teacherUserId: string;
  childUserId: string;
  teacherAssignedChildIds: string[];
  schoolId: string;
  childSchoolId: string;
  evidenceId: string | null;
  issuerVerified: boolean;
}

export interface PassportRecord {
  childUserId: string;
  kind: AchievementKind;
  title: string;
  evidenceId: string;
  issuerUserId: string;
  issuerType: "teacher" | "school" | "approved_organisation";
  verifiedAt: string;
  publicByDefault: false;
}

export function canVerifyAchievement(context: TeacherAchievementContext): boolean {
  return (
    context.issuerVerified &&
    context.schoolId === context.childSchoolId &&
    context.teacherAssignedChildIds.includes(context.childUserId) &&
    Boolean(context.evidenceId)
  );
}

export function buildPassportRecord(
  context: TeacherAchievementContext,
  kind: AchievementKind,
  title: string,
  verifiedAt: string,
): PassportRecord | null {
  if (!canVerifyAchievement(context) || !context.evidenceId) return null;
  return {
    childUserId: context.childUserId,
    kind,
    title,
    evidenceId: context.evidenceId,
    issuerUserId: context.teacherUserId,
    issuerType: "teacher",
    verifiedAt,
    publicByDefault: false,
  };
}

export function passportHasPopularityScore(): false {
  return false;
}

export function teacherCanRankChildrenPublicly(): false {
  return false;
}
