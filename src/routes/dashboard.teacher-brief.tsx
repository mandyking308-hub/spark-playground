import { createFileRoute } from "@tanstack/react-router";
import { BookOpenCheck, ShieldCheck, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/teacher-brief")({
  head: () => ({ meta: [{ title: "Teacher Brief Builder — Aurelia" }] }),
  component: TeacherBrief,
});

function TeacherBrief() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Assigned-cohort educator tool"
        title="Create a project brief"
        description="Teachers can set structured creative work for cohorts they are authorised to teach. The brief creates an evidence route into projects and the Achievement Passport without exposing unrelated pupils."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Teacher", to: "/dashboard/teacher" }, { label: "Brief Builder" }]}
      />
      <Card>
        <CardHeader><CardTitle>Brief details</CardTitle><CardDescription>Preview only until the secure backend is connected.</CardDescription></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2"><Label htmlFor="title">Title</Label><Input id="title" placeholder="Create a five-minute science podcast" disabled /></div>
          <div className="space-y-2"><Label htmlFor="cohort">Authorised cohort</Label><Input id="cohort" placeholder="Year 7 · Class A" disabled /></div>
          <div className="space-y-2"><Label htmlFor="due">Due date</Label><Input id="due" type="date" disabled /></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="brief">Instructions</Label><Textarea id="brief" placeholder="Explain the goal, evidence required and what success looks like..." disabled /></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="skills">Skills evidenced</Label><Input id="skills" placeholder="Research, communication, collaboration" disabled /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Scope before publish</CardTitle></div></CardHeader>
        <CardContent className="flex flex-wrap gap-2"><Badge variant="outline"><UsersRound className="mr-1 size-3" /> Assigned cohort only</Badge><Badge variant="outline">No public ranking</Badge><Badge variant="outline">Evidence-backed assessment</Badge></CardContent>
      </Card>
      <Button disabled><BookOpenCheck className="mr-2 size-4" />Publish brief to cohort</Button>
    </div>
  );
}
