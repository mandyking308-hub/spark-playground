import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/layout/page-header";
import { PlaceholderCard } from "@/components/layout/placeholder-card";
import { dashboardNav } from "@/config/navigation";

export const Route = createFileRoute("/alumni/")({
  head: () => ({
    meta: [
      { title: "Alumni (16+) — Aurelia" },
      { name: "description", content: "A separate environment for Aurelia members aged 16 and over." },
      { property: "og:title", content: "Alumni (16+) — Aurelia" },
      { property: "og:description", content: "A separate environment for Aurelia members aged 16 and over." },
    ],
  }),
  component: AlumniIndex,
});

function AlumniIndex() {
  const { sections, description } = dashboardNav.alumni;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Separate environment"
        title="Alumni dashboard"
        description={description}
        crumbs={[{ label: "Home", to: "/" }, { label: "Alumni" }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <PlaceholderCard
            key={section.title}
            title={section.title}
            description={section.description}
            icon={section.icon}
          />
        ))}
      </div>
    </div>
  );
}
