export type UploadKind = "image" | "audio" | "video";

export type UploadCandidate = {
  kind: UploadKind;
  declaredMimeType: string;
  detectedMimeType: string;
  byteSize: number;
  malwareScan: "pending" | "clean" | "blocked" | "error";
  contentScan: "pending" | "clear" | "review" | "blocked" | "error";
  metadataStripped: boolean;
  sanitizedDerivativeReady: boolean;
};

export const ALLOWED_MEDIA_TYPES: Record<UploadKind, readonly string[]> = {
  image: ["image/jpeg", "image/png", "image/webp"],
  audio: ["audio/mpeg", "audio/wav", "audio/mp4", "audio/webm"],
  video: ["video/mp4", "video/webm"],
};

// Product defaults, not legal limits. Keep configurable in the backend.
export const UPLOAD_SIZE_LIMITS: Record<UploadKind, number> = {
  image: 20 * 1024 * 1024,
  audio: 250 * 1024 * 1024,
  video: 1024 * 1024 * 1024,
};

export const NEVER_ACCEPT_CHILD_UPLOAD_MIME_TYPES = [
  "image/svg+xml",
  "text/html",
  "application/javascript",
  "application/x-javascript",
  "application/x-msdownload",
  "application/x-sh",
  "application/zip",
  "application/x-rar-compressed",
] as const;

export function fileTypeIsAllowed(candidate: Pick<UploadCandidate, "kind" | "declaredMimeType" | "detectedMimeType">): boolean {
  if (candidate.declaredMimeType !== candidate.detectedMimeType) return false;
  if ((NEVER_ACCEPT_CHILD_UPLOAD_MIME_TYPES as readonly string[]).includes(candidate.detectedMimeType)) return false;
  return ALLOWED_MEDIA_TYPES[candidate.kind].includes(candidate.detectedMimeType);
}

export function fileSizeIsAllowed(candidate: Pick<UploadCandidate, "kind" | "byteSize">): boolean {
  return candidate.byteSize > 0 && candidate.byteSize <= UPLOAD_SIZE_LIMITS[candidate.kind];
}

export function ingestionMayLeaveQuarantine(candidate: UploadCandidate): boolean {
  if (!fileTypeIsAllowed(candidate) || !fileSizeIsAllowed(candidate)) return false;
  if (candidate.malwareScan !== "clean") return false;
  if (candidate.contentScan !== "clear") return false;
  if (!candidate.metadataStripped) return false;
  if (!candidate.sanitizedDerivativeReady) return false;
  return true;
}

export function publicationMayUseOriginalUpload(): false {
  return false;
}

export function scanFailureFailsClosed(scan: "malware" | "content" | "metadata"): boolean {
  return ["malware", "content", "metadata"].includes(scan);
}

export const STORAGE_POLICY = {
  originalVisibility: "private-quarantine",
  sanitizedVisibility: "private-until-publication-approved",
  useRandomStorageKeys: true,
  useUserFilenameAsStorageKey: false,
  preservePreciseLocationMetadata: false,
} as const;
