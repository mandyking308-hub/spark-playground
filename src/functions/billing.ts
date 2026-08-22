import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { familyPlanByKey, type FamilyPlanKey } from "@/config/pricing";
import { getSupabaseServerClient } from "@/lib/supabase/server-client";

const familyCheckoutInput = z.object({
  planKey: z.enum([
    "family_monthly",
    "family_annual",
    "family_plus_monthly",
    "family_plus_annual",
  ]),
});

const checkoutResponse = z.object({
  checkout_url: z.string().url(),
  session_id: z.string().optional(),
  id: z.string().optional(),
});

export interface BillingSubscriptionSummary {
  id: string;
  planKey: string;
  provider: string;
  status: string;
  amountPence?: number | undefined;
  currency: string;
  currentPeriodEnd?: string | undefined;
  renewsAt?: string | undefined;
  cancelAtPeriodEnd: boolean;
}

export interface BillingContractSummary {
  status: string;
  seatLimit?: number | undefined;
  schoolLimit?: number | undefined;
  annualAmountPence?: number | undefined;
  currency: string;
  invoiceReference?: string | undefined;
  contractEndsAt?: string | undefined;
  renewalAt?: string | undefined;
}

export interface BillingOverview {
  role: string;
  account?: {
    id: string;
    accountType: string;
    provider: string;
    status: string;
    currency: string;
  } | undefined;
  subscriptions: BillingSubscriptionSummary[];
  contract?: BillingContractSummary | undefined;
  entitlements: Array<{ key: string; quantity?: number | undefined; active: boolean }>;
}

async function authenticatedContext() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Authentication required");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name, primary_role, age_band")
    .single();
  if (profileError || !profile) throw new Error("Profile not available");

  return { supabase, user, profile };
}

export const getBillingOverviewFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<BillingOverview> => {
    const { supabase, profile } = await authenticatedContext();

    const { data: accounts, error: accountError } = await supabase
      .from("billing_accounts")
      .select("id, account_type, provider, status, currency, created_at")
      .order("created_at", { ascending: false })
      .limit(1);
    if (accountError) throw new Error("Billing account could not be loaded");

    const account = accounts?.[0];
    if (!account) {
      return { role: String(profile.primary_role), subscriptions: [], entitlements: [] };
    }

    const [{ data: subscriptions, error: subscriptionError }, { data: entitlements, error: entitlementError }] =
      await Promise.all([
        supabase
          .from("billing_subscriptions")
          .select("id, plan_key, provider, status, amount_pence, currency, current_period_end, renews_at, cancel_at_period_end")
          .eq("billing_account_id", account.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("billing_entitlements")
          .select("entitlement_key, quantity, active")
          .eq("billing_account_id", account.id)
          .eq("active", true),
      ]);

    if (subscriptionError || entitlementError) throw new Error("Billing details could not be loaded");

    let contract: BillingContractSummary | undefined;
    if (account.account_type !== "family") {
      const { data, error } = await supabase
        .from("institution_contracts")
        .select("status, seat_limit, school_limit, annual_amount_pence, currency, invoice_reference, contract_ends_at, renewal_at")
        .eq("billing_account_id", account.id)
        .maybeSingle();
      if (error) throw new Error("Contract details could not be loaded");
      if (data) {
        contract = {
          status: String(data.status),
          seatLimit: typeof data.seat_limit === "number" ? data.seat_limit : undefined,
          schoolLimit: typeof data.school_limit === "number" ? data.school_limit : undefined,
          annualAmountPence: typeof data.annual_amount_pence === "number" ? data.annual_amount_pence : undefined,
          currency: String(data.currency),
          invoiceReference: typeof data.invoice_reference === "string" ? data.invoice_reference : undefined,
          contractEndsAt: typeof data.contract_ends_at === "string" ? data.contract_ends_at : undefined,
          renewalAt: typeof data.renewal_at === "string" ? data.renewal_at : undefined,
        };
      }
    }

    return {
      role: String(profile.primary_role),
      account: {
        id: String(account.id),
        accountType: String(account.account_type),
        provider: String(account.provider),
        status: String(account.status),
        currency: String(account.currency),
      },
      subscriptions: (subscriptions ?? []).map((row) => ({
        id: String(row.id),
        planKey: String(row.plan_key),
        provider: String(row.provider),
        status: String(row.status),
        amountPence: typeof row.amount_pence === "number" ? row.amount_pence : undefined,
        currency: String(row.currency),
        currentPeriodEnd: typeof row.current_period_end === "string" ? row.current_period_end : undefined,
        renewsAt: typeof row.renews_at === "string" ? row.renews_at : undefined,
        cancelAtPeriodEnd: Boolean(row.cancel_at_period_end),
      })),
      contract,
      entitlements: (entitlements ?? []).map((row) => ({
        key: String(row.entitlement_key),
        quantity: typeof row.quantity === "number" ? row.quantity : undefined,
        active: Boolean(row.active),
      })),
    };
  },
);

function dodoProductEnv(planKey: FamilyPlanKey): string {
  const envName: Record<FamilyPlanKey, string> = {
    family_monthly: "DODO_FAMILY_MONTHLY_PRODUCT_ID",
    family_annual: "DODO_FAMILY_ANNUAL_PRODUCT_ID",
    family_plus_monthly: "DODO_FAMILY_PLUS_MONTHLY_PRODUCT_ID",
    family_plus_annual: "DODO_FAMILY_PLUS_ANNUAL_PRODUCT_ID",
  };
  const productId = process.env[envName[planKey]]?.trim();
  if (!productId) throw new Error("Family checkout is not configured yet");
  return productId;
}

export const createFamilyCheckoutFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => familyCheckoutInput.parse(input))
  .handler(async ({ data }): Promise<{ checkoutUrl: string }> => {
    const { supabase, user, profile } = await authenticatedContext();
    if (profile.primary_role !== "parent" || profile.age_band !== "adult") {
      throw new Error("Only a verified parent account can start family billing");
    }

    const plan = familyPlanByKey(data.planKey);
    const productId = dodoProductEnv(data.planKey);
    const apiKey = process.env.DODO_PAYMENTS_API_KEY?.trim();
    const apiBaseUrl = process.env.DODO_PAYMENTS_API_BASE_URL?.trim().replace(/\/$/, "");
    const publicUrl = process.env.AURELIA_PUBLIC_URL?.trim().replace(/\/$/, "");

    if (!apiKey || !apiBaseUrl || !publicUrl) {
      throw new Error("Family checkout is not configured yet");
    }

    const { data: existing, error: existingError } = await supabase
      .from("billing_accounts")
      .select("id")
      .eq("account_type", "family")
      .eq("payer_profile_id", profile.id)
      .maybeSingle();
    if (existingError) throw new Error("Billing account could not be prepared");

    let billingAccountId = existing?.id ? String(existing.id) : undefined;
    if (!billingAccountId) {
      const { data: created, error } = await supabase
        .from("billing_accounts")
        .insert({
          account_type: "family",
          payer_profile_id: profile.id,
          provider: "dodo",
          currency: "GBP",
          status: "pending",
        })
        .select("id")
        .single();
      if (error || !created) throw new Error("Billing account could not be prepared");
      billingAccountId = String(created.id);
    }

    const response = await fetch(`${apiBaseUrl}/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_cart: [{ product_id: productId, quantity: 1 }],
        customer: {
          email: user.email,
          name: String(profile.display_name),
        },
        return_url: `${publicUrl}/billing/return`,
        cancel_url: `${publicUrl}/pricing`,
        metadata: {
          aurelia_billing_account_id: billingAccountId,
          aurelia_profile_id: String(profile.id),
          aurelia_plan_key: plan.key,
          aurelia_price_pence: String(plan.amountPence),
        },
      }),
    });

    if (!response.ok) throw new Error("Checkout could not be started");
    const parsed = checkoutResponse.safeParse(await response.json());
    if (!parsed.success) throw new Error("Checkout provider returned an invalid response");
    return { checkoutUrl: parsed.data.checkout_url };
  });
