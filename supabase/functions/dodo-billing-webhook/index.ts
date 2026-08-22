import { createClient } from "@supabase/supabase-js";
import { Webhook } from "standardwebhooks";

type PlanKey =
  | "family_monthly"
  | "family_annual"
  | "family_plus_monthly"
  | "family_plus_annual";

type JsonRecord = Record<string, unknown>;

const subscriptionEvents = new Set([
  "subscription.active",
  "subscription.updated",
  "subscription.on_hold",
  "subscription.renewed",
  "subscription.plan_changed",
  "subscription.cancelled",
  "subscription.failed",
  "subscription.expired",
]);

const planDefinitions: Array<{
  key: PlanKey;
  amountPence: number;
  productEnv: string;
}> = [
  { key: "family_monthly", amountPence: 1299, productEnv: "DODO_FAMILY_MONTHLY_PRODUCT_ID" },
  { key: "family_annual", amountPence: 12900, productEnv: "DODO_FAMILY_ANNUAL_PRODUCT_ID" },
  { key: "family_plus_monthly", amountPence: 1999, productEnv: "DODO_FAMILY_PLUS_MONTHLY_PRODUCT_ID" },
  { key: "family_plus_annual", amountPence: 19900, productEnv: "DODO_FAMILY_PLUS_ANNUAL_PRODUCT_ID" },
];

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const subscriptionStatuses = new Set(["pending", "active", "on_hold", "cancelled", "failed", "expired"]);

function response(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function record(value: unknown): JsonRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function optionalIso(value: unknown): string | null {
  const raw = text(value);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function configuredPlans() {
  return planDefinitions.map((definition) => ({
    ...definition,
    productId: Deno.env.get(definition.productEnv)?.trim() || "",
  }));
}

function metadataBinding(metadata: JsonRecord | null) {
  if (!metadata) return null;
  const billingAccountId = text(metadata["aurelia_billing_account_id"]);
  const planKey = text(metadata["aurelia_plan_key"]);
  const pricePence = text(metadata["aurelia_price_pence"]);

  if (!billingAccountId && !planKey && !pricePence) return null;
  if (!billingAccountId || !uuidPattern.test(billingAccountId)) throw new Error("invalid_billing_account_metadata");
  if (!planKey || !planDefinitions.some((plan) => plan.key === planKey)) throw new Error("invalid_plan_metadata");

  return {
    billingAccountId,
    planKey: planKey as PlanKey,
    pricePence,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return response({ error: "Method not allowed" }, 405);

  const webhookSecret = Deno.env.get("DODO_PAYMENTS_WEBHOOK_KEY")?.trim();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  const plans = configuredPlans();

  if (!webhookSecret || !supabaseUrl || !serviceRoleKey || plans.some((plan) => !plan.productId)) {
    console.error("dodo-billing-webhook not configured");
    return response({ error: "Billing webhook is not configured" }, 503);
  }

  const webhookId = req.headers.get("webhook-id")?.trim() || "";
  const webhookSignature = req.headers.get("webhook-signature")?.trim() || "";
  const webhookTimestamp = req.headers.get("webhook-timestamp")?.trim() || "";
  const rawBody = await req.text();

  let payload: JsonRecord;
  try {
    const verified = new Webhook(webhookSecret).verify(rawBody, {
      "webhook-id": webhookId,
      "webhook-signature": webhookSignature,
      "webhook-timestamp": webhookTimestamp,
    });
    const parsed = record(verified);
    if (!parsed) throw new Error("invalid_payload");
    payload = parsed;
  } catch {
    console.error("dodo-billing-webhook signature verification failed");
    return response({ error: "Invalid webhook signature" }, 401);
  }

  const eventType = text(payload["type"]);
  const data = record(payload["data"]);
  if (!eventType || !data) return response({ error: "Invalid webhook payload" }, 400);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const payloadHash = await sha256Hex(rawBody);

  try {
    if (eventType === "payment.succeeded") {
      const subscriptionId = text(data["subscription_id"]);
      if (!subscriptionId) {
        return response({ received: true, ignored: true });
      }

      const binding = metadataBinding(record(data["metadata"]));
      if (!binding) {
        return response({ received: true, ignored: true });
      }

      const plan = plans.find((item) => item.key === binding.planKey);
      if (!plan) throw new Error("plan_not_configured");
      if (binding.pricePence !== null && binding.pricePence !== String(plan.amountPence)) {
        throw new Error("price_metadata_mismatch");
      }

      const customer = record(data["customer"]);
      const { data: result, error } = await admin.rpc("server_bind_dodo_subscription_payment", {
        p_provider_event_id: webhookId,
        p_event_type: eventType,
        p_payload_hash: payloadHash,
        p_billing_account_id: binding.billingAccountId,
        p_plan_key: plan.key,
        p_provider_subscription_id: subscriptionId,
        p_provider_product_id: plan.productId,
        p_provider_checkout_session_id: text(data["checkout_session_id"]),
        p_provider_customer_id: text(customer?.["customer_id"]),
      });

      if (error) throw error;
      return response({ received: true, processed: Boolean(result?.[0]?.processed) });
    }

    if (!subscriptionEvents.has(eventType)) {
      return response({ received: true, ignored: true });
    }

    const subscriptionId = text(data["subscription_id"]);
    const productId = text(data["product_id"]);
    const externalStatus = text(data["status"]);
    const currency = text(data["currency"])?.toUpperCase() || null;
    const recurringAmount = data["recurring_pre_tax_amount"];
    const quantity = data["quantity"];

    if (!subscriptionId || !productId || !externalStatus || !subscriptionStatuses.has(externalStatus)) {
      return response({ error: "Invalid subscription payload" }, 400);
    }

    const plan = plans.find((item) => item.productId === productId);
    if (!plan) {
      // The same Dodo business can sell other products. They must never touch
      // Aurelia billing state.
      return response({ received: true, ignored: true });
    }

    if (currency !== "GBP" || recurringAmount !== plan.amountPence || quantity !== 1) {
      return response({ error: "Subscription does not match Aurelia plan configuration" }, 400);
    }

    let billingAccountId: string | null = null;
    const binding = metadataBinding(record(data["metadata"]));
    if (binding) {
      if (binding.planKey !== plan.key) throw new Error("subscription_plan_metadata_mismatch");
      if (binding.pricePence !== null && binding.pricePence !== String(plan.amountPence)) {
        throw new Error("subscription_price_metadata_mismatch");
      }
      billingAccountId = binding.billingAccountId;
    } else {
      // Checkout metadata is guaranteed on the successful payment. If Dodo's
      // subscription object does not carry that metadata, resolve the binding
      // established by payment.succeeded. This also handles out-of-order events:
      // returning 503 causes Dodo to retry after the payment event arrives.
      const { data: existing, error: lookupError } = await admin
        .from("billing_subscriptions")
        .select("billing_account_id")
        .eq("provider", "dodo")
        .eq("provider_subscription_id", subscriptionId)
        .maybeSingle();
      if (lookupError) throw lookupError;
      billingAccountId = text(existing?.billing_account_id);
      if (!billingAccountId) {
        console.error("dodo subscription binding not ready", { eventType });
        return response({ error: "Subscription binding is not ready" }, 503);
      }
    }

    const customer = record(data["customer"]);
    const { data: result, error } = await admin.rpc("server_apply_dodo_subscription_event", {
      p_provider_event_id: webhookId,
      p_event_type: eventType,
      p_payload_hash: payloadHash,
      p_billing_account_id: billingAccountId,
      p_plan_key: plan.key,
      p_provider_subscription_id: subscriptionId,
      p_provider_product_id: productId,
      p_external_status: externalStatus,
      p_amount_pence: plan.amountPence,
      p_currency: "GBP",
      p_provider_customer_id: text(customer?.["customer_id"]),
      p_period_start: optionalIso(data["previous_billing_date"]),
      p_period_end: optionalIso(data["next_billing_date"]),
      p_cancel_at_period_end: data["cancel_at_next_billing_date"] === true,
    });

    if (error) throw error;
    return response({
      received: true,
      processed: Boolean(result?.[0]?.processed),
      status: result?.[0]?.subscription_status ?? null,
    });
  } catch (error) {
    const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "unknown";
    console.error("dodo-billing-webhook processing failed", { eventType, code });
    // A non-2xx response asks Dodo to retry. This is deliberate for transient
    // database errors and event-order races.
    return response({ error: "Webhook could not be processed" }, 500);
  }
});
