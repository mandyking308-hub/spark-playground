import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ShieldCheck, UserRoundCheck, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/alumni/mentoring")({
  head: () => ({ meta: [{ title: "Alumni Mentoring — Aurelia" }] }),
  component: AlumniMentoring,
});

const mentors = [
  { name: "Verified alumni", area: "Engineering & AI", availability: "Monthly" },
  { name: "Verified alumni", area: "Design & Media", availability: "Fortnightly" },
  { name: "Verified alumni", area: "Entrepreneurship", availability: "Monthly" },
];

function AlumniMentoring() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Adult alumni-to-alumni network"
        title="Mentoring"
        description="Verified 16+ alumni can mentor and support one another around university, careers and entrepreneurship. Any mentoring involving under-16s belongs to a separate school-controlled safeguarding programme."
        crumbs={[{ label: "Alumni", to: "/alumni" }, { label: "Community", to: "/alumni/community" }, { label: "Mentoring" }]}
      />
      <div className="flex flex-wrap gap-2"><Badge variant="secondary">Verified 16+</Badge><Badge variant="outline">Adult-to-adult</Badge><Badge variant="outline">Opt-in matching</Badge></div>
      <div className="grid gap-4 md:grid-cols-3">
        {mentors.map((mentor, index) => (
          <Card key={`${mentor.area}-${index}`}>
            <CardHeader><div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRoundCheck className="size-5" /></div><CardTitle>{mentor.area}</CardTitle><CardDescription>{mentor.name}</CardDescription></CardHeader>
            <CardContent className="space-y-3"><p className="flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="size-4" />{mentor.availability}</p><Button variant="outline" disabled className="w-full">Request mentoring</Button></CardContent>
          </Card>
        ))}
      </div>
      <Card><CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Hard boundary</CardTitle></div></CardHeader><CardContent className="space-y-3 text-sm"><p className="rounded-lg bg-muted/40 p-3"><UsersRound className="mr-2 inline size-4 text-primary" />Alumni mentoring here is adult-to-adult.</p><p className="rounded-lg bg-muted/40 p-3">An alumni mentor who later volunteers with children must enter a separately approved school/platform programme with appropriate safeguarding.</p><p className="rounded-lg bg-muted/40 p-3">Alumni credentials never inherit access to the protected child network.</p></CardContent></Card>
    </div>
  );
}
