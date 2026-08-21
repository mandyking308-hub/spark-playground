import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, MessageCircleHeart, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/feedback-send")({
  head: () => ({ meta: [{ title: "Send encouragement — Aurelia" }] }),
  component: SendFeedback,
});

const reactions = [
  { label: "This inspired me", icon: Sparkles },
  { label: "Clear explanation", icon: Lightbulb },
  { label: "Creative idea", icon: MessageCircleHeart },
  { label: "Great teamwork", icon: UsersRound },
];

function SendFeedback() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Constructive peer encouragement"
        title="Send encouragement"
        description="Choose a helpful reaction for work that has been shared inside your verified learning space. There is no free-text peer comment box and no public reaction score."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Feedback", to: "/dashboard/feedback" }, { label: "Send encouragement" }]}
      />

      <section className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Shared project preview</CardTitle><CardDescription>Planet & Nature Club · verified context</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border bg-muted/30 p-5">
              <p className="font-medium">A greener city model</p>
              <p className="mt-2 text-sm text-muted-foreground">Project content will appear here only when it has been shared to a group you are authorised to see.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {reactions.map((reaction) => (
                <Button key={reaction.label} variant="outline" className="h-auto justify-start gap-2 p-4" disabled>
                  <reaction.icon className="size-4" />{reaction.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Sending activates when secure membership checks and persistence are connected.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Feedback boundary</CardTitle></div></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="rounded-lg bg-muted/40 p-3">✓ You must share the same verified cohort, club or challenge context.</p>
            <p className="rounded-lg bg-muted/40 p-3">✓ Feedback stays attached to the project and learning context.</p>
            <p className="rounded-lg bg-muted/40 p-3">✕ No self-reactions.</p>
            <p className="rounded-lg bg-muted/40 p-3">✕ No free-text peer comments or contact details.</p>
            <Badge variant="secondary">Encouragement, not popularity</Badge>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
