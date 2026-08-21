import { Link, createFileRoute } from "@tanstack/react-router";
import { BriefcaseBusiness, CalendarDays, HeartHandshake, ShieldCheck, UserRoundCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/parent-alumni")({
  head: () => ({ meta: [{ title: "Parent Alumni dashboard — Aurelia" }] }),
  component: ParentAlumniDashboard,
});

function ParentAlumniDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Adult alumni family network" title="Parent Alumni" description="Stay part of the adult community after your child leaves: relationships, events, professional groups, volunteering and philanthropy can continue without granting access to current pupils." crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Parent Alumni" }]} />
      <div className="flex flex-wrap gap-2"><Badge variant="secondary">Verified adults</Badge><Badge variant="outline">Opt-in alumni status</Badge><Badge variant="outline">No child access</Badge></div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><UserRoundCheck className="size-5 text-primary" /><CardTitle>Alumni network</CardTitle><CardDescription>Find and reconnect with verified former parents.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/parent-alumni-community">Open network</Link></Button></CardContent></Card>
        <Card><CardHeader><BriefcaseBusiness className="size-5 text-primary" /><CardTitle>Professional groups</CardTitle><CardDescription>Connect around industries, professions and entrepreneurship.</CardDescription></CardHeader><CardContent><Button variant="outline" disabled>Browse groups</Button></CardContent></Card>
        <Card><CardHeader><CalendarDays className="size-5 text-primary" /><CardTitle>Events & reunions</CardTitle><CardDescription>Keep the social network alive beyond school years.</CardDescription></CardHeader><CardContent><Button variant="outline" disabled>View events</Button></CardContent></Card>
        <Card><CardHeader><HeartHandshake className="size-5 text-primary" /><CardTitle>Give back</CardTitle><CardDescription>Volunteer, support talks, fundraising and community projects.</CardDescription></CardHeader><CardContent><Button variant="outline" disabled>View opportunities</Button></CardContent></Card>
      </section>
      <Card><CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Adult-only by design</CardTitle></div><CardDescription>Parent Alumni status creates adult community permissions only. It never exposes child profiles, contact details, private projects or under-16 messaging.</CardDescription></CardHeader></Card>
    </div>
  );
}
