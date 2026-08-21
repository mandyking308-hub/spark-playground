import { Link, createFileRoute } from "@tanstack/react-router";
import { Award, BookOpenCheck, FileCheck2, ShieldCheck, Trophy, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/teacher")({
  head: () => ({ meta: [{ title: "Teacher dashboard — Aurelia" }] }),
  component: TeacherDashboard,
});

function TeacherDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Authorised educator workspace" title="Teacher dashboard" description="Manage authorised cohorts, set structured briefs, review submissions and award verified achievements without gaining broader child access than the role requires." crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Teacher" }]} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader><CardDescription>Authorised classes</CardDescription><CardTitle className="text-3xl">3</CardTitle></CardHeader><CardContent><Badge variant="secondary">Preview data</Badge></CardContent></Card>
        <Card><CardHeader><CardDescription>Submissions to review</CardDescription><CardTitle className="text-3xl">18</CardTitle></CardHeader><CardContent><Badge variant="secondary">Preview data</Badge></CardContent></Card>
        <Card><CardHeader><CardDescription>Achievements awarded</CardDescription><CardTitle className="text-3xl">24</CardTitle></CardHeader><CardContent><Badge variant="secondary">Preview data</Badge></CardContent></Card>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card><CardHeader><BookOpenCheck className="size-5 text-primary" /><CardTitle>Project briefs</CardTitle><CardDescription>Create structured work for assigned cohorts.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/teacher-brief">Create brief</Link></Button></CardContent></Card>
        <Card><CardHeader><FileCheck2 className="size-5 text-primary" /><CardTitle>Review queue</CardTitle><CardDescription>Review evidence without public child comparisons.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/teacher-review">Review submissions</Link></Button></CardContent></Card>
        <Card><CardHeader><Award className="size-5 text-primary" /><CardTitle>Achievement issuer</CardTitle><CardDescription>Issue evidence-backed, auditable Passport records.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/achievement-issuer">Issue achievement</Link></Button></CardContent></Card>
        <Card><CardHeader><Trophy className="size-5 text-primary" /><CardTitle>Challenges</CardTitle><CardDescription>Create or review school challenges and submissions.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/challenges">Open challenges</Link></Button></CardContent></Card>
        <Card><CardHeader><UsersRound className="size-5 text-primary" /><CardTitle>Clubs & cohorts</CardTitle><CardDescription>Work only within authorised learner groups.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/clubs">Open clubs</Link></Button></CardContent></Card>
        <Card><CardHeader><ShieldCheck className="size-5 text-primary" /><CardTitle>Safeguarding</CardTitle><CardDescription>See only cases and workflows your role permits.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/safeguarding">Open centre</Link></Button></CardContent></Card>
      </section>
      <Card><CardHeader><div className="flex items-center gap-2"><BookOpenCheck className="size-5 text-primary" /><CardTitle>Achievement verification</CardTitle></div><CardDescription>Teachers verify appropriate projects, certificates, skills and leadership evidence for assigned learners. Every verification is auditable, evidence-backed and private by default.</CardDescription></CardHeader></Card>
    </div>
  );
}
