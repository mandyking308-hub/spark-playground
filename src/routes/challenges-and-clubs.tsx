import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Ban,
  Building2,
  ClipboardCheck,
  MessageCircleOff,
  ShieldCheck,
  Trophy,
  UserCheck,
  Users2,
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

export const Route = createFileRoute("/challenges-and-clubs")({
  head: () => ({
    meta: [
      { title: "Challenges & Clubs — Aurelia" },
      {
        name: "description",
        content:
          "How challenges and clubs work in Aurelia: challenges set by schools and organisations, guardian-approved submissions, and clubs with named adult supervision — no open messaging or follower counts.",
      },
      { property: "og:title", content: "Challenges & Clubs — Aurelia" },
      {
        property: "og:description",
        content:
          "Purpose to create for, and people to create with — always inside supervised, bounded spaces.",
      },
      { property: "og:url", content: "/challenges-and-clubs" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/challenges-and-clubs" }],
  }),
  component: ChallengesAndClubsPage,
});

const challengeFlow = [
  { step: "01", title: "A brief is set", text: "A verified school, education group or organisation publishes a challenge with a clear brief and deadline." },
  { step: "02", title: "Children respond", text: "Interested children work on a response in the Creator Studio, using drafting and feedback as normal." },
  { step: "03", title: "Guardian approves the entry", text: "As with any shared work, a guardian must approve the submission before it is entered." },
  { step: "04", title: "Named reviewers assess it", text: "Entries are reviewed by identified adults connected to the challenge, not by public voting." },
];

function ChallengesAndClubsPage() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="Challenges & Clubs"
        title="Purpose to create for, and people to create with"
        description="Challenges give a young person a reason to make something and a real audience of adults reviewing it. Clubs give them a small, consistent group to make things alongside — every space with named adult supervision and firm boundaries."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/for-schools">Set a challenge as a school</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/for-organisations">Reach young creators as an organisation</Link>
            </Button>
          </>
        }
      />

      <Section>
        <SectionHeading
          eyebrow="Challenges"
          title="Set by verified schools, groups and organisations"
          description="Every challenge on Aurelia is published by a verified account with a real institutional identity — a school, an education group, or an approved organisation. There is no route for an anonymous or unverified party to set a challenge for children."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <FeatureCard icon={Building2} title="Verified publishers only">
            Challenge briefs can only be published by accounts that have already been through
            Aurelia's verification process for schools, groups or organisations.
          </FeatureCard>
          <FeatureCard icon={ClipboardCheck} title="Clear, bounded briefs">
            A challenge states what is being asked for, who can enter, the deadline, and how
            entries will be reviewed — before a single child sees it.
          </FeatureCard>
          <FeatureCard icon={Trophy} title="Recognition, not ranking">
            A strong entry can lead to a verified achievement in the passport. Aurelia does not
            publish public leaderboards of entrants.
          </FeatureCard>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Submission and review"
          title="From brief to reviewed entry"
          description="A challenge submission follows the same safety rules as any other piece of shared work in Aurelia — nothing skips guardian approval, even under a deadline."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {challengeFlow.map((item) => (
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
        <SectionHeading
          eyebrow="Clubs"
          title="A small, supervised group with a shared interest"
          description="Clubs bring together a bounded group of children around a shared interest — a podcasting club, a nature-writing club, an invention club — always under the direct supervision of a named, accountable adult."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <FeatureCard icon={UserCheck} title="Named adult supervision">
            Every club has a specific, identified adult responsible for it — a teacher, group
            leader or approved supervisor — not an anonymous moderator.
          </FeatureCard>
          <FeatureCard icon={Users2} title="Bounded membership">
            Clubs are limited to members who have been added by a school, group or guardian.
            There is no open, self-service joining of clubs by children.
          </FeatureCard>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Boundaries"
          title="What challenges and clubs deliberately do not include"
          description="The features that make many online communities unsafe for children are simply not present in Aurelia's design."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <CheckList
            items={[
              "No open, unmoderated messaging between children inside a challenge or club.",
              "No public follower counts, friend lists or popularity metrics.",
              "No ability for a child to be added to a club or challenge without an adult's action.",
              "No anonymous accounts participating in review or supervision.",
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FeatureCard icon={MessageCircleOff} title="No open messaging">
              Communication about a project happens through structured feedback tied to the work,
              not free-form chat.
            </FeatureCard>
            <FeatureCard icon={Ban} title="No popularity metrics">
              Aurelia does not surface follower counts or public rankings that could turn
              creativity into a competition for attention.
            </FeatureCard>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Oversight"
          title="Safety does not pause for a deadline"
          description="Even under the time pressure of a challenge, guardian approval, teacher verification and named supervision remain in place. Aurelia does not offer a faster path that skips them."
        />
        <div className="mt-8">
          <ShieldCheck className="size-6 text-accent-foreground" aria-hidden="true" />
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Organisations and schools setting challenges do not gain any ability to bypass a
            family's control over their child's work. Every entry is still the guardian's decision
            to share.
          </p>
        </div>
      </Section>

      <CtaBand
        title="Bring a challenge or club to Aurelia"
        description="Schools, education groups and approved organisations can set challenges. Families and schools can start a supervised club."
        secondary={{ label: "Read the Achievement Passport", to: "/achievement-passport" }}
      />
    </PublicPage>
  );
}
