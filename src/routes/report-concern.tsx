import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, LockKeyhole } from "lucide-react";

import { PublicIntakeForm } from "@/components/public/public-intake-form";
import { PublicPage } from "@/components/public/public-page";
import { PageHero, Section } from "@/components/public/sections";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/report-concern")({
  head: () => ({
    meta: [
      { title: "Report a safeguarding concern — Aurelia" },
      {
        name: "description",
        content: "Submit an Aurelia-related safeguarding concern through a restricted intake route. Anonymous reports are accepted.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportConcernPage,
});

function ReportConcernPage() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="Safeguarding"
        title="Report a concern"
        description="Use this restricted form for an Aurelia-related concern about a child's safety, content involving a child, or conduct towards a child. You can report without giving your name or email."
        actions={
          <Button asChild variant="outline" size="lg">
            <Link to="/safeguarding-and-reporting"><ArrowLeft className="mr-2 size-4" /> Read the safeguarding process</Link>
          </Button>
        }
      />

      <Section tone="ink">
        <div className="flex gap-4 rounded-2xl border border-ink-foreground/20 bg-ink-foreground/5 p-6 sm:p-8">
          <AlertTriangle className="mt-1 size-7 shrink-0 text-gold" aria-hidden="true" />
          <div>
            <h2 className="font-display text-2xl tracking-tight">Immediate danger</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-foreground/80">
              If a child is in immediate danger, contact local emergency services now. Do not wait for an Aurelia response. You may still submit this form afterwards so the platform-side concern can be recorded.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
            <LockKeyhole className="mt-0.5 size-5 shrink-0 text-accent-foreground" aria-hidden="true" />
            <p>
              Include enough information to locate and understand the concern, such as an Aurelia username, project link, approximate time or what you observed. Avoid adding a child's home address, medical information or other details that are not needed for the report.
            </p>
          </div>
          <PublicIntakeForm mode="safeguarding" />
        </div>
      </Section>
    </PublicPage>
  );
}
