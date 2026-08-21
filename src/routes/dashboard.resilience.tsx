import { createFileRoute } from "@tanstack/react-router";
import { DatabaseBackup, History, ShieldCheck, UserRoundCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/resilience")({
  head: () => ({ meta: [{ title: "Resilience & recovery — Aurelia" }] }),
  component: ResiliencePage,
});

const checks = [
  "Replay deletion tombstones and valid retention rules",
  "Remove expired permissions and partner access grants",
  "Revalidate media quarantine and publication eligibility",
  "Verify row-level security and role/membership access",
  "Revoke restored application sessions",
];

function ResiliencePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operational resilience"
        title="Backup, restore & recovery"
        description="Recovery is designed to restore service without restoring old authority, deleted data or unsafe publication state. Backup metadata is tracked here; provider backup bytes and encryption keys remain outside the application database."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Audit", to: "/dashboard/audit" }, { label: "Resilience" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Deletion-aware restore</Badge>
        <Badge variant="outline">Two-person production approval</Badge>
        <Badge variant="outline">Isolated validation first</Badge>
        <Badge variant="outline">Old sessions revoked</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><DatabaseBackup className="size-5 text-primary" /><CardTitle>Backup catalogue</CardTitle><CardDescription>References, encryption state, expiry and verification status — never backup bytes, raw auth secrets or encryption keys.</CardDescription></CardHeader></Card>
        <Card><CardHeader><UserRoundCheck className="size-5 text-primary" /><CardTitle>Controlled restore</CardTitle><CardDescription>Production restore needs fresh step-up authentication, an incident/change reference and approval by a different authorised person.</CardDescription></CardHeader></Card>
        <Card><CardHeader><History className="size-5 text-primary" /><CardTitle>Recovery tests</CardTitle><CardDescription>Restore rehearsals run in isolated environments against policy-versioned recovery targets rather than relying on an untested backup claim.</CardDescription></CardHeader></Card>
      </div>

      <Card>
        <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Before restored data can serve traffic</CardTitle></div><CardDescription>A technically successful database restore is not enough.</CardDescription></CardHeader>
        <CardContent className="space-y-2">{checks.map((check) => <p key={check} className="rounded-lg border p-3 text-sm text-muted-foreground">{check}</p>)}</CardContent>
      </Card>

      <Card><CardHeader><CardTitle>Deletion is still deletion</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">A backup cannot become an undeclared archive. Completed deletion requests generate tombstones that must be re-applied after recovery so ordinary deleted profile/content/community data is not resurrected. Only separately valid, time-bounded retention holds remain authoritative for the records they cover.</CardContent></Card>
    </div>
  );
}
