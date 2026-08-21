import { createFileRoute } from "@tanstack/react-router";
import { Boxes, GitBranch, LockKeyhole, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/supply-chain")({ component: SupplyChainPage });

const controls = [
  { icon: GitBranch, title: "Immutable CI components", text: "GitHub Actions are pinned to commit SHAs and the Bun runtime is pinned to the validated version." },
  { icon: LockKeyhole, title: "Frozen dependency resolution", text: "CI installs from the committed lockfile and fails instead of silently resolving a different dependency graph." },
  { icon: Boxes, title: "Dependency review", text: "Source, resolved version, provenance, vulnerability risk and install-script review are recorded before elevated-risk use." },
  { icon: ShieldCheck, title: "Bounded exceptions", text: "Critical-risk exceptions are explicit, time-bounded and reviewed; known-malicious packages are blocked." },
];

function SupplyChainPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Production security"
        title="Software supply-chain security"
        description="Protect the build pipeline and dependency graph from mutable tooling, unreviewed sources and permanent vulnerability exceptions."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Supply-chain security" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Immutable CI action refs</Badge>
        <Badge variant="outline">Frozen lockfile</Badge>
        <Badge variant="outline">Read-only CI token</Badge>
        <Badge variant="outline">Audited dependency exceptions</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {controls.map((control) => (
          <Card key={control.title}>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><control.icon className="size-4" />{control.title}</CardTitle></CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">{control.text}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">CI policy now enforced in GitHub</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Checkout and Bun setup actions are pinned to immutable commits.</p>
          <p>Bun is pinned to the version validated by this repository rather than <code>latest</code>.</p>
          <p>Dependency installation uses <code>--frozen-lockfile</code>.</p>
          <p>Workflow permissions remain read-only for repository contents.</p>
        </CardContent>
      </Card>
    </div>
  );
}
