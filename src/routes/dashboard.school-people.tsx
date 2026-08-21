import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck, UserRoundCheck, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/school-people")({
  head: () => ({ meta: [{ title: "School People — Aurelia" }] }),
  component: SchoolPeople,
});

const cohorts = [
  { name: "Year 7", learners: 72, staff: 8 },
  { name: "Year 8", learners: 68, staff: 7 },
  { name: "Year 9", learners: 70, staff: 9 },
];

function SchoolPeople() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="School-scoped people operations"
        title="People & cohorts"
        description="Manage staff, learner cohorts and verified family links inside one school's boundary. Group-level reporting can aggregate counts, but it does not turn this roster into a cross-school child directory."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "School Admin", to: "/dashboard/school" }, { label: "People" }]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader><UsersRound className="size-5 text-primary" /><CardDescription>Learners</CardDescription><CardTitle className="text-3xl">420</CardTitle></CardHeader><CardContent><Badge variant="secondary">School scoped</Badge></CardContent></Card>
        <Card><CardHeader><GraduationCap className="size-5 text-primary" /><CardDescription>Staff</CardDescription><CardTitle className="text-3xl">46</CardTitle></CardHeader><CardContent><Badge variant="secondary">Verified roles</Badge></CardContent></Card>
        <Card><CardHeader><UserRoundCheck className="size-5 text-primary" /><CardDescription>Verified parents</CardDescription><CardTitle className="text-3xl">610</CardTitle></CardHeader><CardContent><Badge variant="secondary">Guardian links</Badge></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Cohorts</CardTitle><CardDescription>Preview roster summaries. Child-level rows remain unavailable until the secure backend, auth and school scope are connected.</CardDescription></CardHeader>
        <CardContent className="space-y-2">
          {cohorts.map((cohort) => (
            <div key={cohort.name} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 text-sm">
              <div><p className="font-medium">{cohort.name}</p><p className="text-muted-foreground">{cohort.learners} learners · {cohort.staff} staff</p></div>
              <Button variant="outline" disabled>Open cohort</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Role assignment</CardTitle></div><CardDescription>School admins can assign roles only inside this school. Group admins can assign only within schools in their authorised group scope.</CardDescription></CardHeader>
        <CardContent className="flex flex-wrap gap-2"><Badge variant="outline">Teacher</Badge><Badge variant="outline">School admin</Badge><Badge variant="outline">Safeguarding staff</Badge><Badge variant="outline">Club moderator</Badge></CardContent>
      </Card>
    </div>
  );
}
