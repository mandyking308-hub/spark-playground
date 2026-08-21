import type { AgeBand, PlatformRole } from "./access-control";
import type { ChildLifecycleState, ParentLifecycleState } from "./lifecycle";

export type Id = string;

export interface EducationGroup {
  id: Id;
  name: string;
  slug: string;
  countryCodes: string[];
  active: boolean;
}

export interface School {
  id: Id;
  educationGroupId: Id | null;
  name: string;
  slug: string;
  countryCode: string;
  timezone: string;
  active: boolean;
}

export interface Cohort {
  id: Id;
  schoolId: Id;
  name: string;
  academicYear: string;
  ageBand: AgeBand;
  active: boolean;
}

export interface UserProfile {
  id: Id;
  authUserId: Id;
  displayName: string;
  role: PlatformRole;
  ageBand: AgeBand;
  countryCode: string;
  createdAt: string;
  disabledAt: string | null;
}

export interface SchoolMembership {
  id: Id;
  userId: Id;
  schoolId: Id;
  cohortId: Id | null;
  role: "child" | "parent" | "teacher" | "school_admin";
  status: "invited" | "active" | "historic" | "revoked";
  joinedAt: string | null;
  leftAt: string | null;
}

export interface EducationGroupMembership {
  id: Id;
  userId: Id;
  educationGroupId: Id;
  role: "group_admin";
  status: "active" | "revoked";
}

export interface GuardianLink {
  id: Id;
  parentUserId: Id;
  childUserId: Id;
  relationship: "parent" | "guardian" | "carer" | "other_guardian";
  verificationStatus: "pending" | "verified" | "revoked";
  verifiedAt: string | null;
}

export interface ChildLifecycle {
  userId: Id;
  state: ChildLifecycleState;
  transitionEligibleAt: string | null;
  transitionedAt: string | null;
}

export interface ParentLifecycle {
  userId: Id;
  state: ParentLifecycleState;
  parentAlumniOptInAt: string | null;
}

export type CommunityAudience =
  | "child_cohort"
  | "child_club"
  | "current_parents"
  | "parent_alumni"
  | "parents_and_parent_alumni"
  | "staff"
  | "alumni_16_plus"
  | "adult_professional";

export interface Community {
  id: Id;
  educationGroupId: Id | null;
  schoolId: Id | null;
  name: string;
  description: string;
  audience: CommunityAudience;
  discoverability: "invitation_only" | "tenant_directory" | "curated";
  active: boolean;
}

export interface CommunityMembership {
  id: Id;
  communityId: Id;
  userId: Id;
  role: "member" | "moderator" | "owner";
  status: "pending" | "active" | "muted" | "removed";
  joinedAt: string | null;
}

export interface Project {
  id: Id;
  childUserId: Id;
  schoolId: Id | null;
  title: string;
  kind: "podcast" | "story" | "book" | "art" | "video" | "game" | "general_project";
  visibility: "private" | "family" | "cohort" | "school" | "group" | "curated_public";
  publicationState:
    | "draft"
    | "awaiting_safety_scan"
    | "awaiting_parent_approval"
    | "awaiting_moderation"
    | "approved"
    | "rejected"
    | "published"
    | "removed";
  createdAt: string;
  updatedAt: string;
}

export interface PodcastSeries {
  id: Id;
  projectId: Id;
  title: string;
  description: string;
  coverAssetId: Id | null;
}

export interface PodcastEpisode {
  id: Id;
  seriesId: Id;
  title: string;
  audioAssetId: Id;
  transcriptAssetId: Id | null;
  durationSeconds: number | null;
  publicationState: Project["publicationState"];
}

export interface Challenge {
  id: Id;
  educationGroupId: Id | null;
  schoolId: Id | null;
  createdByUserId: Id;
  title: string;
  description: string;
  audienceAgeBands: AgeBand[];
  status: "draft" | "open" | "judging" | "closed" | "archived";
  opensAt: string | null;
  closesAt: string | null;
}

export interface Submission {
  id: Id;
  challengeId: Id;
  childUserId: Id;
  projectId: Id;
  status: "draft" | "submitted" | "reviewed" | "shortlisted" | "awarded";
}

export interface Achievement {
  id: Id;
  childUserId: Id;
  schoolId: Id | null;
  title: string;
  category: "award" | "certificate" | "skill" | "leadership" | "volunteering" | "competition" | "project";
  issuerName: string;
  verifiedByUserId: Id | null;
  awardedAt: string;
}

export interface ConsentRecord {
  id: Id;
  subjectUserId: Id;
  guardianUserId: Id | null;
  consentType: "account" | "publishing" | "ai" | "media" | "portfolio_transition" | "community";
  status: "granted" | "withdrawn" | "expired";
  policyVersion: string;
  recordedAt: string;
}

export interface ModerationCase {
  id: Id;
  subjectType: "project" | "episode" | "community_post" | "message" | "profile";
  subjectId: Id;
  reasonCode: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "triage" | "escalated" | "resolved" | "appealed";
  assignedToUserId: Id | null;
  createdAt: string;
}

export interface AiAuditEvent {
  id: Id;
  childUserId: Id;
  capability: string;
  ageBand: AgeBand;
  inputClassification: string;
  outcome: "allowed" | "guided" | "blocked" | "escalated";
  createdAt: string;
}
