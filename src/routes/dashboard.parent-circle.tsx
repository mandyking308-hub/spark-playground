import { createFileRoute } from "@tanstack/react-router";
import { BriefcaseBusiness, MessageSquareText, ShieldCheck, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/parent-circle")({
  head: () => ({ meta: [{ title: "Parent Circle — Aurelia" }] }),
  component: ParentCircle,
});

const posts = [
  { author: "Verified parent", text: "I can host a short founder Q&A for parents next month." },
  { author: "Parent alumni", text: "Happy to help with the finance and fundraising section." },
];

function ParentCircle() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Adult professional circle"
        title="Entrepreneurs & Founders"
        description="A verified adult-only circle for networking, introductions, events and collaboration. Current and alumni parents participate together without exposing child records."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Parent Community", to: "/dashboard/parent-community" }, { label: "Circle" }]}
      />

      <div className="flex flex-wrap gap-2"><Badge variant="secondary">Current + alumni parents</Badge><Badge variant="outline">Adult messaging</Badge><Badge variant="outline">Opt-in membership</Badge></div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader><div className="flex items-center gap-2"><MessageSquareText className="size-5 text-primary" /><CardTitle>Circle discussion</CardTitle></div><CardDescription>Adult-to-adult discussion inside a verified community.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {posts.map((post) => <div key={post.text} className="rounded-lg border p-4"><p className="text-sm font-medium">{post.author}</p><p className="mt-1 text-sm text-muted-foreground">{post.text}</p></div>)}
            <Textarea placeholder="Share an introduction, question or opportunity..." disabled />
            <Button disabled>Post to circle</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><div className="flex items-center gap-2"><BriefcaseBusiness className="size-5 text-primary" /><CardTitle>Circle tools</CardTitle></div></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="rounded-lg bg-muted/40 p-3">Member introductions</p>
            <p className="rounded-lg bg-muted/40 p-3">Professional events</p>
            <p className="rounded-lg bg-muted/40 p-3">Volunteering & expertise</p>
            <p className="rounded-lg bg-muted/40 p-3">Group-wide networking</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Adult network only</CardTitle></div></CardHeader>
        <CardContent className="flex flex-wrap gap-2"><Badge variant="outline"><UsersRound className="mr-1 size-3" /> Verified members</Badge><Badge variant="outline">No pupil directory</Badge><Badge variant="outline">No child portfolio access</Badge></CardContent>
      </Card>
    </div>
  );
}
