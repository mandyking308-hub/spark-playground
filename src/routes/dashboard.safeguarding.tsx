import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Eye, Flag, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/safeguarding")({
  head: () => ({ meta: [{ title: "Safeguarding Centre — Aurelia" }] }),
  component: SafeguardingCentre,
});

const queue = [
  { label: "Awaiting content review", count: 6, icon: Eye },
  { label: "Open user reports", count: 2, icon: Flag },
  { label: "High-priority escalations", count: 0, icon: AlertTriangle },
  { label: "Resolved today", count: 14, icon: CheckCircle2 },
];

function SafeguardingCentre() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Staff-only control plane"
        title="Safeguarding Centre"
        description="Moderation, reporting, escalation and audit live here. Serious decisions are reviewable and auditable; AI may flag risk but does not make final safeguarding decisions by itself."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Safeguarding Centre" }]}
      />
      <div className="flex flex-wrap gap-2"><Badge variant="secondary">Staff only</Badge><Badge variant="outline">Least-privilege access</Badge><Badge variant="outline">Audited decisions</Badge></div>
      <div className="flex flex-wrap gap-2"><Button asChild variant="outline"><Link to="/dashboard/report">Preview member report flow</Link></Button><Button asChild><Link to="/dashboard/safeguarding-case">Open case review</Link></Button></div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {queue.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-3"><item.icon className="size-5 text-primary" /><CardDescription>{item.label}</CardDescription><CardTitle className="text-3xl">{item.count}</CardTitle></CardHeader>
            <CardContent><span className="text-xs text-muted-foreground">Preview queue</span></CardContent>
          </Card>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Case lifecycle</CardTitle><CardDescription>Every action keeps a reason, reviewer and timestamp.</CardDescription></CardHeader>
          <CardContent className="space-y-2 text-sm">{["Private report / safety signal", "Severity triage", "Assigned human review", "Escalation where required", "Decision and action", "Follow-up / appeal", "Audited closure"].map((step, index) => <div key={step} className="flex items-center gap-3 rounded-lg border p-3"><span className="text-xs font-medium text-muted-foreground">0{index + 1}</span><span>{step}</span></div>)}</CardContent>
        </Card>
        <Card>
          <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Access boundary</CardTitle></div><CardDescription>Safeguarding records are more sensitive than normal school administration.</CardDescription></CardHeader>
          <CardContent className="space-y-3 text-sm"><p className="rounded-lg bg-muted/40 p-3">✓ Assigned teachers see only cases explicitly assigned to them.</p><p className="rounded-lg bg-muted/40 p-3">✓ School safeguarding staff stay school-scoped.</p><p className="rounded-lg bg-muted/40 p-3">✓ Group safeguarding sees only explicitly escalated cases in authorised schools.</p><p className="rounded-lg bg-muted/40 p-3">✕ Parent, alumni, organisation and general staff roles do not enter case queues.</p></CardContent>
        </Card>
      </section>
    </div>
  );
}
