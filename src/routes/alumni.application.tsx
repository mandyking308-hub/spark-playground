import { createFileRoute } from "@tanstack/react-router";
import { BriefcaseBusiness, FileCheck2, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/alumni/application")({
  head: () => ({ meta: [{ title: "Opportunity Application — Aurelia Alumni" }] }),
  component: AlumniApplication,
});

const portfolio = [
  { title: "Sustainability podcast series", selected: true },
  { title: "Young inventor challenge", selected: true },
  { title: "Private childhood wellbeing record", selected: false },
];

function AlumniApplication() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verified adult opportunity"
        title="Apply with your selected portfolio"
        description="The alumni member chooses which approved portfolio evidence accompanies an application. Private childhood records are never silently included."
        crumbs={[{ label: "Alumni", to: "/alumni" }, { label: "Opportunities", to: "/alumni/opportunities" }, { label: "Application" }]}
      />
      <Card>
        <CardHeader><div className="flex items-center gap-2"><BriefcaseBusiness className="size-5 text-primary" /><CardTitle>Summer design internship</CardTitle></div><CardDescription>Verified employer · London · 16+ opportunity</CardDescription></CardHeader>
      </Card>
      <Card>
        <CardHeader><div className="flex items-center gap-2"><FileCheck2 className="size-5 text-primary" /><CardTitle>Portfolio disclosure</CardTitle></div><CardDescription>Only items explicitly selected for adult portfolio sharing can be submitted.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {portfolio.map((item) => <div key={item.title} className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm"><span>{item.title}</span><Badge variant={item.selected ? "secondary" : "outline"}>{item.selected ? "Available to select" : "Not transferable"}</Badge></div>)}
        </CardContent>
      </Card>
      <Card><CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Disclosure boundary</CardTitle></div></CardHeader><CardContent className="text-sm text-muted-foreground">The provider receives the application and selected adult portfolio evidence only. It does not receive historic child permissions, family records or private under-16 activity.</CardContent></Card>
      <Button disabled>Submit application</Button>
    </div>
  );
}
