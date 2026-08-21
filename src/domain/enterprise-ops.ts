export type NotificationPurpose =
  | "safety"
  | "approval"
  | "project_update"
  | "challenge_deadline"
  | "club_update"
  | "achievement"
  | "event"
  | "administrative"
  | "engagement_nudge"
  | "popularity";

export interface NotificationPolicyInput {
  recipientIsChild: boolean;
  purpose: NotificationPurpose;
  quietHoursActive: boolean;
  urgentSafetyEvent?: boolean;
}

export function canDeliverNotification(input: NotificationPolicyInput): boolean {
  if (input.recipientIsChild && ["engagement_nudge", "popularity"].includes(input.purpose)) {
    return false;
  }

  if (input.quietHoursActive && !input.urgentSafetyEvent) return false;

  return true;
}

export interface EnterpriseLicence {
  educationGroupId: string;
  planName: string;
  licensedLearners: number;
  licensedSchools: number;
  renewalDate?: string;
  status: "trial" | "active" | "past_due" | "paused" | "ended";
}

export interface LicenceUsage {
  activeLearners: number;
  activeSchools: number;
}

export function licenceUtilisationPercent(
  licence: EnterpriseLicence,
  usage: LicenceUsage,
): { learnerPercent: number; schoolPercent: number } {
  const learnerPercent = licence.licensedLearners
    ? Math.min(100, Math.round((usage.activeLearners / licence.licensedLearners) * 100))
    : 0;
  const schoolPercent = licence.licensedSchools
    ? Math.min(100, Math.round((usage.activeSchools / licence.licensedSchools) * 100))
    : 0;

  return { learnerPercent, schoolPercent };
}

export type AuditSeverity = "info" | "review" | "security";

export interface AuditEventSummary {
  id: string;
  action: string;
  actorLabel: string;
  targetLabel?: string;
  severity: AuditSeverity;
  occurredAt: string;
}
