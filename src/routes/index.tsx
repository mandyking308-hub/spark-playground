import { Link, createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { roles, dashboardNav } from "@/config/navigation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurelia — Child-safe creation, learning and achievement" },
      {
        name: "description",
        content:
          "A global child-safe platform for under-16s to create, learn and earn achievements, with a separate 16+ alumni environment.",
      },
      { property: "og:title", content: "Aurelia — Child-safe creation, learning and achievement" },
      {
        property: "og:description",
        content:
          "A global child-safe platform for under-16s to create, learn and earn achievements, with a separate 16+ alumni environment.",
      },
    ],
  }),
  component: Landing,
});

const pillars = [
  { icon: Sparkles, title: "Create", text: "Tools for making, sharing and iterating on creative work." },
  { icon: GraduationCap, title: "Learn", text: "Structured pathways for classrooms and at home." },
  { icon: ShieldCheck, title: "Stay safe", text: "Safety, consent and oversight designed in from day one." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
              A
            </span>
            <span className="font-display text-sm tracking-tight">Aurelia</span>
          </Link>
          <nav className="ml-6 hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
            <Link to="/dashboard" className="transition-colors hover:text-foreground">
              Dashboards
            </Link>
            <Link to="/alumni" className="transition-colors hover:text-foreground">
              Alumni (16+)
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/auth/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-8 sm:py-28">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Application shell
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight text-foreground sm:text-6xl">
            A child-safe home for digital creation, learning and achievement.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Built for under-16s worldwide, with dedicated spaces for parents, teachers, schools and
            education groups — and a separate environment for alumni aged 16 and over.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/dashboard">Explore dashboards</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to={dashboardNav.alumni.to}>Alumni environment</Link>
            </Button>
          </div>
        </section>

        <section className="border-y border-border bg-muted/40">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-8">
            {pillars.map((pillar) => (
              <div key={pillar.title}>
                <pillar.icon className="size-5 text-foreground" aria-hidden="true" />
                <h2 className="mt-3 font-display text-lg tracking-tight">{pillar.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pillar.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8">
          <h2 className="font-display text-2xl tracking-tight">Workspaces</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Six role-based environments, currently empty shells.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...roles, { ...dashboardNav.alumni, key: "alumni", label: dashboardNav.alumni.label }].map(
              (item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="flex items-center gap-3 rounded-lg border border-border px-4 py-3.5 text-sm transition-colors hover:border-primary/40 hover:bg-muted/50"
                >
                  <item.icon className="size-4 text-muted-foreground" aria-hidden="true" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ),
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 text-xs text-muted-foreground sm:px-8">
          Aurelia — shell preview. Features, data and safety workflows come later.
        </div>
      </footer>
    </div>
  );
}
