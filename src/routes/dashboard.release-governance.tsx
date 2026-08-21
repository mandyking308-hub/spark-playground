import { createFileRoute } from "@tanstack/react-router";
import { Flag, GitPullRequestArrow, RotateCcw, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/release-governance")({ component: ReleaseGovernancePage });

const controls = [
  { icon: GitPullRequestArrow, title: "Green gate before production", text: "Tests and security checks must pass before a release can proceed." },
  { icon: ShieldCheck, title: "Safety review for risky changes", text: "High/critical changes require child-safety impact review and a distinct production approver." },
  { icon: RotateCcw, title: "Rollback is planned, not improvised", text: "Risky releases require rollback evidence and database reversibility or verified recovery protection." },
  { icon: Flag, title: "Safer feature-flag defaults", text: "Flags that could widen child access stay disabled until an approved change explicitly enables them." },
];

function ReleaseGovernancePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Change control"
        title="Release & feature governance"
        description="Keep production changes reviewable, reversible and child-safe, including emergency changes and feature flags."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Release governance" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Green CI required</Badge>
        <Badge variant="outline">Distinct production approver</Badge>
        <Badge variant="outline">Rollback evidence</Badge>
        <Badge variant="outline">Safe feature-flag defaults</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {controls.map((control) => (
          <Card key={control.title}><CardHeader><CardTitle className="flex items-center gap-2 text-base"><control.icon className="size-4" />{control.title}</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-muted-foreground">{control.text}</CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Emergency does not mean unreviewed</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">Urgent security or safety fixes may move quickly, but they do not bypass child-safety requirements and always require a recorded after-action review.</CardContent>
      </Card>
    </div>
  );
}
