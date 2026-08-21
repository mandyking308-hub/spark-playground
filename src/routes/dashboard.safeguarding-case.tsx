import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ClipboardCheck, LockKeyhole, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/safeguarding-case")({
  head: () => ({ meta: [{ title: "Safeguarding Case — Aurelia" }] }),
  component: SafeguardingCase,
});

function SafeguardingCase() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Need-to-know safety record"
        title="Case review"
        description="A restricted case workspace for authorised safeguarding reviewers. Evidence, decisions, escalation and follow-up remain attached to the case audit record."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Safeguarding", to: "/dashboard/safeguarding" }, { label: "Case review" }]}
      />
      <div className="flex flex-wrap gap-2"><Badge variant="secondary">High priority</Badge><Badge variant="outline">School scoped</Badge><Badge variant="outline">Assigned reviewers only</Badge></div>
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader><div className="flex items-center gap-2"><ClipboardCheck className="size-5 text-primary" /><CardTitle>Case evidence</CardTitle></div><CardDescription>Preview record. Sensitive evidence is not exposed outside the authorised case scope.</CardDescription></CardHeader>
          <CardContent className="space-y-3 text-sm"><p className="rounded-lg border p-3">Source: member safety report</p><p className="rounded-lg border p-3">Related record: moderated project comment</p><p className="rounded-lg border p-3">Automated signal: context review recommended</p><Button variant="outline" disabled>Open preserved evidence</Button></CardContent>
        </Card>
        <Card>
          <CardHeader><div className="flex items-center gap-2"><LockKeyhole className="size-5 text-primary" /><CardTitle>Access</CardTitle></div></CardHeader>
          <CardContent className="space-y-3 text-sm"><p className="rounded-lg bg-muted/40 p-3">Assigned safeguarding reviewer</p><p className="rounded-lg bg-muted/40 p-3">School safeguarding lead</p><p className="rounded-lg bg-muted/40 p-3">Group team only if explicitly escalated</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Human review & action</CardTitle><CardDescription>AI can flag or prioritise; a human reviewer records the actual decision.</CardDescription></CardHeader>
        <CardContent className="space-y-3"><Textarea placeholder="Record evidence-based review notes and rationale..." disabled /><div className="flex flex-wrap gap-2"><Button disabled>Record decision</Button><Button variant="outline" disabled><AlertTriangle className="mr-2 size-4" />Escalate case</Button><Button variant="outline" disabled>Request more context</Button></div></CardContent>
      </Card>
      <Card><CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Audit guarantee</CardTitle></div></CardHeader><CardContent className="text-sm text-muted-foreground">Every view, assignment, severity change, decision, escalation and closure will create an auditable event. Critical cases cannot be silently downgraded or closed by automation.</CardContent></Card>
    </div>
  );
}
