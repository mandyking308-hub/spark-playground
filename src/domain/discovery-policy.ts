export type DiscoveryEntity = "topic" | "show" | "project" | "club" | "challenge" | "organisation" | "child_profile";

export interface DiscoveryQuery {
  requesterIsChild: boolean;
  entity: DiscoveryEntity;
  usesBehaviouralProfiling: boolean;
  usesPopularityRanking: boolean;
  curatedOrContextual: boolean;
}

export function canRunDiscoveryQuery(query: DiscoveryQuery): boolean {
  if (query.requesterIsChild && query.entity === "child_profile") return false;
  if (query.requesterIsChild && query.usesBehaviouralProfiling) return false;
  if (query.requesterIsChild && query.usesPopularityRanking) return false;
  if (query.requesterIsChild && !query.curatedOrContextual) return false;
  return true;
}

export type RecommendationReason =
  | "chosen_interest"
  | "school_context"
  | "club_membership"
  | "active_challenge"
  | "editorial"
  | "behavioural_prediction"
  | "popularity";

export function isAllowedChildRecommendationReason(reason: RecommendationReason): boolean {
  return !["behavioural_prediction", "popularity"].includes(reason);
}
