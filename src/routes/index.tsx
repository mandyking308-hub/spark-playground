import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenText,
  BriefcaseBusiness,
  CheckCircle2,
  Film,
  Gamepad2,
  HeartHandshake,
  Lightbulb,
  LockKeyhole,
  Mic2,
  Palette,
  School,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { PublicPage } from "@/components/public/public-page";
import { CtaBand, Section, SectionHeading } from "@/components/public/sections";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurelia — Create. Learn. Achieve. Safely." },
      {
        name: "description",
        content:
          "A protected global world where young people create real work, develop real skills and build verified achievements without being turned into followers, metrics or products.",
      },
      { property: "og:title", content: "Aurelia — Create. Learn. Achieve. Safely." },
      {
        property: "og:description",
        content:
          "A protected global creation, learning and achievement world for under-16s, with a separate 16+ alumni environment.",
      },
    ],
  }),
  component: HomePage,
});

const interests = [
  { icon: Palette, label: "Create & design", detail: "Art, visual ideas, making and creative experiments" },
  { icon: Lightbulb, label: "Science & invention", detail: "Prototype, test, explain and improve" },
  { icon: BookOpenText, label: "Stories & words", detail: "Stories, books, scripts, journalism and ideas" },
  { icon: Mic2, label: "Podcast & voice", detail: "Record, interview, explain and tell a story" },
  { icon: Gamepad2, label: "Coding & games", detail: "Build interactive ideas and digital projects" },
  { icon: Film, label: "Film & media", detail: "Plan, shoot, edit and present" },
  { icon: BriefcaseBusiness, label: "Enterprise & ideas", detail: "Pitch, solve problems and build something useful" },
];

const journey = [
  ["01", "Idea", "Start with a question, passion or challenge."],
  ["02", "Draft", "Make privately, experiment and change your mind."],
  ["03", "Create", "Turn the idea into something real."],
  ["04", "Feedback", "Receive constructive responses inside verified contexts."],
  ["05", "Approval", "Guardian or school approval protects wider sharing."],
  ["06", "Verify", "A teacher or authorised adult can verify the evidence."],
  ["07", "Passport", "Keep the achievement with its provenance."],
] as const;

function HomePage() {
  return (
    <PublicPage>
      <section className="overflow-hidden border-b border-border/70 bg-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-14">
          <div className="relative z-10 flex flex-col justify-center lg:pr-12">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-gold/35 bg-gold-soft/60 px-3 py-1.5 text-xs font-semibold text-gold-foreground">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Invitation-only · built for childhood
            </div>
            <h1 className="max-w-3xl font-display text-5xl leading-[0.98] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
              Create. Learn. Achieve. <span className="text-gold-foreground">Safely.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Aurelia is a protected global world where young people under 16 make real things, develop real skills and build achievements that trusted adults have genuinely verified.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/auth/join">Join with an invitation <ArrowRight className="ml-2 size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/ideas-and-resources">Explore ideas & resources</Link>
              </Button>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Children join through a verified parent/guardian or school invitation. <Link to="/for-schools" className="font-medium text-foreground underline underline-offset-4">Schools start here</Link>.
            </p>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                [ShieldCheck, "Child-first by design"],
                [LockKeyhole, "Private by default"],
                [HeartHandshake, "Human-led safety"],
              ].map(([Icon, label]) => {
                const IconComponent = Icon as LucideIcon;
                return (
                  <div key={String(label)} className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/80 px-3 py-2 text-sm font-medium">
                    <IconComponent className="size-4 text-accent-foreground" aria-hidden="true" />
                    <span>{String(label)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-border/70 bg-muted sm:min-h-[500px] lg:min-h-[590px]">
            <img
              src="/assets/editorial/aurelia-hero.jpg"
              alt="Illustrative young creator drawing at a desk in a warm creative studio"
              className="absolute inset-0 h-full w-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-6 pt-28 text-ink-foreground sm:p-8">
              <div className="max-w-md rounded-2xl border border-white/15 bg-ink/72 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">The principle</p>
                <p className="mt-2 font-display text-2xl leading-tight">A child&apos;s work should feel worth making before anyone else sees it.</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-foreground/75">Private making first. Constructive feedback second. Wider sharing only when the right adults have approved it.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="What children actually make here"
          title="Not content for a feed. Work with a beginning, a middle and an outcome."
          description="Illustrative examples of the kinds of projects Aurelia is built to support — not customer work, rankings or popularity content."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-12">
          <ExampleCard className="md:col-span-5 md:row-span-2" icon={Mic2} title="A five-minute podcast" text="Plan a question, interview someone, edit the audio and publish only when approved." accent="Podcast" />
          <ExampleCard className="md:col-span-3" icon={BookOpenText} title="A short story" text="Draft, rewrite, illustrate and keep the finished work in a private portfolio." accent="Story" />
          <ExampleCard className="md:col-span-4" icon={Wrench} title="A working prototype" text="Show the problem, the first attempt, what failed and what changed." accent="Invention" />
          <ExampleCard className="md:col-span-4" icon={Film} title="A tiny documentary" text="Research, script, film, edit and add a reflection on what was learned." accent="Film" />
          <ExampleCard className="md:col-span-3" icon={Gamepad2} title="A playable idea" text="Build a simple game or interactive project and explain how it works." accent="Code" />
          <ExampleCard className="md:col-span-5" icon={Trophy} title="A challenge response" text="Solve a real brief, submit evidence and receive moderated, constructive feedback." accent="Challenge" />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Start with what they love"
          title="Discovery without a behavioural feed"
          description="Aurelia can help a young person find a starting point by interest, age band and format — without building a behavioural profile around what keeps them scrolling."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {interests.map(({ icon: Icon, label, detail }) => (
            <Link key={label} to="/ideas-and-resources" className="group rounded-2xl border border-border bg-card p-5 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gold-soft text-gold-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-xl tracking-tight">{label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</p>
              <span className="mt-4 inline-flex items-center text-sm font-medium">Explore <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" /></span>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-foreground">One piece of work</p>
            <h2 className="mt-3 max-w-lg font-display text-4xl tracking-tight sm:text-5xl">One learning journey from idea to evidence.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">The product is designed around doing, reflecting and proving — not around posting more often.</p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/achievement-passport">See the Achievement Passport</Link>
            </Button>
          </div>
          <div className="relative border-s border-gold/35 ps-6 sm:ps-8">
            {journey.map(([step, title, text]) => (
              <div key={step} className="relative pb-7 last:pb-0">
                <span className="absolute -left-[2.05rem] top-1 flex size-6 items-center justify-center rounded-full border border-gold/50 bg-background text-[10px] font-bold text-gold-foreground sm:-left-[2.55rem]">{step}</span>
                <h3 className="font-display text-2xl tracking-tight">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="ink">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Childhood first</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">The things we chose not to build matter too.</h2>
            <p className="mt-5 text-base leading-7 text-ink-foreground/75">Aurelia is designed to help children make, learn and achieve without copying the mechanics that turn childhood into performance.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["No follower counts", "No popularity score", "No endless-scroll feed", "No unrelated adult DMs", "No child directory", "No behavioural advertising", "No AI companion relationship", "No livestream pressure"].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-ink-foreground/15 bg-ink-foreground/5 px-4 py-3 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="For the adults around them"
          title="Support without taking over"
          description="Different adults have different jobs. Aurelia keeps those boundaries visible."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <AudienceCard icon={Users} title="Families" text="Approve wider sharing, see progress and protect privacy without opening every private draft." to="/for-families" />
          <AudienceCard icon={School} title="Teachers & schools" text="Set briefs, review authorised work and verify achievements with evidence." to="/for-schools" />
          <AudienceCard icon={ShieldCheck} title="Education groups" text="Govern schools, roles, safeguarding and aggregate outcomes without creating a cross-school child directory." to="/for-education-groups" />
          <AudienceCard icon={BriefcaseBusiness} title="Organisations" text="Offer approved challenges, content and opportunities through institutions — never direct child access." to="/for-organisations" />
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-foreground">Growing up without starting over</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">At 16+, the environment changes. The person does not disappear.</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Selected verified Passport items can move into the separate 16+ Alumni environment. Private childhood records do not transfer automatically.</p>
            <Button asChild className="mt-6">
              <Link to="/alumni-world">Explore the 16+ world</Link>
            </Button>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <p className="font-display text-2xl tracking-tight">A portfolio that can grow into opportunity.</p>
            <div className="mt-6 space-y-4 text-sm text-muted-foreground">
              <div className="flex gap-3"><Trophy className="mt-0.5 size-5 shrink-0 text-gold-foreground" /><span>Verified achievements with issuer and evidence provenance.</span></div>
              <div className="flex gap-3"><BriefcaseBusiness className="mt-0.5 size-5 shrink-0 text-gold-foreground" /><span>Applications disclose only the adult portfolio items deliberately selected.</span></div>
              <div className="flex gap-3"><Users className="mt-0.5 size-5 shrink-0 text-gold-foreground" /><span>Adult-to-adult mentoring and opportunity pathways remain separate from the under-16 world.</span></div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-foreground">Why Aurelia exists</p>
          <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">We wanted children to have somewhere online where making something mattered more than being watched.</h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">Somewhere a rough first attempt could stay private. Somewhere an adult could witness real progress without turning a child into a data point. Somewhere achievement could travel forward without childhood being permanently exposed behind it.</p>
        </div>
      </Section>

      <CtaBand
        eyebrow="Aurelia"
        title="Give young people somewhere worth making things."
        description="Invitation-only access for children, verified adult roles, and a platform built around creation, evidence and trust."
        primary={{ label: "Join with an invitation", to: "/auth/join" }}
        secondary={{ label: "Send an enquiry", to: "/contact-enquiry" }}
      />
    </PublicPage>
  );
}

function ExampleCard({
  icon: Icon,
  title,
  text,
  accent,
  className = "",
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  accent: string;
  className?: string;
}) {
  return (
    <article className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 ${className}`}>
      <div className="absolute -right-8 -top-8 size-28 rounded-full bg-gold-soft/70 transition-transform group-hover:scale-110" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-ink text-ink-foreground"><Icon className="size-5" aria-hidden="true" /></div>
          <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Example · {accent}</span>
        </div>
        <h3 className="mt-7 font-display text-3xl tracking-tight">{title}</h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </article>
  );
}

function AudienceCard({ icon: Icon, title, text, to }: { icon: LucideIcon; title: string; text: string; to: string }) {
  return (
    <Link to={to as never} className="group rounded-2xl border border-border bg-card p-6 transition-transform hover:-translate-y-0.5">
      <div className="flex size-11 items-center justify-center rounded-xl bg-gold-soft text-gold-foreground"><Icon className="size-5" aria-hidden="true" /></div>
      <h3 className="mt-5 font-display text-2xl tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
      <span className="mt-5 inline-flex items-center text-sm font-medium">Learn more <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" /></span>
    </Link>
  );
}
