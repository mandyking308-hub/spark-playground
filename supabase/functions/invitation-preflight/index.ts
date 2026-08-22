import { withSupabase } from "@supabase/server";

interface RequestBody {
  invitationToken?: string;
}

const tokenPattern = /^[A-Za-z0-9_-]{40,80}$/;

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(value: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
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
      return Response.json({ data: { valid: false } });
    }

    if (typeof body.invitationToken !== "string" || !tokenPattern.test(body.invitationToken)) {
      return Response.json({ data: { valid: false } });
    }

    const tokenHash = await sha256Hex(body.invitationToken);
    const { data, error } = await ctx.supabaseAdmin
      .from("account_invitations")
      .select("id")
      .eq("token_hash", tokenHash)
      .eq("state", "pending")
      .is("revoked_at", null)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (error) {
      console.error("invitation-preflight failed", { code: error.code ?? "unknown" });
      return Response.json({ error: "Invitation could not be checked" }, { status: 400 });
    }

    // Deliberately reveal only whether the opaque token is currently claimable.
    return Response.json({ data: { valid: Boolean(data) } });
  }),
};
