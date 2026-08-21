import { describe, expect, it } from "bun:test";

import {
  fileTypeIsAllowed,
  ingestionMayLeaveQuarantine,
  publicationMayUseOriginalUpload,
  scanFailureFailsClosed,
  STORAGE_POLICY,
} from "./media-ingestion-policy";

const safeImage = {
  kind: "image" as const,
  declaredMimeType: "image/jpeg",
  detectedMimeType: "image/jpeg",
  byteSize: 500_000,
  malwareScan: "clean" as const,
  contentScan: "clear" as const,
  metadataStripped: true,
  sanitizedDerivativeReady: true,
};

describe("media ingestion policy", () => {
  it("requires server-detected MIME type to match the declaration", () => {
    expect(fileTypeIsAllowed(safeImage)).toBe(true);
    expect(fileTypeIsAllowed({ ...safeImage, detectedMimeType: "text/html" })).toBe(false);
  });

  it("rejects active/executable child-upload formats", () => {
    expect(fileTypeIsAllowed({ kind: "image", declaredMimeType: "image/svg+xml", detectedMimeType: "image/svg+xml" })).toBe(false);
  });

  it("keeps scans pending/review/error in quarantine", () => {
    expect(ingestionMayLeaveQuarantine({ ...safeImage, malwareScan: "pending" })).toBe(false);
    expect(ingestionMayLeaveQuarantine({ ...safeImage, contentScan: "review" })).toBe(false);
    expect(ingestionMayLeaveQuarantine({ ...safeImage, contentScan: "error" })).toBe(false);
  });

  it("requires metadata stripping and a sanitized derivative", () => {
    expect(ingestionMayLeaveQuarantine({ ...safeImage, metadataStripped: false })).toBe(false);
    expect(ingestionMayLeaveQuarantine({ ...safeImage, sanitizedDerivativeReady: false })).toBe(false);
    expect(ingestionMayLeaveQuarantine(safeImage)).toBe(true);
  });

  it("never publishes the original uploaded file", () => {
    expect(publicationMayUseOriginalUpload()).toBe(false);
    expect(STORAGE_POLICY.originalVisibility).toBe("private-quarantine");
    expect(STORAGE_POLICY.useUserFilenameAsStorageKey).toBe(false);
  });

  it("fails closed when a safety scanner is unavailable", () => {
    expect(scanFailureFailsClosed("malware")).toBe(true);
    expect(scanFailureFailsClosed("content")).toBe(true);
    expect(scanFailureFailsClosed("metadata")).toBe(true);
  });

  it("does not preserve precise location metadata", () => {
    expect(STORAGE_POLICY.preservePreciseLocationMetadata).toBe(false);
  });
});
