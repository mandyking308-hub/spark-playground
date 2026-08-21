import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Film, Gamepad2, Image, ShieldCheck, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/creator-project")({
  component: ProjectAuthoringPage,
});

const kinds = [
  { label: "Story / book", icon: BookOpen },
  { label: "Artwork", icon: Image },
  { label: "Video", icon: Film },
  { label: "Game / invention", icon: Gamepad2 },
];

function ProjectAuthoringPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Creator Studio"
        title="Create a project"
        description="A reusable project workspace for stories, artwork, video, games, coding, experiments and inventions."
        crumbs={[
          { label: "Dashboards", to: "/dashboard" },
          { label: "Creator Studio", to: "/dashboard/creator" },
          { label: "Project" },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project workspace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-medium">What are you making?</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {kinds.map((kind) => (
                  <div key={kind.label} className="flex items-center gap-3 rounded-lg border p-3">
                    <kind.icon className="size-4" />
                    <span className="text-sm font-medium">{kind.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="project-title" className="text-sm font-medium">Project title</label>
              <Input id="project-title" placeholder="My project" />
            </div>
            <div className="space-y-2">
              <label htmlFor="project-idea" className="text-sm font-medium">Your idea</label>
              <Textarea id="project-idea" className="min-h-36" placeholder="What are you trying to make, explore or explain?" />
            </div>
            <div className="space-y-2">
              <label htmlFor="project-process" className="text-sm font-medium">How you made it</label>
              <Textarea id="project-process" className="min-h-32" placeholder="Record your choices, experiments, drafts and what you learned…" />
            </div>
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="font-medium">Files, images or video</p>
              <p className="mt-1 text-sm text-muted-foreground">Private uploads will connect to the child-owned storage area.</p>
              <Button className="mt-4" variant="outline" disabled>Add files</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4" /> Authorship
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>The child remains the named creator. AI assistance should be visible rather than hidden.</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Made by me</Badge>
                <Badge variant="outline">Made with AI assistance</Badge>
                <Badge variant="outline">AI-generated element</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4" /> Project privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Drafts are private by default.</p>
              <p>Uploads are checked before broader sharing.</p>
              <p>School badges, contact details and location clues can be flagged before publication.</p>
              <p>Published work follows the same approval chain as podcasts.</p>
            </CardContent>
          </Card>

          <Button className="w-full" disabled>Save project draft</Button>
          <p className="text-center text-xs text-muted-foreground">Persistence activates with the dedicated backend.</p>
        </div>
      </div>
    </div>
  );
}
