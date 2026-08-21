export type MediaKind = "audio" | "image" | "video" | "document";

export interface MediaSafetyFinding {
  type:
    | "precise_location"
    | "contact_detail"
    | "school_identifier"
    | "face"
    | "unsafe_content"
    | "copyright_review"
    | "metadata";
  severity: "info" | "review" | "block";
  detail: string;
}

export interface MediaSafetyInput {
  kind: MediaKind;
  containsExifOrLocationMetadata: boolean;
  findings: MediaSafetyFinding[];
  parentApprovalRequired: boolean;
  parentApproved: boolean;
  moderatorApproved: boolean;
}

export interface MediaSafetyDecision {
  mayPublish: boolean;
  requiresSanitisedDerivative: boolean;
  blockingReasons: string[];
}

export function evaluateMediaForPublication(input: MediaSafetyInput): MediaSafetyDecision {
  const blockingReasons = input.findings
    .filter((finding) => finding.severity === "block")
    .map((finding) => finding.detail);

  if (input.parentApprovalRequired && !input.parentApproved) {
    blockingReasons.push("Required parent approval is missing.");
  }

  if (!input.moderatorApproved) {
    blockingReasons.push("Moderation approval is missing.");
  }

  return {
    mayPublish: blockingReasons.length === 0,
    requiresSanitisedDerivative: input.containsExifOrLocationMetadata || input.findings.some((f) => f.type === "metadata"),
    blockingReasons,
  };
}

export type MediaStorageClass = "private_original" | "review_derivative" | "published_derivative";

export function canExposeMediaClassToPublic(storageClass: MediaStorageClass): boolean {
  return storageClass === "published_derivative";
}

export function shouldStripMetadataBeforeDerivative(kind: MediaKind): boolean {
  return kind === "image" || kind === "video" || kind === "document";
}
