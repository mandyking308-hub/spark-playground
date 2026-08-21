import { createFileRoute } from "@tanstack/react-router";
import { ArchiveRestore, Download, ShieldCheck, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/data-rights")({
  head: () => ({ meta: [{ title: "Data rights — Aurelia" }] }),
  component: DataRightsPage,
});

const deletionFlow = [
  "Verify the request and identity/guardian authority where applicable",
  "Revoke active sessions and public sharing when deletion processing begins",
  "Delete ordinary profile, project, media, Passport and community data",
  "Retain only a separately justified, policy-versioned safety/compliance record until its expiry",
  "Record each data-class outcome and complete the request audit trail",
];

function DataRightsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Privacy lifecycle"
        title="Your data rights"
        description="Export your ordinary account data, request account deletion, or — from age 16 when eligible — choose specific Passport evidence to carry into Alumni. These are separate workflows with separate safeguards."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Privacy", to: "/dashboard/privacy" }, { label: "Data rights" }]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Download className="size-5 text-primary" />
            <CardTitle>Export my data</CardTitle>
            <CardDescription>Prepare a portable copy of ordinary account, project, achievement, Passport, community and consent-history data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant="outline">No blind export of protected third-party safety records</Badge>
            <Button disabled>Request export</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Trash2 className="size-5 text-primary" />
            <CardTitle>Delete my account</CardTitle>
            <CardDescription>Remove ordinary account and product data. A narrow safeguarding/compliance hold cannot be used to keep unrelated projects or community data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant="secondary">Access revoked when processing starts</Badge>
            <Button disabled variant="destructive">Request deletion</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ArchiveRestore className="size-5 text-primary" />
            <CardTitle>Move selected work to Alumni</CardTitle>
            <CardDescription>For eligible 16+ members only. Choose specific Passport items; childhood family, moderation and safeguarding records never transfer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant="outline">Explicit item-by-item consent</Badge>
            <Button disabled>Select Passport items</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>What deletion actually means</CardTitle></div>
          <CardDescription>Retention exceptions are narrow, expiring records — not a blanket reason to keep an account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {deletionFlow.map((step, index) => (
            <div key={step} className="flex gap-3 rounded-lg border p-4 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-medium">{index + 1}</span>
              <p className="text-muted-foreground">{step}</p>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">These actions remain disabled until the dedicated backend, identity verification and jurisdiction-specific rights workflow are connected.</p>
        </CardContent>
      </Card>
    </div>
  );
}
