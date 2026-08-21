import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, GraduationCap, ShieldCheck, Users, Workflow } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/alumni/")({
  head: () => ({
    meta: [
      { title: "Alumni (16+) — Aurelia" },
      { name: "description", content: "A separate 16+ environment for portfolios, opportunities and adult networking." },
    ],
  }),
  component: AlumniIndex,
});

function AlumniIndex() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Separate 16+ environment"
        title="Alumni dashboard"
        description="A member's approved body of work can continue into university, careers, mentoring and entrepreneurship without opening the protected child system to adults."
        crumbs={[{ label: "Home", to: "/" }, { label: "Alumni" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">16+ only</Badge>
        <Badge variant="outline">Separate access domain</Badge>
        <Badge variant="outline">Selective portfolio transition</Badge>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><Workflow className="size-5 text-primary" /><CardTitle>Portfolio</CardTitle><CardDescription>Approved childhood work plus new 16+ projects and credentials.</CardDescription></CardHeader></Card>
        <Card><CardHeader><Briefcase className="size-5 text-primary" /><CardTitle>Opportunities</CardTitle><CardDescription>University, apprenticeships, internships, careers and entrepreneurship.</CardDescription></CardHeader></Card>
        <Card><CardHeader><Users className="size-5 text-primary" /><CardTitle>Community</CardTitle><CardDescription>Verified alumni networking, mentoring and professional communities.</CardDescription></CardHeader></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><div className="flex items-center gap-2"><GraduationCap className="size-5 text-primary" /><CardTitle>Graduation transition</CardTitle></div><CardDescription>Nothing private moves automatically.</CardDescription></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. Member reaches the eligible age/state.</p>
            <p>2. Approved passport and portfolio items are reviewed.</p>
            <p>3. Member explicitly selects what transfers.</p>
            <p>4. Alumni account starts in the separate adult environment.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Boundary remains intact</CardTitle></div></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="rounded-lg bg-muted/40 p-3">✓ Alumni can network with other verified 16+ members.</p>
            <p className="rounded-lg bg-muted/40 p-3">✓ Employers/universities can participate in adult opportunity flows.</p>
            <p className="rounded-lg bg-muted/40 p-3">✕ Alumni membership does not grant access to under-16 private areas.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
