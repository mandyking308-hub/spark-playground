import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw, Share2, ShieldCheck, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/sharing")({
  head: () => ({ meta: [{ title: "My sharing requests — Aurelia" }] }),
  component: SharingRequests,
});

const requests = [
  { title: "Podcast episode", destination: "Approved public showcase", state: "Waiting for guardian" },
  { title: "Climate project", destination: "Verified school club", state: "Safety checks complete" },
  { title: "Innovation project", destination: "Partner challenge", state: "Waiting for guardian" },
];

function SharingRequests() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your choice, with safety around it"
        title="My sharing requests"
        description="You decide when you want to ask for wider sharing or participation. Required adults can approve the request, but they do not take ownership of your work or private drafts."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Child", to: "/dashboard/child" }, { label: "Sharing requests" }]}
      />

      <div className="flex flex-wrap gap-2"><Badge variant="secondary">Child initiated</Badge><Badge variant="outline">Private until approved</Badge><Badge variant="outline">Withdraw anytime while pending</Badge></div>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardHeader><div className="flex items-center gap-2"><Share2 className="size-5 text-primary" /><CardTitle>Requests in progress</CardTitle></div><CardDescription>Each request keeps its own approval chain. One approval never becomes permission for everything else.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {requests.map((request) => (
              <div key={`${request.title}-${request.destination}`} className="rounded-xl border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><p className="font-medium">{request.title}</p><p className="mt-1 text-sm text-muted-foreground">{request.destination}</p><Badge variant="secondary" className="mt-3">{request.state}</Badge></div>
                  <Button size="sm" variant="outline" disabled><RotateCcw className="mr-1 size-4" />Withdraw request</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><div className="flex items-center gap-2"><Sparkles className="size-5 text-primary" /><CardTitle>You stay in control</CardTitle></div></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="rounded-lg bg-muted/40 p-3">✓ Your work starts private.</p>
              <p className="rounded-lg bg-muted/40 p-3">✓ You choose when to request wider sharing.</p>
              <p className="rounded-lg bg-muted/40 p-3">✓ You can withdraw a pending request.</p>
              <p className="rounded-lg bg-muted/40 p-3">✕ An adult approval cannot silently expose other projects.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Safety chain</CardTitle></div><CardDescription>Depending on the request, guardian, school, jurisdiction and safety checks may all need to agree before anything changes.</CardDescription></CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
