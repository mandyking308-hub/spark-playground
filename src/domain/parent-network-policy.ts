export type ParentNetworkRole = "parent" | "parent_alumni";

export interface AdultNetworkIdentity {
  userId: string;
  role: ParentNetworkRole;
  verifiedAdult: boolean;
  communityOptIn: boolean;
  hasCurrentParentLink: boolean;
  hasHistoricalParentLink: boolean;
}

export interface AdultConnectionRequest {
  from: AdultNetworkIdentity;
  to: AdultNetworkIdentity;
}

export interface ParentNetworkProfile {
  displayName: string;
  headline?: string;
  profession?: string;
  cityOrRegion?: string;
  interests: string[];
  schoolCommunityLabels: string[];
}

export function canEnterParentNetwork(identity: AdultNetworkIdentity): boolean {
  if (!identity.verifiedAdult || !identity.communityOptIn) return false;
  if (identity.role === "parent") return identity.hasCurrentParentLink;
  return identity.hasHistoricalParentLink;
}

export function canConnectAdults(request: AdultConnectionRequest): boolean {
  return (
    request.from.userId !== request.to.userId &&
    canEnterParentNetwork(request.from) &&
    canEnterParentNetwork(request.to)
  );
}

export function parentNetworkProfileFields(): ReadonlySet<keyof ParentNetworkProfile> {
  return new Set([
    "displayName",
    "headline",
    "profession",
    "cityOrRegion",
    "interests",
    "schoolCommunityLabels",
  ]);
}

export function exposesChildRecordIdentifiers(): false {
  return false;
}

export function canTransitionToParentAlumni(identity: AdultNetworkIdentity): boolean {
  return (
    identity.verifiedAdult &&
    identity.communityOptIn &&
    !identity.hasCurrentParentLink &&
    identity.hasHistoricalParentLink
  );
}
