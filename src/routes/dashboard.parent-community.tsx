import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Loader2, ShieldCheck, UserRoundCheck, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  listAdultCommunitiesFn,
  listAdultDirectoryFn,
  listAdultEventsFn,
  listMyAdultCommunityMembershipsFn,
  type AdultCommunity,
  type AdultDirectoryProfile,
  type AdultEvent,
} from "@/functions/parent-community";

export const Route = createFileRoute("/dashboard/parent-community")({
  head: () => ({
    meta: [
      { title: "Parent Community — Aurelia" },
      { name: "description", content: "A verified adult-only community for current and alumni parents." },
    ],
  }),
  component: ParentCommunity,
});

function ParentCommunity() {
  const [directory, setDirectory] = useState<AdultDirectoryProfile[]>([]);
  const [communities, setCommunities] = useState<AdultCommunity[]>([]);
  const [events, setEvents] = useState<AdultEvent[]>([]);
  const [joinedCount, setJoinedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void Promise.all([
      listAdultDirectoryFn(),
      listAdultCommunitiesFn(),
      listAdultEventsFn(),
      listMyAdultCommunityMembershipsFn(),
    ])
      .then(([adults, circles, eventItems, memberships]) => {
        if (!active) return;
        setDirectory(adults);
        setCommunities(circles);
        setEvents(eventItems);
        setJoinedCount(memberships.filter((membership) => membership.status === "active").length);
        setError(null);
      })
      .catch(() => {
        if (active) setError("The parent community could not be loaded. It is available only to eligible verified parent accounts.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verified adult community"
        title="Parent Community"
        description="Current and alumni parents can build useful adult relationships around location, interests, professions, circles, events and volunteering. This network is deliberately separated from the protected child environment."
        crumbs={[{ label: "Home", to: "/" }, { label: "Dashboards", to: "/dashboard" }, { label: "Parent Community" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Verified adults only</Badge>
        <Badge variant="outline">Live parent directory</Badge>
        <Badge variant="outline">Live circles & events</Badge>
        <Badge variant="outline">Current + Parent Alumni</Badge>
      </div>

      {error ? <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm">{error}</div> : null}

      <div className="flex flex-wrap gap-2">
        <Button asChild><Link to="/dashboard/parent-directory">Browse verified adults</Link></Button>
        <Button asChild variant="outline"><Link to="/dashboard/parent-circle">Open parent circles</Link></Button>
        <Button asChild variant="outline"><Link to="/dashboard/parent-event">Community events</Link></Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 rounded-xl border p-6 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading your adult community…</div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2"><CardDescription>Opted-in adults</CardDescription><CardTitle className="font-display text-3xl">{directory.length}</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Adult profiles only. No child identifiers.</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardDescription>Active circles</CardDescription><CardTitle className="font-display text-3xl">{communities.length}</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">You have joined {joinedCount}.</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardDescription>Upcoming events</CardDescription><CardTitle className="font-display text-3xl">{events.length}</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Adult networking and community activity.</p></CardContent>
          </Card>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><UsersRound className="size-5 text-primary" /><CardTitle>Parent circles</CardTitle></div>
            <CardDescription>Real circles created by verified parents. Nothing here is seeded with fake members or conversations.</CardDescription>
          </CardHeader>
          <CardContent>
            {communities.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <p className="font-medium">No circles yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Create the first circle around an interest, profession, place or community project.</p>
                <Button asChild size="sm" className="mt-4"><Link to="/dashboard/parent-circle">Create a circle</Link></Button>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-3">
                {communities.slice(0, 3).map((community) => (
                  <div key={community.id} className="rounded-xl border p-4">
                    <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><UsersRound className="size-4" /></div>
                    <p className="font-medium">{community.name}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{community.description || "Adult parent circle"}</p>
                    <Button asChild variant="outline" size="sm" className="mt-4 w-full"><Link to="/dashboard/parent-circle">Open circles</Link></Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Child boundary</CardTitle></div>
            <CardDescription>Adult community membership never expands permissions over children.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="rounded-lg bg-muted/40 p-3">✓ Parents can discover and connect with opted-in verified adults.</p>
            <p className="rounded-lg bg-muted/40 p-3">✓ Current and alumni parents can share circles and events.</p>
            <p className="rounded-lg bg-muted/40 p-3">✕ No browsing unrelated child profiles or portfolios.</p>
            <p className="rounded-lg bg-muted/40 p-3">✕ No route from an adult circle into child direct messaging.</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><CalendarDays className="size-5 text-primary" /><CardTitle>Upcoming community events</CardTitle></div>
          <CardDescription>Live events created for the verified adult parent community.</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <CalendarDays className="mx-auto size-6 text-primary" />
              <p className="mt-2 font-medium">No events yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Create a networking breakfast, talk, reunion or volunteering event.</p>
              <Button asChild size="sm" className="mt-4"><Link to="/dashboard/parent-event">Create an event</Link></Button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              {events.slice(0, 3).map((eventItem) => (
                <div key={eventItem.id} className="rounded-xl border p-4">
                  <CalendarDays className="mb-3 size-5 text-primary" />
                  <p className="font-medium">{eventItem.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{new Date(eventItem.startsAt).toLocaleString()}</p>
                  <Button asChild variant="outline" size="sm" className="mt-3"><Link to="/dashboard/parent-event">View & RSVP</Link></Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><UserRoundCheck className="size-5 text-primary" /><CardTitle>Adult identity, not family identity</CardTitle></div>
          <CardDescription>Your directory card contains only what you choose to say about yourself. Child names, classes, work and family records are not fields in the adult community tables.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
