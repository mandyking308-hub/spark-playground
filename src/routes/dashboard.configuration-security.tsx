import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, RefreshCw, ShieldCheck, Workflow } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/configuration-security")({
  component: ConfigurationSecurityPage,
});

const controls = [
  {
    icon: KeyRound,
    title: "Secrets stay outside source control",
    text: "The app records an opaque provider reference, owner, purpose and rotation metadata — never the credential value itself.",
  },
  {
    icon: Workflow,
    title: "Production changes require two people",
    text: "A production secret/config change requires step-up authentication, a change record and a distinct second approver.",
  },
  {
    icon: RefreshCw,
    title: "Rotation is time-bounded",
    text: "Old credentials get an explicit revocation deadline. Compromised credentials move immediately into incident response and revocation.",
  },
  {
    icon: ShieldCheck,
    title: "Browser receives public values only",
    text: "Service-role keys, client secrets, private keys, passwords and raw access/refresh tokens are never valid browser configuration.",
  },
];

function ConfigurationSecurityPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Production security"
        title="Secrets & configuration governance"
        description="Control how environment configuration and provider credentials are owned, changed, rotated and revoked without exposing secret values to source control, browser bundles or audit records."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Secrets & configuration" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Reference-only secret metadata</Badge>
        <Badge variant="outline">Two-person production approval</Badge>
        <Badge variant="outline">Step-up authentication</Badge>
        <Badge variant="outline">Audited rotation & revocation</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {controls.map((control) => (
          <Card key={control.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <control.icon className="size-4" /> {control.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">{control.text}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Environment trust boundary</CardTitle></CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-4">
          <div className="rounded-lg border p-3"><p className="font-medium">Development</p><p className="mt-1 text-muted-foreground">Change record + step-up for secret operations.</p></div>
          <div className="rounded-lg border p-3"><p className="font-medium">Preview</p><p className="mt-1 text-muted-foreground">No production credentials; public browser config only.</p></div>
          <div className="rounded-lg border p-3"><p className="font-medium">Staging</p><p className="mt-1 text-muted-foreground">Audited config changes and isolated credentials.</p></div>
          <div className="rounded-lg border p-3"><p className="font-medium">Production</p><p className="mt-1 text-muted-foreground">Step-up + distinct approver + change ticket required.</p></div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Governance preview only. No live secret manager is connected yet, and no secret values are stored by this workspace.
      </p>
    </div>
  );
}
