import { createFileRoute } from "@tanstack/react-router";
import { Clock3, Globe2, Lightbulb, School, Trophy } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/challenges")({
  head: () => ({ meta: [{ title: "Challenges — Aurelia" }] }),
  component: Challenges,
});

const challenges = [
  { title: "Design a greener city", scope: "Group-wide", age: "Ages 11–15", icon: Globe2 },
  { title: "Tell a story in five minutes", scope: "School", age: "Ages 8–12", icon: Lightbulb },
  { title: "Young inventor challenge", scope: "Approved partner", age: "Ages 10–15", icon: Trophy },
];

function Challenges() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Create with purpose"
        title="Challenges"
        description="Schools, education groups and approved organisations can set structured creative challenges. Children submit projects inside a moderated workflow rather than competing for public follower attention."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Challenges" }]}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {challenges.map((challenge) => (
          <Card key={challenge.title}>
            <CardHeader>
              <challenge.icon className="mb-2 size-5 text-primary" />
              <CardTitle>{challenge.title}</CardTitle>
              <CardDescription>{challenge.scope}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                <span>{challenge.age}</span>
                <span className="flex items-center gap-1"><Clock3 className="size-3.5" /> Preview</span>
              </div>
              <Button className="w-full" disabled>View challenge</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><School className="size-5 text-primary" /><CardTitle>Controlled judging</CardTitle></div>
          <CardDescription>Submissions can be reviewed by teachers or approved judges without giving judges private access to the child's profile or contact information.</CardDescription>
        </CardHeader>
        <CardContent><Badge variant="secondary">Project first · identity minimised</Badge></CardContent>
      </Card>
    </div>
  );
}
