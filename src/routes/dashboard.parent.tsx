import { createFileRoute } from "@tanstack/react-router";

import { RoleDashboard } from "@/components/layout/role-dashboard";

export const Route = createFileRoute("/dashboard/parent")({
  head: () => ({
    meta: [
      { title: "Parent dashboard — Aurelia" },
      { name: "description", content: "Oversee your children's activity, consent and wellbeing in one place." },
      { property: "og:title", content: "Parent dashboard — Aurelia" },
      { property: "og:description", content: "Oversee your children's activity, consent and wellbeing in one place." },
    ],
  }),
  component: () => <RoleDashboard roleKey="parent" />,
});
