export const STORAGE_BUCKETS = {
  quarantine: "child-quarantine",
  sanitized: "sanitized-media",
  publication: "publication-media",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

const opaqueObjectId = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function quarantineObjectPath(authUserId: string, objectId: string): string {
  if (!opaqueObjectId.test(objectId)) {
    throw new Error("Quarantine object IDs must be opaque UUIDv4 values.");
  }
  if (!authUserId || authUserId.includes("/") || authUserId.includes("..")) {
    throw new Error("Invalid authenticated user identifier for storage path.");
  }
  return `${authUserId}/${objectId}`;
}

export function isSafeQuarantineObjectPath(path: string, authUserId: string): boolean {
  const [owner, objectId, ...extra] = path.split("/");
  return extra.length === 0 && owner === authUserId && opaqueObjectId.test(objectId ?? "");
}

export function childMayWriteBucket(bucket: StorageBucket): boolean {
  return bucket === STORAGE_BUCKETS.quarantine;
}

export function childMayReplaceStoredObject(): false {
  return false;
}

export function originalUploadMayBecomePublicationObject(): false {
  return false;
}

export function sanitizedDerivativeRequiresServerSafetyState(input: {
  malwareClear: boolean;
  contentClear: boolean;
  metadataStripped: boolean;
  sourceQuarantined: boolean;
}): boolean {
  return input.malwareClear && input.contentClear && input.metadataStripped && input.sourceQuarantined;
}

export function publicationAssetRequiresApproval(input: {
  sanitizedDerivative: boolean;
  permissionApproved: boolean;
  moderationApproved: boolean;
  safetyReviewApproved: boolean;
}): boolean {
  return (
    input.sanitizedDerivative &&
    input.permissionApproved &&
    input.moderationApproved &&
    input.safetyReviewApproved
  );
}
