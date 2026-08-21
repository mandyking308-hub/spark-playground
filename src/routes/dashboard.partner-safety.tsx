import { createFileRoute } from "@tanstack/react-router";
import { Building2, EyeOff, MessageSquareWarning, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/partner-safety")({
  head: () => ({ meta: [{ title: "Partner safety boundaries — Aurelia" }] }),
  component: PartnerSafetyPage,
});

function PartnerSafetyPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Institutional access, not child access"
        title="Partner safety boundaries"
        description="Museums, universities, charities and companies can contribute real opportunities without becoming a direct data or messaging channel to under-16 members."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Organisations", to: "/dashboard/organisations" }, { label: "Partner safety" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Verified organisations only</Badge>
        <Badge variant="outline">No child directory/contact export</Badge>
        <Badge variant="outline">No partner DMs to children</Badge>
        <Badge variant="outline">No behavioural tracking</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><Building2 className="size-5 text-primary" /><CardTitle>Approved programme access</CardTitle><CardDescription>A verified organisation member acts only inside an approved programme. Organisation membership alone grants no child visibility.</CardDescription></CardHeader></Card>
        <Card><CardHeader><EyeOff className="size-5 text-primary" /><CardTitle>Sanitized submission review</CardTitle><CardDescription>A partner can see an explicitly shared challenge submission through a time-bounded grant and review alias — not the child's full profile, contact details or precise location.</CardDescription></CardHeader></Card>
        <Card><CardHeader><MessageSquareWarning className="size-5 text-primary" /><CardTitle>Moderated feedback</CardTitle><CardDescription>Partner free-text feedback enters a staff moderation queue. It is never delivered straight into a child's account or used to create a private conversation.</CardDescription></CardHeader></Card>
        <Card><CardHeader><UsersRound className="size-5 text-primary" /><CardTitle>Aggregate reporting</CardTitle><CardDescription>Programme reporting is aggregated, contains no child identifiers and requires a minimum cohort of 10 before partner access.</CardDescription></CardHeader></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>External links and tracking</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">Under-16 partner content may link only to approved HTTPS domains without common advertising/tracking query parameters. Third-party tracking pixels and cross-programme child tracking are outside the partner capability model.</CardContent>
      </Card>
    </div>
  );
}
