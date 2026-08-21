import { Link, createFileRoute } from "@tanstack/react-router";
import { MessageCircleHeart, MessageSquareText, ShieldCheck, UsersRound, Wrench } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/club-space")({
  head: () => ({ meta: [{ title: "Club workspace — Aurelia" }] }),
  component: ClubSpace,
});

const updates = [
  { author: "Team Green", text: "We have chosen recycled materials for the model city." },
  { author: "Club moderator", text: "Great. Add one sentence explaining why each material was chosen." },
];

function ClubSpace() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verified club workspace"
        title="Planet & Nature Club"
        description="A bounded collaboration space for approved members and moderators. Communication stays attached to the club and its projects; there is no private-member messaging or contact exchange."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Clubs", to: "/dashboard/clubs" }, { label: "Club workspace" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Ages 10–14</Badge>
        <Badge variant="outline">Curated cross-school</Badge>
        <Badge variant="outline">Moderator present</Badge>
        <Badge variant="outline">No DMs</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Wrench className="size-5 text-primary" /><CardTitle>Current project</CardTitle></div>
            <CardDescription>Design a greener city model with your approved project team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              <p className="font-medium">Team brief</p>
              <p className="mt-1 text-muted-foreground">Choose materials, divide tasks and submit one shared project through the challenge workflow.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button disabled>Open shared project</Button>
              <Button asChild variant="outline"><Link to="/dashboard/feedback-send"><MessageCircleHeart className="mr-2 size-4" />Encourage shared work</Link></Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><UsersRound className="size-5 text-primary" /><CardTitle>Membership</CardTitle></div>
            <CardDescription>Members are invited or enrolled by an approved school/programme.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="rounded-lg bg-muted/40 p-3">12 child members · approved age band</p>
            <p className="rounded-lg bg-muted/40 p-3">2 staff moderators</p>
            <p className="rounded-lg bg-muted/40 p-3">No public member directory</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><MessageSquareText className="size-5 text-primary" /><CardTitle>Club updates</CardTitle></div>
          <CardDescription>Moderated project communication visible to club members and moderators.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {updates.map((update) => (
            <div key={`${update.author}-${update.text}`} className="rounded-lg border p-4">
              <p className="text-sm font-medium">{update.author}</p>
              <p className="mt-1 text-sm text-muted-foreground">{update.text}</p>
            </div>
          ))}
          <div className="space-y-2">
            <Textarea placeholder="Write a project update for the club..." disabled />
            <Button disabled>Post to club</Button>
            <p className="text-xs text-muted-foreground">Posting activates when the secure backend and moderation queue are connected.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Collaboration boundary</CardTitle></div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Club posts, project comments and team updates are allowed inside the verified programme. Constructive peer reactions use preset prompts; private messages, personal phone/email sharing and communication outside the club record are not.
        </CardContent>
      </Card>
    </div>
  );
}
