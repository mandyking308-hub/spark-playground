import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, Check, ShieldCheck, Sparkles, X } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/dashboard/ai-controls")({
  head: () => ({ meta: [{ title: "AI Controls — Aurelia" }] }),
  component: AiControls,
});

const allowed = [
  "Spelling and writing support",
  "Translation and accessibility",
  "Guided brainstorming",
  "Audio cleanup, transcripts and captions",
  "Age-appropriate learning support",
];

const blocked = [
  "AI companions or simulated friendships",
  "Romantic or sexual roleplay",
  "Medical, mental-health or identity diagnosis",
  "Behavioural manipulation or dependency loops",
  "Real-child deepfakes",
];

function AiControls() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Adult policy controls"
        title="AI Controls"
        description="Parents and schools control whether child AI tools are enabled. Platform policy still blocks prohibited uses even when AI is switched on."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "AI Controls" }]}
      />

      <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><BrainCircuit className="size-5 text-primary" /><CardTitle>Child AI access</CardTitle></div>
            <CardDescription>Preview controls — live settings will be stored per verified child and school policy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
              <div><p className="font-medium">Enable bounded AI tools</p><p className="text-sm text-muted-foreground">Parent control</p></div>
              <Switch checked disabled aria-label="AI enabled preview" />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
              <div><p className="font-medium">School AI policy</p><p className="text-sm text-muted-foreground">Organisation control</p></div>
              <Switch checked disabled aria-label="School AI enabled preview" />
            </div>
            <Badge variant="secondary">Both permissions must allow use</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Non-negotiable platform policy</CardTitle></div>
            <CardDescription>These controls cannot be weakened by a parent, school or child.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Allowed as bounded tools</p>
              {allowed.map((item) => <p key={item} className="flex gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{item}</p>)}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Always blocked</p>
              {blocked.map((item) => <p key={item} className="flex gap-2 text-sm text-muted-foreground"><X className="mt-0.5 size-4 shrink-0" />{item}</p>)}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Sparkles className="size-5 text-primary" /><CardTitle>Authorship rule</CardTitle></div>
          <CardDescription>When a child asks AI to do the whole task, the system moves into guided mode: questions, hints and scaffolding rather than a finished submission.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="outline">No child-content model training</Badge>
          <Badge variant="outline">No behavioural ads</Badge>
          <Badge variant="outline">No prompt retention by default</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
