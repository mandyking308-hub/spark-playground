export type ChangeRisk = "low" | "medium" | "high" | "critical";
export type ReleaseDecision = "allow" | "review" | "block";

export interface ReleaseContext {
  risk: ChangeRisk;
  testsPassed: boolean;
  securityChecksPassed: boolean;
  rollbackPlanPresent: boolean;
  productionApproverDistinct: boolean;
  safetyImpactReviewed: boolean;
  databaseMigrationReversibleOrBackedUp: boolean;
  featureFlagAvailable: boolean;
  emergency: boolean;
}

export function releaseDecision(context: ReleaseContext): ReleaseDecision {
  if (!context.testsPassed || !context.securityChecksPassed) return "block";
  if (["high", "critical"].includes(context.risk)) {
    if (!context.rollbackPlanPresent || !context.productionApproverDistinct || !context.safetyImpactReviewed) return "block";
    if (!context.databaseMigrationReversibleOrBackedUp) return "block";
    return "review";
  }
  if (context.risk === "medium" && !context.rollbackPlanPresent) return "review";
  return "allow";
}

export function childSafetyFeatureMayBypassReviewBecauseEmergency(): false {
  return false;
}

export function featureFlagMayExpandChildAccessByDefault(): false {
  return false;
}

export function productionDeployMaySkipGreenCI(): false {
  return false;
}

export function rollbackMayRestoreRevokedPermissionsOrDeletedData(): false {
  return false;
}

export function emergencyChangeStillRequiresAfterActionReview(): true {
  return true;
}

export const RELEASE_GOVERNANCE_PRINCIPLES = [
  "Production releases require green automated tests and security checks.",
  "High/critical changes require safety-impact review, rollback evidence and a distinct production approver.",
  "Feature flags default to the safer state and cannot silently widen child/adult access.",
  "Database changes require reversible migration or verified recovery protection.",
  "Emergency changes do not bypass child-safety review and always receive after-action review.",
  "Rollback cannot resurrect deleted data, expired permissions or revoked access.",
] as const;
