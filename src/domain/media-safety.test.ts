import { describe, expect, test } from "bun:test";

import {
  canExposeMediaClassToPublic,
  evaluateMediaForPublication,
  shouldStripMetadataBeforeDerivative,
} from "./media-safety";

describe("child media safety", () => {
  test("private originals can never be publicly exposed", () => {
    expect(canExposeMediaClassToPublic("private_original")).toBe(false);
    expect(canExposeMediaClassToPublic("review_derivative")).toBe(false);
    expect(canExposeMediaClassToPublic("published_derivative")).toBe(true);
  });

  test("blocks publication when personal safety findings are blocking", () => {
    const decision = evaluateMediaForPublication({
      kind: "image",
      containsExifOrLocationMetadata: true,
      findings: [
        {
          type: "precise_location",
          severity: "block",
          detail: "Precise home location detected.",
        },
      ],
      parentApprovalRequired: true,
      parentApproved: true,
      moderatorApproved: true,
    });

    expect(decision.mayPublish).toBe(false);
    expect(decision.requiresSanitisedDerivative).toBe(true);
  });

  test("required parent approval and moderation are both enforced", () => {
    const decision = evaluateMediaForPublication({
      kind: "audio",
      containsExifOrLocationMetadata: false,
      findings: [],
      parentApprovalRequired: true,
      parentApproved: false,
      moderatorApproved: false,
    });

    expect(decision.mayPublish).toBe(false);
    expect(decision.blockingReasons).toContain("Required parent approval is missing.");
    expect(decision.blockingReasons).toContain("Moderation approval is missing.");
  });

  test("sanitised approved media can become a published derivative", () => {
    const decision = evaluateMediaForPublication({
      kind: "audio",
      containsExifOrLocationMetadata: false,
      findings: [
        { type: "copyright_review", severity: "info", detail: "Attribution checked." },
      ],
      parentApprovalRequired: false,
      parentApproved: false,
      moderatorApproved: true,
    });

    expect(decision.mayPublish).toBe(true);
    expect(decision.blockingReasons).toHaveLength(0);
  });

  test("image, video and document derivatives strip metadata", () => {
    expect(shouldStripMetadataBeforeDerivative("image")).toBe(true);
    expect(shouldStripMetadataBeforeDerivative("video")).toBe(true);
    expect(shouldStripMetadataBeforeDerivative("document")).toBe(true);
    expect(shouldStripMetadataBeforeDerivative("audio")).toBe(false);
  });
});
