import { createFileRoute } from "@tanstack/react-router";
import { Building2, CalendarDays, ShieldCheck, Users } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/challenge-builder")({
  component: ChallengeBuilderPage,
});

function ChallengeBuilderPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Staff / approved partner workflow"
        title="Create a challenge"
        description="Define the brief, age band, dates and judging route. Approved partners contribute a programme; they do not gain a child directory or private contact channel."
        crumbs={[
          { label: "Dashboards", to: "/dashboard" },
          { label: "Challenges", to: "/dashboard/challenges" },
          { label: "Create challenge" },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Challenge brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="challenge-title">Title</Label>
              <Input id="challenge-title" placeholder="Design a greener city" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="challenge-description">Brief</Label>
              <Textarea id="challenge-description" className="min-h-36" placeholder="Explain what children should create and what they will learn…" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minimum-age">Minimum age</Label>
                <Input id="minimum-age" type="number" min={5} max={15} defaultValue={11} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maximum-age">Maximum age</Label>
                <Input id="maximum-age" type="number" min={5} max={15} defaultValue={15} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="opens">Opens</Label>
                <Input id="opens" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closes">Closes</Label>
                <Input id="closes" type="date" />
              </div>
            </div>
            <Button disabled>Save challenge draft</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="size-4" /> Scope
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">School</Badge>
                <Badge variant="outline">Education group</Badge>
                <Badge variant="outline">Approved organisation</Badge>
              </div>
              <p>External organisation challenges require verified organisation status and programme approval before they can open.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4" /> Judging access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>✓ submitted project</p>
              <p>✓ approved creator/display label</p>
              <p>✓ required age-band context</p>
              <p>✕ child email, phone or contact details</p>
              <p>✕ private direct messaging to the child</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4" /> Submission rule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Children submit an existing project they own after the project passes the relevant safety check.</p>
              <p className="flex items-center gap-2"><CalendarDays className="size-4" /> Closed challenges reject new submissions automatically.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
