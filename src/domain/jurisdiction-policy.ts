export interface JurisdictionPolicy {
  id: string;
  jurisdictionCode: string;
  version: string;
  effectiveFrom: string;
  minimumAgeForAlumniEnvironment: number;
  childDirectMessagingAllowed: boolean;
  childLivestreamingAllowed: boolean;
  behaviouralAdvertisingAllowedForChildren: boolean;
  childAiCompanionsAllowed: boolean;
  parentPublishingApprovalRequiredByDefault: boolean;
  locationSharingAllowedByDefault: boolean;
  profilingAllowedByDefault: boolean;
}

export const SAFE_DEFAULT_POLICY: JurisdictionPolicy = {
  id: "safe-default",
  jurisdictionCode: "DEFAULT",
  version: "1",
  effectiveFrom: "2026-01-01",
  minimumAgeForAlumniEnvironment: 16,
  childDirectMessagingAllowed: false,
  childLivestreamingAllowed: false,
  behaviouralAdvertisingAllowedForChildren: false,
  childAiCompanionsAllowed: false,
  parentPublishingApprovalRequiredByDefault: true,
  locationSharingAllowedByDefault: false,
  profilingAllowedByDefault: false,
};

export interface ChildFeatureFlags {
  directMessaging: boolean;
  livestreaming: boolean;
  behaviouralAdvertising: boolean;
  aiCompanions: boolean;
  parentPublishingApproval: boolean;
  locationSharing: boolean;
  profiling: boolean;
}

export function resolveChildFeatureFlags(
  policy: JurisdictionPolicy | undefined,
): ChildFeatureFlags {
  const active = policy ?? SAFE_DEFAULT_POLICY;
  return {
    directMessaging: active.childDirectMessagingAllowed,
    livestreaming: active.childLivestreamingAllowed,
    behaviouralAdvertising: active.behaviouralAdvertisingAllowedForChildren,
    aiCompanions: active.childAiCompanionsAllowed,
    parentPublishingApproval: active.parentPublishingApprovalRequiredByDefault,
    locationSharing: active.locationSharingAllowedByDefault,
    profiling: active.profilingAllowedByDefault,
  };
}

export function isEligibleForAlumniEnvironment(age: number, policy?: JurisdictionPolicy): boolean {
  return age >= (policy ?? SAFE_DEFAULT_POLICY).minimumAgeForAlumniEnvironment;
}
