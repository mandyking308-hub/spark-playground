export type PartnerCapability =
  | "publish_educational_content"
  | "create_challenge"
  | "view_sanitized_submission"
  | "submit_feedback_for_moderation"
  | "view_aggregate_reporting"
  | "browse_child_directory"
  | "view_child_contact_details"
  | "direct_message_child"
  | "export_behavioral_profile"
  | "view_precise_location";

export type PartnerContext = {
  organisationVerified: boolean;
  membershipActive: boolean;
  programmeApproved: boolean;
  submissionSharingApproved?: boolean;
  aggregateCohortSize?: number;
};

export const MIN_AGGREGATE_REPORTING_COHORT = 10;

const alwaysBlocked: readonly PartnerCapability[] = [
  "browse_child_directory",
  "view_child_contact_details",
  "direct_message_child",
  "export_behavioral_profile",
  "view_precise_location",
];

export function partnerCapabilityAllowed(context: PartnerContext, capability: PartnerCapability): boolean {
  if (!context.organisationVerified || !context.membershipActive || !context.programmeApproved) return false;
  if (alwaysBlocked.includes(capability)) return false;

  if (capability === "view_sanitized_submission") {
    return context.submissionSharingApproved === true;
  }

  if (capability === "view_aggregate_reporting") {
    return (context.aggregateCohortSize ?? 0) >= MIN_AGGREGATE_REPORTING_COHORT;
  }

  return true;
}

export function partnerFeedbackMayDeliverDirectlyToChild(): false {
  return false;
}

export function partnerSubmissionViewMayExposeFullChildProfile(): false {
  return false;
}

export function partnerMayCrossTrackChildAcrossProgrammes(): false {
  return false;
}

export function partnerContentMayContainThirdPartyTracking(): false {
  return false;
}

export function approvedExternalPartnerLink(url: URL, approvedDomains: readonly string[]): boolean {
  if (url.protocol !== "https:") return false;
  if (!approvedDomains.includes(url.hostname)) return false;

  const forbiddenTrackingParams = ["gclid", "fbclid", "msclkid", "utm_source", "utm_medium", "utm_campaign"];
  return !forbiddenTrackingParams.some((param) => url.searchParams.has(param));
}
