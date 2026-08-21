import { createFileRoute } from "@tanstack/react-router";
import { BriefcaseBusiness, GraduationCap, Lightbulb, MapPin } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/alumni/opportunities")({
  head: () => ({ meta: [{ title: "Alumni Opportunities — Aurelia" }] }),
  component: AlumniOpportunities,
});

const opportunities = [
  { title: "University innovation programme", type: "University", location: "Global / hybrid", icon: GraduationCap },
  { title: "Summer design internship", type: "Internship", location: "London", icon: BriefcaseBusiness },
  { title: "Young founder accelerator", type: "Entrepreneurship", location: "Online", icon: Lightbulb },
];

function AlumniOpportunities() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Opportunity network"
        title="Opportunities"
        description="Verified 16+ members can discover university, apprenticeship, internship, career and entrepreneurship opportunities in the adult environment."
        crumbs={[{ label: "Alumni", to: "/alumni" }, { label: "Opportunities" }]}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {opportunities.map((item) => (
          <Card key={item.title}>
            <CardHeader><item.icon className="size-5 text-primary" /><CardTitle>{item.title}</CardTitle><CardDescription>{item.type}</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" />{item.location}</p>
              <Button variant="outline" className="w-full" disabled>View opportunity</Button>
              <Badge variant="secondary">Preview listing</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Partner boundary</CardTitle><CardDescription>Employers and universities can manage adult opportunities here. Their participation does not grant access back into the protected under-16 platform.</CardDescription></CardHeader>
      </Card>
    </div>
  );
}
