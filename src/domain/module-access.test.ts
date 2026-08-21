import { describe, expect, test } from "bun:test";

import { canAccessCoreModule, coreModuleAudience } from "./module-access";

describe("core module audience boundaries", () => {
  test("children can access creation, passport, challenge and club modules", () => {
    expect(canAccessCoreModule("child", "creator_studio")).toBe(true);
    expect(canAccessCoreModule("child", "achievement_passport")).toBe(true);
    expect(canAccessCoreModule("child", "challenges")).toBe(true);
    expect(canAccessCoreModule("child", "clubs")).toBe(true);
  });

  test("children cannot access adult parent, AI, privacy, safeguarding, licensing or audit controls", () => {
    expect(canAccessCoreModule("child", "parent_community")).toBe(false);
    expect(canAccessCoreModule("child", "parent_alumni_network")).toBe(false);
    expect(canAccessCoreModule("child", "ai_controls")).toBe(false);
    expect(canAccessCoreModule("child", "privacy_controls")).toBe(false);
    expect(canAccessCoreModule("child", "safeguarding_centre")).toBe(false);
    expect(canAccessCoreModule("child", "licensing")).toBe(false);
    expect(canAccessCoreModule("child", "audit")).toBe(false);
  });

  test("current parents can access parent community, AI and privacy controls", () => {
    expect(canAccessCoreModule("parent", "parent_community")).toBe(true);
    expect(canAccessCoreModule("parent", "parent_alumni_network")).toBe(true);
    expect(canAccessCoreModule("parent", "ai_controls")).toBe(true);
    expect(canAccessCoreModule("parent", "privacy_controls")).toBe(true);
  });

  test("parent alumni cannot enter protected child, AI, privacy, safeguarding or enterprise admin modules", () => {
    expect(canAccessCoreModule("parent_alumni", "creator_studio")).toBe(false);
    expect(canAccessCoreModule("parent_alumni", "achievement_passport")).toBe(false);
    expect(canAccessCoreModule("parent_alumni", "clubs")).toBe(false);
    expect(canAccessCoreModule("parent_alumni", "ai_controls")).toBe(false);
    expect(canAccessCoreModule("parent_alumni", "privacy_controls")).toBe(false);
    expect(canAccessCoreModule("parent_alumni", "safeguarding_centre")).toBe(false);
    expect(canAccessCoreModule("parent_alumni", "licensing")).toBe(false);
    expect(canAccessCoreModule("parent_alumni", "audit")).toBe(false);
    expect(canAccessCoreModule("parent_alumni", "parent_alumni_network")).toBe(true);
  });

  test("school and group admins can manage AI and privacy controls, teachers cannot", () => {
    expect(canAccessCoreModule("school_admin", "ai_controls")).toBe(true);
    expect(canAccessCoreModule("group_admin", "ai_controls")).toBe(true);
    expect(canAccessCoreModule("teacher", "ai_controls")).toBe(false);
    expect(canAccessCoreModule("school_admin", "privacy_controls")).toBe(true);
    expect(canAccessCoreModule("group_admin", "privacy_controls")).toBe(true);
    expect(canAccessCoreModule("teacher", "privacy_controls")).toBe(false);
  });

  test("staff can access safeguarding according to their role", () => {
    expect(canAccessCoreModule("teacher", "safeguarding_centre")).toBe(true);
    expect(canAccessCoreModule("school_admin", "safeguarding_centre")).toBe(true);
    expect(canAccessCoreModule("group_admin", "safeguarding_centre")).toBe(true);
    expect(canAccessCoreModule("organisation_admin", "safeguarding_centre")).toBe(false);
  });

  test("licensing and audit are limited to enterprise administrators", () => {
    expect(canAccessCoreModule("school_admin", "licensing")).toBe(true);
    expect(canAccessCoreModule("group_admin", "licensing")).toBe(true);
    expect(canAccessCoreModule("school_admin", "audit")).toBe(true);
    expect(canAccessCoreModule("group_admin", "audit")).toBe(true);
    expect(canAccessCoreModule("teacher", "licensing")).toBe(false);
    expect(canAccessCoreModule("parent", "audit")).toBe(false);
    expect(canAccessCoreModule("organisation_admin", "audit")).toBe(false);
  });

  test("notifications are available across legitimate member roles", () => {
    expect(canAccessCoreModule("child", "notifications")).toBe(true);
    expect(canAccessCoreModule("parent", "notifications")).toBe(true);
    expect(canAccessCoreModule("parent_alumni", "notifications")).toBe(true);
    expect(canAccessCoreModule("teacher", "notifications")).toBe(true);
    expect(canAccessCoreModule("alumni", "notifications")).toBe(true);
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
    expect(coreModuleAudience("ai_controls")).toBe("verified_adult");
    expect(coreModuleAudience("privacy_controls")).toBe("verified_adult");
    expect(coreModuleAudience("safeguarding_centre")).toBe("staff");
    expect(coreModuleAudience("licensing")).toBe("staff");
    expect(coreModuleAudience("audit")).toBe("staff");
    expect(coreModuleAudience("notifications")).toBe("mixed_curated");
    expect(coreModuleAudience("organisation_spaces")).toBe("mixed_curated");
  });
});
