import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
            A
          </span>
          <span className="font-display text-sm tracking-tight">Aurelia</span>
        </Link>

        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-2xl tracking-tight">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {isSignUp && (
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth/join">Choose your verified join path</Link>
              </Button>
            )}

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" autoComplete="name" placeholder="Alex Morgan" disabled />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" disabled />
              </div>
              <Button type="submit" className="w-full" disabled>
                {isSignUp ? "Create account" : "Sign in"}
              </Button>
            </form>

            <p className="rounded-md border border-dashed border-border px-3 py-2 text-xs leading-relaxed text-muted-foreground">
              Authentication is not connected yet. Role requests, guardian links and school/group memberships will be verified in the backend rather than trusted from editable profile fields. Explore the{" "}
              <Link to="/dashboard" className="underline underline-offset-2 hover:text-foreground">
                dashboards
              </Link>{" "}
              in the meantime.
            </p>

            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account? " : "New here? "}
              <Link
                to={isSignUp ? "/auth/sign-in" : "/auth/sign-up"}
                className="font-medium text-foreground underline underline-offset-2"
              >
                {isSignUp ? "Sign in" : "Create an account"}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
