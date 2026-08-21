import { Link, createFileRoute } from "@tanstack/react-router";
import { AudioLines, Film, Mic2, Plus, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/shows")({
  component: ShowsPage,
});

const previewShows = [
  {
    title: "Wild World",
    format: "Podcast",
    icon: Mic2,
    season: 1,
    episodes: 8,
    state: "Published",
    publisher: "Wild World Studio",
  },
  {
    title: "Stories After School",
    format: "Audio drama",
    icon: AudioLines,
    season: 1,
    episodes: 3,
    state: "Review",
    publisher: "Young Creators Club",
  },
  {
    title: "Make It Move",
    format: "Video series",
    icon: Film,
    season: 2,
    episodes: 5,
    state: "Draft",
    publisher: "Design Lab",
  },
];

function ShowsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Creator Studio"
        title="My Shows"
        description="Build a programme over time: a podcast, audio drama, video series, book club or youth newsroom. The show is what people discover — not a public directory of children."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "My Shows" }]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Series & seasons</Badge>
          <Badge variant="outline">Approved publisher identity</Badge>
          <Badge variant="outline">Episode-by-episode moderation</Badge>
        </div>
        <Button asChild>
          <Link to="/dashboard/show-builder">
            <Plus className="mr-2 size-4" /> Create a show
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {previewShows.map((show) => (
          <Card key={show.title} className="flex h-full flex-col">
            <CardHeader>
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <show.icon className="size-5" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{show.title}</CardTitle>
                <Badge variant={show.state === "Published" ? "default" : "outline"}>{show.state}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{show.format} · Season {show.season}</p>
            </CardHeader>
            <CardContent className="mt-auto space-y-3">
              <div className="rounded-lg bg-muted/40 p-3 text-sm">
                <p className="font-medium">{show.episodes} episodes</p>
                <p className="mt-1 text-xs text-muted-foreground">Public publisher: {show.publisher}</p>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/dashboard/show-builder">Manage show</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-4" /> Show identity and safety
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
          <p><strong className="text-foreground">Show first.</strong> Discovery centres the programme/topic rather than child popularity.</p>
          <p><strong className="text-foreground">Safe publisher label.</strong> An approved alias, club or programme label is used publicly instead of exposing account identifiers.</p>
          <p><strong className="text-foreground">Every episode reviewed.</strong> A published show does not bypass safety checks for later episodes.</p>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">Preview show data only until the dedicated backend is connected.</p>
    </div>
  );
}
