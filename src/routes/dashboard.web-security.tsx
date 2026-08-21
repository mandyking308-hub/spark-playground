import { createFileRoute } from "@tanstack/react-router";
import { Cookie, ExternalLink, GlobeLock, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/web-security")({ component: WebSecurityPage });

const controls = [
  { icon: ShieldCheck, title: "CSRF-protected mutations", text: "Cookie-authenticated state changes require same-origin validation and a valid anti-CSRF token." },
  { icon: GlobeLock, title: "Exact-origin CORS", text: "Credentialed API access uses explicit approved origins; wildcard credentialed CORS is prohibited." },
  { icon: Cookie, title: "Hardened session cookies", text: "Session cookies are HttpOnly, Secure and SameSite protected, with authority still resolved server-side." },
  { icon: ExternalLink, title: "Redirect allowlists", text: "External redirect targets must be exact approved HTTPS hosts; javascript/data/open redirects are rejected." },
];

function WebSecurityPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Web boundary"
        title="Browser & API security"
        description="Define the browser/server trust boundary before live authentication is connected: request integrity, CORS, cookies, redirects and production response headers."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Browser & API security" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">CSRF-protected mutations</Badge>
        <Badge variant="outline">No wildcard credentialed CORS</Badge>
        <Badge variant="outline">HttpOnly + Secure cookies</Badge>
        <Badge variant="outline">Anti-framing CSP</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {controls.map((control) => (
          <Card key={control.title}><CardHeader><CardTitle className="flex items-center gap-2 text-base"><control.icon className="size-4" />{control.title}</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-muted-foreground">{control.text}</CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Production response-header contract</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Content Security Policy defaults to self, blocks objects and framing, and constrains form/base targets.</p>
          <p>Nosniff, strict referrer policy, DENY framing and HSTS are required.</p>
          <p>Geolocation, payment, USB and serial permissions are disabled by default; child precise location remains off.</p>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">Security contract only. Response headers and cookie issuance will be applied by the dedicated production server/auth layer, not simulated in the browser.</p>
    </div>
  );
}
