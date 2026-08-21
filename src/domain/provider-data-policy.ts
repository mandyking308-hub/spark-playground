export type ProviderPurpose =
  | "auth"
  | "storage"
  | "ai"
  | "email"
  | "notification"
  | "payment"
  | "moderation"
  | "observability"
  | "backup";

export type ProviderDataClass =
  | "account_identity"
  | "guardian_relationship"
  | "child_content"
  | "sanitized_media"
  | "ai_prompt"
  | "payment_reference"
  | "safeguarding"
  | "operational_telemetry";

export interface ProviderApproval {
  verified: boolean;
  purpose: ProviderPurpose;
  approvedDataClasses: readonly ProviderDataClass[];
  regionApproved: boolean;
  retentionDays: number;
  subprocessorsReviewed: boolean;
  incidentContactVerified: boolean;
  childDataTrainingAllowed: boolean;
  behaviouralAdvertisingAllowed: boolean;
}

export function providerCanProcess(input: ProviderApproval, dataClass: ProviderDataClass): boolean {
  if (!input.verified || !input.regionApproved || !input.subprocessorsReviewed || !input.incidentContactVerified) return false;
  if (!Number.isInteger(input.retentionDays) || input.retentionDays < 0 || input.retentionDays > 365) return false;
  if (!input.approvedDataClasses.includes(dataClass)) return false;
  if (input.childDataTrainingAllowed || input.behaviouralAdvertisingAllowed) return false;
  if (input.purpose === "observability" && dataClass !== "operational_telemetry") return false;
  if (input.purpose === "payment" && dataClass !== "payment_reference") return false;
  if (dataClass === "safeguarding" && !["storage", "moderation", "backup"].includes(input.purpose)) return false;
  return true;
}

export function aiProviderMayTrainOnChildData(): false {
  return false;
}

export function providerMayReceiveDataOutsideApprovedClasses(): false {
  return false;
}

export function providerMayChangeRegionOrSubprocessorsSilently(): false {
  return false;
}

export function providerApprovalMustBeVersioned(): true {
  return true;
}

export function childBehaviouralAdvertisingThroughProviderAllowed(): false {
  return false;
}

export const PROVIDER_GOVERNANCE_PRINCIPLES = [
  "Each provider is approved for a named purpose and explicit data classes only.",
  "Region/residency compatibility is verified against versioned jurisdiction policy before processing begins.",
  "Child data is never available for provider model training or behavioural advertising.",
  "Provider retention is bounded and purpose-specific rather than indefinite.",
  "Subprocessor changes require review; they cannot silently expand the data-processing chain.",
  "Provider incidents route into the platform incident-response workflow.",
] as const;
