import { describe, expect, test } from "bun:test";

import {
  canChildSubmitProject,
  canOrganisationCreateChallenge,
  defaultJudgeSubmissionAccess,
} from "./challenge-policy";

describe("challenge safety policy", () => {
  test("judges can review the work without obtaining child contact or DM access", () => {
    expect(defaultJudgeSubmissionAccess()).toEqual({
      judgeCanSeeProject: true,
      judgeCanSeeChildContactDetails: false,
      judgeCanDirectMessageChild: false,
      judgeCanSeeRequiredAgeBand: true,
      judgeCanSeeApprovedDisplayLabel: true,
    });
  });

  test("organisation challenge requires verified organisation and approved programme", () => {
    expect(canOrganisationCreateChallenge({ organisationVerified: true, programmeApproved: true })).toBe(true);
    expect(canOrganisationCreateChallenge({ organisationVerified: true, programmeApproved: false })).toBe(false);
    expect(canOrganisationCreateChallenge({ organisationVerified: false, programmeApproved: true })).toBe(false);
  });

  test("child submission requires ownership, safety scan, open challenge and age eligibility", () => {
    expect(
      canChildSubmitProject({
        projectOwnedByChild: true,
        projectPassedSafetyScan: true,
        challengeOpen: true,
        ageEligible: true,
      }),
    ).toBe(true);

    expect(
      canChildSubmitProject({
        projectOwnedByChild: true,
        projectPassedSafetyScan: false,
        challengeOpen: true,
        ageEligible: true,
      }),
    ).toBe(false);
  });
});
