import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  Film,
  Gamepad2,
  Image,
  MessageCircleHeart,
  Mic2,
  Palette,
  Share2,
  ShieldCheck,
  Trophy,
  UsersRound,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/child-preview")({
  head: () => ({
    meta: [
      { title: "Preview child experience — Aurelia" },
      {
        name: "description",
        content:
          "A read-only, illustrative preview of the under-16 Aurelia experience for verified adults. No real child data is shown.",
      },
      { property: "og:title", content: "Preview child experience — Aurelia" },
      {
        property: "og:description",
        content: "See how the protected under-16 space looks, using illustrative demo content only.",
      },
    ],
  }),
  component: ChildExperiencePreview,
});

const childHome = [
  { title: "Create", description: "Podcasts, stories, art, video and projects.", icon: Mic2 },
  { title: "Challenges", description: "Make something for a school, group or approved partner challenge.", icon: Trophy },
  { title: "Clubs", description: "Join verified communities around interests and projects.", icon: UsersRound },
  { title: "My Passport", description: "Projects, awards, certificates, skills and milestones.", icon: BookOpen },
  { title: "Sharing", description: "Request wider sharing and see what is waiting for approval.", icon: Share2 },
  { title: "Feedback", description: "Constructive encouragement without public popularity scores.", icon: MessageCircleHeart },
] as const;

const studioTypes = [
  { title: "Podcast", description: "Record or upload an episode with a transcript.", icon: Mic2 },
  { title: "Story or book", description: "Write and illustrate a multi-page story.", icon: BookOpen },
  { title: "Art", description: "Upload artwork with clear authorship and AI attribution.", icon: Image },
  { title: "Video", description: "Pre-recorded video projects with captions.", icon: Film },
  { title: "Game or invention", description: "Document a game, coding project, experiment or invention.", icon: Gamepad2 },
] as const;

const journey = [
  { step: "Draft", description: "Private by default. Only the child can see it." },
  { step: "Safety scan", description: "Automated media and text checks run before anything moves on." },
  { step: "Parent approval", description: "A verified parent or guardian approves wider sharing." },
  { step: "Moderation", description: "A verified adult reviews context before publication." },
  { step: "Shared", description: "Visible only within the approved audience — never an open feed." },
] as const;

function ChildExperiencePreview() {
  return (
    <div className="space-y-8">
      <div
        role="status"
        className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3"
      >
        <Eye className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-foreground">Preview — no real child data</p>
          <p className="text-sm text-muted-foreground">
            This is a read-only illustration of the under-16 experience for verified adults. Nothing here is
            loaded from, or written to, a real child account.
          </p>
        </div>
      </div>

      <PageHeader
        eyebrow="Adult preview"
        title="Preview child experience"
        description="See exactly what the protected under-16 space looks like before inviting a child, without entering a child account or viewing any child's work."
        crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Preview child experience" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Read-only</Badge>
        <Badge variant="outline">Illustrative content</Badge>
        <Badge variant="outline">No child records queried</Badge>
      </div>

      <section aria-labelledby="child-home" className="space-y-4">
        <div>
          <h2 id="child-home" className="font-display text-xl tracking-tight">
            The child home screen
          </h2>
          <p className="text-sm text-muted-foreground">
            What a child sees when they sign in. No follower counts, no open directory, no strangers.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {childHome.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <item.icon className="size-5 text-primary" aria-hidden="true" />
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="studio-preview" className="space-y-4">
        <div>
          <h2 id="studio-preview" className="font-display text-xl tracking-tight">
            Creator Studio preview
          </h2>
          <p className="text-sm text-muted-foreground">
            The five ways a child can make something inside Aurelia.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studioTypes.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <item.icon className="size-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="sample-project" className="space-y-4">
        <div>
          <h2 id="sample-project" className="font-display text-xl tracking-tight">
            An illustrative sample project
          </h2>
        </div>
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Palette className="size-5 text-primary" aria-hidden="true" />
              <CardTitle>“The Tide Pool Podcast” — Episode 1</CardTitle>
              <Badge variant="secondary">Demo content</Badge>
            </div>
            <CardDescription>
              Demo content only. This is not a real child, a real account or a real piece of work — it exists
              to show how a project looks as it moves through Aurelia.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              A six-minute recorded episode about rock pools, with a written transcript, two hand-drawn
              illustrations and a short reflection on what the maker learned.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Podcast</Badge>
              <Badge variant="outline">Transcript attached</Badge>
              <Badge variant="outline">Awaiting parent approval (illustrative)</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="publication-journey" className="space-y-4">
        <div>
          <h2 id="publication-journey" className="font-display text-xl tracking-tight">
            The publication journey
          </h2>
          <p className="text-sm text-muted-foreground">
            Draft → Safety scan → Parent approval → Moderation → Shared.
          </p>
        </div>
        <ol className="grid gap-3 md:grid-cols-5">
          {journey.map((stage, index) => (
            <li key={stage.step} className="rounded-lg border border-border bg-card p-4">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Step {index + 1}
              </span>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground">
                <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                {stage.step}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stage.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
            <CardTitle>Why this preview is safe</CardTitle>
          </div>
          <CardDescription>
            This page reads no database records and offers no controls. Adults never gain access to a child
            account, a child's drafts or any child-only route through this preview.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
