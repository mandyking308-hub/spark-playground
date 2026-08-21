import { describe, expect, test } from "bun:test";

import {
  alumniStatusGrantsUnder16Access,
  canAlumniMentorAlumni,
  canApplyToOpportunity,
  canEnterAlumniEnvironment,
  childhoodPrivateDataTransfersAutomatically,
} from "./alumni-opportunity-policy";

const alumni = {
  userId: "alumni-1",
  age: 18,
  alumniVerified: true,
  selectedPortfolioItemIds: ["portfolio-1", "portfolio-2"],
};

const provider = { providerId: "provider-1", providerType: "university" as const, verified: true };

describe("16+ alumni environment", () => {
  test("verified member at or above threshold can enter", () => {
    expect(canEnterAlumniEnvironment(alumni)).toBe(true);
    expect(canEnterAlumniEnvironment({ ...alumni, age: 15 })).toBe(false);
    expect(canEnterAlumniEnvironment({ ...alumni, alumniVerified: false })).toBe(false);
  });

  test("applications can disclose only portfolio items the alumni selected", () => {
    expect(canApplyToOpportunity({ alumni, provider, requestedPortfolioItemIds: ["portfolio-1"] })).toBe(true);
    expect(canApplyToOpportunity({ alumni, provider, requestedPortfolioItemIds: ["private-childhood-item"] })).toBe(false);
  });

  test("unverified opportunity providers cannot receive applications", () => {
    expect(canApplyToOpportunity({ alumni, provider: { ...provider, verified: false }, requestedPortfolioItemIds: ["portfolio-1"] })).toBe(false);
  });

  test("verified adult alumni can mentor one another", () => {
    expect(canAlumniMentorAlumni(alumni, { ...alumni, userId: "alumni-2" })).toBe(true);
  });

  test("alumni status never grants child access or automatic childhood data transfer", () => {
    expect(alumniStatusGrantsUnder16Access()).toBe(false);
    expect(childhoodPrivateDataTransfersAutomatically()).toBe(false);
  });
});
