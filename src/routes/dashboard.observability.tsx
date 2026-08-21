import { createFileRoute } from "@tanstack/react-router";
import { Activity, Bug, Gauge, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/observability")({
  head: () => ({ meta: [{ title: "Privacy-safe observability — Aurelia" }] }),
  component: ObservabilityPage,
});

const allowed = ["Service availability", "Coarse latency buckets", "Error/status codes", "Capacity and region-level service demand"];
const blocked = ["Child identifiers or contact data", "Project/search/AI/chat content", "Precise location or full IP", "Behavioural funnels or advertising attribution"];

function ObservabilityPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operational monitoring"
        title="Privacy-safe observability"
        description="Measure whether Aurelia is healthy without turning children into analytics profiles. Diagnostics use coarse service dimensions and deliberately exclude user content and stable child identifiers."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Audit", to: "/dashboard/audit" }, { label: "Observability" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">No child behavioural funnels</Badge>
        <Badge variant="outline">No raw request/response bodies</Badge>
        <Badge variant="outline">No full IP or precise location</Badge>
        <Badge variant="outline">Diagnostic retention ≤90 days</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><Activity className="size-5 text-primary" /><CardTitle>Availability</CardTitle><CardDescription>Service health and failure signals without child-level engagement tracking.</CardDescription></CardHeader></Card>
        <Card><CardHeader><Gauge className="size-5 text-primary" /><CardTitle>Performance</CardTitle><CardDescription>Route templates and coarse duration buckets, with IDs and query strings removed.</CardDescription></CardHeader></Card>
        <Card><CardHeader><Bug className="size-5 text-primary" /><CardTitle>Errors</CardTitle><CardDescription>Error codes and non-reversible request correlation — not project text, AI prompts or safeguarding narratives.</CardDescription></CardHeader></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Allowed operational signals</CardTitle></CardHeader><CardContent className="space-y-2">{allowed.map((item) => <p key={item} className="rounded-lg border p-3 text-sm text-muted-foreground">✓ {item}</p>)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Outside telemetry</CardTitle></CardHeader><CardContent className="space-y-2">{blocked.map((item) => <p key={item} className="rounded-lg border p-3 text-sm text-muted-foreground">✕ {item}</p>)}</CardContent></Card>
      </div>

      <Card><CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Security evidence is different</CardTitle></div></CardHeader><CardContent className="text-sm text-muted-foreground">If an incident requires evidence to be retained longer, that record belongs in the controlled incident/audit lifecycle with a defined reason and policy — not in general telemetry as an indefinite log archive.</CardContent></Card>
    </div>
  );
}
