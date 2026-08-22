import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AureliaLogo } from "@/components/brand/aurelia-logo";
import { signInFn } from "@/functions/auth";


export function AuthForm({
  mode,
  title,
  description,
}: {
  mode: "sign-in" | "sign-up";
  title: string;
  description: string;
}) {
  const isSignUp = mode === "sign-up";
  const signIn = useServerFn(signInFn);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="brand-dawn flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center" aria-label="Aurelia home">
          <AureliaLogo />
        </Link>

        <Card className="brand-card border-border/70">

          <CardHeader>
            <CardTitle className="font-display text-2xl tracking-tight">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Verified identity</Badge>
              <Badge variant="outline">Role resolved server-side</Badge>
            </div>

            {isSignUp ? (
              <div className="space-y-4">
                <p className="rounded-md border border-border bg-muted/30 px-3 py-3 text-sm leading-relaxed text-muted-foreground">
                  Aurelia does not use open self-registration. Child, parent, staff and organisation accounts enter through verified invitation and safeguarding workflows.
                </p>
                <Button asChild className="w-full">
                  <Link to="/auth/join">Use a verified invitation</Link>
                </Button>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setError(null);
                  setPending(true);

                  const form = new FormData(event.currentTarget);
                  const email = String(form.get("email") ?? "");
                  const password = String(form.get("password") ?? "");

                  try {
                    const result = await signIn({ data: { email, password } });
                    if (!result.ok) {
                      setError(result.error);
                      return;
                    }
                    window.location.assign(result.redirectTo);
                  } catch {
                    setError("We couldn't sign you in right now. Please try again.");
                  } finally {
                    setPending(false);
                  }
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    maxLength={254}
                    disabled={pending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    minLength={8}
                    maxLength={128}
                    disabled={pending}
                  />
                </div>

                {error ? (
                  <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                ) : null}

                <Button type="submit" className="w-full" disabled={pending}>
                  {pending ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            )}

            <p className="rounded-md border border-dashed border-border px-3 py-2 text-xs leading-relaxed text-muted-foreground">
              Your authenticated role comes from Aurelia's verified profile and active memberships. Changing a URL or browser field cannot grant another workspace.
            </p>

            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? "Already provisioned? " : "Joining for the first time? "}
              <Link
                to={isSignUp ? "/auth/sign-in" : "/auth/join"}
                className="font-medium text-foreground underline underline-offset-2"
              >
                {isSignUp ? "Sign in" : "Use your invitation"}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
