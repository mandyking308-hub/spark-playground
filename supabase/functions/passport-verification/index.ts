import { withSupabase } from "@supabase/server";

type Action = "set_review_state" | "issue_achievement" | "revoke_achievement";
type ReviewState = "in_review" | "revision_requested" | "closed";
type AchievementKind = "project" | "certificate" | "skill" | "leadership" | "volunteering" | "award";

interface RequestBody {
  action?: Action;
  submissionId?: string;
  reviewState?: ReviewState;
  achievementKind?: AchievementKind;
  title?: string;
  description?: string;
  verificationNote?: string;
  achievementId?: string;
  reason?: string;
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const reviewStates = new Set<ReviewState>(["in_review", "revision_requested", "closed"]);
const achievementKinds = new Set<AchievementKind>([
  "project",
  "certificate",
  "skill",
  "leadership",
  "volunteering",
  "award",
]);

function badRequest(message = "Invalid request") {
  return Response.json({ error: message }, { status: 400 });
}

function validUuid(value: unknown): value is string {
  return typeof value === "string" && uuidPattern.test(value);
}

function optionalBoundedText(value: unknown, max: number): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (typeof value !== "string" || value.length > max) throw new Error("invalid_text");
  return value.trim() || null;
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

    const authUserId = ctx.userClaims?.sub;
    if (typeof authUserId !== "string" || !uuidPattern.test(authUserId)) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    try {
      if (body.action === "set_review_state") {
        if (!validUuid(body.submissionId) || !body.reviewState || !reviewStates.has(body.reviewState)) {
          return badRequest();
        }

        const { data, error } = await ctx.supabaseAdmin.rpc("server_set_submission_review_state", {
          p_auth_user_id: authUserId,
          p_submission_id: body.submissionId,
          p_review_state: body.reviewState,
        });
        if (error) throw error;
        return Response.json({ data: data?.[0] ?? null });
      }

      if (body.action === "issue_achievement") {
        if (!validUuid(body.submissionId) || !body.achievementKind || !achievementKinds.has(body.achievementKind)) {
          return badRequest();
        }
        if (typeof body.title !== "string") return badRequest();
        const title = body.title.trim();
        if (title.length < 1 || title.length > 180) return badRequest("Invalid achievement title");

        let description: string | null | undefined;
        let verificationNote: string | null | undefined;
        try {
          description = optionalBoundedText(body.description, 4000);
          verificationNote = optionalBoundedText(body.verificationNote, 2000);
        } catch {
          return badRequest("Achievement text is too long");
        }

        const { data, error } = await ctx.supabaseAdmin.rpc("server_issue_passport_achievement", {
          p_auth_user_id: authUserId,
          p_submission_id: body.submissionId,
          p_kind: body.achievementKind,
          p_title: title,
          p_description: description ?? null,
          p_verification_note: verificationNote ?? null,
        });
        if (error) throw error;
        return Response.json({ data: data?.[0] ?? null });
      }

      if (body.action === "revoke_achievement") {
        if (!validUuid(body.achievementId) || typeof body.reason !== "string") return badRequest();
        const reason = body.reason.trim();
        if (reason.length < 1 || reason.length > 2000) return badRequest("Revocation reason is required");

        const { data, error } = await ctx.supabaseAdmin.rpc("server_revoke_passport_achievement", {
          p_auth_user_id: authUserId,
          p_achievement_id: body.achievementId,
          p_reason: reason,
        });
        if (error) throw error;
        return Response.json({ data: Boolean(data) });
      }

      return badRequest("Unsupported action");
    } catch (error) {
      const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "unknown";
      console.error("passport-verification request failed", { action: body.action ?? "unknown", code });
      return Response.json({ error: "Request could not be completed" }, { status: 400 });
    }
  }),
};
