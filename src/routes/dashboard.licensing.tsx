import { Link, createFileRoute } from "@tanstack/react-router";
import { Building2, CalendarClock, Check, CreditCard, Loader2, ReceiptText, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { familyPlans, institutionPricing, type FamilyPlanKey } from "@/config/pricing";
import { createFamilyCheckoutFn, getBillingOverviewFn, type BillingOverview } from "@/functions/billing";

export const Route = createFileRoute("/dashboard/licensing")({
  head: () => ({
    meta: [
      { title: "Billing & licensing — Aurelia" },
      { name: "description", content: "Manage Aurelia family billing or institutional licensing." },
    ],
  }),
  component: LicensingPage,
});

function money(pence: number | undefined, currency = "GBP") {
  if (typeof pence !== "number") return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(pence / 100);
}

function dateLabel(value: string | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function FamilyBilling({ overview, onReload }: { overview: BillingOverview; onReload: () => void }) {
  const [checkoutPlan, setCheckoutPlan] = useState<FamilyPlanKey>();
  const [checkoutError, setCheckoutError] = useState<string>();
  const current = overview.subscriptions.find((subscription) => ["active", "past_due", "cancel_at_period_end", "pending"].includes(subscription.status));

  async function startCheckout(planKey: FamilyPlanKey) {
    setCheckoutPlan(planKey);
    setCheckoutError(undefined);
    try {
      const { checkoutUrl } = await createFamilyCheckoutFn({ data: { planKey } });
      window.location.assign(checkoutUrl);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Checkout could not be started");
      onReload();
    } finally {
      setCheckoutPlan(undefined);
    }
  }

  return (
    <div className="space-y-6">
      {current ? (
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2"><CreditCard className="size-5 text-primary" />Current family plan</CardTitle>
                <CardDescription className="mt-1">Your subscription status comes from the verified billing record, not from browser state.</CardDescription>
              </div>
              <Badge variant={current.status === "active" ? "default" : "secondary"} className="capitalize">{current.status.replaceAll("_", " ")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Plan</p><p className="mt-1 font-medium capitalize">{current.planKey.replaceAll("_", " ")}</p></div>
            <div className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Amount</p><p className="mt-1 font-medium">{money(current.amountPence, current.currency)}</p></div>
            <div className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Next renewal</p><p className="mt-1 font-medium">{dateLabel(current.renewsAt ?? current.currentPeriodEnd)}</p></div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">No active family subscription yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Choose monthly or annual billing below. If your family is covered by a school licence, the school-linked core experience remains included.</p>
            </div>
            <Badge variant="outline">Verified parent payer</Badge>
          </CardContent>
        </Card>
      )}

      {checkoutError ? (
        <div className="rounded-xl border border-dashed p-4 text-sm">
          <p className="font-medium">Checkout is not live yet</p>
          <p className="mt-1 text-muted-foreground">{checkoutError}. The billing account and pricing are ready; Dodo product IDs and server secrets still need to be connected before money can be taken.</p>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {familyPlans.map((plan) => (
          <Card key={plan.key} className={plan.cadence === "annual" ? "border-gold/60" : undefined}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{plan.name} · <span className="capitalize">{plan.cadence}</span></CardTitle>
                {plan.cadence === "annual" ? <Badge>Best value</Badge> : <Badge variant="outline">Flexible</Badge>}
              </div>
              <CardDescription>{plan.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div><span className="font-display text-4xl">{plan.displayPrice}</span><span className="text-sm text-muted-foreground"> {plan.displayCadence}</span>{plan.annualSaving ? <p className="mt-1 text-xs font-medium text-accent-foreground">{plan.annualSaving}</p> : null}</div>
              <ul className="space-y-2 text-sm">
                {plan.highlights.map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{item}</li>)}
              </ul>
              <Button className="w-full" disabled={Boolean(checkoutPlan)} onClick={() => void startCheckout(plan.key)}>
                {checkoutPlan === plan.key ? <><Loader2 className="mr-2 size-4 animate-spin" />Opening secure checkout…</> : `Choose ${plan.displayPrice} ${plan.displayCadence}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Family payments are designed to use Dodo Payments hosted Checkout Sessions. Card details stay with the payment provider; Aurelia stores subscription status and entitlements rather than raw card details.
      </p>
    </div>
  );
}

function InstitutionBilling({ overview }: { overview: BillingOverview }) {
  const pricing = overview.role === "group_admin" || overview.account?.accountType === "education_group"
    ? institutionPricing.educationGroup
    : overview.role === "organisation_admin" || overview.account?.accountType === "organisation"
      ? institutionPricing.organisation
      : institutionPricing.school;

  if (!overview.account || !overview.contract) {
    return (
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ReceiptText className="size-5 text-primary" />Contract-led billing</CardTitle>
            <CardDescription>Institutional access is activated from an agreed proposal and annual contract — never from fake preview licence numbers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border p-5">
              <p className="text-sm text-muted-foreground">Published starting price</p>
              <p className="mt-1 font-display text-4xl">From {pricing.from}<span className="text-sm font-sans text-muted-foreground"> {pricing.cadence}</span></p>
              <p className="mt-2 text-sm text-muted-foreground">{pricing.range}</p>
            </div>
            <Button asChild><Link to="/contact">Request proposal / billing setup</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" />What activates access</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>1. Agreed scope and annual price</p><p>2. Signed institution agreement</p><p>3. Invoice or approved payment route</p><p>4. Contract and entitlements recorded in Aurelia</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const contract = overview.contract;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Building2 className="size-4" /> Contract</CardTitle></CardHeader><CardContent><Badge className="capitalize">{contract.status.replaceAll("_", " ")}</Badge><p className="mt-3 text-2xl font-semibold">{money(contract.annualAmountPence, contract.currency)} / year</p><p className="text-sm text-muted-foreground">{contract.invoiceReference ? `Invoice ${contract.invoiceReference}` : "Annual institutional agreement"}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Users className="size-4" /> Licensed capacity</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold">{contract.seatLimit ? contract.seatLimit.toLocaleString() : "Tailored"}</p><p className="text-sm text-muted-foreground">{contract.schoolLimit ? `${contract.schoolLimit} school${contract.schoolLimit === 1 ? "" : "s"} included` : "Learner/staff scope per contract"}</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><CalendarClock className="size-4" /> Renewal</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold">{dateLabel(contract.renewalAt ?? contract.contractEndsAt)}</p><p className="text-sm text-muted-foreground">Contract renewal date</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Active entitlements</CardTitle><CardDescription>What this contract currently unlocks in Aurelia.</CardDescription></CardHeader>
        <CardContent>{overview.entitlements.length === 0 ? <p className="text-sm text-muted-foreground">No entitlement rows have been issued yet.</p> : <div className="grid gap-3 md:grid-cols-2">{overview.entitlements.map((entitlement) => <div key={entitlement.key} className="rounded-xl border p-4"><p className="font-medium capitalize">{entitlement.key.replaceAll("_", " ")}</p><p className="mt-1 text-xs text-muted-foreground">{typeof entitlement.quantity === "number" ? `Quantity: ${entitlement.quantity}` : "Included"}</p></div>)}</div>}</CardContent>
      </Card>
    </div>
  );
}

function LicensingPage() {
  const [overview, setOverview] = useState<BillingOverview>();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const reload = useMemo(() => () => {
    setLoading(true);
    void getBillingOverviewFn()
      .then((result) => { setOverview(result); setLoadError(false); })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Billing & access"
        title="Licensing & billing"
        description="Family subscriptions and institutional contracts live here. Billing status controls commercial entitlements, while identity and safeguarding permissions remain separate."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Licensing & billing" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">No card data stored in Aurelia</Badge>
        <Badge variant="outline">Entitlements separate from child permissions</Badge>
        <Badge variant="outline">Institutional annual invoicing</Badge>
      </div>

      {loading ? (
        <Card><CardContent className="flex items-center gap-2 p-6 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading billing record…</CardContent></Card>
      ) : loadError || !overview ? (
        <Card><CardContent className="p-6"><p className="font-medium">Billing details could not be loaded</p><p className="mt-1 text-sm text-muted-foreground">The rest of Aurelia is unaffected. Try this billing view again.</p><Button className="mt-4" variant="outline" onClick={reload}>Try again</Button></CardContent></Card>
      ) : overview.role === "parent" ? (
        <FamilyBilling overview={overview} onReload={reload} />
      ) : (
        <InstitutionBilling overview={overview} />
      )}

      <Card className="bg-muted/30">
        <CardContent className="flex gap-3 p-5 text-sm text-muted-foreground">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>A paid plan never grants an adult extra access to a child's private work. Billing unlocks product entitlements; Aurelia's guardian, school and safeguarding rules continue to decide who can see or approve child activity.</p>
        </CardContent>
      </Card>
    </div>
  );
}
