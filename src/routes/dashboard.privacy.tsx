import { Link, createFileRoute } from "@tanstack/react-router";
import { DatabaseZap, Globe2, LockKeyhole, MapPinOff, ShieldCheck, Users } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/privacy")({
  component: PrivacyPage,
});

const defaults = [
  { label: "Direct messaging", value: "Off", detail: "No open child-to-stranger messaging." },
  { label: "Livestreaming", value: "Off", detail: "Pre-recorded creation and moderated publication instead." },
  { label: "Behavioural advertising", value: "Off", detail: "Children are not monetised through behavioural profiles." },
  { label: "AI companions", value: "Off", detail: "AI remains a bounded creative/learning tool." },
  { label: "Location sharing", value: "Off", detail: "Precise location is not shared by default." },
  { label: "Profiling", value: "Off", detail: "Discovery does not depend on child vulnerability or behavioural targeting." },
];

function PrivacyPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Privacy by default"
        title="Privacy & consent"
        description="Parent, school and jurisdiction controls sit above child-facing features. Unknown jurisdictions fall back to the safer policy rather than unlocking functionality."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Privacy & consent" }]}
      />

      <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe2 className="size-4" /> Jurisdiction policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Current preview</span>
                <Badge variant="secondary">Safe default</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Country-specific rules will be loaded as versioned policy records. Until a verified rule is available, the platform keeps the stricter child settings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4" /> Consent history
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Publishing decisions are versioned.</p>
              <p>AI consent is separate from account consent.</p>
              <p>Portfolio transition into Alumni requires explicit approval.</p>
              <p>Withdrawal is recorded rather than silently erasing the audit trail.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DatabaseZap className="size-4" /> Data lifecycle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Export, account deletion and selective 16+ Alumni transfer are separate auditable workflows.</p>
              <Button asChild variant="outline"><Link to="/dashboard/data-rights">Open data rights</Link></Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="size-4" /> Child privacy defaults
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            {defaults.map((item) => (
              <div key={item.label} className="flex gap-4 p-5">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  {item.label === "Location sharing" ? (
                    <MapPinOff className="size-4" />
                  ) : (
                    <LockKeyhole className="size-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{item.label}</p>
                    <Badge variant="outline">{item.value}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Publishing consent chain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="outline">Child creates</Badge>
            <span>→</span>
            <Badge variant="outline">Safety scan</Badge>
            <span>→</span>
            <Badge variant="outline">Age / jurisdiction check</Badge>
            <span>→</span>
            <Badge variant="outline">Parent approval when required</Badge>
            <span>→</span>
            <Badge variant="outline">Moderation</Badge>
            <span>→</span>
            <Badge>Publish</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
