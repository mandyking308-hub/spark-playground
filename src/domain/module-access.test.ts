import { describe, expect, test } from "bun:test";

import { canAccessCoreModule, coreModuleAudience } from "./module-access";

describe("core module audience boundaries", () => {
  test("children can access creation and passport modules", () => {
    expect(canAccessCoreModule("child", "creator_studio")).toBe(true);
    expect(canAccessCoreModule("child", "achievement_passport")).toBe(true);
  });

  test("children cannot access adult parent communities", () => {
    expect(canAccessCoreModule("child", "parent_community")).toBe(false);
    expect(canAccessCoreModule("child", "parent_alumni_network")).toBe(false);
  });

  test("current parents can access current and alumni parent community where eligible", () => {
    expect(canAccessCoreModule("parent", "parent_community")).toBe(true);
    expect(canAccessCoreModule("parent", "parent_alumni_network")).toBe(true);
  });

  test("parent alumni cannot enter the protected child creator or passport modules", () => {
    expect(canAccessCoreModule("parent_alumni", "creator_studio")).toBe(false);
    expect(canAccessCoreModule("parent_alumni", "achievement_passport")).toBe(false);
    expect(canAccessCoreModule("parent_alumni", "parent_alumni_network")).toBe(true);
  });

  test("modules expose their security audience explicitly", () => {
    expect(coreModuleAudience("creator_studio")).toBe("protected_child");
    expect(coreModuleAudience("achievement_passport")).toBe("protected_child");
    expect(coreModuleAudience("parent_community")).toBe("verified_adult");
    expect(coreModuleAudience("parent_alumni_network")).toBe("verified_adult");
  });
});
