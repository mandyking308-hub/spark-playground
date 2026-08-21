export type ChildLifecycleState =
  | "under_16_member"
  | "graduation_pending"
  | "alumni_16_plus"
  | "inactive";

export type ParentLifecycleState =
  | "current_parent"
  | "parent_alumni"
  | "current_and_alumni"
  | "inactive";

export interface ChildMembershipLink {
  childId: string;
  schoolId: string;
  educationGroupId: string | null;
  active: boolean;
  leftAt: string | null;
}

export interface ParentMembershipSummary {
  activeChildLinks: number;
  historicChildLinks: number;
  hasOptedIntoAlumniCommunity: boolean;
}

/**
 * Parents do not lose their community when the final child leaves.
 * They transition into Parent Alumni if they opt in. A parent can be both
 * current and alumni when they have children at different lifecycle stages.
 */
export function deriveParentLifecycle(summary: ParentMembershipSummary): ParentLifecycleState {
  const hasCurrent = summary.activeChildLinks > 0;
  const hasHistoric = summary.historicChildLinks > 0 && summary.hasOptedIntoAlumniCommunity;

  if (hasCurrent && hasHistoric) return "current_and_alumni";
  if (hasCurrent) return "current_parent";
  if (hasHistoric) return "parent_alumni";
  return "inactive";
}

export interface PortfolioTransitionConsent {
  childUserId: string;
  fromEnvironment: "under_16";
  toEnvironment: "alumni_16_plus";
  approvedItemIds: string[];
  consentedAt: string;
}

/**
 * The alumni environment receives an explicitly approved subset of the young
 * person's portfolio. Private childhood records never migrate implicitly.
 */
export function canTransitionPortfolio(consent: PortfolioTransitionConsent | null): boolean {
  return Boolean(consent && consent.approvedItemIds.length > 0 && consent.consentedAt);
}
