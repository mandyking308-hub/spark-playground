import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin, ShieldCheck, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/parent-event")({
  head: () => ({ meta: [{ title: "Parent Event — Aurelia" }] }),
  component: ParentEvent,
});

function ParentEvent() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Adult community event"
        title="Parent networking breakfast"
        description="Events can connect current and alumni parents across one school, a city or the wider education group. Attendance remains adult-only unless the school explicitly creates a separate family event."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Parent Community", to: "/dashboard/parent-community" }, { label: "Event" }]}
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader><div className="flex items-center gap-2"><CalendarDays className="size-5 text-primary" /><CardTitle>Event details</CardTitle></div><CardDescription>Preview event record.</CardDescription></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="rounded-lg border p-3"><strong>Date:</strong> 24 September · 08:30–10:00</p>
            <p className="rounded-lg border p-3"><strong>Audience:</strong> Verified current + alumni parents</p>
            <p className="flex items-center gap-2 rounded-lg border p-3"><MapPin className="size-4 text-primary" />London school community</p>
            <Button disabled>RSVP</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><div className="flex items-center gap-2"><UsersRound className="size-5 text-primary" /><CardTitle>Who can attend</CardTitle></div></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="rounded-lg bg-muted/40 p-3">Verified current parents</p>
            <p className="rounded-lg bg-muted/40 p-3">Verified Parent Alumni</p>
            <p className="rounded-lg bg-muted/40 p-3">Invited school/group staff</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Event safety boundary</CardTitle></div><CardDescription>Attendance at an adult event does not grant access to child profiles, contact details or private pupil work.</CardDescription></CardHeader>
        <CardContent className="flex flex-wrap gap-2"><Badge variant="secondary">Adult-only record</Badge><Badge variant="outline">Verified attendees</Badge><Badge variant="outline">Child permissions unchanged</Badge></CardContent>
      </Card>
    </div>
  );
}
