import { Link, createFileRoute } from "@tanstack/react-router";
import { BriefcaseBusiness, CalendarDays, HeartHandshake, MapPin, ShieldCheck, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/parent-community")({
  head: () => ({
    meta: [
      { title: "Parent Community — Aurelia" },
      { name: "description", content: "A verified adult-only community for current parents across schools and education groups." },
    ],
  }),
  component: ParentCommunity,
});

const groups = [
  { name: "Entrepreneurs & Founders", members: "Group-wide", icon: BriefcaseBusiness },
  { name: "London Parents", members: "Local network", icon: MapPin },
  { name: "Community & Volunteering", members: "School + group", icon: HeartHandshake },
];

const events = [
  { title: "Parent networking breakfast", meta: "08:30 · School community" },
  { title: "Careers & entrepreneurship evening", meta: "18:00 · Group-wide" },
  { title: "Volunteer project briefing", meta: "12:30 · Verified adults" },
];

function ParentCommunity() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verified adult community"
        title="Parent Community"
        description="Current parents can build useful relationships around school, location, interests, professions, events and volunteering. This adult network is deliberately separated from the protected child environment."
        crumbs={[{ label: "Home", to: "/" }, { label: "Dashboards", to: "/dashboard" }, { label: "Parent Community" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Verified adults only</Badge>
        <Badge variant="outline">Parent-to-parent connections</Badge>
        <Badge variant="outline">Current + alumni community</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild><Link to="/dashboard/parent-directory">Browse verified adults</Link></Button>
        <Button asChild variant="outline"><Link to="/dashboard/parent-circle">Open professional circle</Link></Button>
        <Button asChild variant="outline"><Link to="/dashboard/parent-event">View community event</Link></Button>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><UsersRound className="size-5 text-primary" /><CardTitle>Communities</CardTitle></div>
            <CardDescription>Groups connect verified adults beyond a single class chat and can continue after a child leaves.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {groups.map((group) => (
              <div key={group.name} className="rounded-xl border p-4">
                <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><group.icon className="size-4" /></div>
                <p className="font-medium">{group.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{group.members}</p>
                <Button asChild variant="outline" size="sm" className="mt-4 w-full"><Link to="/dashboard/parent-circle">View group</Link></Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Child boundary</CardTitle></div>
            <CardDescription>Adult community membership never expands permissions over children.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="rounded-lg bg-muted/40 p-3">✓ Parents can connect and message verified adults.</p>
            <p className="rounded-lg bg-muted/40 p-3">✓ Current and alumni parents can share circles and events.</p>
            <p className="rounded-lg bg-muted/40 p-3">✕ No browsing unrelated child profiles or portfolios.</p>
            <p className="rounded-lg bg-muted/40 p-3">✕ No generic adult-to-child direct messaging.</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><CalendarDays className="size-5 text-primary" /><CardTitle>Upcoming community events</CardTitle></div>
          <CardDescription>Events can be scoped to one school, a city, or the entire education group.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {events.map((event) => (
            <div key={event.title} className="rounded-xl border p-4">
              <p className="font-medium">{event.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{event.meta}</p>
              <Button asChild variant="outline" size="sm" className="mt-3"><Link to="/dashboard/parent-event">View event</Link></Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
