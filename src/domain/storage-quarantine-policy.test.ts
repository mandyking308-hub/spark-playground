import { describe, expect, test } from "bun:test";

import {
  STORAGE_BUCKETS,
  childMayReplaceStoredObject,
  childMayWriteBucket,
  isSafeQuarantineObjectPath,
  originalUploadMayBecomePublicationObject,
  publicationAssetRequiresApproval,
  quarantineObjectPath,
  sanitizedDerivativeRequiresServerSafetyState,
} from "./storage-quarantine-policy";

const userId = "user-123";
const objectId = "550e8400-e29b-41d4-a716-446655440000";

describe("child media storage boundary", () => {
  test("uses opaque paths rather than original filenames", () => {
    expect(quarantineObjectPath(userId, objectId)).toBe(`${userId}/${objectId}`);
    expect(isSafeQuarantineObjectPath(`${userId}/holiday-at-school.jpg`, userId)).toBe(false);
  });

  test("rejects paths owned by a different authenticated user", () => {
    expect(isSafeQuarantineObjectPath(`other-user/${objectId}`, userId)).toBe(false);
  });

  test("children can write only to quarantine", () => {
    expect(childMayWriteBucket(STORAGE_BUCKETS.quarantine)).toBe(true);
    expect(childMayWriteBucket(STORAGE_BUCKETS.sanitized)).toBe(false);
    expect(childMayWriteBucket(STORAGE_BUCKETS.publication)).toBe(false);
  });

  test("children cannot replace/upsert stored originals", () => {
    expect(childMayReplaceStoredObject()).toBe(false);
  });

  test("original uploads never become publication objects", () => {
    expect(originalUploadMayBecomePublicationObject()).toBe(false);
  });

  test("sanitized derivative fails closed unless every safety prerequisite is satisfied", () => {
    expect(
      sanitizedDerivativeRequiresServerSafetyState({
        malwareClear: true,
        contentClear: true,
        metadataStripped: true,
        sourceQuarantined: true,
      }),
    ).toBe(true);
    expect(
      sanitizedDerivativeRequiresServerSafetyState({
        malwareClear: true,
        contentClear: false,
        metadataStripped: true,
        sourceQuarantined: true,
      }),
    ).toBe(false);
  });

  test("publication requires derivative plus permission, moderation and safety approval", () => {
    expect(
      publicationAssetRequiresApproval({
        sanitizedDerivative: true,
        permissionApproved: true,
        moderationApproved: true,
        safetyReviewApproved: true,
      }),
    ).toBe(true);
    expect(
      publicationAssetRequiresApproval({
        sanitizedDerivative: true,
        permissionApproved: false,
        moderationApproved: true,
        safetyReviewApproved: true,
      }),
    ).toBe(false);
  });
});
