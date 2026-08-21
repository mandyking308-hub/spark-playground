export type ChallengeScope = "school" | "education_group" | "approved_organisation";

export interface ChallengeSubmissionAccess {
  judgeCanSeeProject: boolean;
  judgeCanSeeChildContactDetails: boolean;
  judgeCanDirectMessageChild: boolean;
  judgeCanSeeRequiredAgeBand: boolean;
  judgeCanSeeApprovedDisplayLabel: boolean;
}

export function defaultJudgeSubmissionAccess(): ChallengeSubmissionAccess {
  return {
    judgeCanSeeProject: true,
    judgeCanSeeChildContactDetails: false,
    judgeCanDirectMessageChild: false,
    judgeCanSeeRequiredAgeBand: true,
    judgeCanSeeApprovedDisplayLabel: true,
  };
}

export function canOrganisationCreateChallenge(input: {
  organisationVerified: boolean;
  programmeApproved: boolean;
}): boolean {
  return input.organisationVerified && input.programmeApproved;
}

export function canChildSubmitProject(input: {
  projectOwnedByChild: boolean;
  projectPassedSafetyScan: boolean;
  challengeOpen: boolean;
  ageEligible: boolean;
}): boolean {
  return (
    input.projectOwnedByChild &&
    input.projectPassedSafetyScan &&
    input.challengeOpen &&
    input.ageEligible
  );
}
