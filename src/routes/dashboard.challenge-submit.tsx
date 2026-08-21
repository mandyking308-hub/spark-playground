import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, FileCheck2, ShieldCheck, Trophy } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/challenge-submit")({
  component: ChallengeSubmitPage,
});

const projects = [
  { title: "My Green Neighbourhood", kind: "Project", ready: true },
  { title: "Wild World — Episode 3", kind: "Podcast", ready: true },
  { title: "Solar Car Sketchbook", kind: "Artwork", ready: false },
];

function ChallengeSubmitPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Child submission"
        title="Submit to a challenge"
        description="Choose one of your existing projects. The challenge receives the approved project and display identity needed for judging — not your private contact details."
        crumbs={[
          { label: "Dashboards", to: "/dashboard" },
          { label: "Challenges", to: "/dashboard/challenges" },
          { label: "Submit" },
        ]}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Trophy className="size-5 text-primary" />
            <CardTitle className="text-base">Design a greener city</CardTitle>
            <Badge variant="secondary">Ages 11–15</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-muted/40 p-3 text-sm">
            <p className="font-medium">Open</p>
            <p className="mt-1 text-xs text-muted-foreground">Submission window active</p>
          </div>
          <div className="rounded-lg bg-muted/40 p-3 text-sm">
            <p className="font-medium">Group-wide</p>
            <p className="mt-1 text-xs text-muted-foreground">Participating schools only</p>
          </div>
          <div className="rounded-lg bg-muted/40 p-3 text-sm">
            <p className="font-medium">Project judging</p>
            <p className="mt-1 text-xs text-muted-foreground">Identity minimised</p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 font-medium">Choose a project</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.title} className={project.ready ? "" : "opacity-70"}>
              <CardContent className="space-y-4 p-5">
                <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                  <FileCheck2 className="size-4" />
                </div>
                <div>
                  <p className="font-medium">{project.title}</p>
                  <p className="text-sm text-muted-foreground">{project.kind}</p>
                </div>
                {project.ready ? (
                  <Badge variant="outline">Safety-ready</Badge>
                ) : (
                  <Badge variant="outline">Safety check needed</Badge>
                )}
                <Button className="w-full" variant="outline" disabled>
                  Select project
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-4" /> What the judge receives
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
          <p className="rounded-lg bg-muted/40 p-3"><CheckCircle2 className="mb-2 size-4 text-foreground" />Your approved project</p>
          <p className="rounded-lg bg-muted/40 p-3"><CheckCircle2 className="mb-2 size-4 text-foreground" />Approved creator/display label</p>
          <p className="rounded-lg bg-muted/40 p-3">No email, phone or private contact information</p>
          <p className="rounded-lg bg-muted/40 p-3">No private messaging route created by submission</p>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">Submission persistence activates with the dedicated backend.</p>
    </div>
  );
}
