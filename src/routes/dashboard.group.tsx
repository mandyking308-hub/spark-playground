import { createFileRoute } from "@tanstack/react-router";

import { RoleDashboard } from "@/components/layout/role-dashboard";

export const Route = createFileRoute("/dashboard/group")({
  head: () => ({
    meta: [
      { title: "Education group admin — Aurelia" },
      { name: "description", content: "Oversee multiple schools across a trust or education group." },
      { property: "og:title", content: "Education group admin — Aurelia" },
      { property: "og:description", content: "Oversee multiple schools across a trust or education group." },
    ],
  }),
  component: () => <RoleDashboard roleKey="group" />,
});
