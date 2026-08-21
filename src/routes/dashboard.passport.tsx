import { createFileRoute } from "@tanstack/react-router";
import { Award, BookOpenCheck, HeartHandshake, Medal, Mic2, ShieldCheck, Star } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/dashboard/passport")({
  head: () => ({
    meta: [
      { title: "Achievement Passport — Aurelia" },
      {
        name: "description",
        content: "A longitudinal record of projects, skills, awards and verified achievements.",
      },
    ],
  }),
  component: AchievementPassport,
});

const passportItems = [
  { title: "Published a first podcast", type: "Project", date: "Year 7", icon: Mic2 },
  { title: "Creative writing certificate", type: "Certificate", date: "Year 7", icon: Award },
  { title: "Led a team challenge", type: "Leadership", date: "Year 8", icon: Star },
  { title: "Community volunteering", type: "Volunteering", date: "Year 8", icon: HeartHandshake },
];

function AchievementPassport() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Longitudinal identity"
        title="Achievement Passport"
        description="Projects, certificates, awards, leadership, skills and volunteering accumulate into one verified record that can grow with the child and later transition selectively into the separate 16+ alumni environment."
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Dashboards", to: "/dashboard" },
          { label: "Achievement Passport" },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Verified achievements</CardDescription>
            <CardTitle className="text-3xl">12</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Preview data</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Creative projects</CardDescription>
            <CardTitle className="text-3xl">7</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Preview data</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Skills evidenced</CardDescription>
            <CardTitle className="text-3xl">9</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Preview data</Badge>
          </CardContent>
        </Card>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Passport timeline</CardTitle>
            <CardDescription>Evidence stays attached to the achievement rather than becoming a popularity score.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {passportItems.map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-xl border p-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{item.title}</p>
                      <Badge variant="outline">{item.date}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.type} · verified evidence attached</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Medal className="size-5 text-primary" />
                <CardTitle>Profile completeness</CardTitle>
              </div>
              <CardDescription>Built from real activity, not self-declared claims alone.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={68} />
              <p className="text-sm text-muted-foreground">68% preview progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpenCheck className="size-5 text-primary" />
                <CardTitle>What can be verified</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Projects and publications</p>
              <p>School and external certificates</p>
              <p>Competitions and awards</p>
              <p>Leadership and teamwork</p>
              <p>Volunteering and service</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                <CardTitle>16+ transition</CardTitle>
              </div>
              <CardDescription>
                Only selected, approved portfolio items transfer into Alumni. Private childhood records do not move automatically.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
