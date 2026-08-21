import { describe, expect, test } from "bun:test";

import type { PublicRuntimeConfig } from "@/config/runtime";

import { LiveBackendError, createLiveCoreAdapter } from "./live-core-adapter";

const runtime: PublicRuntimeConfig = {
  supabaseUrl: "https://aureliaref.supabase.co",
  supabasePublishableKey: "sb_publishable_test_only",
  supabaseProjectRef: "aureliaref",
  backendConnected: true,
};

const projectId = "123e4567-e89b-42d3-a456-426614174000";
const schoolId = "223e4567-e89b-42d3-a456-426614174000";
const requestId = "323e4567-e89b-42d3-a456-426614174000";

function jsonResponse(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function adapterWith(fetchImpl: (input: string | URL | Request, init?: RequestInit) => Promise<Response>) {
  return createLiveCoreAdapter({
    runtime,
    getAccessToken: async () => "private-user-access-token",
    fetchImpl,
  });
}

describe("phase-one live Supabase adapter", () => {
  test("requires the explicitly connected runtime", () => {
    expect(() =>
      createLiveCoreAdapter({
        runtime: { backendConnected: false },
        getAccessToken: async () => "token",
      }),
    ).toThrow(/not connected/);
  });

  test("blocks authenticated network calls when the access token is absent", async () => {
    let called = false;
    const adapter = createLiveCoreAdapter({
      runtime,
      getAccessToken: async () => null,
      fetchImpl: async () => {
        called = true;
        return jsonResponse([]);
      },
    });

    await expect(adapter.getOwnProjects()).rejects.toBeInstanceOf(LiveBackendError);
    expect(called).toBe(false);
  });

  test("sends publishable key and user bearer token but no privileged credential", async () => {
    const calls: Array<{ url: string; headers: Headers }> = [];
    const adapter = adapterWith(async (input, init) => {
      calls.push({ url: String(input), headers: new Headers(init?.headers) });
      return jsonResponse([]);
    });

    await adapter.getOwnProjects();
    expect(calls).toHaveLength(1);
    expect(calls[0].headers.get("apikey")).toBe("sb_publishable_test_only");
    expect(calls[0].headers.get("Authorization")).toBe("Bearer private-user-access-token");
    expect([...calls[0].headers.keys()].join(" ").toLowerCase()).not.toMatch(/service|secret/);
  });

  test("project creation never submits owner, state, publication or moderation fields", async () => {
    let body = "";
    const adapter = adapterWith(async (_input, init) => {
      body = String(init?.body ?? "");
      return jsonResponse([
        {
          id: projectId,
          owner_profile_id: "423e4567-e89b-42d3-a456-426614174000",
          title: "My show",
          kind: "podcast",
          state: "draft",
          updated_at: "2026-08-21T12:00:00Z",
        },
      ]);
    });

    const result = await adapter.createProject({ title: "  My show  ", kind: "podcast", schoolId });
    const parsed = JSON.parse(body) as Record<string, unknown>;

    expect(parsed).toEqual({ title: "My show", kind: "podcast", school_id: schoolId });
    expect(parsed).not.toHaveProperty("owner_profile_id");
    expect(parsed).not.toHaveProperty("state");
    expect(parsed).not.toHaveProperty("published_at");
    expect(parsed).not.toHaveProperty("moderation_status");
    expect(result.state).toBe("draft");
  });

  test("project update sends only title and summary", async () => {
    let body = "";
    const adapter = adapterWith(async (_input, init) => {
      body = String(init?.body ?? "");
      return jsonResponse([
        {
          id: projectId,
          owner_profile_id: "423e4567-e89b-42d3-a456-426614174000",
          title: "Updated",
          kind: "story",
          state: "draft",
          updated_at: "2026-08-21T12:00:00Z",
        },
      ]);
    });

    await adapter.updateProject({ projectId, title: "Updated", summary: "A safe summary" });
    expect(JSON.parse(body)).toEqual({ title: "Updated", summary: "A safe summary" });
  });

  test("publication and guardian mutations use the Edge workflow, never permission REST writes", async () => {
    const calls: Array<{ url: string; method?: string; body?: string }> = [];
    const adapter = adapterWith(async (input, init) => {
      calls.push({ url: String(input), method: init?.method, body: String(init?.body ?? "") });
      return jsonResponse({ data: { state: "pending" } });
    });

    await adapter.requestProjectPublication(projectId);
    await adapter.withdrawPermissionRequest(requestId);
    await adapter.recordGuardianDecision({ permissionRequestId: requestId, approved: true });

    expect(calls).toHaveLength(3);
    for (const call of calls) {
      expect(call.url).toBe("https://aureliaref.supabase.co/functions/v1/permission-workflow");
      expect(call.method).toBe("POST");
      expect(call.url).not.toContain("/rest/v1/permission_");
    }
    expect(JSON.parse(calls[0].body ?? "{}")).toEqual({ action: "request_publication", projectId });
    expect(JSON.parse(calls[1].body ?? "{}")).toEqual({ action: "withdraw_request", requestId });
    expect(JSON.parse(calls[2].body ?? "{}")).toEqual({
      action: "guardian_decision",
      requestId,
      approved: true,
    });
  });

  test("backend errors expose status but never provider response body or access token", async () => {
    const adapter = adapterWith(async () => jsonResponse({ error: "sensitive database detail" }, 403));

    try {
      await adapter.getOwnProjects();
      throw new Error("expected request to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(LiveBackendError);
      const message = String((error as Error).message);
      expect(message).not.toContain("sensitive database detail");
      expect(message).not.toContain("private-user-access-token");
      expect((error as LiveBackendError).status).toBe(403);
    }
  });

  test("maps database snake_case project rows into the stable frontend contract", async () => {
    const adapter = adapterWith(async () =>
      jsonResponse([
        {
          id: projectId,
          owner_profile_id: "423e4567-e89b-42d3-a456-426614174000",
          title: "A story",
          kind: "story",
          state: "draft",
          updated_at: "2026-08-21T12:00:00Z",
        },
      ]),
    );

    await expect(adapter.getOwnProjects()).resolves.toEqual([
      {
        id: projectId,
        ownerProfileId: "423e4567-e89b-42d3-a456-426614174000",
        title: "A story",
        kind: "story",
        state: "draft",
        updatedAt: "2026-08-21T12:00:00Z",
      },
    ]);
  });
});
