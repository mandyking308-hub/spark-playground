import { withSupabase } from "@supabase/server";
import { Webhook } from "standardwebhooks";

type FamilyPlanKey =
  | "family_monthly"
  | "family_annual"
  | "family_plus_monthly"
  | "family_plus_annual";

type DodoSubscriptionEvent =
  | "subscription.active"
  | "subscription.updated"
  | "subscription.on_hold"
  | "subscription.renewed"
  | "subscription.plan_changed"
  | "subscription.cancelled"
  | "subscription.failed"
  | "subscription.expired";

interface DodoPayload {
  type?: string;
  timestamp?: string;
  data?: {
    subscription_id?: string;
    product_id?: string;
    recurring_pre_tax_amount?: number;
    currency?: string;
    next_billing_date?: string | null;
    cancelled_at?: string | null;
    cancel_at_next_billing_date?: boolean;
    status?: string;
    customer?: {
      customer_id?: string;
      email?: string;
      name?: string;
    };
    metadata?: Record<string, string | number | boolean | null | undefined>;
  };
}

const familyPlans = new Set<FamilyPlanKey>([
  "family_monthly",
  "family_annual",
  "family_plus_monthly",
  "family_plus_annual",
]);

const handledEvents = new Set<DodoSubscriptionEvent>([
  "subscription.active",
  "subscription.updated",
  "subscription.on_hold",
  "subscription.renewed",
  "subscription.plan_changed",
  "subscription.cancelled",
  "subscription.failed",
  "subscription.expired",
]);

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function response(body: unknown, status = 200) {
  return Response.json(body, {
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

function subscriptionStatus(event: DodoSubscriptionEvent, providerStatus?: string) {
  if (event === "subscription.on_hold" || event === "subscription.failed") return "past_due";
  if (event === "subscription.cancelled") return "cancelled";
  if (event === "subscription.expired") return "expired";

  const normalized = providerStatus?.toLowerCase();
  if (normalized?.includes("hold") || normalized?.includes("past_due") || normalized?.includes("failed")) return "past_due";
  if (normalized?.includes("cancel")) return "cancelled";
  if (normalized?.includes("expired")) return "expired";
  return "active";
}

function productIdForPlan(planKey: FamilyPlanKey) {
  const envName: Record<FamilyPlanKey, string> = {
    family_monthly: "DODO_FAMILY_MONTHLY_PRODUCT_ID",
    family_annual: "DODO_FAMILY_ANNUAL_PRODUCT_ID",
    family_plus_monthly: "DODO_FAMILY_PLUS_MONTHLY_PRODUCT_ID",
    family_plus_annual: "DODO_FAMILY_PLUS_ANNUAL_PRODUCT_ID",
  };
  return Deno.env.get(envName[planKey])?.trim();
}

function entitlementKeys(planKey: FamilyPlanKey) {
  const base = [
    "family_core",
    "creator_studio",
    "guardian_controls",
    "achievement_passport",
    "parent_community",
  ];
  if (planKey.startsWith("family_plus")) base.push("family_plus_multi_child");
  return base;
}

export default {
  fetch: withSupabase({ auth: "publishable" }, async (req, ctx) => {
    if (req.method !== "POST") return response({ error: "Method not allowed" }, 405);

    const secret = Deno.env.get("DODO_PAYMENTS_WEBHOOK_KEY")?.trim();
    if (!secret) return response({ error: "Billing webhook is not configured" }, 503);

    const webhookId = req.headers.get("webhook-id")?.trim();
    const webhookSignature = req.headers.get("webhook-signature")?.trim();
    const webhookTimestamp = req.headers.get("webhook-timestamp")?.trim();
    if (!webhookId || !webhookSignature || !webhookTimestamp) {
      return response({ error: "Invalid webhook" }, 400);
    }

    const rawBody = await req.text();
    try {
      const webhook = new Webhook(secret);
      webhook.verify(rawBody, {
        "webhook-id": webhookId,
        "webhook-signature": webhookSignature,
        "webhook-timestamp": webhookTimestamp,
      });
    } catch {
      return response({ error: "Invalid webhook signature" }, 401);
    }

    let payload: DodoPayload;
    try {
      payload = JSON.parse(rawBody) as DodoPayload;
    } catch {
      return response({ error: "Invalid webhook payload" }, 400);
    }

    const eventType = payload.type as DodoSubscriptionEvent | undefined;
    if (!eventType || !handledEvents.has(eventType)) {
      return response({ received: true, ignored: true });
    }

    const data = payload.data;
    const metadata = data?.metadata ?? {};
    const billingAccountId = String(metadata["aurelia_billing_account_id"] ?? "");
    const planKey = String(metadata["aurelia_plan_key"] ?? "") as FamilyPlanKey;
    const subscriptionId = data?.subscription_id?.trim();
    const productId = data?.product_id?.trim();

    if (!uuidPattern.test(billingAccountId) || !familyPlans.has(planKey) || !subscriptionId || !productId) {
      return response({ error: "Webhook does not match an Aurelia family checkout" }, 400);
    }

    const expectedProductId = productIdForPlan(planKey);
    if (!expectedProductId || expectedProductId !== productId) {
      return response({ error: "Webhook product does not match configured Aurelia plan" }, 400);
    }

    const status = subscriptionStatus(eventType, data?.status);
    const active = status === "active";
    const currency = typeof data?.currency === "string" && /^[A-Z]{3}$/i.test(data.currency)
      ? data.currency.toUpperCase()
      : "GBP";
    const amount = typeof data?.recurring_pre_tax_amount === "number" && data.recurring_pre_tax_amount >= 0
      ? Math.round(data.recurring_pre_tax_amount)
      : null;
    const payloadHash = await sha256Hex(rawBody);

    try {
      const { data: duplicate } = await ctx.supabaseAdmin
        .from("billing_events")
        .select("id")
        .eq("provider", "dodo")
        .eq("provider_event_id", webhookId)
        .maybeSingle();
      if (duplicate?.id) return response({ received: true, duplicate: true });

      const { data: account, error: accountError } = await ctx.supabaseAdmin
        .from("billing_accounts")
        .select("id, account_type")
        .eq("id", billingAccountId)
        .eq("account_type", "family")
        .single();
      if (accountError || !account) throw accountError ?? new Error("billing_account_missing");

      const { error: subscriptionError } = await ctx.supabaseAdmin
        .from("billing_subscriptions")
        .upsert(
          {
            billing_account_id: billingAccountId,
            plan_key: planKey,
            provider: "dodo",
            provider_subscription_id: subscriptionId,
            provider_product_id: productId,
            status,
            amount_pence: amount,
            currency,
            renews_at: data?.next_billing_date ?? null,
            cancel_at_period_end: Boolean(data?.cancel_at_next_billing_date),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "provider,provider_subscription_id" },
        );
      if (subscriptionError) throw subscriptionError;

      const { error: accountUpdateError } = await ctx.supabaseAdmin
        .from("billing_accounts")
        .update({
          provider: "dodo",
          provider_customer_id: data?.customer?.customer_id ?? null,
          status: active ? "active" : status === "past_due" ? "past_due" : "closed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", billingAccountId);
      if (accountUpdateError) throw accountUpdateError;

      const keys = entitlementKeys(planKey);
      for (const key of keys) {
        const { error } = await ctx.supabaseAdmin
          .from("billing_entitlements")
          .upsert(
            {
              billing_account_id: billingAccountId,
              entitlement_key: key,
              active,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "billing_account_id,entitlement_key" },
          );
        if (error) throw error;
      }

      const { error: eventError } = await ctx.supabaseAdmin.from("billing_events").insert({
        provider: "dodo",
        provider_event_id: webhookId,
        billing_account_id: billingAccountId,
        event_type: eventType,
        payload_hash: payloadHash,
        processed_at: new Date().toISOString(),
      });
      if (eventError) throw eventError;

      return response({ received: true });
    } catch (error) {
      const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "unknown";
      console.error("dodo-billing-webhook failed", { eventType, code });
      return response({ error: "Billing event could not be processed" }, 500);
    }
  }),
};
