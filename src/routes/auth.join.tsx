import { Link, createFileRoute } from "@tanstack/react-router";
import { Building2, GraduationCap, ShieldCheck, UserRoundCheck, Users, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/auth/join")({
  component: JoinPage,
});

const paths = [
  {
    title: "Parent / family",
    description: "Create the adult family account, then link a child through a verified guardian flow.",
    icon: Users,
    badge: "Adult",
  },
  {
    title: "Child through parent",
    description: "Under-16 accounts are sponsored and verified through the linked parent/guardian.",
    icon: ShieldCheck,
    badge: "Protected",
  },
  {
    title: "School staff",
    description: "Teacher and school-admin access requires a verified school invitation or administrator approval.",
    icon: GraduationCap,
    badge: "Verified role",
  },
  {
    title: "Education group",
    description: "Group administrators require enterprise verification and explicit group membership.",
    icon: Building2,
    badge: "Enterprise",
  },
  {
    title: "Parent Alumni",
    description: "Former parents can retain the adult community only after historic relationship verification and opt-in.",
    icon: UserRoundCheck,
    badge: "Adult alumni",
  },
  {
    title: "Alumni 16+",
    description: "A separate adult/older-teen environment with selective portfolio transition from childhood.",
    icon: UsersRound,
    badge: "16+",
  },
];

function JoinPage() {
  return (
    <div className="min-h-screen bg-muted/30 px-4 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">A</span>
          <span className="font-display text-base tracking-tight">Aurelia</span>
        </Link>

        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary">Verified identity paths</Badge>
          <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">How are you joining?</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Choosing a path requests the right account journey. It never grants itself privileged access; verification happens through the family, school, education group or organisation relationship.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => (
            <Card key={path.title} className="flex h-full flex-col">
              <CardHeader>
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <path.icon className="size-5" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <Badge variant="outline">{path.badge}</Badge>
                </div>
                <CardDescription className="leading-relaxed">{path.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button className="w-full" variant="outline" disabled>
                  Continue
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-xl rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          Identity persistence is intentionally disabled until the dedicated authentication backend exists. The flow and permission rules are ready.
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already verified?{" "}
          <Link to="/auth/sign-in" className="font-medium text-foreground underline underline-offset-2">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
