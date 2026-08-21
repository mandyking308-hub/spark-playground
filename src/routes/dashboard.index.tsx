import { Link, createFileRoute } from "@tanstack/react-router";
import { Languages } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { roles } from "@/config/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Dashboards — Aurelia" },
      { name: "description", content: "Choose a workspace: child, parent, teacher, school or education group." },
      { property: "og:title", content: "Dashboards — Aurelia" },
      { property: "og:description", content: "Choose a workspace: child, parent, teacher, school or education group." },
    ],
  }),
  component: DashboardIndex,
});

function DashboardIndex() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Choose a workspace"
        description="Each role has a deliberately separated workspace with permissions matched to what that role actually needs."
        crumbs={[{ label: "Home", to: "/" }, { label: "Dashboards" }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Link key={role.key} to={role.to} className="group">
            <Card className="h-full border-border/70 shadow-none transition-colors group-hover:border-primary/40">
              <CardHeader className="gap-2">
                <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <role.icon className="size-4" />
                </span>
                <CardTitle className="text-base font-medium">{role.label}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
        <Link to="/dashboard/accessibility" className="group">
          <Card className="h-full border-border/70 shadow-none transition-colors group-hover:border-primary/40">
            <CardHeader className="gap-2">
              <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground"><Languages className="size-4" /></span>
              <CardTitle className="text-base font-medium">Language & accessibility</CardTitle>
              <CardDescription>Presentation, reading, motion, captions and global language foundations.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
