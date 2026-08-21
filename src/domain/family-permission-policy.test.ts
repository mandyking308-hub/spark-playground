import { describe, expect, test } from "bun:test";

import {
  canFinalizePermission,
  canGuardianDecideForChild,
  childCanWithdrawPendingRequest,
  parentCanInitiateChildPublication,
  parentCanReadPrivateChildDraftByDefault,
  type FamilyPermissionContext,
} from "./family-permission-policy";

const baseContext: FamilyPermissionContext = {
  childProfileId: "child-1",
  requestedByProfileId: "child-1",
  action: "publish_external",
  childWithdrew: false,
  guardianDecision: "approved",
  schoolDecision: "not_required",
  safetyDecision: "approved",
  requirements: {
    guardianRequired: true,
    schoolRequired: false,
    safetyReviewRequired: true,
  },
};

describe("family permission policy", () => {
  test("only a verified guardian link for the same child can decide", () => {
    const link = { parentProfileId: "parent-1", childProfileId: "child-1", status: "verified" as const };
    expect(canGuardianDecideForChild("parent-1", "child-1", link)).toBe(true);
    expect(canGuardianDecideForChild("parent-1", "child-2", link)).toBe(false);
    expect(canGuardianDecideForChild("parent-2", "child-1", link)).toBe(false);
    expect(canGuardianDecideForChild("parent-1", "child-1", { ...link, status: "revoked" })).toBe(false);
  });

  test("a parent cannot initiate publication in the child's name or read private drafts by default", () => {
    expect(parentCanInitiateChildPublication()).toBe(false);
    expect(parentCanReadPrivateChildDraftByDefault()).toBe(false);
    expect(canFinalizePermission({ ...baseContext, requestedByProfileId: "parent-1" })).toBe(false);
  });

  test("all required decisions must approve before an action can complete", () => {
    expect(canFinalizePermission(baseContext)).toBe(true);
    expect(canFinalizePermission({ ...baseContext, guardianDecision: "pending" })).toBe(false);
    expect(canFinalizePermission({ ...baseContext, safetyDecision: "pending" })).toBe(false);
  });

  test("any explicit denial blocks completion", () => {
    expect(canFinalizePermission({ ...baseContext, schoolDecision: "denied" })).toBe(false);
    expect(canFinalizePermission({ ...baseContext, guardianDecision: "denied" })).toBe(false);
  });

  test("child withdrawal overrides earlier approvals", () => {
    expect(canFinalizePermission({ ...baseContext, childWithdrew: true })).toBe(false);
  });

  test("a child can withdraw their own still-pending request", () => {
    expect(childCanWithdrawPendingRequest({ ...baseContext, guardianDecision: "pending" })).toBe(true);
    expect(childCanWithdrawPendingRequest(baseContext)).toBe(false);
  });
});
