import { createFileRoute } from "@tanstack/react-router";
import { BotOff, KeyRound, Radar, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/abuse-protection")({ component: AbuseProtectionPage });

const controls = [
  { icon: KeyRound, title: "Credential-stuffing resistance", text: "Authentication and recovery attempts use bounded rate windows and generic responses that do not reveal child-account existence." },
  { icon: BotOff, title: "Bot and scraping controls", text: "Suspicious automation is challenged or denied without turning bot protection into behavioural advertising or cross-site child tracking." },
  { icon: Radar, title: "No child enumeration surface", text: "The platform does not expose a child-lookup or public child-directory endpoint for attackers to scrape." },
  { icon: ShieldCheck, title: "Verified state changes", text: "Uploads, feedback, challenge submissions and partner API actions require verified sessions plus bounded rates." },
];

function AbuseProtectionPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Platform defence"
        title="Abuse, automation & rate protection"
        description="Protect authentication and product workflows against credential stuffing, account enumeration, scraping, spam and automated abuse without building behavioural profiles of children."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Abuse protection" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">No child enumeration</Badge>
        <Badge variant="outline">Generic auth/recovery responses</Badge>
        <Badge variant="outline">Verified state changes</Badge>
        <Badge variant="outline">Privacy-safe security signals</Badge>
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
        <CardHeader><CardTitle className="text-base">Automation does not replace safeguarding</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Rate limits and bot decisions can restrict abusive traffic, but they do not make or close safeguarding decisions. Serious safety cases remain human-reviewed through the safeguarding workflow.
        </CardContent>
      </Card>
    </div>
  );
}
