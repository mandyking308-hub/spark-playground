export type ChildAgeBand = "6_8" | "9_12" | "13_15";

export type AiIntent =
  | "spelling_support"
  | "translation"
  | "brainstorming"
  | "guided_learning"
  | "story_structure"
  | "audio_cleanup"
  | "transcription"
  | "captioning"
  | "image_assistance"
  | "write_entire_assignment"
  | "ai_companion"
  | "romantic_roleplay"
  | "sexual_roleplay"
  | "medical_diagnosis"
  | "mental_health_diagnosis"
  | "identity_diagnosis"
  | "behavioural_manipulation"
  | "secret_relationship"
  | "real_child_deepfake";

export type AiDecision = "allow" | "guided" | "block";

const alwaysBlocked = new Set<AiIntent>([
  "ai_companion",
  "romantic_roleplay",
  "sexual_roleplay",
  "medical_diagnosis",
  "mental_health_diagnosis",
  "identity_diagnosis",
  "behavioural_manipulation",
  "secret_relationship",
  "real_child_deepfake",
]);

const allowedByAge: Record<ChildAgeBand, ReadonlySet<AiIntent>> = {
  "6_8": new Set([
    "spelling_support",
    "translation",
    "audio_cleanup",
    "transcription",
    "captioning",
  ]),
  "9_12": new Set([
    "spelling_support",
    "translation",
    "brainstorming",
    "guided_learning",
    "story_structure",
    "audio_cleanup",
    "transcription",
    "captioning",
  ]),
  "13_15": new Set([
    "spelling_support",
    "translation",
    "brainstorming",
    "guided_learning",
    "story_structure",
    "audio_cleanup",
    "transcription",
    "captioning",
    "image_assistance",
  ]),
};

export interface AiPolicyInput {
  ageBand: ChildAgeBand;
  intent: AiIntent;
  parentAiEnabled: boolean;
  schoolAiEnabled: boolean;
}

export interface AiPolicyResult {
  decision: AiDecision;
  reason: string;
  storePromptContent: false;
}

export function evaluateChildAi(input: AiPolicyInput): AiPolicyResult {
  if (alwaysBlocked.has(input.intent)) {
    return {
      decision: "block",
      reason: "This AI use is prohibited for children across the platform.",
      storePromptContent: false,
    };
  }

  if (!input.parentAiEnabled || !input.schoolAiEnabled) {
    return {
      decision: "block",
      reason: "AI is disabled by the parent or school policy for this child.",
      storePromptContent: false,
    };
  }

  if (input.intent === "write_entire_assignment") {
    return {
      decision: "guided",
      reason: "The assistant should coach, ask questions and scaffold the work rather than produce the finished assignment.",
      storePromptContent: false,
    };
  }

  if (!allowedByAge[input.ageBand].has(input.intent)) {
    return {
      decision: "guided",
      reason: "This capability requires a more constrained, age-appropriate flow.",
      storePromptContent: false,
    };
  }

  return {
    decision: "allow",
    reason: "Allowed as a bounded creation or learning tool for this age band.",
    storePromptContent: false,
  };
}

export const childAiDataPrinciples = {
  trainOnChildContent: false,
  behaviouralAdvertising: false,
  emotionalDependencyOptimisation: false,
  promptContentRetentionByDefault: false,
} as const;
