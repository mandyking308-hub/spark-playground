import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Building2, Compass, FlaskConical, Mic2, Palette, Trophy, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/discover")({
  component: DiscoverPage,
});

const interests = [
  { label: "Science", icon: FlaskConical },
  { label: "Stories", icon: BookOpen },
  { label: "Podcasts", icon: Mic2 },
  { label: "Art & design", icon: Palette },
  { label: "Clubs", icon: UsersRound },
  { label: "Challenges", icon: Trophy },
];

const shows = [
  {
    title: "Wild World",
    type: "Show",
    detail: "Animals, habitats and conservation — curated for your chosen science interests.",
  },
  {
    title: "Young Makers",
    type: "Projects",
    detail: "Selected creative projects from approved school and group programmes.",
  },
  {
    title: "Future Cities Challenge",
    type: "Challenge",
    detail: "Design a greener neighbourhood with your school team.",
  },
];

function DiscoverPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Interest first, people second"
        title="Discover"
        description="Explore topics, shows, projects, clubs, challenges and approved organisations. There is no browsable directory of children and no popularity-driven feed."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Discover" }]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Compass className="size-4" /> Choose what you want to explore
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {interests.map((interest) => (
            <div key={interest.label} className="flex items-center gap-3 rounded-lg border border-border p-4">
              <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                <interest.icon className="size-4" />
              </div>
              <span className="font-medium">{interest.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">For your chosen interests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {shows.map((item) => (
              <div key={item.title} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-medium">{item.title}</h2>
                  <Badge variant="outline">{item.type}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="size-4" /> Approved organisations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Museums, universities, charities and education partners can contribute approved challenges and learning content.</p>
              <p>They cannot browse child profiles or privately contact children through Discover.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How recommendations work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>✓ chosen interests</p>
              <p>✓ school and club context</p>
              <p>✓ active challenges</p>
              <p>✓ editorial curation</p>
              <p>✕ behavioural prediction</p>
              <p>✕ popularity ranking</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
