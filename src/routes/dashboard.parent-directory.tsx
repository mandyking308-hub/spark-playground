import { createFileRoute } from "@tanstack/react-router";
import { BriefcaseBusiness, MapPin, ShieldCheck, UserRoundCheck, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/parent-directory")({
  head: () => ({ meta: [{ title: "Parent Directory — Aurelia" }] }),
  component: ParentDirectory,
});

const adults = [
  { name: "Alex Morgan", headline: "Founder · Technology", region: "London", status: "Current parent" },
  { name: "Priya Shah", headline: "Doctor · Healthcare", region: "London", status: "Parent alumni" },
  { name: "Daniel Rossi", headline: "Investor · Climate", region: "Madrid", status: "Current parent" },
];

function ParentDirectory() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verified adult directory"
        title="Parent network"
        description="Find verified current and alumni parents by profession, interests, location or school-community affiliation. Child names, child profiles and private family records are not part of this directory."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Parent Community", to: "/dashboard/parent-community" }, { label: "Directory" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Adults only</Badge>
        <Badge variant="outline">Verified identity</Badge>
        <Badge variant="outline">Opt-in visibility</Badge>
        <Badge variant="outline">No child identifiers</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {adults.map((adult) => (
          <Card key={adult.name}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRoundCheck className="size-5" /></div>
                <Badge variant="outline">{adult.status}</Badge>
              </div>
              <CardTitle>{adult.name}</CardTitle>
              <CardDescription>{adult.headline}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" />{adult.region}</p>
              <Button className="w-full" disabled>Connect</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Connection boundary</CardTitle></div>
          <CardDescription>Adult-to-adult networking is allowed because both sides are verified adults. It never changes either adult's permissions over children.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3 text-sm">
          <div className="rounded-lg border p-3"><UsersRound className="mb-2 size-4 text-primary" />Mutual adult connections</div>
          <div className="rounded-lg border p-3"><BriefcaseBusiness className="mb-2 size-4 text-primary" />Professional/interest discovery</div>
          <div className="rounded-lg border p-3"><ShieldCheck className="mb-2 size-4 text-primary" />Child access unchanged</div>
        </CardContent>
      </Card>
    </div>
  );
}
