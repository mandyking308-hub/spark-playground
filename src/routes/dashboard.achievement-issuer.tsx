import { createFileRoute } from "@tanstack/react-router";
import { Award, BookOpenCheck, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/achievement-issuer")({
  head: () => ({ meta: [{ title: "Achievement Issuer — Aurelia" }] }),
  component: AchievementIssuer,
});

function AchievementIssuer() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verified Passport evidence"
        title="Issue an achievement"
        description="Create an auditable Passport entry from reviewed evidence. The issuer, evidence record, date and verification source travel with the achievement; visibility remains private until separately shared."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Teacher", to: "/dashboard/teacher" }, { label: "Achievement Issuer" }]}
      />
      <Card>
        <CardHeader><div className="flex items-center gap-2"><Award className="size-5 text-primary" /><CardTitle>Achievement record</CardTitle></div><CardDescription>Preview form — issuing activates when secure identity and database persistence are connected.</CardDescription></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="learner">Authorised learner</Label><Input id="learner" placeholder="Assigned cohort learner" disabled /></div>
          <div className="space-y-2"><Label htmlFor="type">Achievement type</Label><Input id="type" placeholder="Project / Skill / Leadership / Award" disabled /></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="title">Title</Label><Input id="title" placeholder="Led a cross-school sustainability project" disabled /></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="evidence">Evidence record</Label><Input id="evidence" placeholder="Reviewed project or certificate ID" disabled /></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="note">Verification note</Label><Textarea id="note" placeholder="Explain what evidence supports this achievement..." disabled /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Passport integrity</CardTitle></div></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3 text-sm"><p className="rounded-lg border p-3">Issuer identity stored</p><p className="rounded-lg border p-3">Evidence link required</p><p className="rounded-lg border p-3">Private by default</p></CardContent>
      </Card>
      <Button disabled><BookOpenCheck className="mr-2 size-4" />Issue to Passport</Button>
      <Badge variant="outline">No popularity score or public ranking</Badge>
    </div>
  );
}
