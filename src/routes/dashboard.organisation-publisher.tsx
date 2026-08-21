import { createFileRoute } from "@tanstack/react-router";
import { BookOpenCheck, ShieldCheck, Trophy } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/organisation-publisher")({
  head: () => ({ meta: [{ title: "Partner Publisher — Aurelia" }] }),
  component: OrganisationPublisher,
});

function OrganisationPublisher() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Approved partner publishing"
        title="Create educational content"
        description="Verified partners can draft masterclasses, learning resources, events and challenges for programme approval. Publishing reaches eligible programme audiences without revealing who individual children are."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Organisation Spaces", to: "/dashboard/organisations" }, { label: "Partner Publisher" }]}
      />
      <Card>
        <CardHeader><CardTitle>Content draft</CardTitle><CardDescription>All content remains draft until platform/school programme approval.</CardDescription></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2"><Label htmlFor="partner-title">Title</Label><Input id="partner-title" placeholder="How museums preserve ancient objects" disabled /></div>
          <div className="space-y-2"><Label htmlFor="content-type">Content type</Label><Input id="content-type" placeholder="Masterclass / Challenge / Event / Resource" disabled /></div>
          <div className="space-y-2"><Label htmlFor="age-band">Age band</Label><Input id="age-band" placeholder="10–13" disabled /></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="summary">Educational purpose</Label><Textarea id="summary" placeholder="Describe what children will learn or create..." disabled /></div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><BookOpenCheck className="size-5 text-primary" /><CardTitle>Programme review</CardTitle><CardDescription>Age band, content, links, data collection and any facilitator involvement are reviewed before release.</CardDescription></CardHeader><CardContent><Button disabled>Submit for approval</Button></CardContent></Card>
        <Card><CardHeader><Trophy className="size-5 text-primary" /><CardTitle>Challenge route</CardTitle><CardDescription>Approved partners can use the existing project-first Challenge flow with identity-minimised judging.</CardDescription></CardHeader><CardContent><Button variant="outline" disabled>Create linked challenge</Button></CardContent></Card>
      </div>
      <Card><CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Audience privacy</CardTitle></div></CardHeader><CardContent className="flex flex-wrap gap-2"><Badge variant="outline">Age/school eligibility only</Badge><Badge variant="outline">No child list</Badge><Badge variant="outline">No targeted behavioural ads</Badge><Badge variant="outline">Aggregate outcomes</Badge></CardContent></Card>
    </div>
  );
}
