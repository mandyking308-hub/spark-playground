import { PageHeader } from "@/components/layout/page-header";
import { PlaceholderCard } from "@/components/layout/placeholder-card";
import { roleByKey, type RoleKey } from "@/config/navigation";

export function RoleDashboard({ roleKey }: { roleKey: RoleKey }) {
  const role = roleByKey[roleKey];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace"
        title={`${role.label} dashboard`}
        description={role.description}
        crumbs={[{ label: "Home", to: "/" }, { label: "Dashboards", to: "/dashboard" }, { label: role.label }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {role.sections.map((section) => (
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
