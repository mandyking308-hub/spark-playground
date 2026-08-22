import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Building2,
  FileSearch,
  Landmark,
  Network,
  ShieldCheck,
} from "lucide-react";

import { PublicPage } from "@/components/public/public-page";
import {
  CheckList,
  CtaBand,
  FeatureCard,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/public/sections";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/for-education-groups")({
  head: () => ({
    meta: [
      { title: "For Education Groups — Aurelia" },
      {
        name: "description",
        content:
          "How Aurelia supports multi-school groups and trusts: tenancy, group-level policy, delegated school administration, cross-school reporting and governance.",
      },
      { property: "og:title", content: "For Education Groups — Aurelia" },
      {
        property: "og:description",
        content:
          "The multi-school operating layer in Aurelia — tenancy, policy, delegation, reporting and audit.",
      },
      { property: "og:url", content: "/for-education-groups" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/for-education-groups" }],
  }),
  component: ForEducationGroups,
});

const tenancy = [
  "Each school within a group operates as its own scoped workspace, with its own pupils, staff and classes.",
  "Group Admins operate one level above every school, but day-to-day teaching and pastoral work stays with each school's own staff.",
  "Data belonging to one school is never visible to another school in the group by default.",
  "The group boundary is enforced by the same row-level security that separates every tenant on the platform.",
];

const delegation = [
  { icon: Building2, title: "Set up each school", text: "The Group Admin brings a school into the group, verifies its School Admin, and hands day-to-day administration to that person." },
  { icon: Network, title: "Delegate, don't duplicate", text: "Group Admins do not run each school's roster or reviews — that work stays local, with the group holding policy and oversight." },
  { icon: ShieldCheck, title: "Step in when required", text: "A Group Admin can intervene directly in a school's safeguarding case or account setup when governance requires it." },
];

function ForEducationGroups() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="For education groups"
        title="One policy layer, many schools, no loss of local control"
        description="Aurelia gives multi-academy trusts and school groups a group-level operating layer — consistent policy and reporting across every school, while day-to-day administration stays with each school's own staff."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/contact">Talk to us about your group</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/for-schools">See how individual schools work</Link>
            </Button>
          </>
        }
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Tenancy"
            title="Every school is its own protected space"
            description="Aurelia treats each school as a distinct tenant within the group. Group-wide visibility is additive — it never removes the boundaries between individual schools."
          />
          <CheckList items={tenancy} />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Group-level policy"
          title="Set the standard once, apply it everywhere"
          description="A Group Admin can set policy that applies across every school in the group — safeguarding contacts, AI assistance defaults, approval requirements for certain challenge types — so standards do not depend on individual school configuration."
        />
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Individual schools can still make decisions within that policy — a School Admin sets
          local class structures and staff assignments — but the boundaries of what is possible
          are set once, at group level, and inherited automatically by every school.
        </p>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Delegated administration"
          title="Group oversight without operational bottlenecks"
          description="Group Admins are not meant to run every school's day-to-day account administration, and Aurelia's roles are built to reflect that."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {delegation.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Cross-school reporting"
          title="See patterns across the group, not just within one school"
          description="Group Admins can view aggregate reporting across every school in the group — participation in challenges, verification activity, safeguarding case volumes — without breaking into individual pupil-level records without cause."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <FeatureCard icon={BarChart3} title="Aggregate visibility">
            Trends and volumes across schools, useful for spotting where support or investment is needed.
          </FeatureCard>
          <FeatureCard icon={FileSearch} title="Case-level access on cause">
            Detailed access to an individual case is available when governance or safeguarding requires it, and is itself logged.
          </FeatureCard>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Governance and audit"
          title="Every group-level action is accountable"
          description="Because education groups carry statutory and reputational responsibility across every school they run, Aurelia records group-level actions with the same rigour as school-level ones."
        />
        <div className="mt-10 flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-6">
          <Landmark className="mt-1 size-6 shrink-0 text-accent-foreground" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Policy changes, escalations into a school's safeguarding case, and any access to
            pupil-level records by a Group Admin are all written to an auditable trail, so a
            group can demonstrate exactly how and why it exercised oversight.
          </p>
        </div>
      </Section>

      <CtaBand
        title="Bring your group onto Aurelia"
        description="We set up group tenancy, policy defaults and School Admin verification together with your team before any school goes live."
      />
    </PublicPage>
  );
}
