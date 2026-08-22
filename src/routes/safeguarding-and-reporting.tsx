import { Link, createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  FileText,
  Lock,
  MessageSquareWarning,
  Search,
  ShieldAlert,
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

export const Route = createFileRoute("/safeguarding-and-reporting")({
  head: () => ({
    meta: [
      { title: "Safeguarding & Reporting — Aurelia" },
      {
        name: "description",
        content:
          "How to raise a safeguarding concern on Aurelia, what happens after a report, and what to do if a child is in immediate danger.",
      },
      { property: "og:title", content: "Safeguarding & Reporting — Aurelia" },
      {
        property: "og:description",
        content:
          "How anyone can raise a concern on Aurelia, how reports are triaged and escalated, and where to turn in an emergency.",
      },
      { property: "og:url", content: "/safeguarding-and-reporting" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/safeguarding-and-reporting" }],
  }),
  component: SafeguardingAndReporting,
});

const process = [
  {
    step: "01",
    title: "Triage",
    text: "Every report is read by a trained member of staff within a short, defined window. It is categorised by urgency and type before anything else happens.",
  },
  {
    step: "02",
    title: "Review",
    text: "The relevant material — the content, account history and context — is reviewed. Where needed, we contact the reporter, the guardian involved, or a school for further information.",
  },
  {
    step: "03",
    title: "Escalation",
    text: "Concerns that indicate risk of harm are escalated beyond the platform to guardians, schools or the appropriate authorities, following our internal safeguarding procedures.",
  },
  {
    step: "04",
    title: "Resolution & follow-up",
    text: "Action is taken on the account or content as required, and, where appropriate, the reporter is told the concern was received and acted upon.",
  },
];

const include = [
  "What you saw or experienced, in as much detail as you can give.",
  "When and where it happened on the platform, if you remember.",
  "Any usernames, links or screenshots that help us find the material quickly.",
  "How to reach you, if you are comfortable sharing that, so we can follow up.",
];

function SafeguardingAndReporting() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="Safeguarding & Reporting"
        title="If something feels wrong, tell us"
        description="Anyone — a child, a parent, a teacher, or a member of the public — can raise a safeguarding concern about Aurelia. This page explains how to do that, what happens next, and where to turn if a child is in immediate danger."
        actions={
          <Button asChild size="lg">
            <Link to="/contact">Report a concern</Link>
          </Button>
        }
      />

      <Section tone="ink">
        <div className="flex flex-col gap-6 rounded-2xl border border-ink-foreground/20 bg-ink-foreground/5 p-8 sm:flex-row sm:items-start">
          <AlertTriangle className="mt-1 size-8 shrink-0 text-gold" aria-hidden="true" />
          <div>
            <h2 className="font-display text-2xl tracking-tight">
              If a child is in immediate danger
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-foreground/80">
              Do not wait for a response from us. Contact your local emergency services
              straight away. If you are worried about a child's safety more broadly, your
              national child-protection helpline can also give immediate advice, and you can
              still tell us so we can act on our side of the platform. Reporting to us is a
              complement to emergency and child-protection services, never a substitute for them.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="How to raise a concern"
          title="Anyone can report, at any time"
          description="You do not need to have an Aurelia account to raise a concern about the platform, a piece of content or someone's conduct on it. Reports can come from children, parents, teachers, or members of the public who have come across something worrying."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <FeatureCard icon={MessageSquareWarning} title="Inside the platform">
            Signed-in members can report content, messages or accounts directly from where they encounter them.
          </FeatureCard>
          <FeatureCard icon={FileText} title="Through our contact route">
            Anyone, including people without an account, can raise a concern through our contact page.
          </FeatureCard>
          <FeatureCard icon={ShieldAlert} title="Via a school or organisation">
            Teachers and school safeguarding leads can also escalate concerns through their own institution's channels.
          </FeatureCard>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="What happens next"
          title="Triage, review, escalation"
          description="Every report follows the same basic path, though the speed and depth of response depends on the level of risk involved."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {process.map((item) => (
            <li key={item.step} className="rounded-2xl border border-border/70 bg-card p-6">
              <span className="font-display text-sm tracking-[0.2em] text-accent-foreground">
                {item.step}
              </span>
              <h3 className="mt-3 font-display text-lg tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="What to include"
            title="Details that help us act quickly"
            description="You do not need everything on this list before you report — tell us what you know, and we will ask follow-up questions if needed."
          />
          <CheckList items={include} />
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Confidentiality"
            title="Your report is handled carefully"
            description="We treat every safeguarding report as sensitive information."
          />
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <Lock className="mt-1 size-5 shrink-0 text-accent-foreground" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Access to a report is limited to the people who need it to investigate and act on it. We do not share
                a reporter's identity with the person they have reported except where we are legally required to, or
                where it is necessary to protect a child from harm.
              </p>
            </div>
            <div className="flex gap-3">
              <Search className="mt-1 size-5 shrink-0 text-accent-foreground" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                You can report anonymously, though giving us a way to reach you helps us ask follow-up questions and
                let you know the outcome where appropriate.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Concerned about something you have seen on Aurelia"
        description="Tell us what happened. Reports are read by trained staff and acted on according to our safeguarding process."
        primary={{ label: "Report a concern", to: "/contact" }}
        secondary={{ label: "Read our safety model", to: "/safety-and-trust" }}
      />
    </PublicPage>
  );
}
