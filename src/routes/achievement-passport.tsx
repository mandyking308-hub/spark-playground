import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Ban,
  GraduationCap,
  ScrollText,
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
import {
  Figure,
  GoldRule,
  ProjectLabel,
  SplitFeature,
} from "@/components/public/editorial";
import { Button } from "@/components/ui/button";

import passportEvidence from "@/assets/passport-evidence.jpg";
import teacherEvidence from "@/assets/teacher-evidence.jpg";


export const Route = createFileRoute("/achievement-passport")({
  head: () => ({
    meta: [
      { title: "Achievement Passport — Aurelia" },
      {
        name: "description",
        content:
          "How Aurelia's Achievement Passport works: guardian approval, teacher verification, a durable record of real achievement, and portability into the 16+ alumni world.",
      },
      { property: "og:title", content: "Achievement Passport — Aurelia" },
      {
        property: "og:description",
        content:
          "A verified, portable record of a young person's real achievement — never a vanity badge or a leaderboard position.",
      },
      { property: "og:url", content: "/achievement-passport" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/achievement-passport" }],
  }),
  component: AchievementPassportPage,
});

const timeline = [
  { title: "Drafts", text: "Early, unpolished versions of the work, kept rather than discarded." },
  { title: "Decisions", text: "The choices made along the way — what changed, and why." },
  { title: "Feedback", text: "Constructive comments from a named adult with a real relationship to the child." },
  { title: "Guardian approval", text: "Explicit permission from a parent or guardian for the work to be shared and considered." },
  { title: "Teacher verification", text: "An educator who genuinely reviewed the work confirms the skill it demonstrates." },
  { title: "Recorded achievement", text: "A dated entry written to the Achievement Passport, with the evidence still attached." },
];

const contains = [
  "What was made, and in which discipline of the Creator Studio, a challenge or a club.",
  "Who verified it — a named, school-affiliated teacher or recognised educator, not an algorithm.",
  "Issuer provenance: the verifier's role and setting at the moment of verification, stored with the entry.",
  "The date the achievement was verified and the context it was verified in.",
  "A link back to the evidence: the drafts, the final piece, and any relevant feedback.",
  "Guardian approval status, confirming the family agreed to the achievement being recorded.",
  "An audit trail — an entry can be revoked or corrected, and that action is recorded too.",
];



function AchievementPassportPage() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="Achievement Passport"
        title="A verified record of real achievement, owned by the child"
        description="The Achievement Passport is not a scoreboard. It is a durable, portable record of things a young person genuinely made, learned and demonstrated — each entry checked by an adult who actually saw the work."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/for-families">See it from a family's perspective</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/for-schools">How teachers verify achievements</Link>
            </Button>
          </>
        }
      >
        <div className="mt-12 max-w-lg">
          <Figure
            src={passportEvidence}
            alt="An achievement certificate with a gold seal laid over a project timeline"
            width={1280}
            height={960}
            label="Illustrative example"
            ratio="landscape"
          />
        </div>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="What it is"
          title="Recognition with someone standing behind it"
          description="Every entry in the Achievement Passport can be traced back to real work and a real person who verified it. That is the entire point: it is evidence, not decoration."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <FeatureCard icon={ShieldCheck} title="Guardian-gated">
            Nothing reaches the passport without a guardian first agreeing the work can be shared
            and recorded.
          </FeatureCard>
          <FeatureCard icon={GraduationCap} title="Teacher-verified">
            Verification comes from an educator with a genuine relationship to the work, not an
            automated scoring system.
          </FeatureCard>
          <FeatureCard icon={ScrollText} title="Owned by the child">
            The passport belongs to the young person. It travels with them through school changes
            and, eventually, into the 16+ alumni world.
          </FeatureCard>
        </div>
      </Section>

      {/* Visual evidence timeline */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="How an entry is built"
          title="The evidence timeline behind every achievement"
          description="Before anything is recorded, it travels through the same six stages — visible to the family and, once shared, to the verifying teacher."
        />
        <ol className="mt-12 grid gap-0 sm:grid-cols-2 lg:grid-cols-6">
          {timeline.map((item, index) => (
            <li key={item.title} className="relative border-t-2 border-gold/60 pt-5 sm:px-3">
              <span className="absolute -top-[9px] start-0 size-4 rounded-full border-2 border-gold bg-card" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 font-display text-base tracking-tight">{item.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SplitFeature
          reverse
          image={
            <Figure
              src={teacherEvidence}
              alt="A teacher and a student looking together at printed project evidence and sketches"
              width={1280}
              height={960}
              label="Evidence review"
            />
          }
        >
          <SectionHeading
            eyebrow="Teacher verification"
            title="What verification means — and what it is not"
            description="Verification is a professional judgement, not a mechanism. A named teacher or recognised educator reviews the drafts, the decisions and the feedback, and confirms that a specific skill was genuinely demonstrated."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground">
                It is
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                A deliberate, human judgement, made by someone who reviewed the actual evidence
                behind the work.
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground">
                It is not
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                An automatic badge for activity, and not a score, streak or ranking against other
                children.
              </p>
            </div>
          </div>
        </SplitFeature>
      </Section>

      {/* Single illustrative achievement card */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="What an entry contains"
          title="Evidence, not a badge icon"
          description="A verified achievement is a small dossier, not a single graphic. The card below is an illustrative example — no named people, schools or real submissions are shown."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          <article
            className="rounded-2xl border border-border/70 bg-[oklch(0.98_0.01_95)] p-7 shadow-sm"
            aria-label="Illustrative achievement card"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <ProjectLabel>Illustrative achievement</ProjectLabel>
              <span className="text-xs uppercase tracking-[0.14em] text-accent-foreground">
                Verified · example
              </span>
            </div>
            <GoldRule className="mt-5 w-12" />
            <h3 className="mt-4 font-display text-2xl leading-snug tracking-tight">
              Podcast series, three episodes
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Skill demonstrated: planning, recording and editing a structured audio series, and
              revising it after feedback.
            </p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Issuer provenance
                </dt>
                <dd className="mt-1 text-sm">
                  Verified class teacher, recorded with their role and school at the time of
                  verification
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Visibility
                </dt>
                <dd className="mt-1 text-sm">Private by default; the child chooses who sees it</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Evidence attached
                </dt>
                <dd className="mt-1 text-sm">Running order drafts, recorded takes, feedback notes</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Status
                </dt>
                <dd className="mt-1 text-sm">Revocable and auditable — every change is logged</dd>
              </div>
            </dl>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              A static illustration of how a verified entry is presented. It is not a real member
              achievement.
            </p>
          </article>
          <div className="space-y-8">
            <CheckList items={contains} />
            <div className="rounded-2xl border border-border/70 bg-card p-6">
              <h3 className="font-display text-lg tracking-tight">
                What a parent sees — and what stays closed
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A guardian can see that an achievement was verified, what skill it recognises, and
                who verified it. That does not unlock the underlying project: the drafts and
                private working behind it stay in the child's own space unless the child puts them
                forward.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Turning 16"
          title="Selective transfer, never a wholesale copy"
          description="Moving into the 16+ Alumni environment is a deliberate act by the young person. Only the Passport entries and portfolio items they explicitly select move forward with them."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <p className="text-base leading-relaxed text-muted-foreground">
            At 16, a young person chooses item by item what becomes part of their adult portfolio.
            Selected entries keep their evidence and issuer provenance, so they remain meaningful
            for further education, work experience or mentoring. Everything they do not select
            stays where it is.
          </p>
          <CheckList
            items={[
              "Only explicitly selected Passport entries and portfolio items transfer into Alumni.",
              "Private childhood drafts, wellbeing records and safeguarding material never transfer automatically.",
              "Transferred entries keep their evidence and the provenance of who verified them.",
              "Entries verified before 16 remain valid; nothing is re-verified or re-scored.",
              "Selection is the young person's decision, made item by item rather than in bulk.",
            ]}
          />
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/alumni-world">See the 16+ Alumni world</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/ideas-and-resources">Browse ideas & resources</Link>
          </Button>
        </div>
      </Section>


      <Section tone="ink">
        <SectionHeading
          eyebrow="What it deliberately is not"
          title="No vanity badges, no leaderboards"
          description="The passport is designed to resist the incentives that make many gamified platforms unhealthy for children."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-ink-foreground/15 bg-ink-foreground/5 p-6">
            <Ban className="size-6 text-gold" aria-hidden="true" />
            <h3 className="mt-3 font-display text-lg tracking-tight">No automatic badges</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-foreground/75">
              There are no achievements awarded purely for logging in, streaking or clicking
              through content. Every entry requires a human to verify real substance.
            </p>
          </div>
          <div className="rounded-2xl border border-ink-foreground/15 bg-ink-foreground/5 p-6">
            <Award className="size-6 text-gold" aria-hidden="true" />
            <h3 className="mt-3 font-display text-lg tracking-tight">No public leaderboards</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-foreground/75">
              Aurelia does not rank children against each other by achievement count. The passport
              is a personal record, not a competition.
            </p>
          </div>
        </div>
      </Section>

      <CtaBand
        title="See how the whole system connects"
        description="The Achievement Passport draws its evidence from the Creator Studio and from Challenges and Clubs. Explore how work becomes a verified record."
        secondary={{ label: "Explore Challenges & Clubs", to: "/challenges-and-clubs" }}
      />
    </PublicPage>
  );
}
