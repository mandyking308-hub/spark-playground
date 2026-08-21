import { Link, createFileRoute } from "@tanstack/react-router";
import { ClipboardList, KeyRound, ShieldCheck, UserCog } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/audit")({
  component: AuditPage,
});

const events = [
  {
    icon: UserCog,
    action: "Parent guardian link verified",
    actor: "School administrator",
    target: "Family account",
    level: "Review",
  },
  {
    icon: ShieldCheck,
    action: "Publication moderation completed",
    actor: "Safeguarding reviewer",
    target: "Podcast episode",
    level: "Info",
  },
  {
    icon: KeyRound,
    action: "Group administrator permission changed",
    actor: "Platform administrator",
    target: "Education group",
    level: "Security",
  },
];

function AuditPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Enterprise controls"
        title="Audit & compliance"
        description="Reviewable records for privileged access, consent, publishing, safeguarding and administrative changes."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Audit & compliance" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline"><Link to="/dashboard/incident-response">Incident response</Link></Button>
        <Button asChild variant="outline"><Link to="/dashboard/resilience">Backup & recovery</Link></Button>
        <Button asChild variant="outline"><Link to="/dashboard/observability">Privacy-safe observability</Link></Button>
        <Button asChild variant="outline"><Link to="/dashboard/configuration-security">Secrets & configuration</Link></Button>
        <Button asChild variant="outline"><Link to="/dashboard/supply-chain">Supply-chain security</Link></Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Privileged access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">Audited</p>
            <p className="text-sm text-muted-foreground">Sensitive staff actions require actor identity.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Consent history</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">Versioned</p>
            <p className="text-sm text-muted-foreground">Withdrawal does not erase the historical decision record.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Child-data boundary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">Least privilege</p>
            <p className="text-sm text-muted-foreground">Parent Alumni and partners gain no generic child access.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="size-4" /> Recent audit events
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {events.map((event) => (
            <div key={event.action} className="flex gap-4 p-5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                <event.icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{event.action}</p>
                  <Badge variant="outline">{event.level}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {event.actor} · {event.target}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Preview data only. The live audit table is append-only in the backend schema and will be populated when the dedicated database is connected.
      </p>
    </div>
  );
}
