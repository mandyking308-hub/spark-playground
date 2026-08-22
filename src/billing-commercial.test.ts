import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import { familyPlans, institutionPricing } from "@/config/pricing";

const billingFn = readFileSync(new URL("./functions/billing.ts", import.meta.url), "utf8");
const billingSchema = readFileSync(new URL("../database/live-billing-extension.sql", import.meta.url), "utf8");
const webhookSource = readFileSync(new URL("../supabase/functions/dodo-billing-webhook/index.ts", import.meta.url), "utf8");
const pricingRoute = readFileSync(new URL("./routes/pricing.tsx", import.meta.url), "utf8");

describe("Aurelia commercial model", () => {
  test("locks the approved family prices", () => {
    expect(familyPlans.map(({ key, amountPence }) => [key, amountPence])).toEqual([
      ["family_monthly", 1299],
      ["family_annual", 12900],
      ["family_plus_monthly", 1999],
      ["family_plus_annual", 19900],
    ]);
  });

  test("locks the institutional starting prices", () => {
    expect(institutionPricing.school.from).toBe("£2,950");
    expect(institutionPricing.educationGroup.from).toBe("£12,500");
    expect(institutionPricing.organisation.from).toBe("£5,000");
  });

  test("keeps Dodo secrets and product IDs server-side", () => {
    expect(billingFn).toContain("DODO_PAYMENTS_API_KEY");
    expect(billingFn).toContain("DODO_FAMILY_ANNUAL_PRODUCT_ID");
    expect(billingFn).not.toMatch(/VITE_DODO|VITE_.*PAYMENTS/);
    expect(pricingRoute).not.toContain("DODO_PAYMENTS_API_KEY");
  });

  test("uses hosted checkout and never trusts the browser redirect as payment proof", () => {
    expect(billingFn).toContain("/checkouts");
    expect(billingFn).toContain("product_cart");
    expect(webhookSource).toContain("webhook-signature");
    expect(webhookSource).toContain("new Webhook(secret)");
    expect(webhookSource).toContain("billing_events");
  });

  test("does not give children a billing policy", () => {
    expect(billingSchema).toContain("billing_accounts_family_self_select");
    expect(billingSchema).toContain("primary_role = 'parent'");
    expect(billingSchema).not.toMatch(/primary_role\s*=\s*'child'.*billing/s);
  });

  test("keeps billing entitlements separate from child permissions", () => {
    expect(billingSchema).toContain("billing_entitlements");
    expect(billingSchema).not.toContain("guardian_required");
    expect(webhookSource).toContain("family_core");
    expect(webhookSource).toContain("guardian_controls");
  });
});
