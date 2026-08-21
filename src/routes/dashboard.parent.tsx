import { Link, createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, CalendarDays, ShieldCheck, UserRoundCheck, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/parent")({
  head: () => ({ meta: [{ title: "Parent dashboard — Aurelia" }] }),
  component: ParentDashboard,
});

function ParentDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verified family account"
        title="Parent dashboard"
        description="Manage permissions for linked children while also taking part in the verified adult school community. Adult community membership does not open access to unrelated children."
        crumbs={[{ label: "Home", to: "/" }, { label: "Parent" }]}
      />

      <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Linked children</CardTitle><CardDescription>Only verified guardian relationships will appear here once live data is connected.</CardDescription></CardHeader>
          <CardContent>
            <div className="rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="font-medium">Child profile preview</p><p className="text-sm text-muted-foreground">Verified guardian relationship required</p></div>
                <Badge variant="secondary">Preview</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2"><Badge variant="outline">Publishing</Badge><Badge variant="outline">AI</Badge><Badge variant="outline">Privacy</Badge></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Family controls</CardTitle></div></CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full"><Link to="/dashboard/ai-controls"><BrainCircuit className="mr-2 size-4" />AI controls</Link></Button>
            <Button variant="outline" className="w-full" disabled>Publishing approvals</Button>
            <Button variant="outline" className="w-full" disabled>Privacy & consent</Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><UsersRound className="size-5 text-primary" /><CardTitle>Parent Community</CardTitle><CardDescription>Connect with verified parents across school and group communities.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/parent-community">Open community</Link></Button></CardContent></Card>
        <Card><CardHeader><CalendarDays className="size-5 text-primary" /><CardTitle>Events & volunteering</CardTitle><CardDescription>Adult networking, talks, volunteering and school participation.</CardDescription></CardHeader><CardContent><Button variant="outline" disabled>View events</Button></CardContent></Card>
        <Card><CardHeader><UserRoundCheck className="size-5 text-primary" /><CardTitle>Parent Alumni</CardTitle><CardDescription>Your adult community can continue after your child leaves.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link to="/dashboard/parent-alumni-community">View alumni network</Link></Button></CardContent></Card>
      </section>
    </div>
  );
}
