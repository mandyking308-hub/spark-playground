import { createFileRoute } from "@tanstack/react-router";
import { Flag, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/report")({
  head: () => ({ meta: [{ title: "Report Something — Aurelia" }] }),
  component: ReportSomething,
});

function ReportSomething() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Safety reporting"
        title="Report something"
        description="Children, parents and authorised members can flag content, behaviour or a safety concern without confronting another user. Reports enter a private safeguarding workflow and are not posted into community spaces."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Report something" }]}
      />
      <Card>
        <CardHeader><div className="flex items-center gap-2"><Flag className="size-5 text-primary" /><CardTitle>What happened?</CardTitle></div><CardDescription>Collect the minimum information needed to understand and route the concern.</CardDescription></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="category">Concern type</Label><Input id="category" placeholder="Bullying / unsafe content / contact / other" disabled /></div>
          <div className="space-y-2"><Label htmlFor="content">Related content or programme</Label><Input id="content" placeholder="Optional record reference" disabled /></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="details">What should the safety team know?</Label><Textarea id="details" placeholder="Describe the concern in your own words..." disabled /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>What happens next</CardTitle></div></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-4 text-sm">
          {['Private report','Safety triage','Human review','Action / follow-up'].map((step, index) => <div key={step} className="rounded-lg border p-3"><span className="text-xs text-muted-foreground">0{index + 1}</span><p className="mt-1 font-medium">{step}</p></div>)}
        </CardContent>
      </Card>
      <div className="flex flex-wrap items-center gap-3"><Button disabled>Submit private report</Button><Badge variant="outline">Backend required</Badge></div>
    </div>
  );
}
