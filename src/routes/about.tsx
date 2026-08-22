import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Database,
  GraduationCap,
  Layers,
  Lock,
  ShieldCheck,
  Users,
} from "lucide-react";

import { AureliaMark } from "@/components/brand/aurelia-logo";
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

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Aurelia" },
      {
        name: "description",
        content:
          "Why Aurelia exists, the principles it is built on, how its safety-first architecture works, and who it serves — families, schools, education groups and organisations.",
      },
      { property: "og:title", content: "About Aurelia" },
      {
        property: "og:description",
        content:
          "A protected global creation, learning and achievement world for under-16s, built safety-first from the ground up.",
      },
      { property: "og:url", content: "/about" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const principles = [
  { icon: ShieldCheck, title: "Safety before features", text: "No feature ships unless it can be made safe for a child first. If a safe version is not possible, the feature does not ship." },
  { icon: Lock, title: "Guardians stay in control", text: "A family's authority over what their child creates, shares and is contacted about is never quietly reduced by a product decision." },
  { icon: GraduationCap, title: "Verification means something", text: "Recognition is only meaningful if a real, accountable adult stands behind it. Aurelia does not automate that judgement away." },
  { icon: Layers, title: "Separation by design", text: "Under-16 and 16+ worlds, and the roles within them, are kept structurally apart rather than relying on settings alone." },
];

const architecture = [
  "Permissions are enforced in the database through row-level security, not only in the interface.",
  "Under-16 and 16+ environments run as genuinely separate spaces, not the same space with a toggle.",
  "Publication of a child's work always requires explicit guardian approval before it leaves the family.",
  "Safeguarding reports are triaged and escalated by trained processes, not left to community moderation alone.",
  "AI assistance is bounded, age-banded and labelled rather than open-ended.",
];

const audiences = [
  { icon: Users, title: "Families", text: "Parents and guardians who want their child to create and be recognised for real work, with genuine oversight." },
  { icon: GraduationCap, title: "Schools", text: "Teachers who want to set meaningful briefs and verify achievement without taking on unmanaged risk." },
  { icon: Building2, title: "Education groups", text: "Multi-school organisations that need consistent safeguarding and oversight across many sites." },
  { icon: Database, title: "Organisations", text: "Bodies that want to reach young creators responsibly, through verified challenges rather than open access." },
];

function AboutPage() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="About Aurelia"
        title="A protected world, built for how children actually create"
        description="Aurelia exists because young people deserve a place to make real work, develop real skills and be recognised for genuine achievement — without the risks that come with open social platforms built for adults."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/safety-and-trust">See how safety works</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Get in touch</Link>
            </Button>
          </>
        }
      />

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="brand-card rounded-3xl border border-border/70 bg-card p-8">
            <AureliaMark className="size-14" title="Aurelia" />
            <p className="mt-6 font-display text-xl leading-snug tracking-tight">
              A child's achievement should be witnessed, verified and theirs to keep.
            </p>
          </div>
          <SectionHeading
            eyebrow="Why Aurelia exists"
            title="Creativity and recognition without the usual trade-offs"
            description="Most platforms built for creativity, community or gamified achievement were designed for adults first, with child safety added afterwards as a layer of restrictions. Aurelia starts from the opposite direction: it asks what a genuinely safe environment for a child looks like, and only then builds the creative and recognition tools inside it."
          />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Principles"
          title="What Aurelia is built on"
          description="These principles shape every product decision, from the smallest interface detail to the structure of the database."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {principles.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="How it is built"
          title="Safety-first architecture, not a safety-first policy"
          description="Aurelia's safety commitments are backed by how the platform is actually built, not only by what its policies say."
        />
        <div className="mt-10">
          <CheckList items={architecture} />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Who it serves"
          title="Four groups, one shared standard of care"
          description="Aurelia is built for the people directly responsible for a child's safety and development, as well as for the child themselves."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Beyond 16"
          title="A platform that grows with a young person"
          description="Aurelia does not end abruptly at 16. Members transition into a separate alumni environment, taking their Achievement Passport with them, so the record they built as a child continues to have value into early adulthood."
        />
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/alumni-world">Explore the alumni world</Link>
          </Button>
        </div>
      </Section>

      <CtaBand
        title="Tell us who you are"
        description="Whether you are a family, a school, an education group or an organisation, there is a clear route to get started with Aurelia."
        secondary={{ label: "See enquiry routes", to: "/contact" }}
      />
    </PublicPage>
  );
}
