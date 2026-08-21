import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, UserCog, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/staff-roles")({
  head: () => ({ meta: [{ title: "Staff Roles — Aurelia" }] }),
  component: StaffRoles,
});

const roles = [
  { role: "Teacher", scope: "Assigned school / classes" },
  { role: "School Admin", scope: "One school tenant" },
  { role: "Safeguarding Staff", scope: "School safety workflows" },
  { role: "Group Admin", scope: "Authorised schools only" },
];

function StaffRoles() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Authorised staff access"
        title="Staff roles & permissions"
        description="Assign operational roles without turning role selection into self-service privilege escalation. Every assignment is scoped to an authorised school or education group."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Staff Roles" }]}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((item) => (
          <Card key={item.role}>
            <CardHeader><div className="flex items-center gap-2"><UserCog className="size-5 text-primary" /><CardTitle>{item.role}</CardTitle></div><CardDescription>{item.scope}</CardDescription></CardHeader>
            <CardContent><Button variant="outline" disabled>Assign role</Button></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Privilege boundary</CardTitle></div></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="rounded-lg bg-muted/40 p-3">School admins assign roles only inside their own school.</p>
          <p className="rounded-lg bg-muted/40 p-3">Group admins assign roles only within their authorised school list.</p>
          <p className="rounded-lg bg-muted/40 p-3">Teachers cannot assign administrative roles.</p>
          <p className="rounded-lg bg-muted/40 p-3">Users cannot promote themselves through profile metadata.</p>
        </CardContent>
      </Card>

      <Badge variant="outline"><UsersRound className="mr-1 size-3" /> Preview role catalogue</Badge>
    </div>
  );
}
