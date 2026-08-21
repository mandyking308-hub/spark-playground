import { describe, expect, it } from "bun:test";

import {
  backupMayBeUsedAsAnalyticsArchive,
  backupMayContainRawAuthProviderSecrets,
  productionRestoreRequiresTwoPeople,
  REQUIRED_POST_RESTORE_CHECKS,
  restoreMayExecute,
  restoredSessionShouldRemainActive,
  restoreMustReplayDeletionLedger,
  restoreMustRevalidateSafetyState,
  validRecoveryTargets,
} from "./resilience-recovery-policy";

const validRestore = {
  production: true,
  stepUpAuthenticated: true,
  requestedBy: "staff-a",
  approvedBy: "staff-b",
  changeOrIncidentReference: "INC-123",
  backupVerified: true,
  isolatedValidationCompleted: true,
  deletionLedgerReplayed: true,
  expiredAccessGrantsRemoved: true,
  securityPoliciesVerified: true,
};

describe("resilience and recovery policy", () => {
  it("requires two distinct people for production restores", () => {
    expect(productionRestoreRequiresTwoPeople()).toBe(true);
    expect(restoreMayExecute(validRestore)).toBe(true);
    expect(restoreMayExecute({ ...validRestore, approvedBy: "staff-a" })).toBe(false);
  });

  it("blocks restoration until validation, deletion replay and security checks complete", () => {
    expect(restoreMayExecute({ ...validRestore, isolatedValidationCompleted: false })).toBe(false);
    expect(restoreMayExecute({ ...validRestore, deletionLedgerReplayed: false })).toBe(false);
    expect(restoreMayExecute({ ...validRestore, expiredAccessGrantsRemoved: false })).toBe(false);
    expect(restoreMayExecute({ ...validRestore, securityPoliciesVerified: false })).toBe(false);
  });

  it("never restores old sessions as active", () => {
    expect(restoredSessionShouldRemainActive()).toBe(false);
    expect(REQUIRED_POST_RESTORE_CHECKS).toContain("session_revocation");
  });

  it("prevents backups becoming an undeclared archive or secret store", () => {
    expect(backupMayBeUsedAsAnalyticsArchive()).toBe(false);
    expect(backupMayContainRawAuthProviderSecrets()).toBe(false);
  });

  it("requires deletion and safety state to be re-applied after restore", () => {
    expect(restoreMustReplayDeletionLedger()).toBe(true);
    expect(restoreMustRevalidateSafetyState()).toBe(true);
    expect(REQUIRED_POST_RESTORE_CHECKS).toContain("media_quarantine");
    expect(REQUIRED_POST_RESTORE_CHECKS).toContain("permission_expiry");
    expect(REQUIRED_POST_RESTORE_CHECKS).toContain("partner_access_expiry");
  });

  it("keeps recovery targets configurable and policy-versioned", () => {
    expect(validRecoveryTargets({ policyVersion: "recovery-v1", recoveryPointMinutes: 60, recoveryTimeMinutes: 240 })).toBe(true);
    expect(validRecoveryTargets({ policyVersion: "", recoveryPointMinutes: 60, recoveryTimeMinutes: 240 })).toBe(false);
    expect(validRecoveryTargets({ policyVersion: "v1", recoveryPointMinutes: 0, recoveryTimeMinutes: 240 })).toBe(false);
  });
});
