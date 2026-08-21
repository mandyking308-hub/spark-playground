import { describe, expect, it } from "bun:test";

import {
  childSafetyFeatureMayBypassReviewBecauseEmergency,
  emergencyChangeStillRequiresAfterActionReview,
  featureFlagMayExpandChildAccessByDefault,
  productionDeployMaySkipGreenCI,
  releaseDecision,
  rollbackMayRestoreRevokedPermissionsOrDeletedData,
} from "./release-governance-policy";

describe("release and change governance", () => {
  const safe = {
    risk: "low" as const,
    testsPassed: true,
    securityChecksPassed: true,
    rollbackPlanPresent: true,
    productionApproverDistinct: true,
    safetyImpactReviewed: true,
    databaseMigrationReversibleOrBackedUp: true,
    featureFlagAvailable: true,
    emergency: false,
  };

  it("blocks any release without green tests or security checks", () => {
    expect(releaseDecision({ ...safe, testsPassed: false })).toBe("block");
    expect(releaseDecision({ ...safe, securityChecksPassed: false })).toBe("block");
    expect(productionDeployMaySkipGreenCI()).toBe(false);
  });

  it("requires extra controls for high and critical changes", () => {
    expect(releaseDecision({ ...safe, risk: "high" })).toBe("review");
    expect(releaseDecision({ ...safe, risk: "high", rollbackPlanPresent: false })).toBe("block");
    expect(releaseDecision({ ...safe, risk: "critical", safetyImpactReviewed: false })).toBe("block");
    expect(releaseDecision({ ...safe, risk: "critical", productionApproverDistinct: false })).toBe("block");
  });

  it("blocks risky database changes without reversibility or recovery protection", () => {
    expect(releaseDecision({ ...safe, risk: "high", databaseMigrationReversibleOrBackedUp: false })).toBe("block");
  });

  it("keeps child access flags safe by default", () => {
    expect(featureFlagMayExpandChildAccessByDefault()).toBe(false);
  });

  it("does not let emergency labels bypass child safety", () => {
    expect(childSafetyFeatureMayBypassReviewBecauseEmergency()).toBe(false);
    expect(emergencyChangeStillRequiresAfterActionReview()).toBe(true);
  });

  it("prevents rollback from resurrecting deleted or revoked state", () => {
    expect(rollbackMayRestoreRevokedPermissionsOrDeletedData()).toBe(false);
  });
});
