import { createFileRoute } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Loader2,
  MessageSquareText,
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
  createAdultCommunityPostFn,
  joinAdultCommunityFn,
  listAdultCommunitiesFn,
  listAdultCommunityPostsFn,
  listMyAdultCommunityMembershipsFn,
  type AdultCommunity,
  type AdultCommunityMembership,
  type AdultCommunityPost,
} from "@/functions/parent-community";
import { createAdultCommunityFn } from "@/functions/parent-community-organise";

export const Route = createFileRoute("/dashboard/parent-circle")({
  head: () => ({ meta: [{ title: "Parent Circles — Aurelia" }] }),
  component: ParentCircle,
});

function ParentCircle() {
  const [communities, setCommunities] = useState<AdultCommunity[]>([]);
  const [memberships, setMemberships] = useState<AdultCommunityMembership[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [posts, setPosts] = useState<AdultCommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postBody, setPostBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [joining, setJoining] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshCommunities(preferredId?: string) {
    try {
      const [items, mine] = await Promise.all([
        listAdultCommunitiesFn(),
        listMyAdultCommunityMembershipsFn(),
      ]);
      setCommunities(items);
      setMemberships(mine);
      const activeIds = new Set(mine.filter((membership) => membership.status === "active").map((membership) => membership.communityId));
      const nextId =
        preferredId ??
        selectedId ??
        items.find((community) => activeIds.has(community.id))?.id ??
        items[0]?.id ??
        null;
      setSelectedId(nextId);
      setError(null);
    } catch {
      setError("Parent circles could not be loaded. This space is available only to eligible verified parent accounts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshCommunities();
  }, []);

  const activeMembershipIds = useMemo(
    () => new Set(memberships.filter((membership) => membership.status === "active").map((membership) => membership.communityId)),
    [memberships],
  );

  const selectedCommunity = communities.find((community) => community.id === selectedId) ?? null;
  const joinedSelected = selectedCommunity ? activeMembershipIds.has(selectedCommunity.id) : false;

  async function refreshPosts(communityId: string) {
    if (!activeMembershipIds.has(communityId)) {
      setPosts([]);
      return;
    }
    setLoadingPosts(true);
    try {
      setPosts(await listAdultCommunityPostsFn({ data: { communityId } }));
      setError(null);
    } catch {
      setPosts([]);
      setError("This circle discussion could not be loaded.");
    } finally {
      setLoadingPosts(false);
    }
  }

  useEffect(() => {
    if (selectedId) void refreshPosts(selectedId);
    else setPosts([]);
  }, [selectedId, memberships]);

  async function join() {
    if (!selectedCommunity) return;
    setJoining(true);
    setError(null);
    setMessage(null);
    try {
      await joinAdultCommunityFn({ data: { communityId: selectedCommunity.id } });
      setMessage(`You joined ${selectedCommunity.name}.`);
      await refreshCommunities(selectedCommunity.id);
    } catch {
      setError("This circle could not be joined.");
    } finally {
      setJoining(false);
    }
  }

  async function post() {
    if (!selectedCommunity || !postBody.trim()) return;
    setPosting(true);
    setError(null);
    setMessage(null);
    try {
      await createAdultCommunityPostFn({ data: { communityId: selectedCommunity.id, body: postBody.trim() } });
      setPostBody("");
      setMessage("Posted to the adult circle.");
      await refreshPosts(selectedCommunity.id);
    } catch {
      setError("Your post could not be shared.");
    } finally {
      setPosting(false);
    }
  }

  async function createCircle() {
    if (newName.trim().length < 2) {
      setError("Give the circle a name.");
      return;
    }
    setCreating(true);
    setError(null);
    setMessage(null);
    try {
      const created = await createAdultCommunityFn({
        data: {
          name: newName.trim(),
          description: newDescription.trim(),
          communityType: "interest",
        },
      });
      setNewName("");
      setNewDescription("");
      setShowCreate(false);
      setMessage("Your adult circle is live.");
      await refreshCommunities(created.communityId);
    } catch {
      setError("The circle could not be created.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Adult-only circles"
        title="Parent circles"
        description="Verified current and alumni parents can create small adult communities for professional networking, interests, location, volunteering and collaboration. No circle exposes child records."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Parent Community", to: "/dashboard/parent-community" }, { label: "Circles" }]}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">Current + alumni parents</Badge>
        <Badge variant="outline">Adult discussion</Badge>
        <Badge variant="outline">Opt-in membership</Badge>
        <Button className="ms-auto" size="sm" variant={showCreate ? "secondary" : "outline"} onClick={() => setShowCreate((value) => !value)}>
          <Plus className="mr-2 size-4" /> Create circle
        </Button>
      </div>

      {message ? (
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
          <CheckCircle2 className="size-4 shrink-0 text-primary" />{message}
        </div>
      ) : null}
      {error ? <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm">{error}</div> : null}

      {showCreate ? (
        <Card>
          <CardHeader>
            <CardTitle>Create an adult circle</CardTitle>
            <CardDescription>Start with a clear purpose. Membership remains restricted to eligible verified parents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="circle-name" className="text-sm font-medium">Circle name</label>
              <Input id="circle-name" value={newName} onChange={(event) => setNewName(event.target.value)} maxLength={120} placeholder="Entrepreneurs & Founders" />
            </div>
            <div className="space-y-2">
              <label htmlFor="circle-description" className="text-sm font-medium">Purpose</label>
              <Textarea id="circle-description" value={newDescription} onChange={(event) => setNewDescription(event.target.value)} maxLength={1200} placeholder="Who is this circle for and what should members use it for?" />
            </div>
            <Button onClick={() => void createCircle()} disabled={creating || newName.trim().length < 2}>
              {creating ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {creating ? "Creating…" : "Create circle"}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 rounded-xl border p-6 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading circles…</div>
      ) : communities.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <UsersRound className="mx-auto size-7 text-primary" />
          <p className="mt-3 font-medium">No parent circles yet</p>
          <p className="mx-auto mt-1 max-w-lg text-sm text-muted-foreground">Create the first one for a profession, interest, city or shared project. Aurelia does not seed fake conversations.</p>
          <Button className="mt-4" size="sm" onClick={() => setShowCreate(true)}>Create the first circle</Button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UsersRound className="size-5 text-primary" />Circles</CardTitle>
              <CardDescription>Choose a community to open its adult-only space.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {communities.map((community) => {
                const joined = activeMembershipIds.has(community.id);
                return (
                  <button
                    type="button"
                    key={community.id}
                    onClick={() => setSelectedId(community.id)}
                    className={`w-full rounded-xl border p-4 text-start transition-colors ${selectedId === community.id ? "border-primary bg-primary/5" : "hover:bg-muted/40"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{community.name}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{community.description || "Adult parent community"}</p>
                      </div>
                      <Badge variant={joined ? "secondary" : "outline"}>{joined ? "Joined" : "Open"}</Badge>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2"><MessageSquareText className="size-5 text-primary" />{selectedCommunity?.name ?? "Circle discussion"}</CardTitle>
                  <CardDescription>{selectedCommunity?.description ?? "Adult-to-adult discussion inside a verified community."}</CardDescription>
                </div>
                {selectedCommunity && !joinedSelected ? (
                  <Button size="sm" onClick={() => void join()} disabled={joining}>
                    {joining ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                    Join circle
                  </Button>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!joinedSelected ? (
                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">Join this adult circle to read and take part in its discussion.</div>
              ) : loadingPosts ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading discussion…</div>
              ) : posts.length === 0 ? (
                <div className="rounded-xl border border-dashed p-6 text-center">
                  <MessageSquareText className="mx-auto size-6 text-primary" />
                  <p className="mt-2 font-medium">Start the conversation</p>
                  <p className="mt-1 text-sm text-muted-foreground">There are no posts in this circle yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map((postItem) => (
                    <div key={postItem.id} className="rounded-xl border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{postItem.authorName}</p>
                        <p className="text-xs text-muted-foreground">{new Date(postItem.createdAt).toLocaleString()}</p>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{postItem.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {joinedSelected ? (
                <div className="space-y-3 border-t pt-4">
                  <Textarea value={postBody} onChange={(event) => setPostBody(event.target.value)} maxLength={4000} placeholder="Share an introduction, question or opportunity..." />
                  <Button onClick={() => void post()} disabled={posting || !postBody.trim()}>
                    {posting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                    {posting ? "Posting…" : "Post to circle"}
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader><div className="flex items-center gap-2"><BriefcaseBusiness className="size-5 text-primary" /><CardTitle>What circles are for</CardTitle></div></CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            <p className="rounded-lg bg-muted/40 p-3">Member introductions</p>
            <p className="rounded-lg bg-muted/40 p-3">Professional events</p>
            <p className="rounded-lg bg-muted/40 p-3">Volunteering & expertise</p>
            <p className="rounded-lg bg-muted/40 p-3">Community collaboration</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Adult network only</CardTitle></div></CardHeader>
          <CardContent className="flex flex-wrap gap-2"><Badge variant="outline"><UsersRound className="mr-1 size-3" /> Verified members</Badge><Badge variant="outline">No pupil directory</Badge><Badge variant="outline">No child portfolio access</Badge></CardContent>
        </Card>
      </section>
    </div>
  );
}
