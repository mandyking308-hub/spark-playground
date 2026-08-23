import { Link, createFileRoute } from "@tanstack/react-router";

import { AureliaLogo } from "@/components/brand/aurelia-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/billing/return")({
  head: () => ({
    meta: [
      { title: "Payment verification — Aurelia World" },
      {
        name: "description",
        content:
          "Aurelia World payment return page. Access is confirmed only after verified billing events are processed securely.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BillingReturn,
});

function BillingReturn() {
  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center">
        <AureliaLogo tagline="Create · Learn · Achieve" />

        <Card className="mt-10 w-full">
          <CardContent className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Payment verification
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              We’re checking your payment securely
            </h1>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Returning to Aurelia World does not itself confirm a payment or activate access. We
              wait for a verified billing event from our payment provider before changing your
              subscription or entitlements.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              If you have just completed checkout, sign in to your verified Aurelia World account
              to continue. If access has not updated yet, please allow a short time for payment
              verification to complete.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link to="/auth/sign-in">Sign in</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/pricing">View plans</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/contact">Get help</Link>
              </Button>
            </div>

            <p className="mt-7 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
              Aurelia World is operated by Global Solutions Management LLC. Payment status is
              determined by verified server-side billing records, never by browser return links or
              query parameters.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
