import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCircle2, LockKeyhole, Moon, ShieldAlert, Trophy } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/notifications")({
  component: NotificationsPage,
});

const previewNotifications = [
  {
    icon: CheckCircle2,
    title: "Project review complete",
    body: "Open Aurelia securely to see the project update.",
    label: "Project update",
  },
  {
    icon: Trophy,
    title: "Deadline reminder",
    body: "Aurelia has a deadline reminder. Open the app securely for details.",
    label: "Useful reminder",
  },
  {
    icon: ShieldAlert,
    title: "Approval needs attention",
    body: "An approval is waiting. Sign in securely to review it.",
    label: "Approval",
  },
];

function NotificationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Purposeful and private"
        title="Notifications"
        description="Activity, approvals, deadlines and safety updates without streaks, popularity alerts, engagement bait or sensitive child details appearing on external notification surfaces."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Notifications" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Generic lock-screen copy</Badge>
        <Badge variant="outline">No child email/SMS</Badge>
        <Badge variant="outline">No child open/click tracking</Badge>
        <Badge variant="outline">Quiet hours by default</Badge>
      </div>

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

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Bell className="size-4" /> Child notification standard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Allowed: safety, approvals, real project updates, deadlines, club updates and achievements.</p>
              <p>Blocked: streaks, popularity counts, “people miss you” messages and prompts designed only to increase time in the app.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><LockKeyhole className="size-4" /> External privacy</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Push, email and SMS templates never contain private project titles, child details, safeguarding narratives, moderation reasons or exact location.</p>
              <p>External links contain no sensitive object identifiers; secure detail is resolved only after authentication inside Aurelia.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Moon className="size-4" /> Quiet hours</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">Ordinary delivery waits. Children never receive quiet-hour bypasses. Only verified adult safeguarding/security escalation may bypass quiet hours.</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
