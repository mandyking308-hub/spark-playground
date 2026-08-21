export const CHILD_REACTION_TYPES = [
  "inspired_me",
  "clear_explanation",
  "creative_idea",
  "great_teamwork",
] as const;

export type ChildReactionType = (typeof CHILD_REACTION_TYPES)[number];
export type FeedbackContextType = "cohort" | "club" | "challenge";

export interface ChildFeedbackContext {
  senderProfileId: string;
  recipientProfileId: string;
  projectOwnerProfileId: string;
  senderIsChild: boolean;
  recipientIsChild: boolean;
  senderContextVerified: boolean;
  recipientContextVerified: boolean;
  senderContextId: string;
  recipientContextId: string;
  contextType: FeedbackContextType;
  projectSharedInContext: boolean;
  reactionType: ChildReactionType;
}

export function isAllowedChildReaction(value: string): value is ChildReactionType {
  return CHILD_REACTION_TYPES.includes(value as ChildReactionType);
}

export function canSendConstructiveReaction(context: ChildFeedbackContext): boolean {
  return (
    context.senderIsChild &&
    context.recipientIsChild &&
    context.senderProfileId !== context.recipientProfileId &&
    context.recipientProfileId === context.projectOwnerProfileId &&
    context.senderContextVerified &&
    context.recipientContextVerified &&
    context.senderContextId === context.recipientContextId &&
    context.projectSharedInContext &&
    isAllowedChildReaction(context.reactionType)
  );
}

export function canChildSendFreeTextReaction(): false {
  return false;
}

export function canDisplayPublicReactionCount(): false {
  return false;
}

export function canRankChildrenByFeedback(): false {
  return false;
}

export function canOrganisationReactDirectlyToChild(): false {
  return false;
}
