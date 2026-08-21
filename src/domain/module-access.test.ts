import { describe, expect, test } from "bun:test";

import { canAccessCoreModule, coreModuleAudience } from "./module-access";

describe("core module audience boundaries", () => {
  test("children can access creation, passport, challenge and club modules", () => {
    expect(canAccessCoreModule("child", "creator_studio")).toBe(true);
    expect(canAccessCoreModule("child", "achievement_passport")).toBe(true);
    expect(canAccessCoreModule("child", "challenges")).toBe(true);
    expect(canAccessCoreModule("child", "clubs")).toBe(true);
  });

  test("children cannot access adult parent communities or safeguarding centre", () => {
    expect(canAccessCoreModule("child", "parent_community")).toBe(false);
    expect(canAccessCoreModule("child", "parent_alumni_network")).toBe(false);
    expect(canAccessCoreModule("child", "safeguarding_centre")).toBe(false);
  });

  test("current parents can access current and alumni parent community where eligible", () => {
    expect(canAccessCoreModule("parent", "parent_community")).toBe(true);
    expect(canAccessCoreModule("parent", "parent_alumni_network")).toBe(true);
  });

  test("parent alumni cannot enter protected child or safeguarding modules", () => {
    expect(canAccessCoreModule("parent_alumni", "creator_studio")).toBe(false);
    expect(canAccessCoreModule("parent_alumni", "achievement_passport")).toBe(false);
    expect(canAccessCoreModule("parent_alumni", "clubs")).toBe(false);
    expect(canAccessCoreModule("parent_alumni", "safeguarding_centre")).toBe(false);
    expect(canAccessCoreModule("parent_alumni", "parent_alumni_network")).toBe(true);
  });

  test("staff can access safeguarding according to their role", () => {
    expect(canAccessCoreModule("teacher", "safeguarding_centre")).toBe(true);
    expect(canAccessCoreModule("school_admin", "safeguarding_centre")).toBe(true);
    expect(canAccessCoreModule("group_admin", "safeguarding_centre")).toBe(true);
    expect(canAccessCoreModule("organisation_admin", "safeguarding_centre")).toBe(false);
  });

  test("approved organisation space is curated for users but not parent alumni by default", () => {
    expect(canAccessCoreModule("child", "organisation_spaces")).toBe(true);
    expect(canAccessCoreModule("organisation_admin", "organisation_spaces")).toBe(true);
    expect(canAccessCoreModule("parent_alumni", "organisation_spaces")).toBe(false);
  });

  test("modules expose their security audience explicitly", () => {
    expect(coreModuleAudience("creator_studio")).toBe("protected_child");
    expect(coreModuleAudience("challenges")).toBe("protected_child");
    expect(coreModuleAudience("parent_community")).toBe("verified_adult");
    expect(coreModuleAudience("parent_alumni_network")).toBe("verified_adult");
    expect(coreModuleAudience("safeguarding_centre")).toBe("staff");
    expect(coreModuleAudience("organisation_spaces")).toBe("mixed_curated");
  });
});
