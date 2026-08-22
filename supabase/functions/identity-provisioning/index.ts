import { withSupabase } from "@supabase/server";

// This deployment targets an external Aurelia database without generated types,
// so the admin client is narrowed to the minimal untyped surface used here.
type AdminRows = { data: Record<string, unknown>[] | null; error: unknown };
type AdminRow = { data: Record<string, unknown> | null; error: unknown };
type AdminQuery = {
  select: (columns: string) => AdminQuery;
  eq: (column: string, value: unknown) => AdminQuery;
  is: (column: string, value: unknown) => AdminQuery;
  order: (column: string, options?: Record<string, unknown>) => AdminQuery;
  limit: (count: number) => Promise<AdminRows>;
  maybeSingle: () => Promise<AdminRow>;
};
type AdminClient = {
  from: (table: string) => AdminQuery;
  rpc: (fn: string, args: Record<string, unknown>) => Promise<AdminRows>;
};


type Action = "issue_invitation" | "claim_invitation" | "revoke_invitation" | "list_invitations";
type PilotRole = "child" | "parent" | "teacher" | "school_admin" | "group_admin";
type AgeBand = "under_9" | "age_9_12" | "age_13_15" | "adult";

interface RequestBody {
  action?: Action;
  intendedRole?: PilotRole;
  ageBand?: AgeBand;
  schoolId?: string;
  cohortId?: string;
  educationGroupId?: string;
  ttlHours?: number;
  invitationToken?: string;
  invitationId?: string;
  displayName?: string;
  countryCode?: string;
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const tokenPattern = /^[A-Za-z0-9_-]{40,80}$/;
const roles = new Set<PilotRole>(["child", "parent", "teacher", "school_admin", "group_admin"]);
const ageBands = new Set<AgeBand>(["under_9", "age_9_12", "age_13_15", "adult"]);

function badRequest(message = "Invalid request") {
  return Response.json({ error: message }, { status: 400 });
}

function validOptionalUuid(value: unknown): value is string | undefined {
  return value === undefined || (typeof value === "string" && uuidPattern.test(value));
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createOpaqueToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
}

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return badRequest();
    }

    const authUserId = (ctx.userClaims as { sub?: string } | undefined)?.sub;
    if (typeof authUserId !== "string" || !uuidPattern.test(authUserId)) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    const admin = ctx.supabaseAdmin as unknown as AdminClient;

    try {
      if (body.action === "list_invitations") {
        const { data: actor, error: actorError } = await admin
          .from("profiles")
          .select("id")
          .eq("auth_user_id", authUserId)
          .is("disabled_at", null)
          .maybeSingle();
        if (actorError || !actor) throw actorError ?? new Error("actor_not_found");

        const { data, error } = await admin
          .from("account_invitations")
          .select("id,intended_role,intended_age_band,school_id,cohort_id,education_group_id,state,expires_at,created_at")
          .eq("issued_by_profile_id", actor["id"])
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;

        return Response.json({ data: data ?? [] });
      }

      if (body.action === "issue_invitation") {
        if (!body.intendedRole || !roles.has(body.intendedRole)) return badRequest();
        if (!body.ageBand || !ageBands.has(body.ageBand)) return badRequest();
        if (!validOptionalUuid(body.schoolId) || !validOptionalUuid(body.cohortId) || !validOptionalUuid(body.educationGroupId)) {
          return badRequest();
        }
        const ttlHours = body.ttlHours ?? 24;
        if (!Number.isInteger(ttlHours) || ttlHours < 1 || ttlHours > 168) return badRequest("Invalid invitation lifetime");

        const rawToken = createOpaqueToken();
        const tokenHash = await sha256Hex(rawToken);
        const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString();

        const { data, error } = await admin.rpc("server_issue_account_invitation", {
          p_auth_user_id: authUserId,
          p_token_hash: tokenHash,
          p_intended_role: body.intendedRole,
          p_intended_age_band: body.ageBand,
          p_school_id: body.schoolId ?? null,
          p_cohort_id: body.cohortId ?? null,
          p_education_group_id: body.educationGroupId ?? null,
          p_expires_at: expiresAt,
        });
        if (error) throw error;

        return Response.json({
          data: {
            invitationId: data?.[0]?.invitation_id ?? null,
            invitationToken: rawToken,
            expiresAt: data?.[0]?.expires_at ?? expiresAt,
          },
        });
      }

      if (body.action === "claim_invitation") {
        if (typeof body.invitationToken !== "string" || !tokenPattern.test(body.invitationToken)) return badRequest();
        if (typeof body.displayName !== "string") return badRequest();
        const displayName = body.displayName.trim();
        if (displayName.length < 1 || displayName.length > 120) return badRequest("Invalid display name");
        const countryCode = body.countryCode?.trim().toUpperCase();
        if (countryCode !== undefined && !/^[A-Z]{2}$/.test(countryCode)) return badRequest("Invalid country code");

        const tokenHash = await sha256Hex(body.invitationToken);
        const { data, error } = await admin.rpc("server_claim_account_invitation", {
          p_auth_user_id: authUserId,
          p_token_hash: tokenHash,
          p_display_name: displayName,
          p_country_code: countryCode ?? null,
        });
        if (error) throw error;
        return Response.json({ data: data?.[0] ?? null });
      }

      if (body.action === "revoke_invitation") {
        if (typeof body.invitationId !== "string" || !uuidPattern.test(body.invitationId)) return badRequest();
        const { data, error } = await admin.rpc("server_revoke_account_invitation", {
          p_auth_user_id: authUserId,
          p_invitation_id: body.invitationId,
        });
        if (error) throw error;
        return Response.json({ data: Boolean(data) });
      }

      return badRequest("Unsupported action");
    } catch (error) {
      const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "unknown";
      console.error("identity-provisioning request failed", { action: body.action ?? "unknown", code });
      return Response.json({ error: "Request could not be completed" }, { status: 400 });
    }
  }),
};
