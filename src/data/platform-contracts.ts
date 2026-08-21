import type { PlatformRole } from "@/domain/access-control";

export type EntityId = string;

export interface SessionActor {
  profileId: EntityId;
  authUserId: EntityId;
  role: PlatformRole;
  schoolIds: EntityId[];
  educationGroupIds: EntityId[];
  organisationIds: EntityId[];
}

export interface ChildSummary {
  id: EntityId;
  displayName: string;
  ageBand: "under_9" | "age_9_12" | "age_13_15";
  schoolId?: EntityId;
  guardianVerified: boolean;
}

export interface ProjectSummary {
  id: EntityId;
  ownerProfileId: EntityId;
  title: string;
  kind: "podcast" | "story" | "book" | "art" | "video" | "game" | "general";
  state:
    | "draft"
    | "scan_pending"
    | "approval_pending"
    | "moderation_pending"
    | "published"
    | "rejected"
    | "removed";
  updatedAt: string;
}

export interface AchievementSummary {
  id: EntityId;
  childProfileId: EntityId;
  title: string;
  achievementType: string;
  verified: boolean;
  awardedAt: string;
}

export interface ChallengeSummary {
  id: EntityId;
  title: string;
  sourceLabel: string;
  closesAt?: string;
  scope: "school" | "group" | "organisation";
}

export interface CommunitySummary {
  id: EntityId;
  name: string;
  audience: "parents" | "parent_alumni" | "parents_and_alumni" | "staff" | "alumni_16_plus";
  memberCount?: number;
}

export interface ModerationQueueItem {
  id: EntityId;
  category: string;
  status: "open" | "reviewing" | "actioned" | "dismissed" | "appealed" | "closed";
  severity: "standard" | "elevated" | "urgent";
  schoolId?: EntityId;
  createdAt: string;
}

export interface AlumniOpportunitySummary {
  id: EntityId;
  title: string;
  opportunityType: string;
  sourceLabel: string;
  closesAt?: string;
}

export interface PlatformRepository {
  getSessionActor(): Promise<SessionActor | null>;

  getLinkedChildren(parentProfileId: EntityId): Promise<ChildSummary[]>;
  getChildProjects(childProfileId: EntityId): Promise<ProjectSummary[]>;
  getChildAchievements(childProfileId: EntityId): Promise<AchievementSummary[]>;

  getAvailableChallenges(actor: SessionActor): Promise<ChallengeSummary[]>;
  getCommunities(actor: SessionActor): Promise<CommunitySummary[]>;
  getModerationQueue(actor: SessionActor): Promise<ModerationQueueItem[]>;
  getAlumniOpportunities(alumniProfileId: EntityId): Promise<AlumniOpportunitySummary[]>;
}

export interface ProjectWriteRepository {
  createProject(input: {
    ownerProfileId: EntityId;
    title: string;
    kind: ProjectSummary["kind"];
  }): Promise<ProjectSummary>;

  submitProjectForPublication(projectId: EntityId): Promise<ProjectSummary>;
}

export interface GuardianControlRepository {
  setAiEnabled(input: {
    parentProfileId: EntityId;
    childProfileId: EntityId;
    enabled: boolean;
  }): Promise<void>;

  recordPublishingDecision(input: {
    parentProfileId: EntityId;
    childProfileId: EntityId;
    projectId: EntityId;
    approved: boolean;
  }): Promise<void>;
}

export interface PlatformDataServices {
  read: PlatformRepository;
  projects: ProjectWriteRepository;
  guardianControls: GuardianControlRepository;
}
