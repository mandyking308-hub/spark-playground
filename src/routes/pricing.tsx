import { Link, createFileRoute } from "@tanstack/react-router";
import { Building2, Check, Crown, GraduationCap, HeartHandshake, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

import { PublicPage } from "@/components/public/public-page";
import { PageHero, Section, SectionHeading } from "@/components/public/sections";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { familyPlans, includedAccess, institutionPricing } from "@/config/pricing";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Aurelia" },
      {
        name: "description",
        content: "Aurelia pricing for families, schools, education groups and organisations.",
      },
      { property: "og:title", content: "Pricing — Aurelia" },
      {
        property: "og:description",
        content: "Simple family subscriptions and annual licensing for schools and education groups.",
      },
      { property: "og:url", content: "/pricing" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

const familyMonthly = familyPlans.find((plan) => plan.key === "family_monthly")!;
const familyAnnual = familyPlans.find((plan) => plan.key === "family_annual")!;
const plusMonthly = familyPlans.find((plan) => plan.key === "family_plus_monthly")!;
const plusAnnual = familyPlans.find((plan) => plan.key === "family_plus_annual")!;

function PlanCard({
  name,
  eyebrow,
  monthly,
  annual,
  featured = false,
}: {
  name: string;
  eyebrow: string;
  monthly: typeof familyMonthly;
  annual: typeof familyAnnual;
  featured?: boolean;
}) {
  return (
    <Card className={featured ? "relative overflow-hidden border-gold/70 shadow-lg" : "relative overflow-hidden"}>
      {featured ? (
        <div className="absolute inset-x-0 top-0 h-1 bg-gold" aria-hidden="true" />
      ) : null}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <Badge variant={featured ? "default" : "secondary"}>{eyebrow}</Badge>
          {featured ? <Crown className="size-5 text-gold" aria-hidden="true" /> : <Sparkles className="size-5 text-primary" aria-hidden="true" />}
        </div>
        <CardTitle className="mt-4 font-display text-3xl tracking-tight">{name}</CardTitle>
        <CardDescription className="max-w-md text-sm leading-relaxed">{annual.summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-end gap-2">
            <span className="font-display text-5xl tracking-tight">{annual.displayPrice}</span>
            <span className="pb-1 text-sm text-muted-foreground">{annual.displayCadence}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-accent-foreground">{annual.annualSaving}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Or {monthly.displayPrice} {monthly.displayCadence}
          </p>
        </div>

        <ul className="space-y-3 text-sm">
          {annual.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2.5">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="size-3" aria-hidden="true" />
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button asChild className="w-full">
            <Link to="/auth/sign-in">Choose annual</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/auth/sign-in">Choose monthly</Link>
          </Button>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Family checkout is completed from a verified parent account. If your school already provides Aurelia, core school-linked family access is included rather than charged twice.
        </p>
      </CardContent>
    </Card>
  );
}

function PricingPage() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="Pricing"
        title="A serious creative world, priced simply"
        description="Families can subscribe directly. Schools, education groups and organisations are licensed annually so safeguarding, administration and support are funded properly — without advertising to children."
        actions={
          <>
            <Button asChild size="lg"><Link to="/auth/sign-in">Sign in to subscribe</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/contact">Talk to Aurelia</Link></Button>
          </>
        }
      >
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border bg-card/80 p-4">
            <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium">No advertising to children</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">The product is paid for by the adults and institutions responsible for it.</p>
          </div>
          <div className="rounded-xl border bg-card/80 p-4">
            <UsersRound className="size-5 text-primary" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium">No double charging</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">School-funded core access remains included for families attached to that licence.</p>
          </div>
          <div className="rounded-xl border bg-card/80 p-4">
            <HeartHandshake className="size-5 text-primary" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium">Continuity at 16+</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Young people are not pushed into a paywall when they move into Alumni.</p>
          </div>
        </div>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Families"
          title="Choose the household plan that fits"
          description="Annual plans are the best value. Monthly plans remain available for families who prefer flexibility."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <PlanCard name="Family" eyebrow="Most families" monthly={familyMonthly} annual={familyAnnual} featured />
          <PlanCard name="Family Plus" eyebrow="Larger households" monthly={plusMonthly} annual={plusAnnual} />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Schools & institutions"
          title="Annual licensing, not a consumer checkout"
          description="Institutional buyers receive a proposal, agreement and invoice. Pricing grows with scope rather than forcing every school into the same box."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <GraduationCap className="size-6 text-primary" aria-hidden="true" />
              <CardTitle className="mt-4">{institutionPricing.school.label}</CardTitle>
              <CardDescription>{institutionPricing.school.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><span className="font-display text-4xl">From {institutionPricing.school.from}</span><span className="text-sm text-muted-foreground"> {institutionPricing.school.cadence}</span></p>
              <p className="text-sm text-muted-foreground">{institutionPricing.school.range}</p>
              <Button asChild variant="outline" className="w-full"><Link to="/contact">Request school proposal</Link></Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Building2 className="size-6 text-primary" aria-hidden="true" />
              <CardTitle className="mt-4">{institutionPricing.educationGroup.label}</CardTitle>
              <CardDescription>{institutionPricing.educationGroup.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><span className="font-display text-4xl">From {institutionPricing.educationGroup.from}</span><span className="text-sm text-muted-foreground"> {institutionPricing.educationGroup.cadence}</span></p>
              <p className="text-sm text-muted-foreground">{institutionPricing.educationGroup.range}</p>
              <Button asChild variant="outline" className="w-full"><Link to="/contact">Talk about a group rollout</Link></Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <HeartHandshake className="size-6 text-primary" aria-hidden="true" />
              <CardTitle className="mt-4">{institutionPricing.organisation.label}</CardTitle>
              <CardDescription>{institutionPricing.organisation.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><span className="font-display text-4xl">From {institutionPricing.organisation.from}</span><span className="text-sm text-muted-foreground"> {institutionPricing.organisation.cadence}</span></p>
              <p className="text-sm text-muted-foreground">{institutionPricing.organisation.range}</p>
              <Button asChild variant="outline" className="w-full"><Link to="/contact">Discuss a programme</Link></Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Included access"
          title="Some relationships matter more than another subscription"
          description="Aurelia's pricing follows who is funding the environment without turning every transition into another charge."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border p-6">
            <p className="text-sm font-semibold">16+ Alumni</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{includedAccess.alumni}.</p>
          </div>
          <div className="rounded-2xl border p-6">
            <p className="text-sm font-semibold">Parent Alumni</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{includedAccess.parentAlumni}.</p>
          </div>
          <div className="rounded-2xl border p-6">
            <p className="text-sm font-semibold">School-funded families</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{includedAccess.schoolFamilyCore}</p>
          </div>
        </div>
      </Section>

      <Section tone="dark">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">Ready when you are</p>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-primary-foreground">Pay for the platform. Never sell the child's attention.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/75">
            Family subscriptions fund the household experience. Institutional licences fund the systems, safeguarding and administration schools need around it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary"><Link to="/auth/sign-in">Family sign in</Link></Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"><Link to="/contact">Institutional enquiry</Link></Button>
          </div>
        </div>
      </Section>
    </PublicPage>
  );
}
