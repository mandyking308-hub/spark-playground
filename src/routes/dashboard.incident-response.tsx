import { createFileRoute } from "@tanstack/react-router";
import { BellRing, FileWarning, ShieldAlert, Wrench } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/incident-response")({
  head: () => ({ meta: [{ title: "Incident response — Aurelia" }] }),
  component: IncidentResponsePage,
});

const lifecycle = ["Detect & open", "Contain", "Investigate", "Remediate", "Monitor", "Close with evidence"];

function IncidentResponsePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Security & privacy operations"
        title="Incident response"
        description="A controlled response path for account security, privacy/safeguarding data, partner access, service integrity and provider incidents."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Audit", to: "/dashboard/audit" }, { label: "Incident response" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Contain first</Badge>
        <Badge variant="outline">No raw secrets in incident logs</Badge>
        <Badge variant="outline">Jurisdiction-versioned notice timing</Badge>
        <Badge variant="outline">Second review for high/critical closure</Badge>
      </div>

      <Card>
        <CardHeader><CardTitle>Response lifecycle</CardTitle><CardDescription>Incidents cannot jump from detection straight to “closed”.</CardDescription></CardHeader>
        <CardContent><ol className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">{lifecycle.map((step, index) => <li key={step} className="rounded-lg border p-3 text-sm"><span className="text-xs text-muted-foreground">0{index + 1}</span><p className="mt-1 font-medium">{step}</p></li>)}</ol></CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader><ShieldAlert className="size-5 text-primary" /><CardTitle>Containment</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Revoke sessions, suspend partner access, quarantine publication or disable integrations according to incident type.</CardContent></Card>
        <Card><CardHeader><FileWarning className="size-5 text-primary" /><CardTitle>Evidence</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Use scoped references/hashes and narrow retention holds. Do not duplicate raw child content or secrets into the incident narrative.</CardContent></Card>
        <Card><CardHeader><BellRing className="size-5 text-primary" /><CardTitle>Notification</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Who must be notified and by when comes from the applicable versioned jurisdiction policy; child-facing external notices remain generic.</CardContent></Card>
        <Card><CardHeader><Wrench className="size-5 text-primary" /><CardTitle>Closure</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">High and critical incidents need containment, completed monitoring, root cause, corrective actions and a second reviewer before closure.</CardContent></Card>
      </div>
    </div>
  );
}
