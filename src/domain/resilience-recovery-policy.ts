export type RestoreScope = "profile" | "school" | "group" | "platform";

export type RestoreRequest = {
  production: boolean;
  stepUpAuthenticated: boolean;
  requestedBy: string;
  approvedBy?: string;
  changeOrIncidentReference: string;
  backupVerified: boolean;
  isolatedValidationCompleted: boolean;
  deletionLedgerReplayed: boolean;
  expiredAccessGrantsRemoved: boolean;
  securityPoliciesVerified: boolean;
};

export function restoreMayExecute(request: RestoreRequest): boolean {
  if (!request.stepUpAuthenticated || !request.backupVerified) return false;
  if (request.changeOrIncidentReference.trim().length === 0) return false;
  if (!request.isolatedValidationCompleted) return false;
  if (!request.deletionLedgerReplayed || !request.expiredAccessGrantsRemoved) return false;
  if (!request.securityPoliciesVerified) return false;
  if (request.production) {
    if (!request.approvedBy || request.approvedBy === request.requestedBy) return false;
  }
  return true;
}

export function productionRestoreRequiresTwoPeople(): true {
  return true;
}

export function restoredSessionShouldRemainActive(): false {
  return false;
}

export function backupMayBeUsedAsAnalyticsArchive(): false {
  return false;
}

export function backupMayContainRawAuthProviderSecrets(): false {
  return false;
}

export function restoreMustReplayDeletionLedger(): true {
  return true;
}

export function restoreMustRevalidateSafetyState(): true {
  return true;
}

export type RecoveryTargets = {
  policyVersion: string;
  recoveryPointMinutes: number;
  recoveryTimeMinutes: number;
};

export function validRecoveryTargets(targets: RecoveryTargets): boolean {
  return (
    targets.policyVersion.trim().length > 0 &&
    Number.isFinite(targets.recoveryPointMinutes) &&
    Number.isFinite(targets.recoveryTimeMinutes) &&
    targets.recoveryPointMinutes > 0 &&
    targets.recoveryTimeMinutes > 0
  );
}

export const REQUIRED_POST_RESTORE_CHECKS = [
  "row_level_security",
  "role_membership_access",
  "deletion_tombstones",
  "retention_holds",
  "media_quarantine",
  "publication_eligibility",
  "permission_expiry",
  "partner_access_expiry",
  "session_revocation",
] as const;
