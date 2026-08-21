import { Link, createFileRoute } from "@tanstack/react-router";
import { BarChart3, Building2, Network, ShieldCheck, Trophy, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/group")({
  head: () => ({ meta: [{ title: "Education group admin — Aurelia" }] }),
  component: GroupDashboard,
});

const schools = ["School One", "School Two", "International Campus"];

function GroupDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Enterprise group control plane" title="Education group" description="Oversee schools, policies, cross-school challenges, family communities and group-level outcomes without collapsing tenant boundaries between individual schools." crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Education Group" }]} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[['Schools','12'],['Learners','8,420'],['Verified parents','11,600'],['Parent alumni','3,180']].map(([label,value]) => <Card key={label}><CardHeader className="pb-3"><CardDescription>{label}</CardDescription><CardTitle className="text-3xl">{value}</CardTitle></CardHeader><CardContent><Badge variant="secondary">Preview</Badge></CardContent></Card>)}
      </div>
      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader><div className="flex items-center gap-2"><Building2 className="size-5 text-primary" /><CardTitle>Schools</CardTitle></div><CardDescription>Each institution remains separately scoped while group administrators receive authorised roll-ups.</CardDescription></CardHeader>
          <CardContent className="space-y-2">{schools.map((school) => <div key={school} className="flex items-center justify-between rounded-lg border p-3 text-sm"><span>{school}</span><Badge variant="outline">Preview tenant</Badge></div>)}</CardContent>
        </Card>
        <Card>
          <CardHeader><div className="flex items-center gap-2"><BarChart3 className="size-5 text-primary" /><CardTitle>Group outcomes</CardTitle></div></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground"><p>Creative participation and projects</p><p>Challenge participation across schools</p><p>Achievement Passport growth</p><p>Parent and Parent Alumni engagement</p><p>Aggregated safeguarding trends</p></CardContent>
        </Card>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><Trophy className="size-5 text-primary" /><CardTitle>Group challenges</CardTitle><CardDescription>Run challenges across authorised schools.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/challenges">Challenges</Link></Button></CardContent></Card>
        <Card><CardHeader><UsersRound className="size-5 text-primary" /><CardTitle>Family network</CardTitle><CardDescription>Connect current parents across the group and retain Parent Alumni.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/parent-community">Parent community</Link></Button></CardContent></Card>
        <Card><CardHeader><ShieldCheck className="size-5 text-primary" /><CardTitle>Group policy</CardTitle><CardDescription>Safeguarding and AI controls with school-level enforcement.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/safeguarding">Safeguarding</Link></Button></CardContent></Card>
      </section>
      <Card><CardHeader><div className="flex items-center gap-2"><Network className="size-5 text-primary" /><CardTitle>Enterprise value</CardTitle></div><CardDescription>The group gets one protected digital infrastructure layer connecting schools, pupils, current parents, parent alumni, approved partners and later student alumni while retaining role and tenant separation.</CardDescription></CardHeader></Card>
    </div>
  );
}
