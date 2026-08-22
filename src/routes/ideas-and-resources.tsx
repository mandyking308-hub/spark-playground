import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookOpen, GraduationCap, Heart, Lightbulb } from "lucide-react";

import { PublicPage } from "@/components/public/public-page";
import {
  CtaBand,
  Eyebrow,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/public/sections";
import { Figure, GoldRule, PaperNote, ProjectLabel } from "@/components/public/editorial";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ageBands,
  interests,
  projectStarters,
  resourceCards,
  type AgeBand,
  type Interest,
} from "@/data/ideas-resources";

import designDesk from "@/assets/design-desk.jpg";
import inventionPrototype from "@/assets/invention-prototype.jpg";
import storyArt from "@/assets/story-art.jpg";

export const Route = createFileRoute("/ideas-and-resources")({
  head: () => ({
    meta: [
      { title: "Ideas & Resources — project starters for young makers | Aurelia" },
      {
        name: "description",
        content:
          "Free project starters, family guides and educator brief templates for podcasts, stories, film, art, inventions, games and social-impact projects — filtered by age band and interest.",
      },
      { property: "og:title", content: "Ideas & Resources — Aurelia" },
      {
        property: "og:description",
        content:
          "Project starters, family guides and educator brief templates for young makers, by age band and interest.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/ideas-and-resources" }],
  }),
  component: IdeasAndResources,
});

function IdeasAndResources() {
  const [age, setAge] = useState<AgeBand | "All">("All");
  const [interest, setInterest] = useState<Interest | "All">("All");

  const filtered = useMemo(
    () =>
      projectStarters.filter(
        (starter) =>
          (age === "All" || starter.ages.includes(age)) &&
          (interest === "All" || starter.interest === interest),
      ),
    [age, interest],
  );

  return (
    <PublicPage>
      <PageHero
        eyebrow="Ideas & Resources"
        title="Somewhere to start on a wet Tuesday"
        description="Open project starters, family guides and educator templates. Free to read, no account needed, no sign-in wall. Use them inside Aurelia, in a classroom, or at the kitchen table."
        actions={
          <>
            <Button asChild size="lg">
              <a href="#starters">Browse project starters</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#resources">Guides for adults</a>
            </Button>
          </>
        }
      >
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <Figure
            src={storyArt}
            alt="An illustrated storybook spread with coloured pencils on a warm ivory desk"
            width={1024}
            height={1024}
            ratio="square"
            label="Example · Story"
          />
          <Figure
            src={inventionPrototype}
            alt="A half-built cardboard and electronics prototype beside annotated design sketches"
            width={1024}
            height={1024}
            ratio="square"
            label="Example · Invention"
          />
          <Figure
            src={designDesk}
            alt="Hands sketching a poster design with markers, colour swatches and tape on a desk"
            width={1280}
            height={960}
            ratio="square"
            label="Example · Design"
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Illustrative examples of the kinds of work these starters lead to. Not member work.
        </p>
      </PageHero>

      {/* Explore by interest */}
      <Section id="explore" tone="muted">
        <SectionHeading
          eyebrow="Explore by interest"
          title="Start with what they already love"
          description="Interest-led, not algorithm-led. Nothing here learns from a child's behaviour or ranks them against anyone."
        />
        <div className="mt-10 flex flex-wrap gap-2">
          {interests.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setInterest(item);
                setAge("All");
              }}
              className={cn(
                "rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-gold hover:bg-gold-soft",
                interest === item && "border-gold bg-gold-soft",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </Section>

      {/* Project starters */}
      <Section id="starters">
        <SectionHeading
          eyebrow="Project starters"
          title="Twelve ways in"
          description="Each starter is a small, finishable project with an evidence trail — the kind of work a teacher can later verify and a Passport can hold."
        />

        <div className="mt-10 grid gap-6 rounded-2xl border border-border/70 bg-muted/40 p-6 sm:grid-cols-2">
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Age band
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["All", ...ageBands] as const).map((band) => (
                <button
                  key={band}
                  type="button"
                  aria-pressed={age === band}
                  onClick={() => setAge(band)}
                  className={cn(
                    "rounded-full border border-border bg-card px-3.5 py-1.5 text-sm transition-colors hover:border-gold",
                    age === band && "border-gold bg-gold-soft font-medium",
                  )}
                >
                  {band}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Interest
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["All", ...interests] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={interest === item}
                  onClick={() => setInterest(item)}
                  className={cn(
                    "rounded-full border border-border bg-card px-3.5 py-1.5 text-sm transition-colors hover:border-gold",
                    interest === item && "border-gold bg-gold-soft font-medium",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
          Showing {filtered.length} of {projectStarters.length} starters.
        </p>

        {filtered.length === 0 ? (
          <PaperNote className="mt-6 max-w-xl">
            Nothing matches that combination yet. Try a different age band, or reset the interest
            filter to see everything.
          </PaperNote>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((starter) => (
              <article
                key={starter.id}
                className="brand-card flex flex-col rounded-2xl border border-border/70 bg-card p-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <ProjectLabel>{starter.format}</ProjectLabel>
                  {starter.ages.map((band) => (
                    <Badge key={band} variant="secondary" className="rounded-full">
                      {band}
                    </Badge>
                  ))}
                </div>
                <h3 className="mt-4 font-display text-lg leading-snug tracking-tight">
                  {starter.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {starter.summary}
                </p>
                <ol className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {starter.steps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="font-display text-xs tracking-[0.16em] text-accent-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-auto pt-5 text-xs leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">Evidence to keep: </span>
                  {starter.evidence}
                </p>
              </article>
            ))}
          </div>
        )}
      </Section>

      {/* Resources */}
      <Section id="resources" tone="muted">
        <SectionHeading
          eyebrow="Guides for the adults"
          title="Practical help for families and educators"
          description="Short, usable guidance written for the people who sit beside young makers — plus static brief templates educators can adapt."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {resourceCards.map((card) => (
            <article
              key={card.id}
              className="brand-card flex flex-col rounded-2xl border border-border/70 bg-card p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                {card.audience === "Educators" ? (
                  <GraduationCap className="size-5" aria-hidden="true" />
                ) : card.audience === "Families" ? (
                  <Heart className="size-5" aria-hidden="true" />
                ) : (
                  <BookOpen className="size-5" aria-hidden="true" />
                )}
              </span>
              <Eyebrow className="mt-4">{card.audience}</Eyebrow>
              <h3 className="mt-2 font-display text-lg leading-snug tracking-tight">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.summary}</p>
              <ul className="mt-4 space-y-2">
                {card.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <PaperNote className="mt-10 max-w-3xl" tone="lined">
          <span className="font-medium text-foreground">A note on these templates. </span>
          The educator briefs above are static examples to adapt in your own planning. They are not
          live submission forms, and nothing typed on this page is sent anywhere.
        </PaperNote>
      </Section>

      {/* Integration-ready note */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow>Resource library for schools</Eyebrow>
            <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              Built to fit around how your school already works
            </h2>
            <GoldRule className="mt-5" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Everything in this hub is free to download, print and adapt. We are deliberately
              transparent about what is live today and what is direction of travel.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                <span>
                  <span className="font-medium text-foreground">Live today:</span> briefs, review,
                  verification and safeguarding workflows inside Aurelia.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                <span>
                  <span className="font-medium text-foreground">Integration-ready architecture:</span>{" "}
                  a structured data model and role model designed so exports and integrations can be
                  added deliberately.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                <span>
                  <span className="font-medium text-foreground">Not claimed:</span> we do not
                  advertise LMS or MIS integrations. If your setting needs one, tell us and we will
                  be straight with you about whether it exists.
                </span>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/for-schools">See how schools use Aurelia</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact-enquiry">Send an enquiry</Link>
              </Button>
            </div>
          </div>
          <div className="brand-paper rounded-2xl border border-border/70 p-7">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Lightbulb className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-xl tracking-tight">Using these at home</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              You do not need an Aurelia account to use any of this. Pick one starter, set a
              finishing point, and keep the drafts. If the young person later joins Aurelia through a
              verified parent/guardian or school invitation, that evidence is exactly the kind of
              thing a Passport is built from.
            </p>
            <div className="mt-6">
              <Button asChild variant="outline">
                <Link to="/achievement-passport">How verification works</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Bring this into your classroom or kitchen"
        description="Aurelia is invitation-only for under-16s, sponsored by a verified parent/guardian or school. Tell us who you are and we will guide you through it."
      />
    </PublicPage>
  );
}
