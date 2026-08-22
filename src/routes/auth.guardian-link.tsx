import { Link, createFileRoute } from "@tanstack/react-router";
import { KeyRound, ShieldCheck, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth/guardian-link")({
  head: () => ({
    meta: [
      { title: "Link a parent or guardian — Aurelia" },
      {
        name: "description",
        content:
          "A child account only becomes active once a verified guardian or school invitation establishes the relationship.",
      },
      { property: "og:title", content: "Link a parent or guardian — Aurelia" },
      {
        property: "og:description",
        content: "Establish the verified guardian relationship behind a child's Aurelia account.",
      },
      { property: "og:url", content: "/auth/guardian-link" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/auth/guardian-link" }],
  }),

  component: GuardianLinkPage,
});

function GuardianLinkPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-xl">
        <Link to="/auth/join" className="mb-6 inline-flex text-sm text-muted-foreground hover:text-foreground">
          ← Back to join options
        </Link>

        <Card>
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <CardTitle className="font-display text-2xl">Link a parent or guardian</CardTitle>
            <CardDescription>
              A child account does not become active until a verified guardian or school invitation establishes the relationship.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="invite-code">Guardian / school invitation code</Label>
              <Input id="invite-code" placeholder="Invitation code" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardian-email">Guardian email</Label>
              <Input id="guardian-email" type="email" placeholder="parent@example.com" disabled />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-muted/40 p-4">
                <ShieldCheck className="size-5" />
                <p className="mt-2 text-sm font-medium">Verified relationship</p>
                <p className="mt-1 text-xs text-muted-foreground">The link becomes authoritative only after verification.</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-4">
                <KeyRound className="size-5" />
                <p className="mt-2 text-sm font-medium">No self-granted access</p>
                <p className="mt-1 text-xs text-muted-foreground">Typing a role or relationship into a profile never changes permissions.</p>
              </div>
            </div>

            <Button className="w-full" disabled>Verify and link</Button>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Parent → own child only</Badge>
              <Badge variant="outline">Revocable</Badge>
              <Badge variant="outline">Audited</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Verification action activates when the dedicated authentication/database project is connected.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
