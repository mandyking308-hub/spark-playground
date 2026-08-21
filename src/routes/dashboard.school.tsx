import { Link, createFileRoute } from "@tanstack/react-router";
import { BarChart3, BrainCircuit, Building2, ShieldCheck, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/school")({
  head: () => ({ meta: [{ title: "School admin — Aurelia" }] }),
  component: SchoolDashboard,
});

function SchoolDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="School control plane" title="School admin" description="Manage people, school communities, policies, moderation and participation inside the school's tenant boundary." crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "School Admin" }]} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[['Learners','420'],['Verified parents','610'],['Active clubs','16'],['Open safety cases','2']].map(([label,value]) => <Card key={label}><CardHeader className="pb-3"><CardDescription>{label}</CardDescription><CardTitle className="text-3xl">{value}</CardTitle></CardHeader><CardContent><Badge variant="secondary">Preview</Badge></CardContent></Card>)}
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><ShieldCheck className="size-5 text-primary" /><CardTitle>Safeguarding</CardTitle><CardDescription>Moderation, reports, escalation and audit.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/safeguarding">Open centre</Link></Button></CardContent></Card>
        <Card><CardHeader><BrainCircuit className="size-5 text-primary" /><CardTitle>AI policy</CardTitle><CardDescription>Set the school's child AI availability within platform limits.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/ai-controls">AI controls</Link></Button></CardContent></Card>
        <Card><CardHeader><UsersRound className="size-5 text-primary" /><CardTitle>Communities</CardTitle><CardDescription>School clubs plus verified parent community.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/clubs">View clubs</Link></Button></CardContent></Card>
        <Card><CardHeader><Building2 className="size-5 text-primary" /><CardTitle>Partners</CardTitle><CardDescription>Approved organisation spaces and programmes.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/organisations">View partners</Link></Button></CardContent></Card>
      </section>
      <Card><CardHeader><div className="flex items-center gap-2"><BarChart3 className="size-5 text-primary" /><CardTitle>School reporting</CardTitle></div><CardDescription>Participation, project creation, challenge completion, passport achievements and safeguarding trends will roll up here without exposing unnecessary child-level data.</CardDescription></CardHeader></Card>
    </div>
  );
}
