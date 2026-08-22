import { Link, createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Building2,
  GraduationCap,
  Newspaper,
  Users,
} from "lucide-react";

import { PublicPage } from "@/components/public/public-page";
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/public/sections";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Aurelia" },
      {
        name: "description",
        content:
          "How to reach Aurelia: separate routes for families, schools, education groups, organisations, press and safeguarding concerns.",
      },
      { property: "og:title", content: "Contact Aurelia" },
      {
        property: "og:description",
        content:
          "Clear, separated enquiry routes for families, schools, education groups, organisations, press and safeguarding.",
      },
      { property: "og:url", content: "/contact" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

type ContactRoute = {
  icon: LucideIcon;
  title: string;
  text: string;
  primary: { label: string; to: string };
};

const routes: ContactRoute[] = [
  {
    icon: Users,
    title: "Families",
    text: "If you are a parent or guardian interested in Aurelia for your child, the fastest route is to start an invitation-based join, or to read how the family experience works before deciding.",
    primary: { label: "Start with families", to: "/for-families" },
  },
  {
    icon: GraduationCap,
    title: "Schools",
    text: "Teachers and school leaders can find out how briefs, verification and safeguarding oversight work for a single school, then request an invitation for their staff and students.",
    primary: { label: "Read the schools overview", to: "/for-schools" },
  },
  {
    icon: Building2,
    title: "Education groups",
    text: "Multi-academy trusts and similar organisations managing several schools should review how oversight and reporting work across sites before onboarding.",
    primary: { label: "Read the education groups overview", to: "/for-education-groups" },
  },
  {
    icon: Building2,
    title: "Organisations",
    text: "Organisations wanting to set challenges or reach young creators responsibly can review how challenges work and what verification is required to publish one.",
    primary: { label: "Read the organisations overview", to: "/for-organisations" },
  },
  {
    icon: Newspaper,
    title: "Press",
    text: "For press enquiries, the about page sets out how Aurelia describes itself, its principles and how it is built — the right starting point before any request for comment.",
    primary: { label: "Read about Aurelia", to: "/about" },
  },
  {
    icon: AlertTriangle,
    title: "Safeguarding",
    text: "If you need to raise a concern about a child's safety on Aurelia, do not wait for a general enquiry response. Use the dedicated safeguarding and reporting route, which is triaged separately.",
    primary: { label: "Report a concern", to: "/safeguarding-and-reporting" },
  },
];

function ContactPage() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="Contact"
        title="Six routes in, each one going to the right place"
        description="Aurelia is invitation-only, so there is no single general enquiry form to fill in. Instead, each audience has a clear starting point, and safeguarding concerns have their own dedicated, faster route."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/auth/join">Join with an invitation</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/safeguarding-and-reporting">Report a safeguarding concern</Link>
            </Button>
          </>
        }
      />

      <Section>
        <SectionHeading
          eyebrow="Why there is no general contact form"
          title="Routing matters more than a single inbox"
          description="A single generic contact form tends to slow down the enquiries that matter most — particularly safeguarding concerns, which need to reach a trained team immediately rather than sit in a shared queue. Instead, each audience below is pointed to the page that answers most first questions and the correct next step to take."
        />
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Enquiry routes"
          title="Find your starting point"
          description="Choose the route that matches who you are. Each one explains what to expect next."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <div
              key={route.title}
              className="brand-card flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6"
            >
              <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <route.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="font-display text-lg tracking-tight">{route.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {route.text}
              </p>
              <Button asChild variant="outline" className="mt-5 w-full">
                <Link to={route.primary.to}>{route.primary.label}</Link>
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Safeguarding comes first"
          title="If in doubt, choose safeguarding"
          description="If you are unsure whether your concern belongs in a general enquiry or a safeguarding report, treat it as a safeguarding matter. Reports are triaged by trained staff, and a report that turns out to be a general question causes no harm — a general enquiry that should have been a safeguarding report can."
        />
        <div className="mt-8">
          <Button asChild size="lg">
            <Link to="/safeguarding-and-reporting">Go to safeguarding and reporting</Link>
          </Button>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Before you start"
          title="What to have ready"
          description="Whichever route applies to you, onboarding moves faster if you already know a little about how Aurelia works."
        />
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Aurelia does not accept open self-registration for children. Families typically join
          through an invitation from a school, education group or organisation already using
          Aurelia, or by requesting one directly. Reading the relevant overview page above before
          you begin will make sure you understand what is being asked of you, and what Aurelia
          asks of the young person in your care.
        </p>
      </Section>

      <CtaBand
        title="Ready to take the next step"
        description="Most enquiries end in the same place: a verified, invitation-based join. Start there, or dig deeper into the page that matches who you are."
      />
    </PublicPage>
  );
}
