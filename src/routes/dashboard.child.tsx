import { createFileRoute } from "@tanstack/react-router";

import { RoleDashboard } from "@/components/layout/role-dashboard";

export const Route = createFileRoute("/dashboard/child")({
  head: () => ({
    meta: [
      { title: "Child dashboard — Aurelia" },
      { name: "description", content: "A safe space for under-16s to create, learn and collect achievements." },
      { property: "og:title", content: "Child dashboard — Aurelia" },
      { property: "og:description", content: "A safe space for under-16s to create, learn and collect achievements." },
    ],
  }),
  component: () => <RoleDashboard roleKey="child" />,
});
