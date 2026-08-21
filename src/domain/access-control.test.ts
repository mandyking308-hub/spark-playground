import { describe, expect, test } from "bun:test";

import {
  canDirectlyContactChild,
  canEnterAdultCommunity,
  canEnterChildExperience,
  hasPermission,
} from "./access-control";
import { deriveParentLifecycle } from "./lifecycle";
import { nextPublicationState, prohibitedChildAiUses } from "./safeguarding";

describe("hard child/adult boundaries", () => {
  test("parent alumni can enter adult community but not child experience", () => {
    expect(canEnterAdultCommunity("parent_alumni")).toBe(true);
    expect(canEnterChildExperience("parent_alumni")).toBe(false);
  });

  test("parent alumni cannot browse children or message unrelated children", () => {
    expect(hasPermission("parent_alumni", "child_directory:browse")).toBe(false);
    expect(hasPermission("parent_alumni", "unrelated_child:message")).toBe(false);
    expect(canDirectlyContactChild("parent_alumni", "none")).toBe(false);
  });

  test("alumni cannot browse or directly message children", () => {
    expect(hasPermission("alumni", "child_directory:browse")).toBe(false);
    expect(canDirectlyContactChild("alumni", "none")).toBe(false);
  });

  test("organisation admins cannot directly contact children", () => {
    expect(canDirectlyContactChild("organisation_admin", "programme")).toBe(false);
    expect(canDirectlyContactChild("organisation_admin", "none")).toBe(false);
  });

  test("parent direct contact is limited to their own linked child", () => {
    expect(canDirectlyContactChild("parent", "own_child")).toBe(true);
    expect(canDirectlyContactChild("parent", "none")).toBe(false);
  });

  test("child peer contact is limited to known peers", () => {
    expect(canDirectlyContactChild("child", "known_peer")).toBe(true);
    expect(canDirectlyContactChild("child", "none")).toBe(false);
  });
});

describe("parent lifecycle", () => {
  test("current parent remains current while an active child link exists", () => {
    expect(
      deriveParentLifecycle({
        activeChildLinks: 1,
        historicChildLinks: 0,
        hasOptedIntoAlumniCommunity: false,
      }),
    ).toBe("current_parent");
  });

  test("former parent transitions to parent alumni only after opt-in", () => {
    expect(
      deriveParentLifecycle({
        activeChildLinks: 0,
        historicChildLinks: 1,
        hasOptedIntoAlumniCommunity: true,
      }),
    ).toBe("parent_alumni");
  });

  test("parent can be current and alumni across multiple child histories", () => {
    expect(
      deriveParentLifecycle({
        activeChildLinks: 1,
        historicChildLinks: 1,
        hasOptedIntoAlumniCommunity: true,
      }),
    ).toBe("current_and_alumni");
  });
});

describe("publication and AI safety", () => {
  test("failed scan never advances to publication approval", () => {
    expect(
      nextPublicationState({
        ageBand: "9_12",
        parentApprovalRequired: true,
        automatedSafetyScanPassed: false,
        moderatorApprovalRequired: true,
      }),
    ).toBe("awaiting_safety_scan");
  });

  test("parent approval is represented as an explicit state", () => {
    expect(
      nextPublicationState({
        ageBand: "9_12",
        parentApprovalRequired: true,
        automatedSafetyScanPassed: true,
        moderatorApprovalRequired: true,
      }),
    ).toBe("awaiting_parent_approval");
  });

  test("AI companions remain prohibited", () => {
    expect(prohibitedChildAiUses.has("ai_companion")).toBe(true);
    expect(prohibitedChildAiUses.has("secret_relationship")).toBe(true);
    expect(prohibitedChildAiUses.has("behavioural_manipulation")).toBe(true);
  });
});
