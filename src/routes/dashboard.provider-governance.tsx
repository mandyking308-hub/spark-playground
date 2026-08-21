import { createFileRoute } from "@tanstack/react-router";
import { Bot, Database, Globe2, Network, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/provider-governance")({ component: ProviderGovernancePage });

const principles = [
  { icon: Database, title: "Purpose-bound data", text: "Every provider gets only explicitly approved data classes needed for its named service purpose." },
  { icon: Globe2, title: "Region/residency review", text: "Processing region is approved against versioned jurisdiction policy rather than inferred from language or account location." },
  { icon: Bot, title: "No child-data training", text: "AI and other providers cannot use child data for model training or behavioural advertising." },
  { icon: Network, title: "Subprocessor control", text: "Subprocessor and region changes trigger review before the processing chain is allowed to expand." },
  { icon: ShieldCheck, title: "Incident + revocation path", text: "Provider incidents and material changes can suspend or revoke approval and feed directly into incident response." },
];

function ProviderGovernancePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Third-party governance"
        title="Providers & data residency"
        description="Control what external providers may process, for what purpose, in which region, for how long and through which reviewed subprocessors."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Provider governance" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Explicit data-class grants</Badge>
        <Badge variant="outline">Versioned regional approval</Badge>
        <Badge variant="outline">No child-data training</Badge>
        <Badge variant="outline">Bounded retention</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {principles.map((item) => (
          <Card key={item.title}>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><item.icon className="size-4" />{item.title}</CardTitle></CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">{item.text}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Provider purpose boundaries</CardTitle></CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-3"><p className="font-medium">AI</p><p className="mt-1 text-muted-foreground">Bounded approved tasks; no child-data training.</p></div>
          <div className="rounded-lg border p-3"><p className="font-medium">Observability</p><p className="mt-1 text-muted-foreground">Operational telemetry only; no child content/profile data.</p></div>
          <div className="rounded-lg border p-3"><p className="font-medium">Payments</p><p className="mt-1 text-muted-foreground">Payment references only; not child creative/safety records.</p></div>
          <div className="rounded-lg border p-3"><p className="font-medium">Storage / moderation</p><p className="mt-1 text-muted-foreground">Only approved classes under reviewed region, retention and subprocessor terms.</p></div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">Provider governance preview only. No vendor is deemed approved merely because a connector or SDK exists.</p>
    </div>
  );
}
