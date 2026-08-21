import { describe, expect, test } from "bun:test";

import {
  canChildSendFreeTextReaction,
  canDisplayPublicReactionCount,
  canOrganisationReactDirectlyToChild,
  canRankChildrenByFeedback,
  canSendConstructiveReaction,
  isAllowedChildReaction,
  type ChildFeedbackContext,
} from "./constructive-feedback-policy";

const baseContext: ChildFeedbackContext = {
  senderProfileId: "child-a",
  recipientProfileId: "child-b",
  projectOwnerProfileId: "child-b",
  senderIsChild: true,
  recipientIsChild: true,
  senderContextVerified: true,
  recipientContextVerified: true,
  senderContextId: "club-1",
  recipientContextId: "club-1",
  contextType: "club",
  projectSharedInContext: true,
  reactionType: "inspired_me",
};

describe("constructive feedback policy", () => {
  test("only curated constructive reactions are allowed", () => {
    expect(isAllowedChildReaction("inspired_me")).toBe(true);
    expect(isAllowedChildReaction("creative_idea")).toBe(true);
    expect(isAllowedChildReaction("like")).toBe(false);
    expect(isAllowedChildReaction("dislike")).toBe(false);
  });

  test("a child can react only inside the same verified context to work shared there", () => {
    expect(canSendConstructiveReaction(baseContext)).toBe(true);
    expect(canSendConstructiveReaction({ ...baseContext, senderContextId: "club-2" })).toBe(false);
    expect(canSendConstructiveReaction({ ...baseContext, senderContextVerified: false })).toBe(false);
    expect(canSendConstructiveReaction({ ...baseContext, projectSharedInContext: false })).toBe(false);
  });

  test("self-reactions and reactions to someone else's project are blocked", () => {
    expect(canSendConstructiveReaction({ ...baseContext, senderProfileId: "child-b" })).toBe(false);
    expect(canSendConstructiveReaction({ ...baseContext, projectOwnerProfileId: "child-c" })).toBe(false);
  });

  test("child free-text reactions are disabled", () => {
    expect(canChildSendFreeTextReaction()).toBe(false);
  });

  test("feedback cannot become a public popularity metric", () => {
    expect(canDisplayPublicReactionCount()).toBe(false);
    expect(canRankChildrenByFeedback()).toBe(false);
  });

  test("organisation accounts cannot react directly to children", () => {
    expect(canOrganisationReactDirectlyToChild()).toBe(false);
  });
});
