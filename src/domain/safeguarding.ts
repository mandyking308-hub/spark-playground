export type PublicationState =
  | "draft"
  | "awaiting_safety_scan"
  | "awaiting_parent_approval"
  | "awaiting_moderation"
  | "approved"
  | "rejected"
  | "published"
  | "removed";

export type ChildAiCapability =
  | "spelling_support"
  | "translation"
  | "brainstorming"
  | "guided_learning"
  | "audio_cleanup"
  | "transcription"
  | "captioning"
  | "story_structure"
  | "image_assistance";

export type ProhibitedChildAiUse =
  | "ai_companion"
  | "romantic_roleplay"
  | "sexual_roleplay"
  | "medical_diagnosis"
  | "mental_health_diagnosis"
  | "identity_diagnosis"
  | "behavioural_manipulation"
  | "secret_relationship"
  | "unrestricted_real_child_deepfake";

export const ageCapabilities: Record<"6_8" | "9_12" | "13_15", ReadonlySet<ChildAiCapability>> = {
  "6_8": new Set(["spelling_support", "translation", "audio_cleanup", "transcription", "captioning"]),
  "9_12": new Set([
    "spelling_support",
    "translation",
    "brainstorming",
    "guided_learning",
    "audio_cleanup",
    "transcription",
    "captioning",
    "story_structure",
  ]),
  "13_15": new Set([
    "spelling_support",
    "translation",
    "brainstorming",
    "guided_learning",
    "audio_cleanup",
    "transcription",
    "captioning",
    "story_structure",
    "image_assistance",
  ]),
};

export const prohibitedChildAiUses = new Set<ProhibitedChildAiUse>([
  "ai_companion",
  "romantic_roleplay",
  "sexual_roleplay",
  "medical_diagnosis",
  "mental_health_diagnosis",
  "identity_diagnosis",
  "behavioural_manipulation",
  "secret_relationship",
  "unrestricted_real_child_deepfake",
]);

export interface PublicationPolicyInput {
  ageBand: "6_8" | "9_12" | "13_15";
  parentApprovalRequired: boolean;
  automatedSafetyScanPassed: boolean;
  moderatorApprovalRequired: boolean;
  moderatorApproved?: boolean;
}

export function nextPublicationState(input: PublicationPolicyInput): PublicationState {
  if (!input.automatedSafetyScanPassed) return "awaiting_safety_scan";
  if (input.parentApprovalRequired) return "awaiting_parent_approval";
  if (input.moderatorApprovalRequired && !input.moderatorApproved) return "awaiting_moderation";
  return "approved";
}

export interface SafetyBoundary {
  id: string;
  rule: string;
  enforcement: "application" | "database" | "moderation" | "all";
}

export const safetyBoundaries: SafetyBoundary[] = [
  {
    id: "no-open-child-directory",
    rule: "Children are discovered through approved content, cohorts, clubs and programmes; there is no browsable public directory of minors.",
    enforcement: "all",
  },
  {
    id: "no-adult-child-dm",
    rule: "Adults cannot directly message unrelated children. Any approved adult participation uses moderated programme channels.",
    enforcement: "all",
  },
  {
    id: "parent-own-child-only",
    rule: "A parent or guardian may access only children to whom an active verified guardian relationship exists.",
    enforcement: "database",
  },
  {
    id: "tenant-isolation",
    rule: "Education groups and schools may access only data within their authorised tenant and organisational scope.",
    enforcement: "database",
  },
  {
    id: "parent-alumni-adult-only",
    rule: "Parent Alumni is an adult community. Membership never grants access to unrelated child profiles, portfolios or private child activity.",
    enforcement: "all",
  },
  {
    id: "alumni-boundary",
    rule: "The 16+ alumni environment is separate from the under-16 experience; only explicitly approved portfolio items transition across the boundary.",
    enforcement: "all",
  },
  {
    id: "no-ai-companions",
    rule: "AI may assist creation and learning but must not simulate a romantic, secret or dependency-forming relationship with a child.",
    enforcement: "application",
  },
];
