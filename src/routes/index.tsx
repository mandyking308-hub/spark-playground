import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Baby,
  Bot,
  Building2,
  GraduationCap,
  Users,
  Mic,
  Palette,
  Puzzle,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wand2,
  Globe2,
  Lock,
  ScrollText,
} from "lucide-react";

import { AureliaMark } from "@/components/brand/aurelia-logo";
import { PublicPage } from "@/components/public/public-page";
import {
  CheckList,
  CtaBand,
  Eyebrow,
  FeatureCard,
  Section,
  SectionHeading,
} from "@/components/public/sections";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurelia — Create. Learn. Achieve. Safely." },
      {
        name: "description",
        content:
          "Aurelia is a protected global world where under-16s create, learn and earn verified achievements — with guardian approval, school verification and a separate 16+ alumni environment.",
      },
      { property: "og:title", content: "Aurelia — Create. Learn. Achieve. Safely." },
      {
        property: "og:description",
        content:
          "A protected global creation, learning and achievement world for under-16s, with a separate 16+ alumni environment.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Aurelia",
          url: "/",
          description:
            "A protected global creation, learning and achievement world for under-16s, with a separate 16+ alumni environment.",
        }),
      },
    ],
  }),
  component: Home,
});

const pillars = [
  { icon: Sparkles, title: "Create", text: "Make podcasts, shows, films, art, writing, games and inventions in a studio built for young makers." },
  { icon: GraduationCap, title: "Learn", text: "Structured pathways and school briefs that connect creativity to real curriculum outcomes." },
  { icon: Wand2, title: "Make", text: "Turn ideas into finished work with drafting, iteration and constructive feedback built in." },
  { icon: Globe2, title: "Discover", text: "Explore curated work from peers worldwide inside age-appropriate, moderated spaces." },
  { icon: Trophy, title: "Achieve", text: "Earn recognition that is verified by adults who actually witnessed the work." },
];

const studio = [
  { icon: Mic, title: "Podcasts & shows", text: "Record, structure and publish audio and video with approval before anything leaves the family." },
  { icon: Palette, title: "Art, writing & film", text: "Creative projects with drafts, revisions and evidence of the thinking behind the outcome." },
  { icon: Puzzle, title: "Games & inventions", text: "Build, prototype and document inventions, then submit them to challenges and clubs." },
];

const safety = [
  "Invitation-only onboarding — there is no open self-registration for children.",
  "Guardian approval is required before a child's work can be published or shared.",
  "Row-level security enforces every permission in the database, not in the browser.",
  "Under-16 and 16+ environments are separated by design, with no shared social surface.",
  "Every sensitive action is written to an auditable safeguarding trail.",
  "AI assistance is bounded, age-banded and always labelled as assisted authorship.",
];

const audiences = [
  { icon: Baby, title: "Children", text: "A protected place to make things that matter and build a record of it.", to: "/for-families" },
  { icon: Users, title: "Parents & guardians", text: "Real control over publication, sharing, contact and data.", to: "/for-families" },
  { icon: GraduationCap, title: "Teachers", text: "Set briefs, review work and verify genuine achievement.", to: "/for-schools" },
  { icon: Building2, title: "Schools & groups", text: "Safeguarding, oversight and reporting across classes and sites.", to: "/for-education-groups" },
  { icon: Award, title: "Organisations", text: "Reach young creators through verified, bounded challenges.", to: "/for-organisations" },
  { icon: ScrollText, title: "16+ Alumni", text: "A separate adult world for portfolio, work and mentoring.", to: "/alumni-world" },
];

const passportSteps = [
  { step: "01", title: "The child creates", text: "Work is produced inside Aurelia with drafts and evidence attached." },
  { step: "02", title: "A guardian approves", text: "Nothing is shared beyond the family without explicit guardian consent." },
  { step: "03", title: "A teacher verifies", text: "A verified educator confirms the skill, effort or contribution demonstrated." },
  { step: "04", title: "The passport records it", text: "The achievement becomes durable, portable evidence the young person keeps." },
];

const trustSignals = [
  { icon: Lock, title: "Privacy by design", text: "Minimal data, purpose limits and enforced retention windows." },
  { icon: ShieldCheck, title: "Safeguarding first", text: "Clear reporting routes, case handling and escalation paths." },
  { icon: Bot, title: "Bounded AI", text: "Assistance that supports thinking rather than replacing authorship." },
];

function Home() {
  return (
    <PublicPage>
      {/* 1 — Hero */}
      <section className="brand-dawn border-b border-border/70">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-8 sm:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Badge variant="secondary" className="mb-5 rounded-full px-3 py-1">
                Invitation-only · Built for under-16s
              </Badge>
              <h1 className="max-w-3xl font-display text-4xl leading-[1.06] tracking-tight sm:text-6xl">
                Create. Learn. Achieve.{" "}
                <span className="text-accent-foreground">Safely.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Aurelia is a protected global world where young people under 16 make real work,
                develop real skills and earn achievements that adults have genuinely verified — with
                a separate environment for members aged 16 and over.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/auth/join">Join with an invitation</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/safety-and-trust">See how safety works</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Children join through a verified parent/guardian or school invitation.{" "}
                <Link to="/for-schools" className="font-medium text-foreground underline underline-offset-4">
                  Schools start here
                </Link>
                .
              </p>
            </div>

            <div className="brand-card relative rounded-3xl border border-border/70 bg-card p-8">
              <AureliaMark className="size-14" title="Aurelia" />
              <p className="mt-6 font-display text-xl leading-snug tracking-tight">
                A child's achievement should be witnessed, verified and theirs to keep.
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6">
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Ages</dt>
                  <dd className="mt-1 font-display text-2xl tracking-tight">Under 16</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Alumni</dt>
                  <dd className="mt-1 font-display text-2xl tracking-tight">16+</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Onboarding</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">Verified invitation only</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Publication</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">Guardian approved</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Pillars */}
      <Section>
        <SectionHeading
          eyebrow="The five pillars"
          title="Create. Learn. Make. Discover. Achieve."
          description="Every part of Aurelia serves one of five things a young person is here to do — and each one is protected by the same safety architecture."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map((pillar) => (
            <FeatureCard key={pillar.title} icon={pillar.icon} title={pillar.title}>
              {pillar.text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      {/* 3 — Safety promise */}
      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Safety promise"
            title="Protection is the architecture, not a policy page."
            description="Aurelia was built child-safe from the first table upwards. Permissions live in the database, publication requires guardian consent, and the adult and child worlds never merge."
          />
          <CheckList items={safety} />
        </div>
        <div className="mt-10">
          <Button asChild variant="outline">
            <Link to="/safety-and-trust">Read the full safety model</Link>
          </Button>
        </div>
      </Section>

      {/* 4 — Creator studio */}
      <Section>
        <SectionHeading
          eyebrow="Creator Studio"
          title="A studio built for young makers"
          description="Real creative tools with age-appropriate guardrails, so the work is genuinely the child's own."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {studio.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.text}
            </FeatureCard>
          ))}
        </div>
        <div className="mt-8">
          <Button asChild variant="ghost">
            <Link to="/creator-studio">Explore the Creator Studio →</Link>
          </Button>
        </div>
      </Section>

      {/* 5 — Achievement Passport */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Achievement Passport"
          title="Recognition that someone actually stands behind"
          description="Achievements in Aurelia are not automatic badges. They are verified by adults who witnessed the work, and they belong to the young person."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {passportSteps.map((item) => (
            <li
              key={item.step}
              className="rounded-2xl border border-border/70 bg-card p-6"
            >
              <span className="font-display text-sm tracking-[0.2em] text-accent-foreground">
                {item.step}
              </span>
              <h3 className="mt-3 font-display text-lg tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/achievement-passport">How verification works</Link>
          </Button>
        </div>
      </Section>

      {/* 6 — Audiences */}
      <Section>
        <SectionHeading
          eyebrow="Who Aurelia is for"
          title="Six roles, six deliberately separated workspaces"
          description="Each role sees exactly what it needs — and nothing it does not."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((audience) => (
            <Link key={audience.title} to={audience.to} className="group block">
              <FeatureCard icon={audience.icon} title={audience.title} className="h-full">
                {audience.text}
              </FeatureCard>
            </Link>
          ))}
        </div>
      </Section>

      {/* 7 — Challenges & clubs */}
      <Section tone="muted">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Challenges & Clubs"
            title="Purpose to create for, and people to create with"
            description="Challenges give young people a reason to make something. Clubs give them a small, supervised group to make it with — always with adult oversight and bounded membership."
          />
          <CheckList
            items={[
              "Challenges set by verified schools, groups and organisations.",
              "Small clubs with named adult supervision and clear boundaries.",
              "No open messaging, no follower counts, no public popularity metrics.",
              "Submissions inherit the same guardian approval rules as all work.",
            ]}
          />
        </div>
        <div className="mt-10">
          <Button asChild variant="outline">
            <Link to="/challenges-and-clubs">See challenges and clubs</Link>
          </Button>
        </div>
      </Section>

      {/* 8 — AI */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="AI and children"
            title="Assistance with a boundary around it"
            description="AI in Aurelia helps a young person think, plan and improve — it does not do the work for them, and it never pretends the output is unassisted."
          />
          <CheckList
            items={[
              "Age-banded capability: what is available at 8 is not what is available at 15.",
              "Authorship labelling so verification stays honest.",
              "Guardians and schools can restrict or disable assistance entirely.",
              "No child data is used to train third-party models.",
            ]}
          />
        </div>
        <div className="mt-10">
          <Button asChild variant="outline">
            <Link to="/ai-and-children">Read the AI position</Link>
          </Button>
        </div>
      </Section>

      {/* 9 — Alumni */}
      <Section tone="muted">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="16+ Alumni"
            title="A separate world for growing up"
            description="At 16, members move into a distinct adult environment with its own rules, portfolio, opportunities and mentoring — and no social surface shared with the under-16 world."
          />
          <CheckList
            items={[
              "A deliberate transition, not an automatic merge of accounts.",
              "Portfolio and Achievement Passport carry forward with the member.",
              "Opportunities, mentoring and community designed for adults.",
              "Parent Alumni gives families continuity without child-world access.",
            ]}
          />
        </div>
        <div className="mt-10">
          <Button asChild variant="outline">
            <Link to="/alumni-world">Explore the Alumni world</Link>
          </Button>
        </div>
      </Section>

      {/* 10 — Trust signals */}
      <Section>
        <SectionHeading
          eyebrow="Trust"
          title="Built to be inspected"
          align="center"
          description="We would rather explain exactly how Aurelia protects children than ask anyone to take it on trust."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {trustSignals.map((signal) => (
            <FeatureCard key={signal.title} icon={signal.icon} title={signal.title}>
              {signal.text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      {/* 11 — Reporting */}
      <Section tone="muted">
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Safeguarding</Eyebrow>
            <h2 className="mt-2 font-display text-2xl tracking-tight">
              Worried about something you have seen?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Anyone — child, parent, teacher or member of the public — can raise a safeguarding
              concern. Reports are triaged by trained staff with clear escalation routes.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/report-concern">Report a concern</Link>
          </Button>
        </div>
      </Section>

      {/* 12 — Closing CTA */}
      <CtaBand
        title="Bring Aurelia to your family, school or organisation"
        description="Aurelia is invitation-only. Tell us who you are and we will guide you through verified onboarding."
      />
    </PublicPage>
  );
}
