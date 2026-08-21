export interface AlumniIdentity {
  userId: string;
  age: number;
  alumniVerified: boolean;
  selectedPortfolioItemIds: string[];
}

export interface OpportunityProvider {
  providerId: string;
  providerType: "university" | "employer" | "apprenticeship_provider" | "accelerator";
  verified: boolean;
}

export interface AlumniApplicationContext {
  alumni: AlumniIdentity;
  provider: OpportunityProvider;
  requestedPortfolioItemIds: string[];
}

export function canEnterAlumniEnvironment(identity: AlumniIdentity, minimumAge = 16): boolean {
  return identity.age >= minimumAge && identity.alumniVerified;
}

export function canApplyToOpportunity(context: AlumniApplicationContext): boolean {
  if (!canEnterAlumniEnvironment(context.alumni) || !context.provider.verified) return false;
  return context.requestedPortfolioItemIds.every((id) => context.alumni.selectedPortfolioItemIds.includes(id));
}

export function canAlumniMentorAlumni(mentor: AlumniIdentity, mentee: AlumniIdentity): boolean {
  return canEnterAlumniEnvironment(mentor) && canEnterAlumniEnvironment(mentee) && mentor.userId !== mentee.userId;
}

export function alumniStatusGrantsUnder16Access(): false {
  return false;
}

export function childhoodPrivateDataTransfersAutomatically(): false {
  return false;
}
