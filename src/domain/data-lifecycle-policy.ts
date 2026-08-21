export type DataClass =
  | "profile"
  | "projects"
  | "media"
  | "achievements"
  | "passport"
  | "community"
  | "consent_history"
  | "moderation"
  | "safeguarding"
  | "audit";

export type DataRightsRequestKind = "export" | "delete_account" | "alumni_transfer";

export const ORDINARY_DELETION_CLASSES: readonly DataClass[] = [
  "profile",
  "projects",
  "media",
  "achievements",
  "passport",
  "community",
];

export const HOLD_ELIGIBLE_CLASSES: readonly DataClass[] = [
  "consent_history",
  "moderation",
  "safeguarding",
  "audit",
];

export type RetentionHold = {
  dataClass: DataClass;
  reason: string;
  policyVersion: string;
  retainUntil: Date;
};

export type AlumniTransferInput = {
  age: number;
  alumniEligible: boolean;
  explicitConsent: boolean;
  selectedPortfolioItemIds: readonly string[];
  includesSafeguardingData?: boolean;
  includesGuardianLinkData?: boolean;
};

export function canPlaceRetentionHold(hold: RetentionHold, now = new Date()): boolean {
  return (
    HOLD_ELIGIBLE_CLASSES.includes(hold.dataClass) &&
    hold.reason.trim().length >= 8 &&
    hold.policyVersion.trim().length > 0 &&
    hold.retainUntil.getTime() > now.getTime()
  );
}

export function classesToDelete(activeHolds: readonly RetentionHold[], now = new Date()): DataClass[] {
  const held = new Set(
    activeHolds
      .filter((hold) => canPlaceRetentionHold(hold, now))
      .map((hold) => hold.dataClass),
  );

  return ([...ORDINARY_DELETION_CLASSES, ...HOLD_ELIGIBLE_CLASSES] as DataClass[]).filter(
    (dataClass) => !held.has(dataClass),
  );
}

export function canTransferToAlumni(input: AlumniTransferInput): boolean {
  if (input.age < 16 || !input.alumniEligible || !input.explicitConsent) return false;
  if (input.selectedPortfolioItemIds.length === 0) return false;
  if (new Set(input.selectedPortfolioItemIds).size !== input.selectedPortfolioItemIds.length) return false;
  if (input.includesSafeguardingData || input.includesGuardianLinkData) return false;
  return true;
}

export function exportableClassesForChild(): readonly DataClass[] {
  // Internal safeguarding/moderation records can contain third-party or protected operational data.
  // They are not blindly placed into a self-service export bundle.
  return [
    "profile",
    "projects",
    "media",
    "achievements",
    "passport",
    "community",
    "consent_history",
  ];
}

export function shouldRevokeAccessImmediately(kind: DataRightsRequestKind): boolean {
  return kind === "delete_account";
}
