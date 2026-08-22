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
  Eyebrow,
  FeatureCard,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/public/sections";
import {
  Figure,
  GoldRule,
  PaperNote,
  SplitFeature,
  WaveformStrip,
} from "@/components/public/editorial";
import { Button } from "@/components/ui/button";

import heroPodcast from "@/assets/hero-podcast.jpg";
import makingFilm from "@/assets/making-film.jpg";
import storyArt from "@/assets/story-art.jpg";
import designDesk from "@/assets/design-desk.jpg";
import inventionPrototype from "@/assets/invention-prototype.jpg";
import codingGame from "@/assets/coding-game.jpg";

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

const mosaic = [
  {
    icon: Mic,
    src: heroPodcast,
    alt: "Hands setting up a podcast microphone beside a handwritten episode plan",
    label: "Example · Podcast & show",
    title: "Podcasts & shows",
    text: "Plan an episode, record audio or video, edit a running order and build a series over time.",
    flow: "Idea: \"Episode 3, finding my voice\" → Draft running order → Record & edit → Family feedback → Guardian approval to share.",
    ratio: "wide" as const,
    span: true,
  },
  {
    icon: Film,
    src: makingFilm,
    alt: "Two young people filming a stop-motion set with a phone on a tripod",
    label: "Example · Film",
    title: "Film",
    text: "Storyboard, shoot and cut short films, with each stage kept as part of the project's history.",
    flow: "Idea: a one-minute film about their street → Storyboard draft → Shoot & cut → Feedback from a supervisor → Guardian approval.",
    ratio: "landscape" as const,
  },
  {
    icon: PenTool,
    src: storyArt,
    alt: "An illustrated storybook spread with hand lettering and coloured pencils",
    label: "Example · Story & writing",
    title: "Story & writing",
    text: "Stories, scripts, journalism and poetry, drafted and redrafted with visible revision history.",
    flow: "Idea: a picture book for a younger sibling → First draft pages → Redraft & illustrate → Feedback → Guardian approval.",
    ratio: "square" as const,
  },
  {
    icon: Palette,
    src: designDesk,
    alt: "Hands sketching a poster design with markers, swatches and tape",
    label: "Example · Art & design",
    title: "Art & design",
    text: "Digital and documented physical artwork and design, from first sketch to finished piece.",
    flow: "Idea: a poster for a cause they chose → Thumbnail sketches → Make the final piece → Feedback → Guardian approval.",
    ratio: "landscape" as const,
  },
  {
    icon: Lightbulb,
    src: inventionPrototype,
    alt: "A cardboard and electronics prototype beside annotated design sketches",
    label: "Example · Invention",
    title: "Invention",
    text: "Prototype physical or conceptual inventions and document the reasoning behind each choice.",
    flow: "Idea: fix one annoying thing at home → Sketch the mechanism → Build a prototype → Feedback → Guardian approval.",
    ratio: "square" as const,
  },
  {
    icon: Gamepad2,
    src: codingGame,
    alt: "A young person coding a simple platform game beside pixel sketches on graph paper",
    label: "Example · Game",
    title: "Game",
    text: "Design simple games and interactive projects, describing mechanics as well as building them.",
    flow: "Idea: a game built around one rule → Sketch mechanics on paper → Build & test → Feedback → Guardian approval.",
    ratio: "landscape" as const,
  },
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
              <Link to="/ideas-and-resources">Browse project starters</Link>
            </Button>
          </>
        }
      >
        <div className="mt-12 max-w-md rounded-2xl border border-border/70 bg-card p-5">
          <WaveformStrip className="mb-3" />
          <p className="font-display text-base leading-snug tracking-tight">
            “Episode 3: Finding Voice.”
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Illustrative example of the kind of episode plan a child might start from.
          </p>
        </div>
      </PageHero>

      {/* Mosaic of capability categories */}
      <Section>
        <SectionHeading
          eyebrow="Six ways in"
          title="Room to make almost anything"
          description="The studio is not a single tool. It is a set of project categories that share the same safety rules, so a child can move between podcasting one week and prototyping an invention the next."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mosaic.map((item, index) => (
            <article
              key={item.title}
              className={item.span ? "lg:col-span-2" : undefined}
            >
              <Figure src={item.src} alt={item.alt} width={1280} height={960} ratio={item.ratio} label={item.label} />
              <div className="mt-4 flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <item.icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-lg leading-snug tracking-tight">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </div>
              <GoldRule className="mt-4 w-10" />
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">Example project flow: </span>
                {item.flow}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-10 text-xs text-muted-foreground">
          All images and project descriptions above are illustrative examples created for Aurelia.
          They are not member work and do not depict identifiable people.
        </p>
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

      {/* Audio section using WaveformStrip */}
      <Section>
        <SplitFeature
          image={
            <div className="space-y-5">
              <div className="rounded-2xl border border-border/70 bg-card p-6">
                <WaveformStrip className="mb-4" />
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Illustrative example
                </p>
                <p className="mt-2 font-display text-lg tracking-tight">
                  Episode plan, take three
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A running order, a recorded take, feedback from a parent, and a revised edit —
                  all attached to the same project.
                </p>
              </div>
              <PaperNote tone="lined">
                Not every take makes the final cut, and that's fine — the earlier ones stay
                attached so the project shows real iteration, not just a finished file.
              </PaperNote>
            </div>
          }
        >
          <SectionHeading
            eyebrow="Sound, structured"
            title="Podcasting and audio, built for iteration"
            description="Audio projects in the studio keep every take, script revision and running order alongside the finished episode, so the process of making something heard stays visible."
          />
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link to="/ideas-and-resources">Find a podcast starter idea</Link>
            </Button>
          </div>
        </SplitFeature>
      </Section>

      <Section tone="muted">
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

      {/* Maker's note */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">A maker's note</Eyebrow>
          <h2 className="mt-3 font-display text-2xl tracking-tight sm:text-3xl">
            What we ask every young maker to keep
          </h2>
        </div>
        <PaperNote className="mx-auto mt-8 max-w-xl text-center" tone="paper">
          Keep the messy version. Say why you changed it. Ask someone you trust what they think
          before you ask everyone. That's the whole method — illustrative, not an actual member's
          note.
        </PaperNote>
      </Section>

      <Section tone="muted">
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
