import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, FileCheck2, LockKeyhole, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/alumni/portfolio")({
  head: () => ({ meta: [{ title: "Alumni Portfolio — Aurelia" }] }),
  component: AlumniPortfolio,
});

const items = [
  { title: "Young Innovator finalist", source: "Verified award", icon: BadgeCheck },
  { title: "Podcast series: Future Cities", source: "Approved creator work", icon: Sparkles },
  { title: "Community leadership certificate", source: "Verified certificate", icon: FileCheck2 },
];

function AlumniPortfolio() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="16+ portfolio"
        title="My Portfolio"
        description="A member chooses which approved achievements and creations move forward. Childhood privacy does not disappear just because the member turns 16."
        crumbs={[{ label: "Alumni", to: "/alumni" }, { label: "Portfolio" }]}
      />
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Approved transition items</CardTitle><CardDescription>Preview examples of records selected for the adult portfolio.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div key={item.title} className="flex items-center gap-3 rounded-xl border p-4">
                <item.icon className="size-5 text-primary" />
                <div className="flex-1"><p className="font-medium">{item.title}</p><p className="text-sm text-muted-foreground">{item.source}</p></div>
                <Badge variant="secondary">Approved</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div className="flex items-center gap-2"><LockKeyhole className="size-5 text-primary" /><CardTitle>Private by history</CardTitle></div><CardDescription>Private childhood records remain private unless explicitly selected and eligible.</CardDescription></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground"><p>No automatic message-history transfer.</p><p>No hidden safeguarding-record transfer into a public profile.</p><p>No automatic publication of family-only projects.</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
