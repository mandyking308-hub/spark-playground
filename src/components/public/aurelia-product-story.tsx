import {
  ArrowRight,
  Award,
  BellRing,
  BookOpen,
  CheckCircle2,
  CircleUserRound,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  Mic2,
  PenLine,
  School,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

const sidebarItems = [
  { label: "Home", icon: LayoutDashboard, active: true },
  { label: "Create", icon: PenLine },
  { label: "Passport", icon: Award },
  { label: "Clubs", icon: UsersRound },
];

const workItems = [
  {
    title: "Finding Voice",
    meta: "Podcast · Episode 3",
    state: "Guardian approved",
    icon: Mic2,
  },
  {
    title: "My neighbourhood map",
    meta: "Design project · Draft 4",
    state: "Working draft",
    icon: PenLine,
  },
  {
    title: "The tiny forest",
    meta: "Story · 8 pages",
    state: "Teacher review",
    icon: BookOpen,
  },
];

const workflow = [
  {
    step: "01",
    title: "Create",
    text: "Make the work in a private, child-owned workspace.",
    icon: Sparkles,
  },
  {
    step: "02",
    title: "Approve",
    text: "A guardian controls what can leave the family space.",
    icon: ShieldCheck,
  },
  {
    step: "03",
    title: "Verify",
    text: "A teacher confirms skills they genuinely witnessed.",
    icon: GraduationCap,
  },
  {
    step: "04",
    title: "Keep",
    text: "Evidence is added to a portable Achievement Passport.",
    icon: Award,
  },
];

const roleViews = [
  {
    eyebrow: "Young person",
    title: "Make something real",
    text: "Projects, podcasts, challenges and clubs live in one calm workspace without followers, likes or an endless feed.",
    icon: Sparkles,
    rows: ["Private drafts", "Creator tools", "My Passport"],
  },
  {
    eyebrow: "Parent / guardian",
    title: "See what needs your yes",
    text: "Parents approve sharing, manage permissions and see achievements without turning private creative work into surveillance.",
    icon: ShieldCheck,
    rows: ["2 approvals waiting", "Sharing controls", "Family permissions"],
  },
  {
    eyebrow: "Teacher / school",
    title: "Verify what you witnessed",
    text: "Schools can set briefs, review evidence, verify achievement and keep safeguarding and role boundaries visible.",
    icon: School,
    rows: ["Review queue", "Achievement issuer", "Safeguarding"],
  },
  {
    eyebrow: "16+ Alumni",
    title: "Carry the work forward",
    text: "At 16, selected work can move into a separate adult environment for portfolio, mentoring and opportunities.",
    icon: CircleUserRound,
    rows: ["Portfolio", "Mentoring", "Opportunities"],
  },
];

export function AureliaProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div
        aria-hidden="true"
        className="absolute -inset-5 rounded-[2.25rem] bg-gold/15 blur-2xl"
      />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-ink/10 bg-ink p-2 shadow-2xl shadow-ink/15">
        <div className="flex items-center gap-2 px-3 py-2 text-ink-foreground/60">
          <span className="size-2 rounded-full bg-gold" />
          <span className="size-2 rounded-full bg-ink-foreground/25" />
          <span className="size-2 rounded-full bg-ink-foreground/25" />
          <span className="ms-2 text-[0.65rem] font-medium tracking-[0.16em] uppercase">
            Aurelia workspace
          </span>
        </div>

        <div className="grid min-h-[29rem] overflow-hidden rounded-[1.35rem] bg-background sm:grid-cols-[8rem_1fr]">
          <aside className="hidden border-e border-border/80 bg-card/70 p-3 sm:block">
            <div className="mb-5 flex items-center gap-2 px-2 pt-1">
              <span className="flex size-7 items-center justify-center rounded-lg bg-ink text-xs font-semibold text-gold">
                A
              </span>
              <span className="font-display text-sm">Aurelia</span>
            </div>
            <nav className="space-y-1" aria-label="Illustrative Aurelia workspace navigation">
              {sidebarItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs ${
                    item.active
                      ? "bg-ink text-ink-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="size-3.5" aria-hidden="true" />
                  <span>{item.label}</span>
                </div>
              ))}
            </nav>
            <div className="mt-6 rounded-xl border border-border/70 bg-background p-2.5">
              <div className="flex items-center gap-2 text-[0.65rem] font-medium">
                <LockKeyhole className="size-3 text-accent-foreground" aria-hidden="true" />
                Protected space
              </div>
              <p className="mt-1.5 text-[0.6rem] leading-relaxed text-muted-foreground">
                No public child directory. No stranger messaging.
              </p>
            </div>
          </aside>

          <div className="min-w-0 p-4 sm:p-5">
            <header className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  My workspace
                </p>
                <h3 className="mt-1 font-display text-xl tracking-tight">Good afternoon, Maya</h3>
              </div>
              <div className="flex size-8 items-center justify-center rounded-full border bg-card">
                <BellRing className="size-3.5" aria-hidden="true" />
              </div>
            </header>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border bg-card p-3 sm:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.65rem] font-medium text-muted-foreground">Continue making</p>
                    <p className="mt-1 text-sm font-semibold">Finding Voice</p>
                  </div>
                  <span className="flex size-9 items-center justify-center rounded-xl bg-gold-soft text-gold-foreground">
                    <Mic2 className="size-4" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[72%] rounded-full bg-gold" />
                </div>
                <div className="mt-2 flex justify-between text-[0.6rem] text-muted-foreground">
                  <span>Draft saved</span>
                  <span>72% complete</span>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-3">
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-accent-foreground" aria-hidden="true" />
                  <p className="text-[0.65rem] font-medium text-muted-foreground">Passport</p>
                </div>
                <p className="mt-3 font-display text-2xl">12</p>
                <p className="text-[0.6rem] text-muted-foreground">verified pieces of evidence</p>
              </div>
            </div>

            <section className="mt-3 rounded-xl border bg-card p-3" aria-label="Illustrative recent work">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold">Recent work</p>
                  <p className="mt-0.5 text-[0.6rem] text-muted-foreground">Private until the right people approve it</p>
                </div>
                <span className="text-[0.6rem] font-medium text-accent-foreground">View all</span>
              </div>
              <div className="mt-3 divide-y divide-border/70">
                {workItems.map((item) => (
                  <div key={item.title} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <item.icon className="size-3.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{item.title}</p>
                      <p className="truncate text-[0.6rem] text-muted-foreground">{item.meta}</p>
                    </div>
                    <Badge variant="outline" className="hidden text-[0.55rem] sm:inline-flex">
                      {item.state}
                    </Badge>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gold/30 bg-gold-soft/45 p-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-accent-foreground" aria-hidden="true" />
                  <p className="text-xs font-semibold">Guardian approved</p>
                </div>
                <p className="mt-1.5 text-[0.65rem] leading-relaxed text-muted-foreground">
                  Finding Voice can now move to teacher verification.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="size-4 text-accent-foreground" aria-hidden="true" />
                  <p className="text-xs font-semibold">Teacher verification</p>
                </div>
                <p className="mt-1.5 text-[0.65rem] leading-relaxed text-muted-foreground">
                  Evidence review requested · pending
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[0.65rem] leading-relaxed text-muted-foreground">
        Illustrative product view · representative of Aurelia’s protected role-based workspace
      </p>
    </div>
  );
}

export function AureliaProductTour() {
  return (
    <section className="border-b border-border/70 bg-background py-18 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-accent-foreground uppercase">
            One protected journey
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            The work moves. The boundaries stay put.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Aurelia connects making, family approval, professional verification and lasting evidence
            without collapsing children, parents, schools and adults into one social network.
          </p>
        </div>

        <ol className="mt-12 grid gap-3 md:grid-cols-4">
          {workflow.map((item, index) => (
            <li key={item.step} className="relative rounded-2xl border bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-ink text-gold">
                  <item.icon className="size-4" aria-hidden="true" />
                </span>
                <span className="text-[0.65rem] font-semibold tracking-[0.16em] text-muted-foreground">
                  {item.step}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              {index < workflow.length - 1 ? (
                <ArrowRight
                  aria-hidden="true"
                  className="absolute -end-2.5 top-8 z-10 hidden size-5 rounded-full border bg-background p-1 text-muted-foreground md:block"
                />
              ) : null}
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-4 lg:grid-cols-2">
          {roleViews.map((view) => (
            <article key={view.eyebrow} className="overflow-hidden rounded-2xl border bg-card">
              <div className="grid sm:grid-cols-[1fr_0.82fr]">
                <div className="p-6 sm:p-7">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-gold-soft text-gold-foreground">
                    <view.icon className="size-4.5" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-[0.65rem] font-semibold tracking-[0.16em] text-accent-foreground uppercase">
                    {view.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-2xl tracking-tight">{view.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{view.text}</p>
                </div>
                <div className="border-t bg-muted/35 p-5 sm:border-s sm:border-t-0">
                  <div className="rounded-xl border bg-background p-3 shadow-sm">
                    <div className="mb-3 flex items-center justify-between border-b pb-2">
                      <span className="text-[0.6rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                        Workspace
                      </span>
                      <CheckCircle2 className="size-3.5 text-accent-foreground" aria-hidden="true" />
                    </div>
                    <div className="space-y-2">
                      {view.rows.map((row, index) => (
                        <div key={row} className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5">
                          <span
                            className={`size-1.5 rounded-full ${index === 0 ? "bg-gold" : "bg-muted-foreground/35"}`}
                            aria-hidden="true"
                          />
                          <span className="text-[0.68rem] font-medium">{row}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-4 rounded-2xl bg-ink p-6 text-ink-foreground sm:grid-cols-3 sm:p-8">
          <div>
            <p className="text-xs font-semibold text-gold">Childhood first</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-foreground/70">
              No public popularity metrics, behavioural advertising or open child discovery.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gold">Verified adults</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-foreground/70">
              Parents, teachers and organisations receive explicit roles rather than blanket access.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gold">Evidence that lasts</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-foreground/70">
              Finished work can become verified evidence a young person carries forward.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
