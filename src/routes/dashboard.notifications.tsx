import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCircle2, ShieldAlert, Trophy } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/notifications")({
  component: NotificationsPage,
});

const previewNotifications = [
  {
    icon: CheckCircle2,
    title: "Podcast approved",
    body: "Your latest episode completed the publication review.",
    label: "Project update",
  },
  {
    icon: Trophy,
    title: "Challenge closes Friday",
    body: "Your Science for Tomorrow entry is still in draft.",
    label: "Useful reminder",
  },
  {
    icon: ShieldAlert,
    title: "Parent approval requested",
    body: "A new publishing request needs an adult decision.",
    label: "Approval",
  },
];

function NotificationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Purposeful, not addictive"
        title="Notifications"
        description="Activity, approvals, deadlines and safety updates without streaks, popularity alerts or engagement bait for children."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Notifications" }]}
      />

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-3">
          {previewNotifications.map((item) => (
            <Card key={item.title}>
              <CardContent className="flex gap-4 p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <item.icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium">{item.title}</h2>
                    <Badge variant="outline">{item.label}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="size-4" />
              Child notification standard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Allowed: safety, approvals, real project updates, deadlines, club updates and achievements.</p>
            <p>Blocked: streaks, popularity counts, “people miss you” messages and prompts designed only to increase time in the app.</p>
            <p>Quiet hours suppress ordinary notifications. Urgent safeguarding alerts follow a separate adult escalation route.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
