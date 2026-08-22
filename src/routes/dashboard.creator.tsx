import { Link, createFileRoute } from "@tanstack/react-router";
import { BookOpen, Clock3, Film, Gamepad2, Image, Loader2, Mic2, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listMyProjectsFn, type ProjectSummary } from "@/functions/projects";

export const Route = createFileRoute("/dashboard/creator")({
  head: () => ({
    meta: [
      { title: "Creator Studio — Aurelia" },
      {
        name: "description",
        content: "A protected studio for podcasts, stories, art, video and projects.",
      },
    ],
  }),
  component: CreatorStudio,
});

const creationTypes = [
  {
    title: "Podcast",
    description: "Record or upload an episode, add a transcript and publish through the safety workflow.",
    icon: Mic2,
    action: "Start a podcast",
    to: "/dashboard/creator-podcast" as const,
  },
  {
    title: "Story or book",
    description: "Write, illustrate and build a multi-page story while keeping the child's authorship clear.",
    icon: BookOpen,
    action: "Start writing",
    to: "/dashboard/creator-project" as const,
  },
  {
    title: "Art",
    description: "Upload artwork or use bounded creative assistance with clear AI attribution.",
    icon: Image,
    action: "Create artwork",
    to: "/dashboard/creator-project" as const,
  },
  {
    title: "Video",
    description: "Build pre-recorded video projects with captions and moderated publishing.",
    icon: Film,
    action: "Create a video",
    to: "/dashboard/creator-project" as const,
  },
  {
    title: "Game or project",
    description: "Document a game, coding project, invention, experiment or team creation.",
    icon: Gamepad2,
    action: "Start a project",
    to: "/dashboard/creator-project" as const,
  },
];

function CreatorStudio() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    void listMyProjectsFn()
      .then((items) => {
        if (!active) return;
        setProjects(items.slice(0, 6));
        setLoadError(false);
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Protected under-16 world"
        title="Creator Studio"
        description="Children make things here. AI can assist the work, but it cannot become the relationship. Every creation starts private and follows an age-appropriate approval path before wider sharing."
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Dashboards", to: "/dashboard" },
          { label: "Creator Studio" },
        ]}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">Private by default</Badge>
        <Badge variant="outline">Live project drafts</Badge>
        <Badge variant="outline">Quarantined uploads</Badge>
        <Badge variant="outline">No follower counts</Badge>
        <Badge variant="outline">No open adult DMs</Badge>
        <Badge variant="outline">Bounded AI</Badge>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {creationTypes.map((item) => (
          <Card key={item.title} className="flex h-full flex-col">
            <CardHeader>
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription className="leading-relaxed">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button className="w-full" asChild>
                <Link to={item.to}>{item.action}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>My recent projects</CardTitle>
            <CardDescription>Private work saved to the child-owned Aurelia workspace.</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard/creator-project">New project</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading projects…
            </div>
          ) : loadError ? (
            <p className="text-sm text-muted-foreground">Projects could not be loaded right now.</p>
          ) : projects.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <Sparkles className="mx-auto size-6 text-primary" />
              <p className="mt-3 font-medium">Your first idea starts here</p>
              <p className="mt-1 text-sm text-muted-foreground">Create a private project and it will appear in this workspace.</p>
              <Button asChild className="mt-4" size="sm">
                <Link to="/dashboard/creator-project">Create a project</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <div key={project.id} className="rounded-xl border bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{project.title}</p>
                      <p className="mt-1 text-xs capitalize text-muted-foreground">{project.kind}</p>
                    </div>
                    <Badge variant={project.state === "draft" ? "secondary" : "outline"} className="capitalize">
                      {project.state.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock3 className="size-3.5" />
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Publication journey</CardTitle>
                <CardDescription>Sharing is a workflow, not an instant public post.</CardDescription>
              </div>
              <ShieldCheck className="size-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="grid gap-3 sm:grid-cols-5">
              {["Draft", "Safety scan", "Parent approval", "Moderation", "Published"].map(
                (step, index) => (
                  <li key={step} className="rounded-lg border bg-muted/30 p-3">
                    <span className="text-xs font-medium text-muted-foreground">0{index + 1}</span>
                    <p className="mt-1 text-sm font-medium">{step}</p>
                  </li>
                ),
              )}
            </ol>
            <Button asChild variant="outline"><Link to="/dashboard/upload-safety">See how uploads are protected</Link></Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <CardTitle>AI creative assistant</CardTitle>
            </div>
            <CardDescription>
              Helps with ideas, spelling, structure, transcripts and accessibility without replacing the child's work.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="rounded-lg bg-muted/40 p-3">✓ Guided brainstorming and learning support</p>
            <p className="rounded-lg bg-muted/40 p-3">✓ Audio cleanup, captions and translation</p>
            <p className="rounded-lg bg-muted/40 p-3">✕ No AI friends, romance, diagnosis or secret relationships</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
