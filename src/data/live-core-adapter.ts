import type { PublicRuntimeConfig } from "@/config/runtime";
import type { EntityId, ProjectSummary, SessionActor } from "@/data/platform-contracts";
import type { PlatformRole } from "@/domain/access-control";

export type AccessTokenProvider = () => Promise<string | null>;

export interface LivePermissionRequest {
  id: EntityId;
  childProfileId: EntityId;
  requestType: "publish_external" | "join_club" | "enter_challenge" | "share_portfolio" | "alumni_transfer";
  resourceKind: "project" | "club" | "challenge" | "passport_item" | "alumni_transition";
  resourceId?: EntityId | undefined;
  state: "pending" | "approved" | "denied" | "withdrawn" | "expired";
  requestedAt: string;
}

export class LiveBackendError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(status === 401 ? "Authentication required" : "Live backend request failed");
    this.name = "LiveBackendError";
    this.status = status;
  }
}

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

interface LiveCoreAdapterOptions {
  runtime: PublicRuntimeConfig;
  getAccessToken: AccessTokenProvider;
  fetchImpl?: FetchLike;
}

interface ProfileRow {
  id: string;
  auth_user_id: string;
  primary_role: PlatformRole;
}

interface ProjectRow {
  id: string;
  owner_profile_id: string;
  title: string;
  kind: ProjectSummary["kind"];
  state: ProjectSummary["state"];
  updated_at: string;
}

interface PermissionRequestRow {
  id: string;
  child_profile_id: string;
  request_type: LivePermissionRequest["requestType"];
  resource_kind: LivePermissionRequest["resourceKind"];
  resource_id: string | null;
  state: LivePermissionRequest["state"];
  requested_at: string;
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function requireUuid(value: string, field: string): string {
  if (!uuidPattern.test(value)) throw new Error(`Invalid ${field}`);
  return value;
}

function requireConnectedRuntime(runtime: PublicRuntimeConfig) {
  if (!runtime.backendConnected || !runtime.supabaseUrl || !runtime.supabasePublishableKey || !runtime.supabaseProjectRef) {
    throw new Error("Dedicated Supabase backend is not connected");
  }

  return {
    url: runtime.supabaseUrl.replace(/\/$/, ""),
    publishableKey: runtime.supabasePublishableKey,
  };
}

function projectFromRow(row: ProjectRow): ProjectSummary {
  return {
    id: row.id,
    ownerProfileId: row.owner_profile_id,
    title: row.title,
    kind: row.kind,
    state: row.state,
    updatedAt: row.updated_at,
  };
}

function permissionFromRow(row: PermissionRequestRow): LivePermissionRequest {
  return {
    id: row.id,
    childProfileId: row.child_profile_id,
    requestType: row.request_type,
    resourceKind: row.resource_kind,
    resourceId: row.resource_id ?? undefined,
    state: row.state,
    requestedAt: row.requested_at,
  };
}

export function createLiveCoreAdapter(options: LiveCoreAdapterOptions) {
  const { url, publishableKey } = requireConnectedRuntime(options.runtime);
  const fetchImpl = options.fetchImpl ?? fetch;

  async function authenticatedFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const accessToken = await options.getAccessToken();
    if (!accessToken) throw new LiveBackendError(401);

    const headers = new Headers(init.headers);
    headers.set("apikey", publishableKey);
    headers.set("Authorization", `Bearer ${accessToken}`);
    headers.set("Accept", "application/json");
    if (init.body !== undefined) headers.set("Content-Type", "application/json");

    const response = await fetchImpl(`${url}${path}`, { ...init, headers });
    if (!response.ok) throw new LiveBackendError(response.status);
    return response;
  }

  async function readJson<T>(path: string): Promise<T> {
    const response = await authenticatedFetch(path);
    return (await response.json()) as T;
  }

  async function getSessionActor(): Promise<SessionActor | null> {
    let profiles: ProfileRow[];
    try {
      profiles = await readJson<ProfileRow[]>("/rest/v1/profiles?select=id,auth_user_id,primary_role&limit=1");
    } catch (error) {
      if (error instanceof LiveBackendError && error.status === 401) return null;
      throw error;
    }

    const profile = profiles[0];
    if (!profile) return null;

    const [schoolRows, groupRows] = await Promise.all([
      readJson<Array<{ school_id: string }>>("/rest/v1/school_memberships?select=school_id&status=eq.active"),
      readJson<Array<{ education_group_id: string }>>(
        "/rest/v1/group_memberships?select=education_group_id&status=eq.active",
      ),
    ]);

    return {
      profileId: profile.id,
      authUserId: profile.auth_user_id,
      role: profile.primary_role,
      schoolIds: schoolRows.map((row) => row.school_id),
      educationGroupIds: groupRows.map((row) => row.education_group_id),
      organisationIds: [],
    };
  }

  async function getOwnProjects(): Promise<ProjectSummary[]> {
    const rows = await readJson<ProjectRow[]>(
      "/rest/v1/projects?select=id,owner_profile_id,title,kind,state,updated_at&order=updated_at.desc",
    );
    return rows.map(projectFromRow);
  }

  async function createProject(input: {
    title: string;
    kind: ProjectSummary["kind"];
    schoolId?: EntityId;
  }): Promise<ProjectSummary> {
    const title = input.title.trim();
    if (!title || title.length > 160) throw new Error("Project title must be between 1 and 160 characters");
    if (input.schoolId) requireUuid(input.schoolId, "school id");

    const response = await authenticatedFetch("/rest/v1/projects", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        title,
        kind: input.kind,
        ...(input.schoolId ? { school_id: input.schoolId } : {}),
      }),
    });
    const rows = (await response.json()) as ProjectRow[];
    if (!rows[0]) throw new LiveBackendError(500);
    return projectFromRow(rows[0]);
  }

  async function updateProject(input: {
    projectId: EntityId;
    title?: string;
    summary?: string;
  }): Promise<ProjectSummary> {
    const projectId = requireUuid(input.projectId, "project id");
    const patch: Record<string, string> = {};
    if (input.title !== undefined) {
      const title = input.title.trim();
      if (!title || title.length > 160) throw new Error("Project title must be between 1 and 160 characters");
      patch["title"] = title;
    }
    if (input.summary !== undefined) {
      if (input.summary.length > 4000) throw new Error("Project summary is too long");
      patch["summary"] = input.summary;
    }
    if (Object.keys(patch).length === 0) throw new Error("No safe project fields supplied");

    const response = await authenticatedFetch(`/rest/v1/projects?id=eq.${projectId}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(patch),
    });
    const rows = (await response.json()) as ProjectRow[];
    if (!rows[0]) throw new LiveBackendError(404);
    return projectFromRow(rows[0]);
  }

  async function getPermissionRequests(): Promise<LivePermissionRequest[]> {
    const rows = await readJson<PermissionRequestRow[]>(
      "/rest/v1/permission_requests?select=id,child_profile_id,request_type,resource_kind,resource_id,state,requested_at&order=requested_at.desc",
    );
    return rows.map(permissionFromRow);
  }

  async function permissionWorkflow(body: Record<string, unknown>): Promise<unknown> {
    const response = await authenticatedFetch("/functions/v1/permission-workflow", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return response.json();
  }

  async function requestProjectPublication(projectId: EntityId): Promise<unknown> {
    return permissionWorkflow({ action: "request_publication", projectId: requireUuid(projectId, "project id") });
  }

  async function withdrawPermissionRequest(requestId: EntityId): Promise<unknown> {
    return permissionWorkflow({ action: "withdraw_request", requestId: requireUuid(requestId, "permission request id") });
  }

  async function recordGuardianDecision(input: {
    permissionRequestId: EntityId;
    approved: boolean;
    decisionNote?: string;
  }): Promise<unknown> {
    if (input.decisionNote && input.decisionNote.length > 2000) throw new Error("Decision note is too long");
    return permissionWorkflow({
      action: "guardian_decision",
      requestId: requireUuid(input.permissionRequestId, "permission request id"),
      approved: input.approved,
      ...(input.decisionNote?.trim() ? { decisionNote: input.decisionNote.trim() } : {}),
    });
  }

  return {
    getSessionActor,
    getOwnProjects,
    createProject,
    updateProject,
    getPermissionRequests,
    requestProjectPublication,
    withdrawPermissionRequest,
    recordGuardianDecision,
  };
}

export type LiveCoreAdapter = ReturnType<typeof createLiveCoreAdapter>;
