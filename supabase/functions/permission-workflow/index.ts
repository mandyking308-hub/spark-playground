import { withSupabase } from "@supabase/server";

// This deployment targets an external Aurelia database without generated types,
// so the admin client is narrowed to the minimal untyped surface used here.
type AdminClient = {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{
    data: Record<string, unknown>[] | null;
    error: unknown;
  }>;
};


type Action = "request_publication" | "withdraw_request" | "guardian_decision";

interface RequestBody {
  action?: Action;
  projectId?: string;
  requestId?: string;
  approved?: boolean;
  decisionNote?: string;
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function badRequest(message = "Invalid request") {
  return Response.json({ error: message }, { status: 400 });
}

function validUuid(value: unknown): value is string {
  return typeof value === "string" && uuidPattern.test(value);
}

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

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

    try {
      if (body.action === "request_publication") {
        if (!validUuid(body.projectId)) return badRequest();

        const { data, error } = await (ctx.supabaseAdmin as unknown as AdminClient).rpc("server_request_project_publication", {
          p_auth_user_id: authUserId,
          p_project_id: body.projectId,
        });
        if (error) throw error;
        return Response.json({ data: data?.[0] ?? null });
      }

      if (body.action === "withdraw_request") {
        if (!validUuid(body.requestId)) return badRequest();

        const { data, error } = await (ctx.supabaseAdmin as unknown as AdminClient).rpc("server_withdraw_permission_request", {
          p_auth_user_id: authUserId,
          p_request_id: body.requestId,
        });
        if (error) throw error;
        return Response.json({ data: data?.[0] ?? null });
      }

      if (body.action === "guardian_decision") {
        if (!validUuid(body.requestId) || typeof body.approved !== "boolean") return badRequest();
        if (body.decisionNote !== undefined && (typeof body.decisionNote !== "string" || body.decisionNote.length > 2000)) {
          return badRequest("Decision note is too long");
        }

        const { data, error } = await (ctx.supabaseAdmin as unknown as AdminClient).rpc("server_record_guardian_decision", {
          p_auth_user_id: authUserId,
          p_request_id: body.requestId,
          p_approved: body.approved,
          p_decision_note: body.decisionNote?.trim() || null,
        });
        if (error) throw error;
        return Response.json({ data: data?.[0] ?? null });
      }

      return badRequest("Unsupported action");
    } catch (error) {
      const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "unknown";
      console.error("permission-workflow request failed", { action: body.action ?? "unknown", code });
      return Response.json({ error: "Request could not be completed" }, { status: 400 });
    }
  }),
};
