import { describe, expect, it } from "bun:test";

import {
  approvedExternalPartnerLink,
  MIN_AGGREGATE_REPORTING_COHORT,
  partnerCapabilityAllowed,
  partnerContentMayContainThirdPartyTracking,
  partnerFeedbackMayDeliverDirectlyToChild,
  partnerMayCrossTrackChildAcrossProgrammes,
  partnerSubmissionViewMayExposeFullChildProfile,
} from "./partner-access-policy";

const verified = {
  organisationVerified: true,
  membershipActive: true,
  programmeApproved: true,
};

describe("external partner access policy", () => {
  it("blocks all partner access until organisation, member and programme are verified", () => {
    expect(partnerCapabilityAllowed({ ...verified, organisationVerified: false }, "create_challenge")).toBe(false);
    expect(partnerCapabilityAllowed({ ...verified, membershipActive: false }, "create_challenge")).toBe(false);
    expect(partnerCapabilityAllowed({ ...verified, programmeApproved: false }, "create_challenge")).toBe(false);
  });

  it("never permits direct child directory/contact/message/profile/location capabilities", () => {
    for (const capability of [
      "browse_child_directory",
      "view_child_contact_details",
      "direct_message_child",
      "export_behavioral_profile",
      "view_precise_location",
    ] as const) {
      expect(partnerCapabilityAllowed(verified, capability)).toBe(false);
    }
  });

  it("requires explicit submission sharing approval", () => {
    expect(partnerCapabilityAllowed({ ...verified, submissionSharingApproved: false }, "view_sanitized_submission")).toBe(false);
    expect(partnerCapabilityAllowed({ ...verified, submissionSharingApproved: true }, "view_sanitized_submission")).toBe(true);
  });

  it("requires a minimum aggregate cohort before partner reporting", () => {
    expect(partnerCapabilityAllowed({ ...verified, aggregateCohortSize: MIN_AGGREGATE_REPORTING_COHORT - 1 }, "view_aggregate_reporting")).toBe(false);
    expect(partnerCapabilityAllowed({ ...verified, aggregateCohortSize: MIN_AGGREGATE_REPORTING_COHORT }, "view_aggregate_reporting")).toBe(true);
  });

  it("routes partner feedback through moderation rather than directly to a child", () => {
    expect(partnerFeedbackMayDeliverDirectlyToChild()).toBe(false);
    expect(partnerSubmissionViewMayExposeFullChildProfile()).toBe(false);
  });

  it("blocks cross-programme tracking and third-party tracking", () => {
    expect(partnerMayCrossTrackChildAcrossProgrammes()).toBe(false);
    expect(partnerContentMayContainThirdPartyTracking()).toBe(false);
  });

  it("allows only HTTPS approved domains without common tracking parameters", () => {
    expect(approvedExternalPartnerLink(new URL("https://museum.example/learn"), ["museum.example"])).toBe(true);
    expect(approvedExternalPartnerLink(new URL("http://museum.example/learn"), ["museum.example"])).toBe(false);
    expect(approvedExternalPartnerLink(new URL("https://tracker.example/learn"), ["museum.example"])).toBe(false);
    expect(approvedExternalPartnerLink(new URL("https://museum.example/learn?utm_source=aurelia"), ["museum.example"])).toBe(false);
  });
});
