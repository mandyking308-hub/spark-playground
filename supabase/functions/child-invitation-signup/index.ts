import { withSupabase } from "@supabase/server";

interface RequestBody {
  invitationToken?: string;
  email?: string;
  password?: string;
  displayName?: string;
  countryCode?: string;
}

const tokenPattern = /^[A-Za-z0-9_-]{40,80}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const childAgeBands = new Set(["under_9", "age_9_12", "age_13_15"]);

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(value: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

function fail(message = "Child invitation could not be completed") {
  return Response.json({ error: message }, { status: 400 });
}

export default {
  fetch: withSupabase({ auth: "publishable" }, async (req, ctx) => {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return fail();
    }

    const invitationToken = typeof body.invitationToken === "string" ? body.invitationToken.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
    const countryCode = typeof body.countryCode === "string" ? body.countryCode.trim().toUpperCase() : null;

    if (!tokenPattern.test(invitationToken)) return fail();
    if (!emailPattern.test(email) || email.length > 254) return fail();
    if (password.length < 10 || password.length > 128) return fail();
    if (displayName.length < 1 || displayName.length > 120) return fail();
    if (countryCode !== null && !/^[A-Z]{2}$/.test(countryCode)) return fail();

    const tokenHash = await sha256Hex(invitationToken);

    const { data: invitation, error: invitationError } = await ctx.supabaseAdmin
      .from("account_invitations")
      .select("id,intended_role,intended_age_band,school_id,guardian_sponsor_profile_id")
      .eq("token_hash", tokenHash)
      .eq("state", "pending")
      .is("revoked_at", null)
      .is("claimed_at", null)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (
      invitationError ||
      !invitation ||
      invitation.intended_role !== "child" ||
      !childAgeBands.has(String(invitation.intended_age_band)) ||
      (!invitation.school_id && !invitation.guardian_sponsor_profile_id)
    ) {
      return fail();
    }

    const { data: created, error: createError } = await ctx.supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        aurelia_onboarding: "sponsored_child_invitation",
      },
    });

    if (createError || !created.user) {
      console.error("child invitation auth creation failed", { code: createError?.code ?? "unknown" });
      return fail();
    }

    const authUserId = created.user.id;
    const { data: claimData, error: claimError } = await ctx.supabaseAdmin.rpc("server_claim_account_invitation", {
      p_auth_user_id: authUserId,
      p_token_hash: tokenHash,
      p_display_name: displayName,
      p_country_code: countryCode,
    });

    if (claimError || !claimData?.[0]?.profile_id) {
      await ctx.supabaseAdmin.auth.admin.deleteUser(authUserId);
      console.error("child invitation claim failed", { code: claimError?.code ?? "unknown" });
      return fail();
    }

    return Response.json({
      data: {
        created: true,
        authUserId,
        profileId: claimData[0].profile_id,
        role: "child",
      },
    });
  }),
};
