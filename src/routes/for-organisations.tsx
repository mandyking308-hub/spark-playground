import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Ban,
  BadgeCheck,
  Handshake,
  MegaphoneOff,
  ShieldCheck,
  Trophy,
  UserRoundX,
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
import { Figure, GoldRule, SplitFeature } from "@/components/public/editorial";
import { Button } from "@/components/ui/button";

import challengeBrief from "@/assets/challenge-brief.jpg";
import designDesk from "@/assets/design-desk.jpg";
import inventionPrototype from "@/assets/invention-prototype.jpg";

export const Route = createFileRoute("/for-organisations")({
  head: () => ({
    meta: [
      { title: "For Organisations — Aurelia" },
      {
        name: "description",
        content:
          "How verified organisations publish challenges and opportunities on Aurelia, within strict boundaries: no direct contact with children, no data harvesting, no advertising.",
      },
      { property: "og:title", content: "For Organisations — Aurelia" },
      {
        property: "og:description",
        content:
          "Verified organisations reach young creators through bounded, reviewed challenges — never direct contact.",
      },
      { property: "og:url", content: "/for-organisations" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/for-organisations" }],
  }),
  component: ForOrganisations,
});

const neverList = [
  { icon: UserRoundX, title: "No child accounts", text: "An organisation cannot create, hold or manage an account for any child, under any circumstance." },
  { icon: Ban, title: "No child directory", text: "There is no list of children an organisation can browse, search or select from — children are never visible to an organisation as individuals." },
  { icon: MegaphoneOff, title: "No private contact with children", text: "An organisation never messages, emails or otherwise contacts a child directly. All interaction happens through published challenges reviewed by Aurelia staff." },
  { icon: ShieldCheck, title: "No behavioural targeting", text: "Organisations cannot target, segment or recommend content to individual children based on behaviour, engagement or profile data." },
  { icon: Ban, title: "No data harvesting", text: "Organisations do not receive personal data about the children who take part. Only what a judging process genuinely needs is shared, and only with guardian consent." },
];

const process = [
  { step: "01", title: "Verification", text: "An organisation is verified before it can propose anything — identity, purpose and safeguarding awareness are all checked first." },
  { step: "02", title: "Proposal", text: "The organisation submits a challenge or opportunity brief, describing the task, audience age band and any recognition on offer." },
  { step: "03", title: "Review", text: "Aurelia staff review the brief for age-appropriateness, safeguarding risk and compliance with platform boundaries before approval." },
  { step: "04", title: "Publication", text: "Only once approved does the challenge reach schools and families, who can choose whether their children take part at all." },
];

function ForOrganisations() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="For organisations"
        title="Set a brief. Never meet the child who answers it."
        description="Verified organisations work with Aurelia the way a publisher works with a school — through briefs, content and opportunities that pass through institutional review, never through a direct line to a young person."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/contact">Propose a challenge</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/challenges-and-clubs">See challenges and clubs</Link>
            </Button>
          </>
        }
      >
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          <Figure
            src={challengeBrief}
            alt="A printed challenge brief with a gold seal, pinned notes and a project label"
            width={1280}
            height={960}
            label="Illustrative · Brief"
            priority
          />
          <Figure
            src={designDesk}
            alt="Hands sketching a poster design with markers, swatches and tape"
            width={1280}
            height={960}
            label="Illustrative · Response"
          />
          <Figure
            src={inventionPrototype}
            alt="A cardboard and electronics prototype beside annotated design sketches"
            width={1024}
            height={1024}
            label="Illustrative · Outcome"
          />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Images are illustrative examples of the kind of project work a brief can inspire. They
          are not member work and depict no identifiable people or direct contact with children.
        </p>
      </PageHero>

      <Section>
        <SplitFeature
          image={
            <Figure
              src={designDesk}
              alt="Hands sketching a poster design with markers, swatches and tape on a studio desk"
              width={1280}
              height={960}
              label="A brief, answered"
            />
          }
        >
          <SectionHeading
            eyebrow="What organisations can do"
            title="Publish a challenge, not a relationship"
            description="Aurelia lets an organisation set a task worth doing — a design brief, a research question, a piece of writing — and offer genuine recognition for it, entirely through institutional workflows."
          />
          <GoldRule className="mt-6 w-16" />
        </SplitFeature>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <FeatureCard icon={Trophy} title="Set a real challenge">
            Define a task with a clear brief, age band and judging criteria, aligned with what young creators can genuinely produce.
          </FeatureCard>
          <FeatureCard icon={BadgeCheck} title="Offer genuine recognition">
            Successful entries can feed into a young person's Achievement Passport once a verified teacher confirms the work.
          </FeatureCard>
          <FeatureCard icon={Handshake} title="Work through the platform">
            All communication, submission and feedback happens through Aurelia's reviewed workflow, never through a side channel.
          </FeatureCard>
        </div>
      </Section>

      <Section tone="ink">
        <SectionHeading
          eyebrow="Strict boundaries"
          title="What organisations can never do"
          description="These are not policy preferences — they are structural limits, enforced in how Aurelia is built, not left to an organisation's good intentions."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {neverList.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-ink-foreground/15 bg-ink-foreground/5 p-6"
            >
              <item.icon className="size-6 text-gold" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-foreground/75">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Review and approval"
          title="Nothing reaches a young person unreviewed"
          description="Every challenge or opportunity an organisation proposes passes through verification and review before it is visible to a single school or family."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {process.map((item) => (
            <li key={item.step} className="rounded-2xl border border-border/70 bg-card p-6">
              <span className="font-display text-sm tracking-[0.2em] text-accent-foreground">{item.step}</span>
              <h3 className="mt-3 font-display text-lg tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Why the boundaries exist"
          title="A challenge should be a gift, not a funnel"
          description="Aurelia's value to an organisation is the chance to inspire genuine work from young people — not a route to their attention, their data or their households. The boundaries exist to keep that distinction permanent."
        />
        <div className="mt-10">
          <CheckList
            items={[
              "Guardian consent remains required for a child to take part in any challenge.",
              "Schools and families can withdraw from an organisation's challenge at any time.",
              "Aurelia reserves the right to decline or remove any proposal that does not meet these standards.",
            ]}
          />
        </div>
      </Section>

      <CtaBand
        title="Propose a challenge for young creators"
        description="Tell us about your organisation and the task you would like to set. We review every proposal before it reaches a school or family."
      />
    </PublicPage>
  );
}
