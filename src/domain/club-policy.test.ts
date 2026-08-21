import { describe, expect, test } from "bun:test";

import {
  canJoinClub,
  canPerformClubAction,
  childDirectoryEnabled,
  collaborationVisibility,
} from "./club-policy";

describe("verified club access", () => {
  test("eligible invited child can join an approved club", () => {
    expect(
      canJoinClub({
        age: 12,
        clubMinAge: 10,
        clubMaxAge: 15,
        invitedOrEnrolled: true,
        guardianOrSchoolApproved: true,
        scope: "cross_school",
      }),
    ).toBe(true);
  });

  test("open stranger joining is not permitted", () => {
    expect(
      canJoinClub({
        age: 12,
        clubMinAge: 10,
        clubMaxAge: 15,
        invitedOrEnrolled: false,
        guardianOrSchoolApproved: true,
        scope: "approved_programme",
      }),
    ).toBe(false);
  });

  test("age band and approval are both enforced", () => {
    expect(
      canJoinClub({
        age: 16,
        clubMinAge: 10,
        clubMaxAge: 15,
        invitedOrEnrolled: true,
        guardianOrSchoolApproved: true,
        scope: "group",
      }),
    ).toBe(false);
    expect(
      canJoinClub({
        age: 12,
        clubMinAge: 10,
        clubMaxAge: 15,
        invitedOrEnrolled: true,
        guardianOrSchoolApproved: false,
        scope: "school",
      }),
    ).toBe(false);
  });
});

describe("bounded club collaboration", () => {
  test("club posts and project comments can happen inside the verified club", () => {
    expect(
      canPerformClubAction({
        actorRole: "child_member",
        targetRole: "child_member",
        kind: "project_comment",
        insideVerifiedClub: true,
      }),
    ).toBe(true);
  });

  test("direct messages and contact sharing are blocked", () => {
    expect(
      canPerformClubAction({
        actorRole: "child_member",
        targetRole: "child_member",
        kind: "direct_message",
        insideVerifiedClub: true,
      }),
    ).toBe(false);
    expect(
      canPerformClubAction({
        actorRole: "programme_facilitator",
        targetRole: "child_member",
        kind: "contact_share",
        insideVerifiedClub: true,
      }),
    ).toBe(false);
  });

  test("collaboration outside the verified club record is blocked", () => {
    expect(
      canPerformClubAction({
        actorRole: "child_member",
        targetRole: "child_member",
        kind: "team_update",
        insideVerifiedClub: false,
      }),
    ).toBe(false);
  });

  test("there is no child directory and collaboration stays inside the club audience", () => {
    expect(childDirectoryEnabled()).toBe(false);
    expect(collaborationVisibility()).toBe("club_members_and_moderators");
  });
});
