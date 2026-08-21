import { Link, createFileRoute } from "@tanstack/react-router";
import { BookOpen, Mic2, ShieldCheck, Trophy, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/child")({
  head: () => ({
    meta: [
      { title: "Child dashboard — Aurelia" },
      { name: "description", content: "A protected under-16 space for creating, learning and achievement." },
    ],
  }),
  component: ChildDashboard,
});

const destinations = [
  { title: "Create", description: "Podcasts, stories, art, video and projects.", to: "/dashboard/creator", icon: Mic2 },
  { title: "Challenges", description: "Make something for a school, group or approved partner challenge.", to: "/dashboard/challenges", icon: Trophy },
  { title: "Clubs", description: "Join verified communities around interests and projects.", to: "/dashboard/clubs", icon: UsersRound },
  { title: "My Passport", description: "See projects, awards, certificates, skills and milestones.", to: "/dashboard/passport", icon: BookOpen },
] as const;

function ChildDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Protected under-16 world"
        title="Your creative home"
        description="Create, learn, join approved communities and build a body of work without follower pressure, open strangers or unrestricted AI."
        crumbs={[{ label: "Home", to: "/" }, { label: "Child" }]}
      />
      <div className="flex flex-wrap gap-2"><Badge variant="secondary">Private by default</Badge><Badge variant="outline">Interest-led discovery</Badge><Badge variant="outline">Age-banded AI</Badge></div>
      <section className="grid gap-4 md:grid-cols-2">
        {destinations.map((item) => (
          <Card key={item.title}>
            <CardHeader><item.icon className="size-5 text-primary" /><CardTitle>{item.title}</CardTitle><CardDescription>{item.description}</CardDescription></CardHeader>
            <CardContent><Button asChild variant="outline"><Link to={item.to}>Open {item.title}</Link></Button></CardContent>
          </Card>
        ))}
      </section>
      <Card>
        <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>How sharing works</CardTitle></div><CardDescription>Work begins privately. Wider publication can require safety scanning, parent approval and moderation depending on age and context.</CardDescription></CardHeader>
      </Card>
    </div>
  );
}
