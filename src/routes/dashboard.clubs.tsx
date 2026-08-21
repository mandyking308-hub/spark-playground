import { Link, createFileRoute } from "@tanstack/react-router";
import { BookOpen, Code2, Leaf, Languages, ShieldCheck, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/clubs")({
  head: () => ({ meta: [{ title: "Clubs — Aurelia" }] }),
  component: Clubs,
});

const clubs = [
  { name: "Coding Club", scope: "Verified school cohort", icon: Code2 },
  { name: "Book Club", scope: "Education group", icon: BookOpen },
  { name: "Planet & Nature", scope: "Curated cross-school", icon: Leaf },
  { name: "Languages Exchange", scope: "Moderated programme", icon: Languages },
];

function Clubs() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Interests first, people second"
        title="Clubs"
        description="Children join age-appropriate, verified communities around interests and projects. Membership comes through schools, cohorts and approved programmes rather than open stranger discovery."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Clubs" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Button asChild><Link to="/dashboard/club-space">Open example club</Link></Button>
        <Button asChild variant="outline"><Link to="/dashboard/club-builder">Staff: create club</Link></Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {clubs.map((club) => (
          <Card key={club.name}>
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><club.icon className="size-5" /></div>
              <CardTitle>{club.name}</CardTitle>
              <CardDescription>{club.scope}</CardDescription>
            </CardHeader>
            <CardContent><Button asChild variant="outline" className="w-full"><Link to="/dashboard/club-space">Open club</Link></Button></CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Closed collaboration</CardTitle></div>
          <CardDescription>Collaboration is limited to authorised peers and programmes. There is no open child directory and no unrestricted adult-to-child direct message channel.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="secondary"><UsersRound className="mr-1 size-3" /> Verified members</Badge>
          <Badge variant="outline">Moderated spaces</Badge>
          <Badge variant="outline">Age-banded access</Badge>
          <Badge variant="outline">No contact sharing</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
