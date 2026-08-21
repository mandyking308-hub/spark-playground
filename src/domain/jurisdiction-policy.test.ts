import { describe, expect, test } from "bun:test";

import {
  SAFE_DEFAULT_POLICY,
  isEligibleForAlumniEnvironment,
  resolveChildFeatureFlags,
} from "./jurisdiction-policy";

describe("jurisdiction policy safety fallback", () => {
  test("unknown jurisdictions fall back to the safer child settings", () => {
    expect(resolveChildFeatureFlags(undefined)).toEqual({
      directMessaging: false,
      livestreaming: false,
      behaviouralAdvertising: false,
      aiCompanions: false,
      parentPublishingApproval: true,
      locationSharing: false,
      profiling: false,
    });
  });

  test("default alumni threshold is 16", () => {
    expect(isEligibleForAlumniEnvironment(15)).toBe(false);
    expect(isEligibleForAlumniEnvironment(16)).toBe(true);
  });

  test("a verified jurisdiction policy can be versioned independently", () => {
    const custom = {
      ...SAFE_DEFAULT_POLICY,
      id: "example-policy",
      jurisdictionCode: "XX",
      version: "2026.2",
      minimumAgeForAlumniEnvironment: 18,
    };

    expect(isEligibleForAlumniEnvironment(17, custom)).toBe(false);
    expect(isEligibleForAlumniEnvironment(18, custom)).toBe(true);
  });
});
