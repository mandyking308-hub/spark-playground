import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PlatformRole } from "@/domain/access-control";

const roleLabels: Record<PlatformRole, string> = {
  child: "Child",
  parent: "Parent",
  parent_alumni: "Parent Alumni",
  teacher: "Teacher",
  school_admin: "School Admin",
  group_admin: "Education Group Admin",
  organisation_admin: "Organisation Admin",
  alumni: "Alumni",
  mentor: "Mentor",
  platform_admin: "Platform Admin",
};

export function RoleSwitcher({ role }: { role: PlatformRole }) {
  return (
    <Button variant="outline" size="sm" className="gap-2" disabled aria-label={`Verified role: ${roleLabels[role]}`}>
      <ShieldCheck className="size-4" />
      <span className="hidden sm:inline">{roleLabels[role]}</span>
    </Button>
  );
}
