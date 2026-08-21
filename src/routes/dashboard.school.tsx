import { createFileRoute } from "@tanstack/react-router";

import { RoleDashboard } from "@/components/layout/role-dashboard";

export const Route = createFileRoute("/dashboard/school")({
  head: () => ({
    meta: [
      { title: "School admin — Aurelia" },
      { name: "description", content: "Manage staff, learners and school-level safeguarding settings." },
      { property: "og:title", content: "School admin — Aurelia" },
      { property: "og:description", content: "Manage staff, learners and school-level safeguarding settings." },
    ],
  }),
  component: () => <RoleDashboard roleKey="school" />,
});
