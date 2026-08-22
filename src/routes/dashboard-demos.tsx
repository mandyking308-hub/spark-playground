import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Eye, Layers, ShieldCheck } from "lucide-react";

import { PublicPage } from "@/components/public/public-page";
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/public/sections";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardDemos, sharingJourney } from "@/data/dashboard-demos";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard-demos")({
  head: () => ({
    meta: [
      { title: "Dashboard demos — see every Aurelia workspace" },
      {
        name: "description",
        content:
          "Explore illustrative demos of the Aurelia workspaces for children, parents, teachers, schools, education groups, organisations and 16+ alumni.",
      },
      { property: "og:title", content: "Dashboard demos — see every Aurelia workspace" },
      {
        property: "og:description",
        content: "A demo-only showroom of the protected workspace each Aurelia role receives.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/dashboard-demos" }],
  }),
  component: DashboardDemosPage,
});

function DashboardDemosPage() {
  const [activeKey, setActiveKey] = useState(dashboardDemos[0]!.key);
  const active = dashboardDemos.find((demo) => demo.key === activeKey) ?? dashboardDemos[0]!;
  const ActiveIcon = active.icon;

  return (
    <PublicPage>
      <PageHero
        eyebrow="Dashboard demos"
        title={<>See the dashboards behind Aurelia</>}
        description="Every role gets a different protected workspace — a child never sees what a school administrator sees, and a partner organisation never sees a child at all. These are illustrative demos, not live accounts."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/pricing">See pricing</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/for-schools">For schools</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/for-families">For families</Link>
            </Button>
          </>
        }
      >
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Layers, title: "Separated by design", text: "Each role sees only the modules that role genuinely needs." },
            { icon: ShieldCheck, title: "Safety in the structure", text: "Approval, review and audit are part of the architecture." },
            { icon: Eye, title: "Demo content only", text: "Names, projects and numbers on this page are illustrative." },
          ].map((item) => (
            <div key={item.title} className="brand-card rounded-2xl border border-border/70 bg-card p-5">
              <item.icon className="size-5 text-accent-foreground" aria-hidden="true" />
              <p className="mt-3 font-display text-base tracking-tight">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Choose a workspace"
          title="One platform, eight very different views"
          description="Select a role to see a miniature version of that workspace. Everything shown is demo content — no real people, children, schools or figures."
        />

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Dashboard demos">
          {dashboardDemos.map((demo) => {
            const Icon = demo.icon;
            const selected = demo.key === active.key;
            return (
              <button
                key={demo.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveKey(demo.key)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  selected
                    ? "border-gold bg-gold-soft/70 text-foreground"
                    : "border-border/70 bg-card text-muted-foreground hover:border-accent-foreground/40 hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {demo.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div className="brand-card rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <ActiveIcon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <Badge variant="secondary">{active.audience}</Badge>
                <h3 className="mt-1 font-display text-2xl tracking-tight">{active.headline}</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{active.summary}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {active.metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-border/70 bg-muted/30 p-4">
                  <p className="font-display text-2xl tracking-tight">{metric.value}</p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Illustrative
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {active.modules.map((module) => (
                <Card key={module.title} className="border-border/70 shadow-none">
                  <CardHeader className="gap-1.5">
                    <module.icon className="size-4 text-primary" aria-hidden="true" />
                    <CardTitle className="text-sm font-medium">{module.title}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="brand-card overflow-hidden rounded-3xl border border-border/70 bg-card">
              <div className="flex items-center justify-between border-b border-border/70 bg-muted/40 px-5 py-3">
                <div>
                  <p className="text-sm font-medium">{active.panel.title}</p>
                  <p className="text-xs text-muted-foreground">{active.panel.description}</p>
                </div>
                <Badge variant="outline">Demo</Badge>
              </div>
              <ul className="divide-y divide-border/70">
                {active.panel.rows.map((row) => (
                  <li key={row.primary} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{row.primary}</p>
                      <p className="truncate text-xs text-muted-foreground">{row.secondary}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {row.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-border/70 bg-muted/30 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground">
                Boundaries in this workspace
              </p>
              <ul className="mt-3 space-y-3">
                {active.boundaries.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {active.key === "child" ? (
              <div className="rounded-3xl border border-border/70 bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground">
                  The sharing journey
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  How sharing is designed to work in Aurelia. Shown here as product design, not as a live
                  end-to-end publication workflow.
                </p>
                <ol className="mt-4 space-y-3">
                  {sharingJourney.map((stage, index) => (
                    <li key={stage.step} className="flex gap-3">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                        {index + 1}
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-foreground">{stage.step}</span>
                        <span className="block text-xs leading-relaxed text-muted-foreground">
                          {stage.description}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        </div>

        <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="size-4" aria-hidden="true" />
          All content on this page is illustrative demo content. No real users, children, schools, partners or
          billing records are shown.
        </p>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Why separate workspaces"
          title="Protection comes from structure, not promises"
          description="Aurelia does not give everyone one shared feed with settings on top. Each role has its own workspace, its own permissions and its own accountability."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardDemos.map((demo) => (
            <button
              key={demo.key}
              type="button"
              onClick={() => setActiveKey(demo.key)}
              className="brand-card group rounded-2xl border border-border/70 bg-card p-5 text-start transition-colors hover:border-accent-foreground/40"
            >
              <demo.icon className="size-5 text-accent-foreground" aria-hidden="true" />
              <p className="mt-3 font-display text-base tracking-tight">{demo.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{demo.summary}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                View demo
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Want to see it with your own school or family in mind?"
        description="Talk to us about licensing, or sign in if you already have a verified Aurelia workspace."
        primary={{ label: "Send an enquiry", to: "/contact-enquiry" }}
        secondary={{ label: "Sign in", to: "/auth/sign-in" }}
      />
    </PublicPage>
  );
}
