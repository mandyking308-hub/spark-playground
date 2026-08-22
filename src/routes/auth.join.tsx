import { Link, createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinWithInvitationFn } from "@/functions/auth";

export const Route = createFileRoute("/auth/join")({
  head: () => ({
    meta: [
      { title: "Join with an invitation — Aurelia" },
      {
        name: "description",
        content:
          "Aurelia is invitation-only. Use your verified family, school or organisation invitation to finish setting up your account.",
      },
      { property: "og:title", content: "Join with an invitation — Aurelia" },
      {
        property: "og:description",
        content: "Use your verified invitation to finish setting up your Aurelia account.",
      },
      { property: "og:url", content: "/auth/join" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/auth/join" }],
  }),
  component: JoinPage,
});

function JoinPage() {
  const joinWithInvitation = useServerFn(joinWithInvitationFn);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "confirmation"; text: string } | null>(null);

  return (
    <div className="brand-dawn min-h-screen px-4 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <Link to="/" className="mb-8 flex items-center justify-center" aria-label="Aurelia home">
          <AureliaLogo />
        </Link>


        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary">Invitation only</Badge>
          <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">Join your verified Aurelia workspace</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your invitation already contains the approved relationship and workspace scope. This form cannot choose or upgrade a role.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-6 lg:grid-cols-[1fr_0.7fr]">
          <Card>
            <CardHeader>
              <CardTitle>Create or finish your account</CardTitle>
              <CardDescription>
                If you already confirmed this email, use the same details and invitation to finish joining.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setMessage(null);
                  const form = new FormData(event.currentTarget);
                  const password = String(form.get("password") ?? "");
                  const confirmPassword = String(form.get("confirmPassword") ?? "");

                  if (password !== confirmPassword) {
                    setMessage({ kind: "error", text: "The passwords do not match." });
                    return;
                  }

                  setPending(true);
                  try {
                    const countryCode = String(form.get("countryCode") ?? "").trim();
                    const result = await joinWithInvitation({
                      data: {
                        invitationToken: String(form.get("invitationToken") ?? "").trim(),
                        displayName: String(form.get("displayName") ?? "").trim(),
                        email: String(form.get("email") ?? "").trim(),
                        password,
                        ...(countryCode ? { countryCode } : {}),
                      },
                    });

                    if (result.ok) {
                      window.location.assign(result.redirectTo);
                      return;
                    }

                    setMessage({
                      kind: result.confirmationRequired ? "confirmation" : "error",
                      text: result.error,
                    });
                  } catch {
                    setMessage({ kind: "error", text: "We couldn't complete that invitation right now. Please check the details and try again." });
                  } finally {
                    setPending(false);
                  }
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="invitationToken">Invitation code</Label>
                  <Input
                    id="invitationToken"
                    name="invitationToken"
                    type="password"
                    autoComplete="off"
                    minLength={40}
                    maxLength={80}
                    required
                    disabled={pending}
                    aria-describedby="invitation-help"
                  />
                  <p id="invitation-help" className="text-xs text-muted-foreground">
                    Keep this code private. Aurelia checks it before creating an account.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Name</Label>
                  <Input id="displayName" name="displayName" autoComplete="name" minLength={1} maxLength={120} required disabled={pending} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" autoComplete="email" inputMode="email" maxLength={254} required disabled={pending} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="countryCode">Country code <span className="font-normal text-muted-foreground">(optional)</span></Label>
                  <Input id="countryCode" name="countryCode" autoComplete="country" inputMode="text" minLength={2} maxLength={2} placeholder="GB" disabled={pending} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required disabled={pending} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={10} maxLength={128} required disabled={pending} />
                  </div>
                </div>

                {message ? (
                  <p
                    role={message.kind === "error" ? "alert" : "status"}
                    className={
                      message.kind === "error"
                        ? "rounded-md border border-destructive/30 bg-destructive/5 px-3 py-3 text-sm text-destructive"
                        : "rounded-md border border-border bg-muted/40 px-3 py-3 text-sm leading-relaxed text-foreground"
                    }
                  >
                    {message.text}
                  </p>
                ) : null}

                <Button type="submit" className="w-full" disabled={pending}>
                  {pending ? "Checking invitation…" : "Join Aurelia"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </div>
                <CardTitle className="text-lg">The invitation decides access</CardTitle>
                <CardDescription className="leading-relaxed">
                  Parent, child, teacher, school and group access is derived from the verified invitation and live database records—not a dropdown, URL or profile field.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Children stay protected</CardTitle>
                <CardDescription className="leading-relaxed">
                  Under-16 invitations require an approved family or school sponsorship path. Adult community membership never creates access to unrelated children.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email confirmation</CardTitle>
                <CardDescription className="leading-relaxed">
                  If confirmation is required, confirm the email first, then return here with the same invitation code, email and password. The invitation is not consumed until the verified account claims it.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already joined?{" "}
          <Link to="/auth/sign-in" className="font-medium text-foreground underline underline-offset-2">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
