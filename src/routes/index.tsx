import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Building2,
  GraduationCap,
  Users,
  ScrollText,
  Baby,
} from "lucide-react";

import { PublicPage } from "@/components/public/public-page";
import {
  CheckList,
  CtaBand,
  Eyebrow,
  FeatureCard,
  Section,
  SectionHeading,
} from "@/components/public/sections";
import {
  EditorialImage,
  Figure,
  GoldRule,
  PaperNote,
  SplitFeature,
  WaveformStrip,
} from "@/components/public/editorial";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import heroPodcast from "@/assets/hero-podcast.jpg";
import makingFilm from "@/assets/making-film.jpg";
import storyArt from "@/assets/story-art.jpg";
import designDesk from "@/assets/design-desk.jpg";
import inventionPrototype from "@/assets/invention-prototype.jpg";
import codingGame from "@/assets/coding-game.jpg";
import challengeBrief from "@/assets/challenge-brief.jpg";
import familyReview from "@/assets/family-review.jpg";
import teacherEvidence from "@/assets/teacher-evidence.jpg";
import classroomMaking from "@/assets/classroom-making.jpg";
import clubCollaboration from "@/assets/club-collaboration.jpg";
import alumniPortfolio from "@/assets/alumni-portfolio.jpg";
import adultsCommunity from "@/assets/adults-community.jpg";
import passportEvidence from "@/assets/passport-evidence.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurelia — Create. Learn. Achieve. Safely." },
      {
        name: "description",
        content:
          "Aurelia is a protected global world where under-16s make real things — podcasts, films, stories, art, inventions and games — and earn achievements verified by the adults who witnessed the work.",
      },
      { property: "og:title", content: "Aurelia — Create. Learn. Achieve. Safely." },
      {
        property: "og:description",
        content:
          "A protected global creation, learning and achievement world for under-16s, with a separate 16+ alumni environment.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

const mosaic = [
  {
    src: makingFilm,
    alt: "Two young people filming a small stop-motion set with a phone on a tripod",
    label: "Example · Short film",
    title: "A one-minute film about their street",
    width: 1280,
    height: 960,
  },
  {
    src: storyArt,
    alt: "An illustrated storybook spread with hand lettering and coloured pencils",
    label: "Example · Story",
    title: "A picture book written for a younger sibling",
    width: 1024,
    height: 1024,
  },
  {
    src: inventionPrototype,
    alt: "A cardboard and electronics prototype beside annotated design sketches",
    label: "Example · Invention",
    title: "A prototype that fixes one annoying thing",
    width: 1024,
    height: 1024,
  },
  {
    src: designDesk,
    alt: "Hands sketching a poster design with markers, swatches and tape",
    label: "Example · Design",
    title: "A poster for a cause they chose themselves",
    width: 1280,
    height: 960,
  },
  {
    src: codingGame,
    alt: "A young person coding a simple platform game beside pixel sketches on graph paper",
    label: "Example · Game",
    title: "A game built around exactly one rule",
    width: 1280,
    height: 960,
  },
  {
    src: challengeBrief,
    alt: "A printed challenge brief with a gold seal, pinned notes and a project label",
    label: "Example · Challenge entry",
    title: "An answer to a brief set by a verified partner",
    width: 1280,
    height: 960,
  },
];

const interestPaths = [
  { title: "Create", text: "Podcasts, shows, films and everything that starts with making something." },
  { title: "Science & invention", text: "Prototypes, experiments and the failures that come first." },
  { title: "Storytelling", text: "Writing, illustration, audio and the shape of a good idea." },
  { title: "Design", text: "Type, colour, posters, objects and the craft of making it clear." },
  { title: "Coding & games", text: "Small games, tools and interactive work with real logic behind it." },
  { title: "World & culture", text: "Places, languages, history and the world beyond the classroom." },
  { title: "Enterprise & ideas", text: "Local problems, real audiences and work that is useful to someone." },
];

const journey = [
  { step: "01", title: "An idea", text: "Something they actually want to make, not an assignment they endure." },
  { step: "02", title: "A draft", text: "The messy first version, kept rather than hidden." },
  { step: "03", title: "The making", text: "Tools, iteration and the decisions that shaped the outcome." },
  { step: "04", title: "Constructive feedback", text: "Specific, kind, about the work — never a score or a ranking." },
  { step: "05", title: "Guardian approval", text: "Nothing leaves the family without an explicit yes." },
  { step: "06", title: "Teacher verification", text: "An adult who witnessed the work confirms the skill it shows." },
  { step: "07", title: "The Passport", text: "Durable, portable evidence the young person keeps." },
];

const childhoodFirst = [
  "No follower counts, no likes, no leaderboards and no popularity score.",
  "No endless feed — sessions end because the work is finished, not because attention ran out.",
  "No adult direct messages to children, and no open child directory to browse.",
  "No behavioural targeting, no advertising and no engagement-optimised recommendations.",
  "Built-in pause points that treat finishing as the reward.",
  "Creation before consumption, in the structure of the product itself.",
];

const adults = [
  {
    icon: Baby,
    title: "Parents & guardians",
    text: "You approve what leaves the family and you can change your mind later. You see achievements and shared work — not every private draft.",
    to: "/for-families",
  },
  {
    icon: GraduationCap,
    title: "Teachers",
    text: "Set a brief, review the evidence, and verify the skill you genuinely witnessed. Verification is a professional act, not a button.",
    to: "/for-schools",
  },
  {
    icon: Building2,
    title: "Schools & groups",
    text: "Oversight, safeguarding routes and reporting across classes and sites, with clear role boundaries.",
    to: "/for-education-groups",
  },
  {
    icon: Award,
    title: "Organisations",
    text: "Provide challenges, content and opportunities through institutional workflows. Never a child directory, never private contact, never account creation.",
    to: "/for-organisations",
  },
  {
    icon: Users,
    title: "Parent community",
    text: "A verified adult space for the people raising young makers — separate from the child world.",
    to: "/parent-community",
  },
  {
    icon: ScrollText,
    title: "16+ Alumni",
    text: "A distinct adult environment for portfolio, opportunities and mentoring.",
    to: "/alumni-world",
  },
];

function Home() {
  return (
    <PublicPage>
      {/* 1 — Hero */}
      <section className="brand-dawn relative overflow-hidden border-b border-border/70">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -end-24 -top-24 size-72 rounded-full bg-gold/15 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <Badge variant="secondary" className="mb-5 rounded-full px-3 py-1">
                Invitation-only · Built for under-16s
              </Badge>
              <h1 className="font-display text-4xl leading-[1.04] tracking-tight sm:text-6xl">
                Create. Learn. Achieve.{" "}
                <span className="relative inline-block text-accent-foreground">
                  Safely.
                  <MarkerUnderline className="absolute inset-x-0 -bottom-1" />
                </span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Somewhere a young person can make something real — a podcast, a film, a story, an
                invention — and be recognised for it by adults who actually watched them do it. No
                followers. No scores. No strangers.
              </p>
              <ul className="mt-7 flex flex-wrap gap-2" aria-label="Kinds of work made in Aurelia">
                {heroCrafts.map((craft) => (
                  <li
                    key={craft.label}
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <ObjectGlyph name={craft.glyph} className="size-4 text-accent-foreground" />
                    {craft.label}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/auth/join">Join with an invitation</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/ideas-and-resources">Explore ideas & resources</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Children join through a verified parent/guardian or school invitation.{" "}
                <Link
                  to="/for-schools"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Schools start here
                </Link>
                .
              </p>
            </div>

            <div className="relative pb-16 sm:pb-24 lg:pb-10">
              <div className="relative rotate-[-1.2deg]">
                <EditorialImage
                  src={heroPodcast}
                  alt="A young person setting up a podcast microphone beside a handwritten episode plan"
                  width={1536}
                  height={1024}
                  ratio="landscape"
                  priority
                  className="brand-frame rounded-3xl"
                />
                <span aria-hidden="true" className="brand-tape" />
              </div>

              <div className="absolute -bottom-2 start-0 w-[62%] max-w-xs sm:-bottom-6 sm:start-4 lg:-bottom-2">
                <DetailCard
                  glyph="microphone"
                  label="Illustrative example"
                  title="“Episode 3: Finding Voice.”"
                >
                  <WaveformStrip className="mb-2 h-6" bars={28} />
                  Recorded, edited and finished — then shared only after a guardian said yes.
                </DetailCard>
              </div>

              <div className="absolute -end-1 -top-6 hidden w-44 rotate-[2.5deg] sm:block">
                <DetailCard
                  glyph="notebook"
                  label="Working notebook"
                  title="Draft two: cut the intro, keep the pause."
                />
              </div>

              <div className="absolute -end-2 bottom-6 hidden w-40 -rotate-[2deg] lg:block">
                <DetailCard
                  glyph="prototype"
                  label="Next up"
                  title="A prototype that fixes one annoying thing."
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 2 — What children actually make */}
      <Section className="pt-20">
        <SectionHeading
          eyebrow="What children actually make here"
          title="Real things, finished and kept"
          description="Not worksheets and not content. Work with drafts behind it, a decision inside it, and someone specific it was made for."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mosaic.map((item, index) => (
            <article key={item.title} className={index === 0 ? "lg:col-span-2" : undefined}>
              <Figure
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                ratio={index === 0 ? "wide" : "landscape"}
                label={item.label}
              />
              <h3 className="mt-4 font-display text-lg leading-snug tracking-tight">
                {item.title}
              </h3>
            </article>
          ))}
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          All images and project titles on this page are illustrative examples created for Aurelia.
          They are not member work and do not depict identifiable people.
        </p>
      </Section>

      {/* 3 — Interest first */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Start with what they love"
          title="Interest first, always"
          description="A young person who cares about the subject will do harder work than one who is told what to make. Choose a way in — nothing here is ranked, recommended by behaviour, or personalised by tracking."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {interestPaths.map((path) => (
            <Link
              key={path.title}
              to="/ideas-and-resources"
              hash="explore"
              className="group block h-full"
            >
              <div className="brand-card flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 transition-colors group-hover:border-gold">
                <GoldRule className="w-8" />
                <h3 className="mt-4 font-display text-lg tracking-tight">{path.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{path.text}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <Button asChild>
            <Link to="/ideas-and-resources">Browse project starters</Link>
          </Button>
        </div>
      </Section>

      {/* 4 — One piece of work, one journey */}
      <Section>
        <SplitFeature
          image={
            <div className="space-y-4">
              <Figure
                src={teacherEvidence}
                alt="A teacher and a student looking together at printed project evidence and sketches"
                width={1280}
                height={960}
                label="Evidence review"
              />
              <PaperNote tone="lined" className="mt-6">
                Verification means an adult who saw the work confirms the skill it shows. It is
                deliberately harder to earn than a badge, and it belongs to the young person.
              </PaperNote>
            </div>
          }
        >
          <SectionHeading
            eyebrow="One piece of work, one learning journey"
            title="From a half-formed idea to something that counts"
            description="Every project in Aurelia travels the same route. Nothing skips a step, and nothing is published because it was popular."
          />
          <ol className="mt-8 space-y-4">
            {journey.map((item) => (
              <li key={item.step} className="flex gap-4">
                <span className="mt-1 font-display text-sm tracking-[0.2em] text-accent-foreground">
                  {item.step}
                </span>
                <span>
                  <span className="block font-medium">{item.title}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link to="/achievement-passport">See the Achievement Passport</Link>
            </Button>
          </div>
        </SplitFeature>
      </Section>

      {/* 5 — Childhood first */}
      <Section tone="ink">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow className="text-gold">Childhood first</Eyebrow>
            <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              We left out the things that make children feel measured
            </h2>
            <GoldRule className="mt-6 w-24" />
            <p className="mt-5 text-base leading-relaxed text-ink-foreground/75">
              Most of what a child meets online is designed to hold their attention. Aurelia is
              designed to hand it back. What we deliberately did not build matters as much as what we
              did.
            </p>
            <div className="mt-8">
              <Button asChild variant="secondary" size="lg">
                <Link to="/safety-and-trust">How safety is designed</Link>
              </Button>
            </div>
          </div>
          <ul className="space-y-4">
            {childhoodFirst.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-foreground/80">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 6 — Making together */}
      <Section>
        <SplitFeature
          reverse
          image={
            <Figure
              src={clubCollaboration}
              alt="A small supervised club of young people building a project together at a table"
              width={1280}
              height={960}
              label="Clubs & challenges"
            />
          }
        >
          <SectionHeading
            eyebrow="Challenges & Clubs"
            title="A reason to make something, and people to make it with"
            description="Challenges give the work a purpose. Clubs give it company — small, named-adult-supervised groups, with no open messaging and no audience metrics."
          />
          <CheckList
            className="mt-8"
            items={[
              "Challenges set by verified schools, groups and organisations.",
              "Small clubs with named adult supervision and bounded membership.",
              "No follower counts, no public popularity metrics, no livestreams.",
              "Submissions inherit the same guardian approval rules as all work.",
            ]}
          />
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link to="/challenges-and-clubs">See challenges and clubs</Link>
            </Button>
          </div>
        </SplitFeature>
      </Section>

      {/* 7 — For the adults around them */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="For the adults around them"
          title="Everyone gets exactly the access their role needs"
          description="Six roles, six deliberately separated workspaces — and clear limits on every one of them."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            <Figure
              src={familyReview}
              alt="A parent and child at a kitchen table looking together at a drawing on a tablet"
              width={1280}
              height={960}
              label="Family"
            />
            <Figure
              src={classroomMaking}
              alt="Students making projects with cardboard, paint and laptops in a sunlit classroom"
              width={1536}
              height={1024}
              ratio="wide"
              label="School"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {adults.map((role) => (
              <Link key={role.title} to={role.to} className="group block h-full">
                <FeatureCard icon={role.icon} title={role.title} className="h-full">
                  {role.text}
                </FeatureCard>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* 8 — Growing up without starting over */}
      <Section>
        <SplitFeature
          image={
            <Figure
              src={alumniPortfolio}
              alt="A young adult presenting a wall of pinned portfolio work to two people"
              width={1280}
              height={960}
              label="16+ Alumni"
            />
          }
        >
          <SectionHeading
            eyebrow="16+ Alumni"
            title="Growing up without starting over"
            description="At 16, a member moves into a separate adult environment — different rules, different community, no shared social surface with the under-16 world. What they choose to bring, they keep."
          />
          <CheckList
            className="mt-8"
            items={[
              "A deliberate transition, not an automatic merge of accounts.",
              "Selective portfolio and Passport continuity, chosen by the member.",
              "Opportunities, mentoring and community designed for adults.",
              "Parent Alumni gives families continuity without child-world access.",
            ]}
          />
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link to="/alumni-world">Explore the Alumni world</Link>
            </Button>
          </div>
        </SplitFeature>
      </Section>

      {/* 9 — Why Aurelia exists */}
      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Eyebrow>Why Aurelia exists</Eyebrow>
            <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              We wanted somewhere children could make things online without becoming the product
            </h2>

            <GoldRule className="mt-6 w-24" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Children are creative long before anyone gives them permission to be. What they
                mostly find online is a place to consume, compare and be counted — and the work they
                make disappears into someone else's metrics.
              </p>
              <p>
                We built Aurelia because the alternative should exist: a protected place where a
                young person makes something real, is given honest feedback by someone who cares
                about the work, and ends up with evidence of what they can actually do. Not a
                follower count. Not a streak. Evidence.
              </p>
              <p>
                That is also why the boundaries are strict. No open registration for children. No
                organisation browsing children. No adult messaging a child. If a feature would make
                Aurelia stickier but a child less safe, it does not get built.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/about">Read about Aurelia</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/community-standards">Our community standards</Link>
              </Button>
            </div>
          </div>
          <div className="space-y-5">
            <Figure
              src={passportEvidence}
              alt="An achievement certificate with a gold seal laid over a timeline of project photographs and notes"
              width={1280}
              height={960}
              label="Illustrative"
              caption="An illustrative representation of verified achievement and its evidence trail."
            />
            <Figure
              src={adultsCommunity}
              alt="A group of adults talking around a table with notebooks in a sunlit community room"
              width={1280}
              height={960}
              label="Parent community"
            />
          </div>
        </div>
      </Section>

      {/* 10 — Compare the model */}
      <Section>
        <SectionHeading
          eyebrow="Compare the model"
          title="Aurelia is not social media, and it is not a school portal"
          description="A plain comparison of three different kinds of place a child's work can live. No competitor names, no marketing arithmetic."
        />
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-start text-sm">
            <caption className="sr-only">
              Comparison of ordinary social media, an ordinary school portal and Aurelia across
              purpose, child identity, adult access, feedback, achievement, AI, data and turning 16.
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="w-40 py-3 pe-4 text-start font-medium">
                  &nbsp;
                </th>
                <th scope="col" className="py-3 pe-4 text-start font-medium text-muted-foreground">
                  Ordinary social media
                </th>
                <th scope="col" className="py-3 pe-4 text-start font-medium text-muted-foreground">
                  Ordinary school portal
                </th>
                <th scope="col" className="py-3 text-start font-medium">
                  Aurelia
                </th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.dimension} className="border-b border-border/60 align-top">
                  <th scope="row" className="py-4 pe-4 text-start font-medium">
                    {row.dimension}
                  </th>
                  <td className="py-4 pe-4 leading-relaxed text-muted-foreground">{row.social}</td>
                  <td className="py-4 pe-4 leading-relaxed text-muted-foreground">{row.portal}</td>
                  <td className="py-4 leading-relaxed">{row.aurelia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 11 — Safeguarding */}
      <Section tone="muted">
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Safeguarding</Eyebrow>
            <h2 className="mt-2 font-display text-2xl tracking-tight">
              Worried about something you have seen?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Anyone — child, parent, teacher or member of the public — can raise a safeguarding
              concern. Reports are triaged by urgency and handled through human safeguarding
              workflows. If someone is in immediate danger, contact your local emergency services
              first.
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
        description="Aurelia is invitation-only. Under-16 accounts are sponsored by a verified parent/guardian or school. Tell us who you are and we will guide you through it."
      />
    </PublicPage>
  );
}

const compareRows = [
  {
    dimension: "Purpose",
    social: "Attention and engagement time.",
    portal: "Administration and reporting.",
    aurelia: "Making real work and recording genuine achievement.",
  },
  {
    dimension: "Child identity",
    social: "A public profile, often discoverable.",
    portal: "An institutional record owned by the school.",
    aurelia: "A protected identity with no public directory of children.",
  },
  {
    dimension: "Adult access",
    social: "Strangers can often reach a child.",
    portal: "Staff access defined by the institution.",
    aurelia: "Verified roles only; organisations never contact children privately.",
  },
  {
    dimension: "Feedback",
    social: "Likes, comments and counts.",
    portal: "Grades and marks.",
    aurelia: "Structured constructive feedback tied to the work itself.",
  },
  {
    dimension: "Achievement",
    social: "Popularity signals.",
    portal: "Attainment data.",
    aurelia: "Verified by an adult who witnessed the work.",
  },
  {
    dimension: "AI",
    social: "Often generating and ranking content for you.",
    portal: "Rarely addressed explicitly.",
    aurelia: "Bounded, age-banded assistance with authorship labelled.",
  },
  {
    dimension: "Data",
    social: "Behavioural profiling and advertising.",
    portal: "Institutional data retention.",
    aurelia: "Minimal data, purpose limits, no behavioural targeting of children.",
  },
  {
    dimension: "Turning 16",
    social: "Nothing changes.",
    portal: "The record usually stays with the school.",
    aurelia: "A deliberate move to a separate adult environment, carrying selected work.",
  },
];
