import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Film, Gamepad2, Image, Loader2, PencilLine, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createProjectFn,
  listMyProjectsFn,
  updateProjectFn,
  type ProjectSummary,
} from "@/functions/projects";

export const Route = createFileRoute("/dashboard/creator-project")({
  component: ProjectAuthoringPage,
});

type ProjectKind = ProjectSummary["kind"];

const kinds: Array<{ label: string; value: ProjectKind; icon: typeof BookOpen }> = [
  { label: "Story / book", value: "story", icon: BookOpen },
  { label: "Artwork", value: "art", icon: Image },
  { label: "Video", value: "video", icon: Film },
  { label: "Game / invention", value: "game", icon: Gamepad2 },
];

function composeSummary(idea: string, process: string) {
  const parts = [];
  if (idea.trim()) parts.push(`Idea\n${idea.trim()}`);
  if (process.trim()) parts.push(`Process\n${process.trim()}`);
  return parts.join("\n\n");
}

function parseSummary(summary?: string) {
  if (!summary) return { idea: "", process: "" };
  const processMarker = "\n\nProcess\n";
  const processIndex = summary.indexOf(processMarker);
  const idea = (processIndex >= 0 ? summary.slice(0, processIndex) : summary).replace(/^Idea\n/, "");
  const process = processIndex >= 0 ? summary.slice(processIndex + processMarker.length) : "";
  return { idea, process };
}

function ProjectAuthoringPage() {
  const [kind, setKind] = useState<ProjectKind>("story");
  const [title, setTitle] = useState("");
  const [idea, setIdea] = useState("");
  const [process, setProcess] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshProjects() {
    try {
      const items = await listMyProjectsFn();
      setProjects(items);
      setError(null);
    } catch {
      setError("Your saved projects could not be loaded right now.");
    } finally {
      setLoadingProjects(false);
    }
  }

  useEffect(() => {
    void refreshProjects();
  }, []);

  async function saveDraft() {
    if (!title.trim()) {
      setError("Give your project a title before saving it.");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    const payload = {
      kind,
      title: title.trim(),
      summary: composeSummary(idea, process),
    };

    try {
      const saved = projectId
        ? await updateProjectFn({ data: { projectId, ...payload } })
        : await createProjectFn({ data: payload });

      setProjectId(saved.id);
      setMessage("Saved securely to your Aurelia workspace.");
      await refreshProjects();
    } catch {
      setError("This draft could not be saved. Your account must be an active child profile with permission to create projects.");
    } finally {
      setSaving(false);
    }
  }

  function editProject(project: ProjectSummary) {
    const parsed = parseSummary(project.summary);
    setProjectId(project.id);
    setKind(project.kind);
    setTitle(project.title);
    setIdea(parsed.idea);
    setProcess(parsed.process);
    setMessage(`Editing “${project.title}”.`);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startNew() {
    setProjectId(null);
    setKind("story");
    setTitle("");
    setIdea("");
    setProcess("");
    setMessage("New private draft started.");
    setError(null);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Creator Studio"
        title="Create a project"
        description="A reusable project workspace for stories, artwork, video, games, coding, experiments and inventions. Drafts save into the child-owned Aurelia workspace."
        crumbs={[
          { label: "Dashboards", to: "/dashboard" },
          { label: "Creator Studio", to: "/dashboard/creator" },
          { label: "Project" },
        ]}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">Private draft</Badge>
        <Badge variant="outline">Live backend saving</Badge>
        {projectId ? <Badge variant="outline">Saved project</Badge> : null}
        <Button variant="ghost" size="sm" className="ms-auto" onClick={startNew}>
          <PencilLine className="mr-2 size-4" /> New project
        </Button>
      </div>

      {message ? (
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
          <CheckCircle2 className="size-4 shrink-0 text-primary" />
          <span>{message}</span>
        </div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm">{error}</div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project workspace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-medium">What are you making?</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {kinds.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setKind(item.value)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-start transition-colors ${
                      kind === item.value ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    aria-pressed={kind === item.value}
                  >
                    <item.icon className="size-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {kind === item.value ? <CheckCircle2 className="ms-auto size-4 text-primary" /> : null}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="project-title" className="text-sm font-medium">Project title</label>
              <Input
                id="project-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={160}
                placeholder="My project"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="project-idea" className="text-sm font-medium">Your idea</label>
              <Textarea
                id="project-idea"
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                className="min-h-36"
                placeholder="What are you trying to make, explore or explain?"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="project-process" className="text-sm font-medium">How you made it</label>
              <Textarea
                id="project-process"
                value={process}
                onChange={(event) => setProcess(event.target.value)}
                className="min-h-32"
                placeholder="Record your choices, experiments, drafts and what you learned…"
              />
            </div>
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="font-medium">Files, images or video</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Project text now saves live. Private media upload remains locked until the dedicated child-safe storage and scanning path is enabled.
              </p>
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
              <p>Only the child owner can create or edit a draft.</p>
              <p>Uploads will be checked before broader sharing.</p>
              <p>Publishing follows the separate permission and safety workflow.</p>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={() => void saveDraft()} disabled={saving || !title.trim()}>
            {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {saving ? "Saving…" : projectId ? "Update project draft" : "Save project draft"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Saved through authenticated server functions and protected by Aurelia row-level security.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your recent projects</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingProjects ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading your drafts…
            </div>
          ) : projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved projects yet. Your first draft will appear here.</p>
          ) : (
            <div className="divide-y">
              {projects.map((project) => (
                <div key={project.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{project.title}</p>
                      <Badge variant="outline" className="capitalize">{project.kind}</Badge>
                      <Badge variant={project.state === "draft" ? "secondary" : "outline"} className="capitalize">
                        {project.state.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Updated {new Date(project.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  {(project.state === "draft" || project.state === "rejected") ? (
                    <Button variant="outline" size="sm" onClick={() => editProject(project)}>
                      Edit draft
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
