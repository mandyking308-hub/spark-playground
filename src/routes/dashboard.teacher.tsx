import { createFileRoute } from "@tanstack/react-router";

import { RoleDashboard } from "@/components/layout/role-dashboard";

export const Route = createFileRoute("/dashboard/teacher")({
  head: () => ({
    meta: [
      { title: "Teacher dashboard — Aurelia" },
      { name: "description", content: "Set work, review creations and follow class progress." },
      { property: "og:title", content: "Teacher dashboard — Aurelia" },
      { property: "og:description", content: "Set work, review creations and follow class progress." },
    ],
  }),
  component: () => <RoleDashboard roleKey="teacher" />,
});
