import { Link, createFileRoute } from "@tanstack/react-router";
import { BookOpenCheck, ShieldCheck, Trophy, UsersRound } from "lucide-react";

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
      <PageHeader eyebrow="Authorised educator workspace" title="Teacher dashboard" description="Manage authorised cohorts, set structured challenges, review submissions and award verified achievements without gaining broader child access than the role requires." crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Teacher" }]} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader><CardDescription>Authorised classes</CardDescription><CardTitle className="text-3xl">3</CardTitle></CardHeader><CardContent><Badge variant="secondary">Preview data</Badge></CardContent></Card>
        <Card><CardHeader><CardDescription>Submissions to review</CardDescription><CardTitle className="text-3xl">18</CardTitle></CardHeader><CardContent><Badge variant="secondary">Preview data</Badge></CardContent></Card>
        <Card><CardHeader><CardDescription>Achievements awarded</CardDescription><CardTitle className="text-3xl">24</CardTitle></CardHeader><CardContent><Badge variant="secondary">Preview data</Badge></CardContent></Card>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><Trophy className="size-5 text-primary" /><CardTitle>Challenges</CardTitle><CardDescription>Create or review school challenges and submissions.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/challenges">Open challenges</Link></Button></CardContent></Card>
        <Card><CardHeader><UsersRound className="size-5 text-primary" /><CardTitle>Clubs & cohorts</CardTitle><CardDescription>Work only within authorised learner groups.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/clubs">Open clubs</Link></Button></CardContent></Card>
        <Card><CardHeader><ShieldCheck className="size-5 text-primary" /><CardTitle>Safeguarding</CardTitle><CardDescription>See only the cases and workflows your staff role permits.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/safeguarding">Open centre</Link></Button></CardContent></Card>
      </section>
      <Card><CardHeader><div className="flex items-center gap-2"><BookOpenCheck className="size-5 text-primary" /><CardTitle>Achievement verification</CardTitle></div><CardDescription>Teachers can verify appropriate projects, certificates, skills and leadership evidence for the Achievement Passport. Every verification is auditable.</CardDescription></CardHeader></Card>
    </div>
  );
}
