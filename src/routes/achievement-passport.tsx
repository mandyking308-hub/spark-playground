import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  Ban,
  FileCheck2,
  GraduationCap,
  ScrollText,
  ShieldCheck,
  Users,
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

const flow = [
  { step: "01", icon: FileCheck2, title: "Create", text: "A child completes a project, challenge entry or piece of work inside Aurelia, with drafts and context attached." },
  { step: "02", icon: Users, title: "Guardian approves", text: "A parent or guardian reviews what was made and approves it for sharing beyond the immediate family." },
  { step: "03", icon: GraduationCap, title: "Teacher verifies", text: "A verified educator who genuinely reviewed the work confirms the skill, effort or contribution it demonstrates." },
  { step: "04", icon: BadgeCheck, title: "Recorded", text: "The achievement is written to the child's Achievement Passport as a durable, dated entry they keep." },
];

const contains = [
  "What was made, and in which discipline of the Creator Studio, a challenge or a club.",
  "Who verified it — a named, school-affiliated teacher or recognised educator, not an algorithm.",
  "The date the achievement was verified and the context it was verified in.",
  "A link back to the evidence: the drafts, the final piece, and any relevant feedback.",
  "Guardian approval status, confirming the family agreed to the achievement being recorded.",
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
      />

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

      <Section tone="muted">
        <SectionHeading
          eyebrow="How an entry is created"
          title="Create, approve, verify, record"
          description="Every achievement follows the same four-step path, so families and schools always know exactly how much scrutiny sits behind an entry."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {flow.map((item) => (
            <li key={item.step} className="rounded-2xl border border-border/70 bg-card p-6">
              <span className="font-display text-sm tracking-[0.2em] text-accent-foreground">
                {item.step}
              </span>
              <item.icon className="mt-3 size-6 text-accent-foreground" aria-hidden="true" />
              <h3 className="mt-3 font-display text-lg tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="What an entry contains"
          title="Evidence, not a badge icon"
          description="A verified achievement is a small dossier, not a single graphic. Anyone with permission to view it can see exactly what it is based on."
        />
        <div className="mt-10">
          <CheckList items={contains} />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Portability"
          title="A record that follows the young person, not the platform"
          description="Achievements are tied to the person, not to a single school year or a single school. As a member approaches 16 and transitions into the alumni world, their Achievement Passport moves with them."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <p className="text-base leading-relaxed text-muted-foreground">
            When a member reaches 16 and moves into the separate alumni environment, their
            existing Achievement Passport carries forward intact. It can then form the basis of a
            portfolio used for further education, work experience or mentoring — evidence built up
            over years, rather than a CV written from scratch.
          </p>
          <CheckList
            items={[
              "Entries verified before 16 remain valid and visible after the transition.",
              "The passport is exportable as a readable record the young person controls.",
              "Alumni add to the same passport rather than starting a new, disconnected one.",
              "Guardians retain visibility into historical entries created while their child was under 16.",
            ]}
          />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="What it deliberately is not"
          title="No vanity badges, no leaderboards"
          description="The passport is designed to resist the incentives that make many gamified platforms unhealthy for children."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <FeatureCard icon={Ban} title="No automatic badges">
            There are no achievements awarded purely for logging in, streaking or clicking through
            content. Every entry requires a human to verify real substance.
          </FeatureCard>
          <FeatureCard icon={Award} title="No public leaderboards">
            Aurelia does not rank children against each other by achievement count. The passport
            is a personal record, not a competition.
          </FeatureCard>
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
