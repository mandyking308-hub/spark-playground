import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";

import { PublicPage } from "@/components/public/public-page";
import { PageHero, Section } from "@/components/public/sections";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/billing/return")({
  head: () => ({
    meta: [
      { title: "Payment confirmation — Aurelia" },
      {
        name: "description",
        content: "Return to Aurelia after secure family checkout.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BillingReturn,
});

function BillingReturn() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="Secure billing"
        title="You're back in Aurelia"
        description="If you completed checkout, Aurelia will activate the subscription only after the payment provider confirms it through a verified server-to-server event. We never trust a browser redirect as proof of payment."
        actions={
          <>
            <Button asChild size="lg"><Link to="/auth/sign-in">Sign in to check billing</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/pricing">Back to pricing</Link></Button>
          </>
        }
      >
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <CheckCircle2 className="size-5 text-primary" />
            <p className="mt-3 font-medium">Checkout completed</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">The hosted payment flow returns you here when finished.</p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <ShieldCheck className="size-5 text-primary" />
            <p className="mt-3 font-medium">Server verification</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">A signed webhook is the source of truth for payment and subscription state.</p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <Clock3 className="size-5 text-primary" />
            <p className="mt-3 font-medium">Then access updates</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Your billing dashboard reflects the verified subscription record once processed.</p>
          </div>
        </div>
      </PageHero>
      <Section>
        <div className="mx-auto max-w-2xl rounded-2xl border border-dashed p-6 text-center">
          <p className="font-medium">No card details are stored in Aurelia.</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Billing status and product entitlements are kept separate from guardian permissions, school permissions and child-safety decisions.</p>
        </div>
      </Section>
    </PublicPage>
  );
}
