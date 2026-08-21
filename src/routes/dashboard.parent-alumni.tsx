import { createFileRoute } from "@tanstack/react-router";

import { RoleDashboard } from "@/components/layout/role-dashboard";

export const Route = createFileRoute("/dashboard/parent-alumni")({
  head: () => ({
    meta: [
      { title: "Parent Alumni dashboard — Aurelia" },
      {
        name: "description",
        content: "Stay connected to the verified adult parent community after your child leaves.",
      },
      { property: "og:title", content: "Parent Alumni dashboard — Aurelia" },
      {
        property: "og:description",
        content: "Adult-only alumni parent networking, events, volunteering and community.",
      },
    ],
  }),
  component: () => <RoleDashboard roleKey="parent_alumni" />,
});
