import { Link, createFileRoute } from "@tanstack/react-router";
import { BriefcaseBusiness, Globe2, Lightbulb, ShieldCheck, UserRoundCheck, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/alumni/community")({
  head: () => ({ meta: [{ title: "Alumni Community — Aurelia" }] }),
  component: AlumniCommunity,
});

const communities = [
  { title: "Technology & AI", scope: "Professional", icon: Lightbulb },
  { title: "London Alumni", scope: "Location", icon: Globe2 },
  { title: "Founders Network", scope: "Entrepreneurship", icon: BriefcaseBusiness },
];

function AlumniCommunity() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verified 16+ network"
        title="Alumni Community"
        description="Adult alumni can network, collaborate and mentor one another in a separate environment designed for university, careers and lifelong community."
        crumbs={[{ label: "Alumni", to: "/alumni" }, { label: "Community" }]}
      />
      <div className="flex flex-wrap gap-2"><Badge variant="secondary">16+ verified members</Badge><Badge variant="outline">Adult networking</Badge></div>
      <section className="grid gap-4 md:grid-cols-3">
        {communities.map((community) => (
          <Card key={community.title}>
            <CardHeader><community.icon className="size-5 text-primary" /><CardTitle>{community.title}</CardTitle><CardDescription>{community.scope}</CardDescription></CardHeader>
            <CardContent><Button variant="outline" className="w-full" disabled>Open community</Button></CardContent>
          </Card>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><UserRoundCheck className="size-5 text-primary" /><CardTitle>Alumni mentoring</CardTitle></div>
            <CardDescription>Opt-in adult-to-adult mentoring around university, careers, professional skills and entrepreneurship.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline"><Link to="/alumni/mentoring">Find a mentor</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Adult community, hard child boundary</CardTitle></div><CardDescription>Alumni may later become approved speakers or mentors, but participation with children must use school/platform-controlled programme workflows. Adult networking credentials never become a child-access permission.</CardDescription></CardHeader>
          <CardContent><Badge variant="outline"><UsersRound className="mr-1 size-3" /> Alumni-to-alumni connections</Badge></CardContent>
        </Card>
      </section>
    </div>
  );
}
