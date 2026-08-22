import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRightLeft,
  BriefcaseBusiness,
  FolderOpenDot,
  Users,
  UserRoundSearch,
} from "lucide-react";

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
import { Figure, GoldRule, PaperNote, SplitFeature } from "@/components/public/editorial";
import { Button } from "@/components/ui/button";

import alumniPortfolio from "@/assets/alumni-portfolio.jpg";
import adultsCommunity from "@/assets/adults-community.jpg";

export const Route = createFileRoute("/alumni-world")({
  head: () => ({
    meta: [
      { title: "Alumni World — Aurelia" },
      {
        name: "description",
        content:
          "Aurelia's separate 16+ environment: portfolio, opportunities, mentoring and community, entered through a deliberate transition at 16, never an automatic merge.",
      },
      { property: "og:title", content: "Alumni World — Aurelia" },
      {
        property: "og:description",
        content:
          "The separate adult environment members move into at 16 — portfolio, opportunities, mentoring and community.",
      },
      { property: "og:url", content: "/alumni-world" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/alumni-world" }],
  }),
  component: AlumniWorld,
});

const pillars = [
  { icon: FolderOpenDot, title: "Portfolio", text: "Selected Passport achievements and portfolio pieces the member chose to bring forward, plus everything created since — a body of work the alumnus now owns and controls outright." },
  { icon: BriefcaseBusiness, title: "Opportunities", text: "Routes into further study, apprenticeships, early work and accelerator programmes, posted only by opportunity providers Aurelia has verified." },
  { icon: UserRoundSearch, title: "Mentoring", text: "Adult-to-adult mentoring: guidance on a craft, a subject or a career path from verified adults, in a structured and moderated setting." },
  { icon: Users, title: "Community", text: "A community of verified peers at the same stage of life, with discussion appropriate to adults and entirely separate from the under-16 world." },
];

const providers = [
  { icon: GraduationCap, title: "Universities & colleges", text: "Admissions and outreach teams sharing routes, open days and portfolio guidance with 16+ members." },
  { icon: BriefcaseBusiness, title: "Employers", text: "Verified employers posting early-career roles, work experience and insight days appropriate to 16 to 18-year-olds." },
  { icon: Hammer, title: "Apprenticeship providers", text: "Recognised providers listing apprenticeship routes, entry requirements and application windows." },
  { icon: Rocket, title: "Accelerators & programmes", text: "Creative, enterprise and research programmes offering structured places to keep building on their work." },
];

const transition = [
  "The move to Alumni happens at 16, on a schedule the young person and their guardian can see coming in advance.",
  "It is a deliberate, one-way step into a new environment — not an automatic merge of the child account into an adult one.",
  "The young person chooses what carries forward: specifically selected portfolio pieces and Passport achievements, item by item.",
  "Private childhood records — unpublished drafts, wellbeing notes, safeguarding records and family correspondence — never transfer automatically, and are not part of the Alumni account.",
  "Once in the Alumni world, the account is the young person's own, with adult-level control over privacy and sharing.",
  "Alumni membership is an adult status. It never grants access to the under-16 world, to any child's work, or to any child member.",
];


function AlumniWorld() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="Alumni world"
        title="At sixteen, the ink changes"
        description="Aurelia's under-16 world is warm and closely supervised, by design. At 16, members step deliberately out of it into something else entirely — a quieter, more adult space with its own portfolio, opportunities, mentoring and community."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/achievement-passport">See the Achievement Passport</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/parent-community">Parent Alumni continuity</Link>
            </Button>
          </>
        }
      >
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <Figure
            src={alumniPortfolio}
            alt="A young adult presenting a wall of pinned portfolio work to two people"
            width={1280}
            height={960}
            label="Illustrative · Portfolio"
            priority
          />
          <Figure
            src={adultsCommunity}
            alt="Adults talking around a table in a sunlit room"
            width={1280}
            height={960}
            label="Illustrative · Alumni community"
          />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Images are illustrative examples created for Aurelia. They are not member work and do not
          depict identifiable people.
        </p>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="What's inside"
          title="Built for a young adult, not a grown-up child"
          description="The Alumni world keeps the things worth keeping from the under-16 experience — verified achievement, a real body of work — and adds what a 16 to 18-year-old actually needs next."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {pillars.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section tone="ink">
        <SplitFeature
          image={
            <div className="space-y-4">
              <Figure
                src={alumniPortfolio}
                alt="A young adult standing in front of a wall of pinned portfolio work"
                width={1280}
                height={960}
                label="A body of work, finally theirs to show"
              />
              <PaperNote tone="paper" className="text-ink border-ink-foreground/20">
                Nothing carries over that the member didn't choose. Alumni pick which pieces from
                their Passport travel with them into the new portfolio — this is not a data export,
                it's a curated first exhibition.
              </PaperNote>
            </div>
          }
        >
          <Eyebrow>The transition at 16</Eyebrow>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            A deliberate step, not an automatic merge
          </h2>
          <GoldRule className="mt-6 w-24" />
          <p className="mt-5 text-base leading-relaxed text-ink-foreground/75">
            Aurelia treats the move from the under-16 world to the Alumni world as a genuine
            transition, with its own moment and its own consent — not a background account
            upgrade.
          </p>
          <ul className="mt-8 space-y-4">
            {transition.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-foreground/80">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SplitFeature>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Why the separation matters"
          title="Two different worlds need two different rules"
          description="The safeguards that protect an 11-year-old — no open messaging, no public profile, guardian approval on everything — would be the wrong fit for a 17-year-old preparing for further study or early work. Rather than compromise either group, Aurelia keeps the environments entirely separate."
        />
        <div className="mt-10 flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-6">
          <ArrowRightLeft className="mt-1 size-6 shrink-0 text-accent-foreground" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            There is no shared social surface between the two worlds. An Alumni member cannot see
            or contact current under-16 users, and the reverse is also true, regardless of family
            connection.
          </p>
        </div>
      </Section>

      {/* Verified opportunity providers */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Opportunities"
          title="Every opportunity provider is verified before it can post"
          description="Universities, employers, apprenticeship providers and programme organisers are verified as institutions before an opportunity reaches a single Alumni member. What appears here is checked, not scraped or syndicated."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {providers.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.text}
            </FeatureCard>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Opportunity providers operate in the 16+ environment only. Verification as a provider
          gives an organisation no visibility of, or route to, any under-16 member of Aurelia.
        </p>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Community and mentoring"
          title="Adult community, adult-to-adult mentoring"
          description="The Alumni community operates under moderation appropriate to its members' age — open discussion, direct connection between verified peers, and mentoring between adults — while still holding to Aurelia's standards of conduct and respect."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <FeatureCard icon={UserRoundSearch} title="Mentoring is adult to adult">
            Mentors are verified adults working with members aged 16 and over. There is no
            mentoring relationship between an adult and an under-16 member anywhere on Aurelia.
          </FeatureCard>
          <FeatureCard icon={Lock} title="Alumni status unlocks nothing below 16">
            Being an Alumni member — or a mentor, or an opportunity provider within it — never
            grants any access to the under-16 environment or to a child's work.
          </FeatureCard>
        </div>
      </Section>


      <Section>
        <SectionHeading
          eyebrow="For families"
          title="Parents keep continuity, not access"
          description="A parent whose child moves into the Alumni world can stay connected to the wider Aurelia parent community through Parent Alumni, but the Alumni account itself belongs to the young person, with adult-level privacy from that point on."
        />
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/parent-community">Read about Parent Alumni</Link>
          </Button>
        </div>
      </Section>

      <CtaBand
        title="Approaching 16 on Aurelia?"
        description="Families and Alumni-to-be can find out what to expect from the transition well before it happens."
      />
    </PublicPage>
  );
}
