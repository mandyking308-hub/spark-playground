import { withSupabase } from "@supabase/server";

type IntakeKind = "enquiry" | "safeguarding";
type IntakeAudience = "family" | "school" | "education_group" | "organisation" | "press" | "general";

interface IntakeBody {
  kind?: IntakeKind;
  audience?: IntakeAudience;
  name?: string;
  email?: string;
  organisation?: string;
  message?: string;
  contactPermitted?: boolean;
  website?: string;
}

const audiences = new Set<IntakeAudience>([
  "family",
  "school",
  "education_group",
  "organisation",
  "press",
  "general",
]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function response(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function cleanOptional(value: unknown, maxLength: number): string | null | undefined {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return undefined;
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > maxLength) return undefined;
  return cleaned;
}

export default {
  fetch: withSupabase({ auth: "publishable" }, async (req, ctx) => {
    if (req.method !== "POST") return response({ error: "Method not allowed" }, 405);

    let body: IntakeBody;
    try {
      body = await req.json();
    } catch {
      return response({ error: "Invalid request" }, 400);
    }

    // Honeypot. Bots receive an indistinguishable success without creating data.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return response({ data: { accepted: true, reference: `AUR-${crypto.randomUUID().slice(0, 8).toUpperCase()}` } });
    }

    const kind = body.kind;
    const audience = body.audience ?? "general";
    const name = cleanOptional(body.name, 120);
    const email = cleanOptional(body.email, 254);
    const organisation = cleanOptional(body.organisation, 160);
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const contactPermitted = body.contactPermitted === true;

    if ((kind !== "enquiry" && kind !== "safeguarding") || !audiences.has(audience)) {
      return response({ error: "Invalid request" }, 400);
    }
    if (name === undefined || email === undefined || organisation === undefined) {
      return response({ error: "Invalid request" }, 400);
    }
    if (email !== null && (!emailPattern.test(email) || email.length > 254)) {
      return response({ error: "Invalid email address" }, 400);
    }
    if (message.length < 20 || message.length > (kind === "safeguarding" ? 8000 : 4000)) {
      return response({ error: "Message length is outside the allowed range" }, 400);
    }
    if (kind === "enquiry" && (email === null || !contactPermitted)) {
      return response({ error: "An email address and permission to respond are required for enquiries" }, 400);
    }

    try {
      // The source address is used only in-memory to derive an hourly, non-reversible
      // quota key. The raw address is never inserted or logged.
      const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
      const source = forwarded || email || "anonymous";
      const windowStart = new Date();
      windowStart.setUTCMinutes(0, 0, 0);
      const keyHash = await sha256Hex(`${kind}|${windowStart.toISOString()}|${source}`);

      const { data: allowed, error: quotaError } = await ctx.supabaseAdmin.rpc(
        "server_consume_public_intake_quota",
        {
          p_key_hash: keyHash,
          p_window_start: windowStart.toISOString(),
          p_limit: kind === "safeguarding" ? 15 : 8,
        },
      );
      if (quotaError) throw quotaError;
      if (allowed !== true) return response({ error: "Too many submissions. Please try again later." }, 429);

      const { data, error } = await ctx.supabaseAdmin
        .from("public_intake_submissions")
        .insert({
          kind,
          audience,
          name,
          email,
          organisation,
          message,
          contact_permitted: contactPermitted,
          retention_class: kind === "safeguarding" ? "safeguarding_report" : "general_enquiry",
        })
        .select("id")
        .single();
      if (error || !data?.id) throw error ?? new Error("insert_failed");

      return response({
        data: {
          accepted: true,
          reference: `AUR-${String(data.id).slice(0, 8).toUpperCase()}`,
        },
      });
    } catch (error) {
      const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "unknown";
      console.error("public-intake failed", { kind: kind ?? "unknown", code });
      return response({ error: "Your submission could not be recorded right now" }, 400);
    }
  }),
};
