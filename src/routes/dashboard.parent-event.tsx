import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  MapPin,
  Plus,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  listAdultCommunitiesFn,
  listAdultEventsFn,
  listMyAdultEventRsvpsFn,
  setAdultEventRsvpFn,
  type AdultCommunity,
  type AdultEvent,
  type AdultEventRsvp,
} from "@/functions/parent-community";
import { createAdultEventFn } from "@/functions/parent-community-organise";

export const Route = createFileRoute("/dashboard/parent-event")({
  head: () => ({ meta: [{ title: "Parent Events — Aurelia" }] }),
  component: ParentEvent,
});

function localDateTimeToIso(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid event date");
  return date.toISOString();
}

function ParentEvent() {
  const [events, setEvents] = useState<AdultEvent[]>([]);
  const [rsvps, setRsvps] = useState<AdultEventRsvp[]>([]);
  const [communities, setCommunities] = useState<AdultCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyEventId, setBusyEventId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [location, setLocation] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const [eventItems, myRsvps, circleItems] = await Promise.all([
        listAdultEventsFn(),
        listMyAdultEventRsvpsFn(),
        listAdultCommunitiesFn(),
      ]);
      setEvents(eventItems);
      setRsvps(myRsvps);
      setCommunities(circleItems);
      setError(null);
    } catch {
      setError("Adult community events could not be loaded. This space is available only to eligible verified parent accounts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const rsvpByEvent = useMemo(() => new Map(rsvps.map((rsvp) => [rsvp.eventId, rsvp])), [rsvps]);
  const communityById = useMemo(() => new Map(communities.map((community) => [community.id, community])), [communities]);

  async function rsvp(eventId: string, response: "going" | "interested" | "declined") {
    setBusyEventId(eventId);
    setError(null);
    setMessage(null);
    try {
      await setAdultEventRsvpFn({ data: { eventId, response } });
      setMessage(response === "going" ? "You’re going." : response === "interested" ? "Marked as interested." : "RSVP updated.");
      setRsvps(await listMyAdultEventRsvpsFn());
    } catch {
      setError("Your RSVP could not be saved.");
    } finally {
      setBusyEventId(null);
    }
  }

  async function createEvent() {
    if (!title.trim() || !startsAt) {
      setError("Add an event title and start time.");
      return;
    }
    setCreating(true);
    setError(null);
    setMessage(null);
    try {
      await createAdultEventFn({
        data: {
          title: title.trim(),
          description: description.trim(),
          startsAt: localDateTimeToIso(startsAt),
          endsAt: endsAt ? localDateTimeToIso(endsAt) : undefined,
          locationText: location.trim(),
          communityId: communityId || undefined,
          audience: "parents_and_alumni",
        },
      });
      setTitle("");
      setDescription("");
      setStartsAt("");
      setEndsAt("");
      setLocation("");
      setCommunityId("");
      setShowCreate(false);
      setMessage("Adult community event created.");
      await refresh();
    } catch {
      setError("The event could not be created. Check that the dates are valid and the end time is after the start.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Adult community events"
        title="Parent events"
        description="Verified current and alumni parents can organise and attend adult networking, learning, volunteering and reunion events. Attendance never changes permissions over children."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Parent Community", to: "/dashboard/parent-community" }, { label: "Events" }]}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">Verified adults</Badge>
        <Badge variant="outline">Current + Parent Alumni</Badge>
        <Badge variant="outline">Live RSVP</Badge>
        <Button className="ms-auto" size="sm" variant={showCreate ? "secondary" : "outline"} onClick={() => setShowCreate((value) => !value)}>
          <Plus className="mr-2 size-4" /> Create event
        </Button>
      </div>

      {message ? (
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm"><CheckCircle2 className="size-4 shrink-0 text-primary" />{message}</div>
      ) : null}
      {error ? <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm">{error}</div> : null}

      {showCreate ? (
        <Card>
          <CardHeader>
            <CardTitle>Create an adult event</CardTitle>
            <CardDescription>Events are visible only inside the verified parent community. Link one to a circle if useful.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="event-title" className="text-sm font-medium">Event title</label>
              <Input id="event-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={180} placeholder="Parent networking breakfast" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="event-description" className="text-sm font-medium">Description</label>
              <Textarea id="event-description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={3000} placeholder="What is the event for?" />
            </div>
            <div className="space-y-2">
              <label htmlFor="event-start" className="text-sm font-medium">Starts</label>
              <Input id="event-start" type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="event-end" className="text-sm font-medium">Ends</label>
              <Input id="event-end" type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="event-location" className="text-sm font-medium">Location</label>
              <Input id="event-location" value={location} onChange={(event) => setLocation(event.target.value)} maxLength={240} placeholder="Mayfair, London" />
            </div>
            <div className="space-y-2">
              <label htmlFor="event-circle" className="text-sm font-medium">Circle (optional)</label>
              <select id="event-circle" value={communityId} onChange={(event) => setCommunityId(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Whole parent community</option>
                {communities.map((community) => <option key={community.id} value={community.id}>{community.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <Button onClick={() => void createEvent()} disabled={creating || !title.trim() || !startsAt}>
                {creating ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                {creating ? "Creating…" : "Create event"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 rounded-xl border p-6 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading events…</div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <CalendarDays className="mx-auto size-7 text-primary" />
          <p className="mt-3 font-medium">No adult community events yet</p>
          <p className="mx-auto mt-1 max-w-lg text-sm text-muted-foreground">Create the first networking breakfast, talk, reunion or volunteering event. No fake event records are shown.</p>
          <Button className="mt-4" size="sm" onClick={() => setShowCreate(true)}>Create the first event</Button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {events.map((eventItem) => {
            const current = rsvpByEvent.get(eventItem.id)?.response;
            const community = eventItem.communityId ? communityById.get(eventItem.communityId) : undefined;
            return (
              <Card key={eventItem.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>{eventItem.title}</CardTitle>
                      <CardDescription className="mt-1 leading-relaxed">{eventItem.description || "Adult parent community event"}</CardDescription>
                    </div>
                    {current ? <Badge variant="secondary" className="capitalize">{current}</Badge> : null}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">{new Date(eventItem.startsAt).toLocaleString()}</p>
                    {eventItem.endsAt ? <p className="mt-1 text-muted-foreground">Ends {new Date(eventItem.endsAt).toLocaleString()}</p> : null}
                  </div>
                  {eventItem.locationText ? <p className="flex items-center gap-2 rounded-lg border p-3"><MapPin className="size-4 text-primary" />{eventItem.locationText}</p> : null}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <UsersRound className="size-4" />
                    <span>{community?.name ?? "Whole parent community"}</span>
                    <span>·</span>
                    <span>Current + alumni parents</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => void rsvp(eventItem.id, "going")} disabled={busyEventId === eventItem.id} variant={current === "going" ? "default" : "outline"}>Going</Button>
                    <Button size="sm" onClick={() => void rsvp(eventItem.id, "interested")} disabled={busyEventId === eventItem.id} variant={current === "interested" ? "secondary" : "outline"}>Interested</Button>
                    <Button size="sm" onClick={() => void rsvp(eventItem.id, "declined")} disabled={busyEventId === eventItem.id} variant="ghost">Can’t go</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Event safety boundary</CardTitle></div><CardDescription>Attendance at an adult event does not grant access to child profiles, contact details or private pupil work.</CardDescription></CardHeader>
        <CardContent className="flex flex-wrap gap-2"><Badge variant="secondary">Adult-only record</Badge><Badge variant="outline">Verified attendees</Badge><Badge variant="outline">Child permissions unchanged</Badge></CardContent>
      </Card>
    </div>
  );
}
