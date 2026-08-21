import { Link, createFileRoute } from "@tanstack/react-router";
import { Lightbulb, MessageCircleHeart, ShieldCheck, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/feedback")({
  head: () => ({ meta: [{ title: "Constructive feedback — Aurelia" }] }),
  component: FeedbackInbox,
});

const encouragement = [
  { project: "My greener city model", reaction: "This inspired me", context: "Planet & Nature Club" },
  { project: "How solar panels work", reaction: "Clear explanation", context: "Science cohort" },
  { project: "Recycled fashion idea", reaction: "Creative idea", context: "Design challenge" },
];

function FeedbackInbox() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Encouragement without popularity pressure"
        title="Constructive feedback"
        description="See helpful acknowledgements from verified learning spaces. Feedback is about the work, not follower status: there are no public totals, rankings, trending scores or open peer comments."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Child", to: "/dashboard/child" }, { label: "Feedback" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Verified contexts only</Badge>
        <Badge variant="outline">No public counts</Badge>
        <Badge variant="outline">No rankings</Badge>
        <Badge variant="outline">No open comments</Badge>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><MessageCircleHeart className="size-5 text-primary" /><CardTitle>Encouragement received</CardTitle></div>
            <CardDescription>Shown as individual moments of feedback rather than a scoreboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {encouragement.map((item) => (
              <div key={`${item.project}-${item.reaction}`} className="rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Sparkles className="size-4" /></div>
                  <div>
                    <p className="font-medium">{item.reaction}</p>
                    <p className="mt-1 text-sm text-muted-foreground">On {item.project}</p>
                    <Badge variant="outline" className="mt-3">{item.context}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><div className="flex items-center gap-2"><Lightbulb className="size-5 text-primary" /><CardTitle>Encourage someone</CardTitle></div><CardDescription>Choose from constructive prompts when viewing work shared inside one of your verified groups.</CardDescription></CardHeader>
            <CardContent><Button asChild variant="outline"><Link to="/dashboard/feedback-send">Send encouragement</Link></Button></CardContent>
          </Card>

          <Card>
            <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Why it works this way</CardTitle></div></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="rounded-lg bg-muted/40 p-3">✓ Feedback stays inside verified cohorts, clubs and challenges.</p>
              <p className="rounded-lg bg-muted/40 p-3">✓ Reactions use constructive preset language.</p>
              <p className="rounded-lg bg-muted/40 p-3">✕ Children cannot compete for reaction totals.</p>
              <p className="rounded-lg bg-muted/40 p-3">✕ External organisations cannot react directly to children.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
