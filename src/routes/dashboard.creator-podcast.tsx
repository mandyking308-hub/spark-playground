import { createFileRoute } from "@tanstack/react-router";
import { FileAudio, Mic2, ShieldCheck, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/creator-podcast")({
  component: PodcastAuthoringPage,
});

function PodcastAuthoringPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Creator Studio"
        title="Create a podcast episode"
        description="Build the show first; publishing remains private until the safety, consent and moderation steps are complete."
        crumbs={[
          { label: "Dashboards", to: "/dashboard" },
          { label: "Creator Studio", to: "/dashboard/creator" },
          { label: "Podcast" },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Draft</Badge>
        <Badge variant="outline">Private</Badge>
        <Badge variant="outline">Transcript required before publication</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mic2 className="size-4" /> Episode details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="podcast-title" className="text-sm font-medium">Episode title</label>
              <Input id="podcast-title" placeholder="Why elephants remember" />
            </div>
            <div className="space-y-2">
              <label htmlFor="podcast-description" className="text-sm font-medium">What is this episode about?</label>
              <Textarea id="podcast-description" className="min-h-28" placeholder="Write a short description in your own words…" />
            </div>
            <div className="rounded-lg border border-dashed p-6 text-center">
              <FileAudio className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 font-medium">Audio recording or upload</p>
              <p className="mt-1 text-sm text-muted-foreground">The live storage/upload action will connect to the dedicated backend bucket.</p>
              <Button className="mt-4" variant="outline" disabled>Choose audio</Button>
            </div>
            <div className="space-y-2">
              <label htmlFor="transcript" className="text-sm font-medium">Transcript</label>
              <Textarea id="transcript" className="min-h-40" placeholder="Transcript will appear here, with child-safe AI allowed to help transcribe and caption…" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4" /> AI help allowed here
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>✓ brainstorm interview questions</p>
              <p>✓ clean up audio</p>
              <p>✓ transcribe and caption</p>
              <p>✓ suggest a title from the child’s content</p>
              <p>✕ invent the entire episode as the child</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4" /> Before anyone else sees it
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {["Personal-information scan", "Age / jurisdiction check", "Parent approval if required", "Moderation", "Publish to an approved audience"].map((item, index) => (
                <div key={item} className="flex gap-3 rounded-lg bg-muted/40 p-3">
                  <span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button className="w-full" disabled>Save draft to backend</Button>
          <p className="text-center text-xs text-muted-foreground">Form is ready; persistence activates with the dedicated Supabase connection.</p>
        </div>
      </div>
    </div>
  );
}
