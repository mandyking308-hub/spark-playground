import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseServerClient } from "@/lib/supabase/server-client";

const issueInput = z.object({
  intendedRole: z.enum(["child", "parent", "teacher"]),
  ageBand: z.enum(["under_9", "age_9_12", "age_13_15", "adult"]),
  schoolId: z.string().uuid().optional(),
  ttlHours: z.union([z.literal(24), z.literal(72), z.literal(168)]).default(24),
});

const revokeInput = z.object({ invitationId: z.string().uuid() });

export interface InvitationSummary {
  id: string;
  intendedRole: "child" | "parent" | "teacher" | "school_admin" | "group_admin";
  ageBand: "under_9" | "age_9_12" | "age_13_15" | "adult";
  schoolId?: string | undefined;
  state: "pending" | "claimed" | "revoked" | "expired";
  expiresAt: string;
  createdAt: string;
}

async function requireAuthenticatedClient() {
  const supabase = getSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Authentication required");
  return supabase;
}

export const listInvitationsFn = createServerFn({ method: "GET" }).handler(async (): Promise<InvitationSummary[]> => {
  const supabase = await requireAuthenticatedClient();
  const { data, error } = await supabase.functions.invoke("identity-provisioning", {
    body: { action: "list_invitations" },
  });
  if (error || !Array.isArray(data?.data)) throw new Error("Unable to load invitations");

  return data.data.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    intendedRole: row.intended_role as InvitationSummary["intendedRole"],
    ageBand: row.intended_age_band as InvitationSummary["ageBand"],
    schoolId: typeof row.school_id === "string" ? row.school_id : undefined,
    state: row.state as InvitationSummary["state"],
    expiresAt: String(row.expires_at),
    createdAt: String(row.created_at),
  }));
});

export const issueInvitationFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => issueInput.parse(input))
  .handler(async ({ data }): Promise<{ invitationToken: string; invitationId: string; expiresAt: string }> => {
    const supabase = await requireAuthenticatedClient();
    const { data: response, error } = await supabase.functions.invoke("identity-provisioning", {
      body: {
        action: "issue_invitation",
        intendedRole: data.intendedRole,
        ageBand: data.ageBand,
        schoolId: data.schoolId,
        ttlHours: data.ttlHours,
      },
    });

    const issued = response?.data;
    if (error || !issued?.invitationToken || !issued?.invitationId || !issued?.expiresAt) {
      throw new Error("Invitation could not be issued");
    }

    return {
      invitationToken: String(issued.invitationToken),
      invitationId: String(issued.invitationId),
      expiresAt: String(issued.expiresAt),
    };
  });

export const revokeInvitationFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => revokeInput.parse(input))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const supabase = await requireAuthenticatedClient();
    const { data: revoked, error } = await supabase.functions.invoke("identity-provisioning", {
      body: { action: "revoke_invitation", invitationId: data.invitationId },
    });
    if (error || revoked?.data !== true) throw new Error("Invitation could not be revoked");
    return { ok: true };
  });
