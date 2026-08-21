import { createFileRoute } from "@tanstack/react-router";
import { BriefcaseBusiness, CalendarDays, GraduationCap, HeartHandshake, Network, ShieldCheck, UserRoundCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/parent-alumni-community")({
  head: () => ({
    meta: [
      { title: "Parent Alumni Network — Aurelia" },
      {
        name: "description",
        content: "An adult-only network that lets former parents stay connected after their child leaves.",
      },
    ],
  }),
  component: ParentAlumniCommunity,
});

const pathways = [
  {
    title: "Professional network",
    description: "Reconnect by profession, sector, city or shared interest.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Events & reunions",
    description: "Keep school and group relationships alive beyond the fee-paying years.",
    icon: CalendarDays,
  },
  {
    title: "Give back",
    description: "Support talks, volunteering, fundraising and philanthropy through controlled adult workflows.",
    icon: HeartHandshake,
  },
  {
    title: "Education community",
    description: "Remain part of the wider education-group community without gaining access to current pupils.",
    icon: GraduationCap,
  },
];

function ParentAlumniCommunity() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Adult-only alumni layer"
        title="Parent Alumni Network"
        description="When the final child leaves, a parent can opt to keep the relationships they built over many years. The community remains adult-to-adult; alumni status never creates access to current children."
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Dashboards", to: "/dashboard" },
          { label: "Parent Alumni Network" },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Opt-in transition</Badge>
        <Badge variant="outline">Verified former parents</Badge>
        <Badge variant="outline">Adult networking</Badge>
        <Badge variant="outline">No child access</Badge>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {pathways.map((pathway) => (
          <Card key={pathway.title}>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <pathway.icon className="size-5" />
              </div>
              <CardTitle>{pathway.title}</CardTitle>
              <CardDescription className="leading-relaxed">{pathway.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled>
                Open network
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserRoundCheck className="size-5 text-primary" />
              <CardTitle>Parent lifecycle</CardTitle>
            </div>
            <CardDescription>A parent can remain current for one child while being alumni for another.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg border p-3 text-sm">
                <p className="font-medium">Current parent</p>
                <p className="mt-1 text-muted-foreground">Active verified child link.</p>
              </div>
              <div className="rounded-lg border p-3 text-sm">
                <p className="font-medium">Current + alumni</p>
                <p className="mt-1 text-muted-foreground">Multiple family histories.</p>
              </div>
              <div className="rounded-lg border p-3 text-sm">
                <p className="font-medium">Parent alumni</p>
                <p className="mt-1 text-muted-foreground">Adult community retained by opt-in.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <CardTitle>Safeguarding wall</CardTitle>
            </div>
            <CardDescription>The community can be powerful without creating a route around child safeguards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="rounded-lg bg-muted/40 p-3">✓ Parent Alumni can find and connect with verified adults.</p>
            <p className="rounded-lg bg-muted/40 p-3">✓ Schools can invite alumni parents to approved talks and volunteering.</p>
            <p className="rounded-lg bg-muted/40 p-3">✕ Alumni status does not reveal current child profiles, contact data or private work.</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Network className="size-5 text-primary" />
            <CardTitle>Why groups keep this network</CardTitle>
          </div>
          <CardDescription>
            Instead of losing years of family relationships when pupils leave, the education group retains a trusted adult community for networking, expertise, events, volunteering and philanthropy.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
