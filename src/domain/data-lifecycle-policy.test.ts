import { describe, expect, it } from "bun:test";

import {
  canPlaceRetentionHold,
  canTransferToAlumni,
  classesToDelete,
  exportableClassesForChild,
  shouldRevokeAccessImmediately,
} from "./data-lifecycle-policy";

describe("data lifecycle policy", () => {
  const now = new Date("2026-08-21T09:00:00Z");

  it("never allows an ordinary product-data class to be hidden behind a retention hold", () => {
    expect(
      canPlaceRetentionHold(
        {
          dataClass: "projects",
          reason: "Keep this indefinitely",
          policyVersion: "uk-child-v1",
          retainUntil: new Date("2027-08-21T09:00:00Z"),
        },
        now,
      ),
    ).toBe(false);
  });

  it("requires a reason, policy version and future expiry for safety/compliance holds", () => {
    expect(
      canPlaceRetentionHold(
        {
          dataClass: "safeguarding",
          reason: "Active safeguarding review",
          policyVersion: "uk-child-v1",
          retainUntil: new Date("2027-08-21T09:00:00Z"),
        },
        now,
      ),
    ).toBe(true);

    expect(
      canPlaceRetentionHold(
        {
          dataClass: "audit",
          reason: "short",
          policyVersion: "uk-child-v1",
          retainUntil: new Date("2027-08-21T09:00:00Z"),
        },
        now,
      ),
    ).toBe(false);
  });

  it("deletes ordinary account data even when a narrow safety hold exists", () => {
    const deletions = classesToDelete(
      [
        {
          dataClass: "safeguarding",
          reason: "Active safeguarding review",
          policyVersion: "uk-child-v1",
          retainUntil: new Date("2027-08-21T09:00:00Z"),
        },
      ],
      now,
    );

    expect(deletions).toContain("projects");
    expect(deletions).toContain("profile");
    expect(deletions).not.toContain("safeguarding");
  });

  it("permits only explicit 16+ selective portfolio transfer into Alumni", () => {
    expect(
      canTransferToAlumni({
        age: 16,
        alumniEligible: true,
        explicitConsent: true,
        selectedPortfolioItemIds: ["portfolio-1", "portfolio-2"],
      }),
    ).toBe(true);

    expect(
      canTransferToAlumni({
        age: 15,
        alumniEligible: true,
        explicitConsent: true,
        selectedPortfolioItemIds: ["portfolio-1"],
      }),
    ).toBe(false);
  });

  it("never transfers safeguarding or guardian-link data into Alumni", () => {
    expect(
      canTransferToAlumni({
        age: 16,
        alumniEligible: true,
        explicitConsent: true,
        selectedPortfolioItemIds: ["portfolio-1"],
        includesSafeguardingData: true,
      }),
    ).toBe(false);
  });

  it("keeps protected operational records out of automatic self-service exports", () => {
    expect(exportableClassesForChild()).not.toContain("safeguarding");
    expect(exportableClassesForChild()).not.toContain("moderation");
    expect(exportableClassesForChild()).toContain("projects");
  });

  it("revokes access immediately when account deletion begins", () => {
    expect(shouldRevokeAccessImmediately("delete_account")).toBe(true);
    expect(shouldRevokeAccessImmediately("export")).toBe(false);
  });
});
