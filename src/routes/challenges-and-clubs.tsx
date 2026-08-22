import { Link, createFileRoute } from "@tanstack/react-router";
import {
  AtSign,
  Ban,
  Building2,
  ClipboardCheck,
  Eye,
  EyeOff,
  ListOrdered,
  MessageCircleOff,
  ShieldCheck,
  Trophy,
  UserCheck,
  UserRoundX,
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
import {
  DetailCard,
  Figure,
  GoldRule,
  MarkerUnderline,
  ObjectGlyph,
  PaperNote,
  SplitFeature,
} from "@/components/public/editorial";
import { Button } from "@/components/ui/button";

import clubCollaboration from "@/assets/club-collaboration.jpg";
import challengeBrief from "@/assets/challenge-brief.jpg";
import classroomMaking from "@/assets/classroom-making.jpg";
import makingFilm from "@/assets/making-film.jpg";

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
  {
    step: "01",
    title: "A brief is set",
    text: "A verified school, education group or organisation publishes a challenge with a clear brief and deadline.",
  },
  {
    step: "02",
    title: "Children respond",
    text: "Interested children work on a response in the Creator Studio, using drafting and feedback as normal.",
  },
  {
    step: "03",
    title: "Guardian approves the entry",
    text: "As with any shared work, a guardian must approve the submission before it is entered.",
  },
  {
    step: "04",
    title: "Named reviewers assess it",
    text: "Entries are reviewed by identified adults connected to the challenge, not by public voting.",
  },
];

const examplePrompts = [
  {
    title: "\"Tell a one-minute story about your street\"",
    format: "Film or audio",
    glyph: "camera" as const,
  },
  {
    title: "\"Design a poster for a cause you care about\"",
    format: "Art & design",
    glyph: "pencil" as const,
  },
  {
    title: "\"Invent something that fixes one small annoyance\"",
    format: "Invention",
    glyph: "prototype" as const,
  },
  {
    title: "\"Build a game with exactly one rule\"",
    format: "Game",
    glyph: "controller" as const,
  },
];

const clubBoundaries = [
  "Named adult supervision for every club — a teacher, group leader or approved supervisor.",
  "Bounded membership: children are added by a school, group or guardian, never self-service.",
  "No open messaging between members — feedback is structured and tied to the work.",
  "No public follower counts, friend lists or popularity metrics inside a club.",
];

const judgeSees = [
  "The submitted piece of work itself, as approved for entry.",
  "The project label — the format and the brief it was answering.",
  "The age band the entry was submitted under, so it can be judged fairly against its peers.",
  "The child's chosen display name for the entry, or an anonymous entry reference.",
  "Any notes the child chose to include about how they made it.",
];

const judgeNeverSees = [
  "A real name, email address, phone number or home address.",
  "A school name, class or town that could locate the child.",
  "Any route to message, follow or contact the child who entered.",
  "Private drafts, earlier versions or anything else in the child's studio.",
  "A browsable list of the other children who entered.",
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
      >
        <div className="mt-12 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="relative">
            <Figure
              src={challengeBrief}
              alt="A printed challenge brief with a gold seal, pinned notes and a project label"
              width={1280}
              height={960}
              label="Illustrative example"
              ratio="landscape"
            />
            <DetailCard
              glyph="notebook"
              label="Brief"
              title="Clear task, fair deadline, named reviewers"
              className="absolute -bottom-6 -right-4 hidden max-w-[16rem] lg:block"
            >
              Every challenge states what is being asked, who can enter, and how entries will be
              reviewed before a child sees it.
            </DetailCard>
          </div>
          <div className="hidden flex-col gap-4 lg:flex">
            <Figure
              src={makingFilm}
              alt="A young filmmaker's hands holding a phone on a simple cardboard rig"
              width={1280}
              height={960}
              label="Illustrative · Making a response"
              ratio="square"
            />
            <PaperNote tone="lined" className="border-dashed">
              <span className="flex items-center gap-2 text-accent-foreground">
                <ObjectGlyph name="camera" className="size-4" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em]">
                  Example prompt
                </span>
              </span>
              <p className="mt-2 font-display text-base leading-snug tracking-tight text-foreground">
                &ldquo;Tell a one-minute story about your street&rdquo;
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Film or audio · illustrative</p>
            </PaperNote>
          </div>
        </div>
      </PageHero>

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

      {/* Example challenge prompts */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Example prompts"
          title="The kind of brief a challenge might set"
          description="Illustrative examples only — not live challenges, and not written for a real organisation."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {examplePrompts.map((p) => (
            <PaperNote key={p.title} tone="paper">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground">
                <ObjectGlyph name={p.glyph} className="size-4" />
                {p.format} · illustrative
              </p>
              <p className="mt-2 font-display text-base leading-snug tracking-tight text-foreground">
                {p.title}
              </p>
            </PaperNote>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/ideas-and-resources">Browse project starters</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/creator-studio">See the Creator Studio</Link>
          </Button>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Submission and review"
          title="From brief to reviewed entry"
          description="A challenge submission follows the same safety rules as any other piece of shared work in Aurelia — nothing skips guardian approval, even under a deadline."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {challengeFlow.map((item, index) => (
            <li key={item.step} className="relative rounded-2xl border border-border/70 bg-card p-6">
              {index < challengeFlow.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute -right-3 top-8 hidden h-px w-6 bg-border md:block"
                />
              ) : null}
              <span className="font-display text-sm tracking-[0.2em] text-accent-foreground">
                {item.step}
              </span>
              <h3 className="mt-3 font-display text-lg tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Clubs, editorial split */}
      <Section tone="muted">
        <SplitFeature
          image={
            <Figure
              src={clubCollaboration}
              alt="A small supervised club of young people building a project together at a table"
              width={1280}
              height={960}
              label="Illustrative example · Clubs"
            />
          }
        >
          <SectionHeading
            eyebrow="Clubs"
            title="A small, supervised group with a shared interest"
            description="Clubs bring together a bounded group of children around a shared interest — a podcasting club, a nature-writing club, an invention club — always under the direct supervision of a named, accountable adult."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <FeatureCard icon={UserCheck} title="Named adult supervision">
              Every club has a specific, identified adult responsible for it — a teacher, group
              leader or approved supervisor — not an anonymous moderator.
            </FeatureCard>
            <FeatureCard icon={Users2} title="Bounded membership">
              Clubs are limited to members who have been added by a school, group or guardian.
              There is no open, self-service joining of clubs by children.
            </FeatureCard>
          </div>
        </SplitFeature>
      </Section>

      {/* Making together band */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Figure
            src={classroomMaking}
            alt="A sunlit classroom of students making things together, seen from behind"
            width={1536}
            height={1024}
            ratio="wide"
            label="Illustrative example · Making together"
            className="lg:order-2"
          />
          <div>
            <GoldRule className="w-10" />
            <h2 className="mt-4 font-display text-2xl leading-tight tracking-tight sm:text-3xl">
              Making together, without the features that turn it competitive
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A club or challenge is a place to build something alongside other people — not a
              feed to perform on. Aurelia deliberately leaves out the mechanics that make many
              online groups unsafe or anxiety-inducing for children.
            </p>
            <div className="mt-6">
              <CheckList items={clubBoundaries} />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Boundaries"
          title="What challenges and clubs deliberately do not include"
          description="The features that make many online communities unsafe for children are simply not present in Aurelia's design."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={MessageCircleOff} title="No child direct messages">
            There is no private messaging between children, and no route for an adult outside a
            child's verified circle to open a conversation with them. Communication about a project
            happens through structured feedback tied to the work.
          </FeatureCard>
          <FeatureCard icon={Ban} title="No follower or popularity counts">
            No followers, no likes, no vote tallies and no public ranking of entrants. A challenge
            result is a judged outcome, not a competition for attention.
          </FeatureCard>
          <FeatureCard icon={UserRoundX} title="No open child directory">
            Children are not browsable, searchable or listed anywhere — not by other children, not
            by clubs, and not by the organisations sponsoring a challenge.
          </FeatureCard>
          <FeatureCard icon={AtSign} title="No contact details shared">
            Email addresses, phone numbers, handles and locations are never exposed through a club
            or a challenge entry, in either direction.
          </FeatureCard>
          <FeatureCard icon={ListOrdered} title="No feed and no endless scroll">
            Clubs and challenges are bounded spaces with a purpose and a deadline, not an infinite
            stream ranked to keep a young person scrolling.
          </FeatureCard>
          <FeatureCard icon={UserCheck} title="No unsupervised space">
            Every club and every challenge review sits with a named, accountable adult. There is no
            corner of this area without adult responsibility attached to it.
          </FeatureCard>
        </div>
      </Section>

      {/* What a judge actually sees */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Judging"
              title="A judge sees the work. Not the child."
              description="When an entry reaches a challenge reviewer, it arrives stripped of anything that identifies the young person behind it. Judging is an assessment of a piece of work against a brief — it is never an introduction."
            />
            <GoldRule className="mt-6 w-16" />
            <MarkerUnderline className="mt-4 max-w-[12rem]" />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/ideas-and-resources">Ideas &amp; Resources</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/creator-studio">See the Creator Studio</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card p-6">
              <Eye className="size-5 text-accent-foreground" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg tracking-tight">What a judge sees</h3>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                {judgeSees.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-foreground"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-6">
              <EyeOff className="size-5 text-muted-foreground" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg tracking-tight">What a judge never sees</h3>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                {judgeNeverSees.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[0.6rem] h-px w-3 shrink-0 bg-muted-foreground/60"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="The organisation boundary"
          title="An organisation can sponsor a challenge. It never meets the child who answers it."
          description="Verified organisations can sponsor approved challenge and content workflows — funding a prize, setting a brief in their field, offering recognition. That sponsorship runs entirely through institutional workflows and grants no other access to children."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <ShieldCheck className="size-5 text-accent-foreground" aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg tracking-tight">
              What a sponsoring organisation can do
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Propose an approved brief, supply approved supporting content, provide named
              reviewers for judging, and offer recognition that a verified teacher can turn into a
              Passport achievement.
            </p>
          </div>
          <div className="rounded-2xl border border-dashed border-border bg-background p-6">
            <UserRoundX className="size-5 text-muted-foreground" aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg tracking-tight">
              What sponsorship never unlocks
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              No direct contact with a child, no browsing or searching children, no contact details,
              no bypassing a family's control over their child's work. Every entry remains the
              guardian's decision to share.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/for-organisations">How organisation partnerships work</Link>
          </Button>
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
