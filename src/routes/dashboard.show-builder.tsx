import { createFileRoute } from "@tanstack/react-router";
import { ListPlus, Mic2, ShieldCheck, UserRoundCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/show-builder")({
  component: ShowBuilderPage,
});

const episodes = [
  { number: 1, title: "Why elephants remember", state: "Published" },
  { number: 2, title: "The secret life of bees", state: "Moderation" },
  { number: 3, title: "How coral reefs talk", state: "Draft" },
];

function ShowBuilderPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="My Shows"
        title="Show Builder"
        description="Define the show identity once, then create seasons and episodes underneath it. Public identity can use an approved show alias or programme name rather than exposing a child's account identity."
        crumbs={[
          { label: "Dashboards", to: "/dashboard" },
          { label: "My Shows", to: "/dashboard/shows" },
          { label: "Show Builder" },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mic2 className="size-4" /> Show identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="show-title">Show title</Label>
              <Input id="show-title" defaultValue="Wild World" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="show-description">What is the show about?</Label>
              <Textarea
                id="show-description"
                className="min-h-28"
                defaultValue="A young creator's programme about animals, habitats and the natural world."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publisher-label">Approved public publisher label</Label>
              <Input id="publisher-label" defaultValue="Wild World Studio" />
              <p className="text-xs text-muted-foreground">
                This is what viewers/listeners see publicly. The underlying child profile ID is never a public publisher identity.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="season">Current season</Label>
              <Input id="season" type="number" min={1} defaultValue={1} />
            </div>
            <Button disabled>Save show settings</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserRoundCheck className="size-4" /> Public identity rule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>✓ approved show/creator alias</p>
              <p>✓ school or programme label</p>
              <p>✓ generic “Young Creator” fallback</p>
              <p>✕ child account ID as publisher identity</p>
              <p>✕ contact details or school/location disclosure</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4" /> Media handling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Private original → safety review → sanitised derivative → approved public derivative.</p>
              <p>Images/video/documents strip metadata before a publishable derivative is created.</p>
              <p>Location, contact details, school identifiers and unsafe material can block publication.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Season 1 episodes</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Every episode keeps its own review/publication state.</p>
            </div>
            <Button variant="outline" disabled>
              <ListPlus className="mr-2 size-4" /> Add episode
            </Button>
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {episodes.map((episode) => (
            <div key={episode.number} className="flex flex-wrap items-center gap-3 p-5">
              <span className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                {episode.number}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{episode.title}</p>
                <p className="text-xs text-muted-foreground">Episode {episode.number}</p>
              </div>
              <Badge variant={episode.state === "Published" ? "default" : "outline"}>{episode.state}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Preview data only. Show settings, episode creation and media storage activate after the dedicated backend is connected.
      </p>
    </div>
  );
}
