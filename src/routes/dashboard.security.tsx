import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, ShieldCheck, TimerReset, UserRoundCog } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/security")({
  head: () => ({ meta: [{ title: "Account security — Aurelia" }] }),
  component: SecurityPage,
});

const revocationEvents = [
  "Password/credential reset",
  "Role or verified membership changes",
  "Guardian relationship revocation",
  "Account deletion processing begins",
  "Manual security revocation",
];

function SecurityPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Identity and access"
        title="Account & session security"
        description="Identity is authenticated first; workspace authority is then resolved from verified server-side role, membership, guardian and age-transition records."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Security" }]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><UserRoundCog className="size-5 text-primary" /><CardTitle>Server-bound roles</CardTitle><CardDescription>The browser cannot grant itself a child, parent, staff, mentor or administrator role.</CardDescription></CardHeader>
          <CardContent><Badge variant="secondary">No role authority from URL/local storage</Badge></CardContent>
        </Card>
        <Card>
          <CardHeader><TimerReset className="size-5 text-primary" /><CardTitle>Session windows</CardTitle><CardDescription>Staff and platform-admin sessions expire sooner than ordinary member sessions, with both idle and absolute limits.</CardDescription></CardHeader>
          <CardContent><Badge variant="outline">Server-enforced expiry</Badge></CardContent>
        </Card>
        <Card>
          <CardHeader><KeyRound className="size-5 text-primary" /><CardTitle>Fresh verification</CardTitle><CardDescription>Deletion, Alumni transfer, safeguarding access, guardian changes and role grants require short-lived step-up authentication.</CardDescription></CardHeader>
          <CardContent><Badge variant="outline">Single-purpose · ≤10 minutes</Badge></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>When sessions are revoked</CardTitle></div><CardDescription>Changes that alter identity, authority or account safety invalidate existing sessions rather than waiting for natural expiry.</CardDescription></CardHeader>
        <CardContent className="space-y-2">
          {revocationEvents.map((event) => <p key={event} className="rounded-lg border p-3 text-sm text-muted-foreground">{event}</p>)}
          <Button disabled>Review active sessions</Button>
          <p className="text-xs text-muted-foreground">Session management becomes active only after the dedicated authentication backend is connected. Raw access/refresh tokens are never stored in the application session registry.</p>
        </CardContent>
      </Card>
    </div>
  );
}
