import type { PlatformRole } from "./access-control";

export type CoreModule =
  | "creator_studio"
  | "achievement_passport"
  | "parent_community"
  | "parent_alumni_network";

const rolesByModule: Record<CoreModule, ReadonlySet<PlatformRole>> = {
  creator_studio: new Set(["child"]),
  achievement_passport: new Set(["child"]),
  parent_community: new Set(["parent"]),
  parent_alumni_network: new Set(["parent", "parent_alumni"]),
};

export function canAccessCoreModule(role: PlatformRole, module: CoreModule): boolean {
  if (role === "platform_admin") return true;
  return rolesByModule[module].has(role);
}

export function coreModuleAudience(module: CoreModule): "protected_child" | "verified_adult" {
  return module === "creator_studio" || module === "achievement_passport"
    ? "protected_child"
    : "verified_adult";
}
