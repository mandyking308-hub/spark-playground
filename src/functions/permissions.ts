import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseServerClient } from "@/lib/supabase/server-client";

const uuid = z.string().uuid();

export interface FamilyPermissionRequest {
  id: string;
  requestType: string;
  resourceKind: string;
  resourceId: string | null;
  state: string;
  requestedAt: string;
  expiresAt: string | null;
  guardianDecision: "approved" | "denied" | null;
}

export const requestProjectPublicationFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ projectId: uuid }).parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: result, error } = await supabase.functions.invoke("permission-workflow", {
      body: { action: "request_publication", projectId: data.projectId },
    });

    if (error || !result?.data?.request_id) {
      throw new Error("Sharing request could not be created");
    }

    return {
      requestId: String(result.data.request_id),
      state: String(result.data.request_state ?? "pending"),
    };
  });

export const listFamilyPermissionRequestsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<FamilyPermissionRequest[]> => {
    const supabase = getSupabaseServerClient();
    const { data: requests, error } = await supabase
      .from("permission_requests")
      .select("id,request_type,resource_kind,resource_id,state,requested_at,expires_at")
      .order("requested_at", { ascending: false })
      .limit(50);

    if (error) throw new Error("Permission requests could not be loaded");

    const ids = (requests ?? []).map((row) => row.id);
    let decisions: Array<{ request_id: string; decision: "approved" | "denied" }> = [];

    if (ids.length > 0) {
      const { data: decisionRows, error: decisionError } = await supabase
        .from("permission_decisions")
        .select("request_id,decision")
        .eq("decision_role", "guardian")
        .in("request_id", ids);
      if (decisionError) throw new Error("Permission decisions could not be loaded");
      decisions = (decisionRows ?? []) as typeof decisions;
    }

    const decisionByRequest = new Map(decisions.map((row) => [row.request_id, row.decision]));

    return (requests ?? []).map((row) => ({
      id: String(row.id),
      requestType: String(row.request_type),
      resourceKind: String(row.resource_kind),
      resourceId: row.resource_id ? String(row.resource_id) : null,
      state: String(row.state),
      requestedAt: String(row.requested_at),
      expiresAt: row.expires_at ? String(row.expires_at) : null,
      guardianDecision: decisionByRequest.get(String(row.id)) ?? null,
    }));
  },
);

export const recordGuardianDecisionFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ requestId: uuid, approved: z.boolean(), decisionNote: z.string().trim().max(2000).optional() }).parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: result, error } = await supabase.functions.invoke("permission-workflow", {
      body: {
        action: "guardian_decision",
        requestId: data.requestId,
        approved: data.approved,
        decisionNote: data.decisionNote,
      },
    });

    if (error || !result?.data?.request_id) {
      throw new Error("Guardian decision could not be recorded");
    }

    return {
      requestId: String(result.data.request_id),
      state: String(result.data.request_state ?? "pending"),
    };
  });
