import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/club-builder")({
  head: () => ({ meta: [{ title: "Club Builder — Aurelia" }] }),
  component: ClubBuilder,
});

function ClubBuilder() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Staff / group tool"
        title="Create a verified club"
        description="Schools and education groups define the purpose, age band, moderators and membership route before a club can open. There is no public child recruitment directory."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Clubs", to: "/dashboard/clubs" }, { label: "Club Builder" }]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Club details</CardTitle>
          <CardDescription>Preview form — saving stays disabled until the backend is connected.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2"><Label htmlFor="club-name">Club name</Label><Input id="club-name" placeholder="Young Makers Club" disabled /></div>
          <div className="space-y-2"><Label htmlFor="min-age">Minimum age</Label><Input id="min-age" type="number" placeholder="10" disabled /></div>
          <div className="space-y-2"><Label htmlFor="max-age">Maximum age</Label><Input id="max-age" type="number" placeholder="14" disabled /></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="purpose">Purpose and activities</Label><Textarea id="purpose" placeholder="Describe what members will make, learn or explore together..." disabled /></div>
          <div className="space-y-2"><Label htmlFor="moderators">Named staff moderators</Label><Input id="moderators" placeholder="At least one verified moderator" disabled /></div>
          <div className="space-y-2"><Label htmlFor="membership">Membership route</Label><Input id="membership" placeholder="School / cohort / approved programme" disabled /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Opening checklist</CardTitle></div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {["Age band defined", "Moderator assigned", "Membership source verified", "Guardian/school approval route set", "No DMs enabled", "Reporting route active"].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-lg border p-3 text-sm"><UsersRound className="size-4 text-primary" />{item}</div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center gap-3"><Button disabled>Create club</Button><Badge variant="outline">Backend required</Badge></div>
    </div>
  );
}
