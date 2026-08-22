import { createFileRoute } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Loader2,
  MapPin,
  ShieldCheck,
  UserRoundCheck,
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
  getParentCommunityIdentityFn,
  listAdultConnectionsFn,
  listAdultDirectoryFn,
  requestAdultConnectionFn,
  respondAdultConnectionFn,
  upsertAdultDirectoryProfileFn,
  type AdultConnection,
  type AdultDirectoryProfile,
} from "@/functions/parent-community";

export const Route = createFileRoute("/dashboard/parent-directory")({
  head: () => ({ meta: [{ title: "Parent Directory — Aurelia" }] }),
  component: ParentDirectory,
});

function ParentDirectory() {
  const [identity, setIdentity] = useState<{ profileId: string; displayName: string } | null>(null);
  const [directory, setDirectory] = useState<AdultDirectoryProfile[]>([]);
  const [connections, setConnections] = useState<AdultConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [busyProfileId, setBusyProfileId] = useState<string | null>(null);
  const [busyConnectionId, setBusyConnectionId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [headline, setHeadline] = useState("");
  const [region, setRegion] = useState("");
  const [bio, setBio] = useState("");
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const [me, adults, links] = await Promise.all([
        getParentCommunityIdentityFn(),
        listAdultDirectoryFn(),
        listAdultConnectionsFn(),
      ]);
      setIdentity(me);
      setDirectory(adults);
      setConnections(links);
      const mine = adults.find((adult) => adult.profileId === me.profileId);
      setDisplayName(mine?.displayName ?? me.displayName);
      setHeadline(mine?.headline ?? "");
      setRegion(mine?.region ?? "");
      setBio(mine?.bio ?? "");
      setVisible(mine?.visible ?? true);
      setError(null);
    } catch {
      setError("The verified parent directory could not be loaded. This space is available only to eligible parent and Parent Alumni accounts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const directoryById = useMemo(
    () => new Map(directory.map((adult) => [adult.profileId, adult])),
    [directory],
  );

  const incoming = connections.filter(
    (connection) => connection.addresseeProfileId === identity?.profileId && connection.status === "pending",
  );

  function connectionFor(profileId: string) {
    return connections.find(
      (connection) =>
        (connection.requesterProfileId === identity?.profileId && connection.addresseeProfileId === profileId) ||
        (connection.addresseeProfileId === identity?.profileId && connection.requesterProfileId === profileId),
    );
  }

  async function saveProfile() {
    if (!displayName.trim()) {
      setError("Add your display name before joining the directory.");
      return;
    }
    setSavingProfile(true);
    setError(null);
    setMessage(null);
    try {
      await upsertAdultDirectoryProfileFn({
        data: {
          displayName: displayName.trim(),
          headline: headline.trim(),
          region: region.trim(),
          bio: bio.trim(),
          visible,
        },
      });
      setMessage(visible ? "Your adult directory profile is live." : "Your directory profile is saved but hidden from other parents.");
      await refresh();
    } catch {
      setError("Your directory profile could not be saved.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function connect(profileId: string) {
    setBusyProfileId(profileId);
    setError(null);
    setMessage(null);
    try {
      await requestAdultConnectionFn({ data: { profileId } });
      setMessage("Connection request sent.");
      const links = await listAdultConnectionsFn();
      setConnections(links);
    } catch {
      setError("That connection request could not be sent. You may already have a connection with this person.");
    } finally {
      setBusyProfileId(null);
    }
  }

  async function respond(connectionId: string, response: "accepted" | "declined") {
    setBusyConnectionId(connectionId);
    setError(null);
    setMessage(null);
    try {
      await respondAdultConnectionFn({ data: { connectionId, response } });
      setMessage(response === "accepted" ? "Connection accepted." : "Connection declined.");
      const links = await listAdultConnectionsFn();
      setConnections(links);
    } catch {
      setError("That connection response could not be saved.");
    } finally {
      setBusyConnectionId(null);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verified adult directory"
        title="Parent network"
        description="Find opted-in current and alumni parents by their own profession, interests and location. Child names, child profiles and private family records are not part of this directory."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Parent Community", to: "/dashboard/parent-community" }, { label: "Directory" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Adults only</Badge>
        <Badge variant="outline">Verified identity</Badge>
        <Badge variant="outline">Opt-in visibility</Badge>
        <Badge variant="outline">No child identifiers</Badge>
        <Badge variant="outline">Live connections</Badge>
      </div>

      {message ? (
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
          <CheckCircle2 className="size-4 shrink-0 text-primary" />
          {message}
        </div>
      ) : null}
      {error ? <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm">{error}</div> : null}

      <Card>
        <CardHeader>
          <CardTitle>Your adult profile</CardTitle>
          <CardDescription>
            You choose whether to appear. This card describes you only — never your child or family record.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="directory-name" className="text-sm font-medium">Display name</label>
            <Input id="directory-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={120} />
          </div>
          <div className="space-y-2">
            <label htmlFor="directory-headline" className="text-sm font-medium">Professional headline</label>
            <Input id="directory-headline" value={headline} onChange={(event) => setHeadline(event.target.value)} maxLength={180} placeholder="Founder · Technology" />
          </div>
          <div className="space-y-2">
            <label htmlFor="directory-region" className="text-sm font-medium">General location</label>
            <Input id="directory-region" value={region} onChange={(event) => setRegion(event.target.value)} maxLength={120} placeholder="London" />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              className="flex min-h-10 w-full items-center justify-between rounded-lg border px-3 py-2 text-sm"
              aria-pressed={visible}
            >
              <span>Visible to verified parents</span>
              <Badge variant={visible ? "secondary" : "outline"}>{visible ? "On" : "Off"}</Badge>
            </button>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="directory-bio" className="text-sm font-medium">About you</label>
            <Textarea id="directory-bio" value={bio} onChange={(event) => setBio(event.target.value)} maxLength={1200} className="min-h-24" placeholder="A short introduction, interests or ways you would like to connect…" />
          </div>
          <div className="md:col-span-2">
            <Button onClick={() => void saveProfile()} disabled={savingProfile || loading || !displayName.trim()}>
              {savingProfile ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {savingProfile ? "Saving…" : "Save adult profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {incoming.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Connection requests</CardTitle>
            <CardDescription>Requests from other verified adults in the parent network.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {incoming.map((connection) => {
              const requester = directoryById.get(connection.requesterProfileId);
              return (
                <div key={connection.id} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{requester?.displayName ?? "Verified parent"}</p>
                    <p className="text-sm text-muted-foreground">{requester?.headline ?? "Adult community member"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => void respond(connection.id, "accepted")} disabled={busyConnectionId === connection.id}>Accept</Button>
                    <Button size="sm" variant="outline" onClick={() => void respond(connection.id, "declined")} disabled={busyConnectionId === connection.id}>Decline</Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : null}

      <section>
        <div className="mb-4">
          <h2 className="font-display text-2xl tracking-tight">Verified adults</h2>
          <p className="mt-1 text-sm text-muted-foreground">Only adults who have explicitly chosen to appear are listed.</p>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 rounded-xl border p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading the adult directory…
          </div>
        ) : directory.filter((adult) => adult.profileId !== identity?.profileId).length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <UsersRound className="mx-auto size-7 text-primary" />
            <p className="mt-3 font-medium">No other adults have opted into the directory yet</p>
            <p className="mx-auto mt-1 max-w-lg text-sm text-muted-foreground">As verified parents choose to be visible, their own adult profiles will appear here. Aurelia does not manufacture demo members.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {directory.filter((adult) => adult.profileId !== identity?.profileId).map((adult) => {
              const connection = connectionFor(adult.profileId);
              const connected = connection?.status === "accepted";
              const pending = connection?.status === "pending";
              return (
                <Card key={adult.profileId}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRoundCheck className="size-5" /></div>
                      {connected ? <Badge variant="secondary">Connected</Badge> : pending ? <Badge variant="outline">Pending</Badge> : <Badge variant="outline">Verified adult</Badge>}
                    </div>
                    <CardTitle>{adult.displayName}</CardTitle>
                    <CardDescription>{adult.headline || "Parent community member"}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {adult.region ? <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" />{adult.region}</p> : null}
                    {adult.bio ? <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{adult.bio}</p> : null}
                    <Button className="w-full" onClick={() => void connect(adult.profileId)} disabled={Boolean(connection) || busyProfileId === adult.profileId}>
                      {busyProfileId === adult.profileId ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                      {connected ? "Connected" : pending ? "Request pending" : connection ? "Connection closed" : "Connect"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Connection boundary</CardTitle></div>
          <CardDescription>Adult-to-adult networking never changes either adult's permissions over children.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-lg border p-3"><UsersRound className="mb-2 size-4 text-primary" />Verified adult connections</div>
          <div className="rounded-lg border p-3"><BriefcaseBusiness className="mb-2 size-4 text-primary" />Professional and interest discovery</div>
          <div className="rounded-lg border p-3"><ShieldCheck className="mb-2 size-4 text-primary" />Child access unchanged</div>
        </CardContent>
      </Card>
    </div>
  );
}
