import type { PlatformRole } from "./access-control";

export type CoreModule =
  | "creator_studio"
  | "achievement_passport"
  | "challenges"
  | "clubs"
  | "parent_community"
  | "parent_alumni_network"
  | "ai_controls"
  | "safeguarding_centre"
  | "organisation_spaces";

const rolesByModule: Record<CoreModule, ReadonlySet<PlatformRole>> = {
  creator_studio: new Set(["child"]),
  achievement_passport: new Set(["child"]),
  challenges: new Set(["child", "teacher", "school_admin", "group_admin", "organisation_admin"]),
  clubs: new Set(["child", "teacher", "school_admin", "group_admin"]),
  parent_community: new Set(["parent"]),
  parent_alumni_network: new Set(["parent", "parent_alumni"]),
  ai_controls: new Set(["parent", "school_admin", "group_admin"]),
  safeguarding_centre: new Set(["teacher", "school_admin", "group_admin"]),
  organisation_spaces: new Set([
    "child",
    "parent",
    "teacher",
    "school_admin",
    "group_admin",
    "organisation_admin",
  ]),
};

export function canAccessCoreModule(role: PlatformRole, module: CoreModule): boolean {
  if (role === "platform_admin") return true;
  return rolesByModule[module].has(role);
}

export function coreModuleAudience(
  module: CoreModule,
): "protected_child" | "verified_adult" | "staff" | "mixed_curated" {
  if (["creator_studio", "achievement_passport", "challenges", "clubs"].includes(module)) {
    return "protected_child";
  }
  if (["parent_community", "parent_alumni_network", "ai_controls"].includes(module)) {
    return "verified_adult";
  }
  if (module === "safeguarding_centre") return "staff";
  return "mixed_curated";
}
