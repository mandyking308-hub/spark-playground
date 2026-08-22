import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Film,
  Gamepad2,
  Lightbulb,
  MessageSquareText,
  Mic,
  PenTool,
  Palette,
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
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/creator-studio")({
  head: () => ({
    meta: [
      { title: "Creator Studio — Aurelia" },
      {
        name: "description",
        content:
          "Aurelia's Creator Studio: podcasts, shows, film, art, writing, games and inventions, with drafting, iteration and a safe, guardian-approved publishing pipeline.",
      },
      { property: "og:title", content: "Creator Studio — Aurelia" },
      {
        property: "og:description",
        content:
          "Real creative tools for young makers, built with drafting, feedback and a safe publishing pipeline from day one.",
      },
      { property: "og:url", content: "/creator-studio" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/creator-studio" }],
  }),
  component: CreatorStudioPage,
});

const disciplines = [
  { icon: Mic, title: "Podcasts & shows", text: "Plan an episode, record audio or video, edit a running order and build a series over time." },
  { icon: Film, title: "Film", text: "Storyboard, shoot and cut short films, with each stage kept as part of the project's history." },
  { icon: Palette, title: "Art", text: "Digital and documented physical artwork, from first sketch to finished piece." },
  { icon: PenTool, title: "Writing", text: "Stories, scripts, journalism and poetry, drafted and redrafted with visible revision history." },
  { icon: Gamepad2, title: "Games", text: "Design simple games and interactive projects, describing mechanics as well as building them." },
  { icon: Lightbulb, title: "Inventions", text: "Prototype physical or conceptual inventions and document the reasoning behind each choice." },
];

const lifecycle = [
  { step: "01", title: "Start a project", text: "A child opens a project in the studio, chooses a discipline and sets out what they intend to make." },
  { step: "02", title: "Draft and iterate", text: "Work is built up in stages. Earlier drafts stay attached to the project rather than being overwritten and lost." },
  { step: "03", title: "Ask for feedback", text: "A parent, teacher or club supervisor can leave constructive comments before anything is finished." },
  { step: "04", title: "Guardian review", text: "Before a project can be shared beyond the family, a guardian reviews and approves it." },
  { step: "05", title: "Safe publishing", text: "Approved work is published into the appropriate, moderated space — never to the open internet by default." },
  { step: "06", title: "Recognition", text: "Where a teacher verifies the achievement it demonstrates, it can be recorded to the Achievement Passport." },
];

function CreatorStudioPage() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="Creator Studio"
        title="A studio built for young makers, not an open publishing platform"
        description="The Creator Studio gives children real tools to make podcasts, shows, film, art, writing, games and inventions — with drafting, feedback and a guardian-approved publishing pipeline built into every project from the start."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/auth/join">Join with an invitation</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/achievement-passport">See how work becomes achievement</Link>
            </Button>
          </>
        }
      />

      <Section>
        <SectionHeading
          eyebrow="Seven disciplines"
          title="Room to make almost anything"
          description="The studio is not a single tool. It is a set of project types that share the same safety rules, so a child can move between podcasting one week and prototyping an invention the next."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {disciplines.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Drafting and iteration"
          title="Work is a process, not a single upload"
          description="Aurelia treats a finished piece as the end of a visible process rather than something that appears fully formed. Every project keeps its earlier drafts, so a young person — and the adults supporting them — can see how the work developed."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <p className="text-base leading-relaxed text-muted-foreground">
            This matters for two reasons. First, it is how genuine skill is demonstrated: a
            teacher verifying an achievement can see the thinking, not just the outcome. Second,
            it protects children from the pressure to publish something polished immediately —
            drafts are private to the project by default, and nothing leaves the family without
            explicit guardian approval.
          </p>
          <CheckList
            items={[
              "Earlier versions of a project remain attached rather than being overwritten.",
              "Projects can be paused and returned to over weeks or months.",
              "Private drafting space is separate from anything visible to guardians or teachers.",
              "A project's history forms part of the evidence behind a verified achievement.",
            ]}
          />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Constructive feedback"
          title="Comments that help the work improve"
          description="Feedback in the studio comes from named adults with a real relationship to the child — a parent, a teacher, or a named club supervisor — not from open comment sections or anonymous strangers."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <FeatureCard icon={MessageSquareText} title="Attached to the project">
            Comments sit alongside the specific draft they refer to, so feedback is always
            concrete and easy to act on.
          </FeatureCard>
          <FeatureCard icon={ShieldCheck} title="From known adults only">
            There is no open commenting from strangers. Feedback comes from people the family or
            school has already recognised as responsible for that child.
          </FeatureCard>
          <FeatureCard icon={Lightbulb} title="Focused on improvement">
            The purpose of feedback is to help a project get better, not to rank, score or compare
            it publicly against other children's work.
          </FeatureCard>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="From idea to record"
          title="What a project looks like end to end"
          description="Every discipline in the studio follows the same underlying journey, so families and schools always know what stage a piece of work is at."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {lifecycle.map((item) => (
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
          eyebrow="Safe publishing pipeline"
          title="Sharing is a decision, not a default"
          description="Nothing a child makes in the studio is visible outside their own account until a guardian explicitly approves it, and even then it is published into moderated, age-appropriate spaces rather than the open internet."
        />
        <div className="mt-10">
          <CheckList
            items={[
              "Private by default: only the child can see a project while it is in draft.",
              "Guardian approval is required before a project can be shared with a class, club or challenge.",
              "Publication targets are bounded — a class, a club, a challenge — never an open public feed.",
              "Approval and publication events are recorded, so families and schools can see what has been shared and when.",
            ]}
          />
        </div>
      </Section>

      <CtaBand
        title="See where a project can go next"
        description="Work made in the Creator Studio can become a verified achievement, a challenge entry, or a club contribution. Explore how recognition works in Aurelia."
        secondary={{ label: "Read the Achievement Passport", to: "/achievement-passport" }}
      />
    </PublicPage>
  );
}
