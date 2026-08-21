import { Link, createFileRoute } from "@tanstack/react-router";
import { BarChart3, Building2, Network, ShieldCheck, Trophy, UserCog, UsersRound } from "lucide-react";

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
        {[["Schools","12"],["Learners","8,420"],["Verified parents","11,600"],["Parent alumni","3,180"]].map(([label,value]) => <Card key={label}><CardHeader className="pb-3"><CardDescription>{label}</CardDescription><CardTitle className="text-3xl">{value}</CardTitle></CardHeader><CardContent><Badge variant="secondary">Preview</Badge></CardContent></Card>)}
      </div>
      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader><div className="flex items-center gap-2"><Building2 className="size-5 text-primary" /><CardTitle>Schools</CardTitle></div><CardDescription>Each institution remains separately scoped while group administrators receive authorised roll-ups.</CardDescription></CardHeader>
          <CardContent className="space-y-2">{schools.map((school) => <div key={school} className="flex items-center justify-between rounded-lg border p-3 text-sm"><span>{school}</span><Badge variant="outline">Preview tenant</Badge></div>)}<Button asChild className="mt-3"><Link to="/dashboard/group-schools">Manage schools</Link></Button></CardContent>
        </Card>
        <Card>
          <CardHeader><div className="flex items-center gap-2"><BarChart3 className="size-5 text-primary" /><CardTitle>Group outcomes</CardTitle></div></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground"><p>Creative participation and projects</p><p>Challenge participation across schools</p><p>Achievement Passport growth</p><p>Parent and Parent Alumni engagement</p><p>Aggregated safeguarding trends</p><p className="font-medium text-foreground">No cross-school child-row browser.</p></CardContent>
        </Card>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><Building2 className="size-5 text-primary" /><CardTitle>School tenants</CardTitle><CardDescription>Create/manage authorised schools.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/group-schools">Schools</Link></Button></CardContent></Card>
        <Card><CardHeader><UserCog className="size-5 text-primary" /><CardTitle>Staff roles</CardTitle><CardDescription>Assign roles within authorised schools only.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/staff-roles">Staff roles</Link></Button></CardContent></Card>
        <Card><CardHeader><Trophy className="size-5 text-primary" /><CardTitle>Group challenges</CardTitle><CardDescription>Run challenges across authorised schools.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/challenges">Challenges</Link></Button></CardContent></Card>
        <Card><CardHeader><UsersRound className="size-5 text-primary" /><CardTitle>Family network</CardTitle><CardDescription>Connect current parents and retain Parent Alumni.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/parent-community">Parent community</Link></Button></CardContent></Card>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><ShieldCheck className="size-5 text-primary" /><CardTitle>Group policy</CardTitle><CardDescription>Safeguarding and AI controls with school-level enforcement.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/safeguarding">Safeguarding</Link></Button></CardContent></Card>
        <Card><CardHeader><div className="flex items-center gap-2"><Network className="size-5 text-primary" /><CardTitle>Enterprise value</CardTitle></div><CardDescription>One protected infrastructure layer connects schools, pupils, current parents, Parent Alumni, approved partners and later student alumni while retaining role and tenant separation.</CardDescription></CardHeader></Card>
      </section>
    </div>
  );
}
