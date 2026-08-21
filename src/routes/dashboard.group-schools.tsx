import { createFileRoute } from "@tanstack/react-router";
import { Building2, Plus, ShieldCheck, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/group-schools")({
  head: () => ({ meta: [{ title: "Group Schools — Aurelia" }] }),
  component: GroupSchools,
});

const schools = [
  { name: "School One", region: "London", learners: 420, status: "Active" },
  { name: "School Two", region: "London", learners: 610, status: "Active" },
  { name: "International Campus", region: "Madrid", learners: 520, status: "Pilot" },
];

function GroupSchools() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Education group operations"
        title="Schools"
        description="Create and manage authorised school tenants while preserving each school's child-data boundary. Group administrators receive aggregate oversight and scoped administrative rights, not a universal pupil browser."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Education Group", to: "/dashboard/group" }, { label: "Schools" }]}
      />

      <div className="flex flex-wrap gap-2"><Button disabled><Plus className="mr-2 size-4" />Add school</Button><Badge variant="outline">Group admin only</Badge></div>

      <div className="grid gap-4 md:grid-cols-3">
        {schools.map((school) => (
          <Card key={school.name}>
            <CardHeader><Building2 className="mb-2 size-5 text-primary" /><CardTitle>{school.name}</CardTitle><CardDescription>{school.region}</CardDescription></CardHeader>
            <CardContent className="space-y-3 text-sm"><p className="flex items-center gap-2"><UsersRound className="size-4 text-primary" />{school.learners} learners</p><Badge variant={school.status === "Active" ? "secondary" : "outline"}>{school.status}</Badge><Button variant="outline" className="w-full" disabled>Open tenant</Button></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Tenant boundary</CardTitle></div><CardDescription>Cross-school features such as group challenges and aggregate analytics operate through authorised programme scopes. They do not merge school rosters into one child directory.</CardDescription></CardHeader>
        <CardContent className="flex flex-wrap gap-2"><Badge variant="outline">Separate school RLS</Badge><Badge variant="outline">Authorised roll-ups</Badge><Badge variant="outline">No cross-school child search</Badge></CardContent>
      </Card>
    </div>
  );
}
