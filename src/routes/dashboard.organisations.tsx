import { Link, createFileRoute } from "@tanstack/react-router";
import { Building2, GraduationCap, Landmark, ShieldCheck, Trophy } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/organisations")({
  head: () => ({ meta: [{ title: "Organisation Spaces — Aurelia" }] }),
  component: OrganisationSpaces,
});

const spaces = [
  { title: "Museum learning space", type: "Culture", icon: Landmark },
  { title: "University discovery space", type: "Education", icon: GraduationCap },
  { title: "Young innovators programme", type: "Challenge partner", icon: Trophy },
];

function OrganisationSpaces() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verified external partners"
        title="Organisation Spaces"
        description="Approved museums, universities, charities and companies can contribute challenges, masterclasses, competitions and educational content without receiving a directory of children or private child contact channels."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Organisation Spaces" }]}
      />
      <div className="flex flex-wrap gap-2"><Button asChild><Link to="/dashboard/organisation-publisher">Partner Publisher</Link></Button><Button asChild variant="outline"><Link to="/dashboard/organisation-admin">Partner administration</Link></Button><Button asChild variant="outline"><Link to="/dashboard/partner-safety">Partner safety boundaries</Link></Button></div>
      <div className="grid gap-4 md:grid-cols-3">
        {spaces.map((space) => (
          <Card key={space.title}>
            <CardHeader><div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><space.icon className="size-5" /></div><CardTitle>{space.title}</CardTitle><CardDescription>{space.type} · verified partner</CardDescription></CardHeader>
            <CardContent><Button variant="outline" className="w-full" disabled>Explore approved space</Button></CardContent>
          </Card>
        ))}
      </div>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><div className="flex items-center gap-2"><Building2 className="size-5 text-primary" /><CardTitle>What partners can do</CardTitle></div></CardHeader><CardContent className="space-y-2 text-sm text-muted-foreground"><p>Create approved educational content and challenges</p><p>Offer events, competitions and masterclasses</p><p>Provide age-appropriate careers inspiration</p><p>Receive aggregated programme reporting above the minimum cohort threshold</p></CardContent></Card>
        <Card><CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>What partners cannot do</CardTitle></div></CardHeader><CardContent className="space-y-3 text-sm"><p className="rounded-lg bg-muted/40 p-3">✕ Browse a public directory of children</p><p className="rounded-lg bg-muted/40 p-3">✕ Export children's private contact details, precise location or behavioural profiles</p><p className="rounded-lg bg-muted/40 p-3">✕ Privately message children or deliver unmoderated free-text feedback</p><Badge variant="secondary">Institutional access, not child access</Badge></CardContent></Card>
      </section>
    </div>
  );
}
