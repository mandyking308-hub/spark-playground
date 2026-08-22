import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Baby,
  Bot,
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
  Eyebrow,
  FeatureCard,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/public/sections";
import { Figure, GoldRule, SplitFeature } from "@/components/public/editorial";
import { Button } from "@/components/ui/button";
import { compareModel } from "@/data/ideas-resources";

import adultsCommunity from "@/assets/adults-community.jpg";
import passportEvidence from "@/assets/passport-evidence.jpg";

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

const holds = [
  {
    icon: Baby,
    title: "Invitation-only under-16 onboarding",
    text: "There is no open self-registration for children. Every child joins through a verified parent/guardian or through a verified school invitation.",
  },
  {
    icon: GraduationCap,
    title: "Verified achievement",
    text: "Achievements are never awarded automatically. They are confirmed through an accountable verified workflow; in the live school flow, a verified teacher reviews the evidence behind the work before it is recorded.",
  },
  {
    icon: Users,
    title: "No popularity metrics",
    text: "No follower counts, no likes, no leaderboards. A young person's standing here is never a number other people gave them.",
  },
  {
    icon: Bot,
    title: "Bounded AI, labelled authorship",
    text: "AI assistance is age-banded and limited in scope, and it is always labelled, so it is always clear what a young person made themselves.",
  },
  {
    icon: Database,
    title: "Minimal data, no behavioural targeting",
    text: "Aurelia collects what it needs to operate safely and nothing more. Children are never profiled or targeted based on behaviour.",
  },
  {
    icon: Layers,
    title: "A separate 16+ environment",
    text: "The under-16 world and the 16+ alumni environment are genuinely separate spaces, with no shared social surface between them.",
  },
];

const brandFacts = [
  { label: "Product", value: "Aurelia" },
  { label: "What it is", value: "A protected global creation, learning and achievement platform for under-16s, with a separate 16+ alumni environment." },
  { label: "Who it is for", value: "Families, schools, education groups and organisations, alongside the young people at the centre of it." },
  { label: "Age model", value: "Under-16 and 16+ are structurally separate environments, with no shared social surface between them." },
  { label: "Onboarding model", value: "Invitation-only for under-16s, via a verified parent/guardian or a verified school. There is no open self-registration for children." },
  { label: "Creation", value: "The Creator Studio, where children make podcasts, films, stories, artwork, inventions and games — private by default." },
  { label: "Recognition", value: "The Achievement Passport: evidence-backed achievements confirmed through an accountable verified workflow rather than awarded automatically." },
  { label: "Roles", value: "Verified roles — child, parent/guardian, teacher, school admin, education group admin and 16+ alumni — with distinct permissions." },
  { label: "What it does not have", value: "No follower counts, no likes, no popularity ranking and no public directory of children." },
  { label: "Contact route", value: "/contact-enquiry" },
  { label: "Reporting route", value: "/report-concern" },

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
              <Link to="/contact-enquiry">Get in touch</Link>
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
            eyebrow="Our mission"
            title="Creativity and recognition without the usual trade-offs"
            description="Most platforms built for creativity, community or gamified achievement were designed for adults first, with child safety added afterwards as a layer of restrictions. Aurelia starts from the opposite direction: it asks what a genuinely safe environment for a child looks like, and only then builds the creative and recognition tools inside it."
          />
        </div>
      </Section>

      <Section tone="muted">
        <SplitFeature
          image={
            <Figure
              src={adultsCommunity}
              alt="Adults talking around a table in a sunlit room"
              width={1280}
              height={960}
              label="Why Aurelia exists"
            />
          }
        >
          <Eyebrow>Why Aurelia exists</Eyebrow>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            We think a child's creativity deserves better than a feed
          </h2>
          <GoldRule className="mt-6 w-20" />
          <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              We kept noticing the same gap: children are natural makers, but almost everywhere
              they go online to share that making, the platform is really built to hold their
              attention rather than to develop their skill.
            </p>
            <p>
              So we built something with a different starting question. Not "how do we keep them
              here longer", but "how do we help a young person finish something real, get honest
              feedback from an adult who cares, and walk away with proof of what they can do".
            </p>
            <p>
              That question is why the boundaries are non-negotiable, not a compromise we made
              along the way.
            </p>
          </div>
        </SplitFeature>
      </Section>

      <Section>
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

      <Section tone="muted">
        <SectionHeading
          eyebrow="The principles Aurelia holds"
          title="Six commitments that do not move"
          description="Whatever else changes as Aurelia grows, these hold."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {holds.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section>
        <SplitFeature
          reverse
          image={
            <Figure
              src={passportEvidence}
              alt="An achievement certificate with a gold seal over a project timeline"
              width={1280}
              height={960}
              label="Verified achievement"
              caption="Illustrative representation of verified achievement and its evidence trail."
            />
          }
        >
          <SectionHeading
            eyebrow="How it is built"
            title="Safety-first architecture, not a safety-first policy"
            description="Aurelia's safety commitments are backed by how the platform is actually built, not only by what its policies say."
          />
          <div className="mt-8">
            <CheckList
              items={[
                "Permissions are enforced in the database through row-level security, not only in the interface.",
                "Under-16 and 16+ environments run as genuinely separate spaces, not the same space with a toggle.",
                "Publication of a child's work always requires explicit guardian approval before it leaves the family.",
                "Safeguarding reports are triaged and escalated by trained processes, not left to community moderation alone.",
                "AI assistance is bounded, age-banded and labelled rather than open-ended.",
              ]}
            />
          </div>
        </SplitFeature>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Who it serves"
          title="Four groups, one shared standard of care"
          description="Aurelia is built for the people directly responsible for a child's safety and development, as well as for the child themselves."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon={Users} title="Families">
            Parents and guardians who want their child to create and be recognised for real work, with genuine oversight.
          </FeatureCard>
          <FeatureCard icon={GraduationCap} title="Schools">
            Teachers who want to set meaningful briefs and verify achievement without taking on unmanaged risk.
          </FeatureCard>
          <FeatureCard icon={Building2} title="Education groups">
            Multi-school organisations that need consistent safeguarding and oversight across many sites.
          </FeatureCard>
          <FeatureCard icon={Database} title="Organisations">
            Bodies that want to reach young creators responsibly, through verified challenges rather than open access.
          </FeatureCard>
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

      <Section id="compare" tone="muted">
        <SectionHeading
          eyebrow="Compare the model"
          title="How this differs from the two places children already are"
          description="A measured comparison of design intent — an ordinary social platform, an ordinary school portal, and Aurelia. No products are named, and this describes how each model is typically designed rather than any specific service."
        />
        <div className="mt-10 overflow-x-auto rounded-2xl border border-border/70 bg-card">
          <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Comparison of ordinary social media, an ordinary school portal and Aurelia across
              purpose, child identity, adult access, feedback, achievement, AI, data and turning 16.
            </caption>
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th scope="col" className="px-5 py-4 font-display text-sm tracking-tight">
                  Dimension
                </th>
                <th scope="col" className="px-5 py-4 font-display text-sm tracking-tight">
                  Ordinary social media
                </th>
                <th scope="col" className="px-5 py-4 font-display text-sm tracking-tight">
                  Ordinary school portal
                </th>
                <th scope="col" className="px-5 py-4 font-display text-sm tracking-tight text-foreground">
                  Aurelia
                </th>
              </tr>
            </thead>
            <tbody>
              {compareModel.map((row) => (
                <tr key={row.dimension} className="border-b border-border/60 last:border-0">
                  <th scope="row" className="px-5 py-4 align-top font-medium text-foreground">
                    {row.dimension}
                  </th>
                  <td className="px-5 py-4 align-top text-muted-foreground">{row.social}</td>
                  <td className="px-5 py-4 align-top text-muted-foreground">{row.portal}</td>
                  <td className="bg-gold-soft/40 px-5 py-4 align-top text-foreground">
                    {row.aurelia}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Brand facts" title="Aurelia, in plain terms" />
        <dl className="mt-10 grid gap-6 sm:grid-cols-2">
          {brandFacts.map((fact) => (
            <div key={fact.label} className="rounded-2xl border border-border/70 bg-card p-6">
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {fact.label}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-foreground">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <CtaBand
        title="Tell us who you are"
        description="Whether you are a family, a school, an education group or an organisation, there is a clear route to get started with Aurelia."
        secondary={{ label: "See enquiry routes", to: "/contact-enquiry" }}
      />
    </PublicPage>
  );
}
