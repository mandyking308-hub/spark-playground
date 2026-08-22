import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  tone = "default",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted" | "ink";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "border-b border-border/70",
        tone === "muted" && "bg-muted/35",
        tone === "ink" && "brand-ink-panel bg-ink text-ink-foreground",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 sm:py-20">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
      <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function FeatureCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "brand-card rounded-2xl border border-border/70 bg-card p-6 transition-colors hover:border-accent-foreground/30",
        className,
      )}
    >
      {Icon ? (
        <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      ) : null}
      <h3 className="font-display text-lg tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
          <span
            aria-hidden="true"
            className="mt-2 size-1.5 shrink-0 rounded-full bg-gold"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CtaBand({
  title,
  description,
  primary = { label: "Join with invitation", to: "/auth/join" },
  secondary = { label: "Talk to our team", to: "/contact" },
}: {
  title: string;
  description: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
}) {
  return (
    <Section tone="ink">
      <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 text-base leading-relaxed text-ink-foreground/75">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link to={primary.to}>{primary.label}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-ink-foreground/30 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
          >
            <Link to={secondary.to}>{secondary.label}</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="brand-dawn border-b border-border/70">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
        <div className="max-w-3xl">
          {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
          <h1 className="font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{description}</p>
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Trust & legal" title={title} description={intro} />
      <Section>
        <div className="max-w-3xl space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-xl [&_h2]:tracking-tight [&_h2]:text-foreground [&_h3]:font-medium [&_h3]:text-foreground [&_li]:mt-2 [&_p]:mt-3 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:ps-5">
          <p className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs">
            Draft for review · Last updated {updated}. This document describes how Aurelia is
            designed to work. It is a working draft and should be reviewed by qualified legal
            counsel before public launch.
          </p>
          {children}
        </div>
      </Section>
    </>
  );
}
