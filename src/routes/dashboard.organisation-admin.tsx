import { createFileRoute } from "@tanstack/react-router";
import { Building2, ShieldCheck, UserRoundCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/organisation-admin")({
  head: () => ({ meta: [{ title: "Organisation Admin — Aurelia" }] }),
  component: OrganisationAdmin,
});

const staff = [
  { name: "Programme lead", role: "Programme admin", status: "Verified" },
  { name: "Education editor", role: "Content editor", status: "Verified" },
  { name: "Challenge judge", role: "Judge", status: "Approved programme only" },
];

function OrganisationAdmin() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verified partner administration"
        title="Organisation workspace"
        description="Manage the organisation's approved programmes, named staff and content permissions. Institutional verification does not create access to child directories or private child records."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Organisation Spaces", to: "/dashboard/organisations" }, { label: "Organisation Admin" }]}
      />
      <div className="flex flex-wrap gap-2"><Badge variant="secondary">Verified organisation</Badge><Badge variant="outline">Approved programme</Badge><Badge variant="outline">Aggregate reporting only</Badge></div>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader><div className="flex items-center gap-2"><UserRoundCheck className="size-5 text-primary" /><CardTitle>Authorised staff</CardTitle></div><CardDescription>Every staff member needs their own verified platform identity and explicit programme role.</CardDescription></CardHeader>
          <CardContent className="space-y-2">{staff.map((person) => <div key={person.name} className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm"><div><p className="font-medium">{person.name}</p><p className="text-muted-foreground">{person.role}</p></div><Badge variant="outline">{person.status}</Badge></div>)}<Button disabled className="mt-2">Add authorised staff</Button></CardContent>
        </Card>
        <Card>
          <CardHeader><div className="flex items-center gap-2"><Building2 className="size-5 text-primary" /><CardTitle>Programme status</CardTitle></div></CardHeader>
          <CardContent className="space-y-3 text-sm"><p className="rounded-lg bg-muted/40 p-3">Young innovators programme · approved</p><p className="rounded-lg bg-muted/40 p-3">Museum careers masterclass · review pending</p><p className="rounded-lg bg-muted/40 p-3">Science challenge · approved</p></CardContent>
        </Card>
      </div>
      <Card><CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Partner boundary</CardTitle></div></CardHeader><CardContent className="grid gap-3 sm:grid-cols-3 text-sm"><p className="rounded-lg border p-3">No child directory</p><p className="rounded-lg border p-3">No private child contact</p><p className="rounded-lg border p-3">No behavioural-profile export</p></CardContent></Card>
    </div>
  );
}
