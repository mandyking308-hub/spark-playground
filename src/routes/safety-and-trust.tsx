import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  Lock,
  Users2,
  Split,
  Eye,
  ClipboardList,
  Siren,
  Bot,
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

export const Route = createFileRoute("/safety-and-trust")({
  head: () => ({
    meta: [
      { title: "Safety & Trust — Aurelia" },
      {
        name: "description",
        content:
          "How Aurelia designs protection into every layer: invitation-only onboarding, guardian approval, database-enforced permissions, separated age worlds and human moderation.",
      },
      { property: "og:title", content: "Safety & Trust — Aurelia" },
      {
        property: "og:description",
        content:
          "How protection is designed into Aurelia from onboarding through to moderation, audit trails and incident response.",
      },
      { property: "og:url", content: "/safety-and-trust" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/safety-and-trust" }],
  }),
  component: SafetyAndTrust,
});

const foundations = [
  {
    icon: Users2,
    title: "Invitation-only onboarding",
    text: "There is no open self-registration for children. Every child joins through a verified parent/guardian or school invitation, so we know who is bringing a child onto the platform before an account exists.",
  },
  {
    icon: ShieldCheck,
    title: "Guardian approval",
    text: "A guardian must approve a child's account and must approve before any piece of work leaves the family and becomes visible to a class, club or wider audience.",
  },
  {
    icon: Lock,
    title: "Database-enforced permissions",
    text: "Who can see what is not a setting in the interface that a bug could bypass. Permissions are enforced with row-level security in the database itself, so access control holds even if a screen is built incorrectly.",
  },
  {
    icon: Split,
    title: "Separated age worlds",
    text: "The under-16 environment and the 16+ alumni environment are separate by design. There is no shared social surface, messaging channel or discovery feed connecting the two.",
  },
];

const moderation = [
  "Work intended for wider sharing passes through review before it becomes visible beyond the family or class.",
  "Trained staff, not automated filters alone, make the final call on borderline or reported content.",
  "Clubs and challenges carry named adult supervision rather than open, unmoderated interaction.",
  "Every account has clear, accessible routes to report a concern about content or conduct.",
];

const accountability = [
  {
    icon: ClipboardList,
    title: "Audit trails",
    text: "Sensitive actions — approvals, publications, permission changes, access to a child's data — are written to an auditable trail so decisions can be reviewed after the fact, not just trusted in the moment.",
  },
  {
    icon: Siren,
    title: "Incident response",
    text: "Safeguarding and security concerns follow a defined path: triage, investigation, containment and, where appropriate, escalation to guardians, schools or the relevant authorities.",
  },
  {
    icon: Eye,
    title: "Human review",
    text: "Automated checks flag possible issues, but decisions that affect a child's account, work or safety are made or confirmed by a person with safeguarding responsibility.",
  },
  {
    icon: Bot,
    title: "Bounded AI",
    text: "AI assistance is age-banded, limited in scope and always labelled, so it supports a young person's thinking without acting unsupervised on their behalf or their data.",
  },
];

function SafetyAndTrust() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="Safety & Trust"
        title="Protection is the architecture, not a policy page"
        description="Aurelia was designed child-safe from the first database table upwards. This page explains, in plain terms, how that protection actually works — not just what we promise."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/report-concern">Report a concern</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/for-families">For families</Link>
            </Button>
          </>
        }
      />

      <Section>
        <SectionHeading
          eyebrow="The foundations"
          title="Four decisions that shape everything else"
          description="These are structural choices, not optional settings. They apply to every account, every piece of work and every interaction on the platform."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {foundations.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Moderation"
            title="Review by people, not just filters"
            description="Automated tools help us spot potential issues quickly, but the final decisions about what is shared and how concerns are handled sit with trained people who carry that responsibility."
          />
          <CheckList items={moderation} />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Accountability"
          title="How we stay honest about what happens"
          description="Trust is easier to claim than to demonstrate. These are the mechanisms that let decisions be checked, questioned and improved over time."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {accountability.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Read more"
          title="Related pages"
          description="Safety touches every part of Aurelia. These pages go into more detail on specific areas."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/safeguarding-and-reporting">Safeguarding & reporting</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/ai-and-children">AI and children</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/privacy-policy">Privacy policy</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/community-standards">Community standards</Link>
          </Button>
        </div>
      </Section>

      <CtaBand
        title="Bring Aurelia to your family or school"
        description="Aurelia is invitation-only. Tell us who you are and we will guide you through verified onboarding."
      />
    </PublicPage>
  );
}
