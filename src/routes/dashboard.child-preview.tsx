import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Film,
  Gamepad2,
  Image,
  MessageCircleHeart,
  Mic2,
  Share2,
  ShieldCheck,
  Sparkles,
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
        content: "A read-only adult preview of Aurelia's protected child experience.",
      },
    ],
  }),
  component: ChildExperiencePreview,
});

const childDestinations = [
  { title: "Create", description: "Podcasts, stories, art, video and projects.", icon: Mic2 },
  { title: "Challenges", description: "Make something for an approved school, group or partner brief.", icon: Trophy },
  { title: "Clubs", description: "Join verified communities around interests and projects.", icon: UsersRound },
  { title: "My Passport", description: "Projects, awards, certificates, skills and milestones.", icon: BookOpen },
  { title: "Sharing", description: "Request wider sharing and see what is waiting for approval.", icon: Share2 },
  { title: "Feedback", description: "Constructive encouragement without follower counts or popularity scores.", icon: MessageCircleHeart },
] as const;

const creationTypes = [
  { title: "Podcast", description: "Plan an episode, add a transcript and move through the safety workflow.", icon: Mic2 },
  { title: "Story or book", description: "Write, illustrate and develop a multi-page story while keeping authorship clear.", icon: BookOpen },
  { title: "Art", description: "Create artwork with bounded assistance and visible AI attribution where relevant.", icon: Image },
  { title: "Video", description: "Develop a pre-recorded video project with captions and moderated sharing.", icon: Film },
  { title: "Game or invention", description: "Document a game, coding project, experiment, prototype or invention.", icon: Gamepad2 },
] as const;

function ChildExperiencePreview() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Preview — no real child data</Badge>
          <Badge variant="outline">Read only</Badge>
          <Badge variant="outline">Adult viewing mode</Badge>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This mirrors the protected child experience for parents, schools and other verified adults. It never opens a real child's workspace and never writes to child records.
        </p>
      </div>

      <PageHeader
        eyebrow="Protected under-16 world"
        title="Your creative home"
        description="Create, learn, join approved communities and build a body of work without follower pressure, open strangers or unrestricted AI."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Child experience preview" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Private by default</Badge>
        <Badge variant="outline">Interest-led discovery</Badge>
        <Badge variant="outline">Age-banded AI</Badge>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {childDestinations.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="size-5 text-primary" />
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-medium text-primary">Creator Studio</p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">What can I make?</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            The child chooses the medium. Aurelia supports the process around the work rather than turning creativity into a social popularity contest.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {creationTypes.map((item) => (
            <Card key={item.title} className="h-full">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription className="leading-relaxed">{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <Badge variant="outline">Illustrative demo — not a real child</Badge>
                <CardTitle className="mt-3">Moonbase Garden</CardTitle>
                <CardDescription>A sample invention project showing how a child records both the idea and the making process.</CardDescription>
              </div>
              <Sparkles className="size-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-medium">My idea</p>
              <p className="mt-1 text-muted-foreground">Design a small garden that could grow food on a moon base using recycled water and very little space.</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-medium">How I made it</p>
              <p className="mt-1 text-muted-foreground">Sketch the system, test plant choices, explain the water loop, improve the design and record what changed after each experiment.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Private draft</Badge>
              <Badge variant="outline">Made by me</Badge>
              <Badge variant="outline">AI help must be labelled</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <CardTitle>How sharing works</CardTitle>
            </div>
            <CardDescription>Sharing is a controlled journey, not an instant public post.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {["Draft", "Safety scan", "Parent approval", "Moderation", "Shared"].map((step, index) => (
                <li key={step} className="flex items-center gap-3 rounded-lg border bg-muted/25 p-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{index + 1}</span>
                  <span className="text-sm font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>What is different in a real child account?</CardTitle>
          <CardDescription>
            A real child sees this same protected structure, but their private drafts, approved challenges, clubs, passport and feedback are live and belong only to that child. This preview deliberately contains no child records and cannot create or edit anything.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
