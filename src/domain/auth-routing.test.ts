import { describe, expect, test } from "bun:test";

import {
  authenticatedHomeForRole,
  canEnterAlumniExperience,
  canEnterDashboardPath,
} from "./auth-routing";
import type { PlatformRole } from "./access-control";

describe("authenticated route boundaries", () => {
  test("routes each verified lifecycle role to its own home", () => {
    expect(authenticatedHomeForRole("child")).toBe("/dashboard/child");
    expect(authenticatedHomeForRole("parent")).toBe("/dashboard/parent");
    expect(authenticatedHomeForRole("parent_alumni")).toBe("/dashboard/parent-alumni");
    expect(authenticatedHomeForRole("teacher")).toBe("/dashboard/teacher");
    expect(authenticatedHomeForRole("school_admin")).toBe("/dashboard/school");
    expect(authenticatedHomeForRole("group_admin")).toBe("/dashboard/group");
    expect(authenticatedHomeForRole("organisation_admin")).toBe("/dashboard/organisation-admin");
    expect(authenticatedHomeForRole("alumni")).toBe("/alumni");
  });

  test("never lets adult roles enter the child workspace by changing the URL", () => {
    for (const role of ["parent", "parent_alumni", "teacher", "school_admin", "group_admin", "organisation_admin", "platform_admin"] as const) {
      expect(canEnterDashboardPath(role, "/dashboard/child")).toBe(false);
      expect(canEnterDashboardPath(role, "/dashboard/creator")).toBe(false);
      expect(canEnterDashboardPath(role, "/dashboard/passport")).toBe(false);
    }
  });

  test("never lets a child enter adult, staff or enterprise workspaces", () => {
    for (const path of [
      "/dashboard/parent",
      "/dashboard/parent-alumni",
      "/dashboard/teacher",
      "/dashboard/school",
      "/dashboard/group",
      "/dashboard/organisation-admin",
      "/dashboard/safeguarding",
      "/dashboard/invitations",
    ]) {
      expect(canEnterDashboardPath("child", path)).toBe(false);
    }
  });

  test("keeps current-parent and parent-alumni lifecycles separate", () => {
    expect(canEnterDashboardPath("parent", "/dashboard/parent")).toBe(true);
    expect(canEnterDashboardPath("parent", "/dashboard/parent-alumni")).toBe(false);
    expect(canEnterDashboardPath("parent_alumni", "/dashboard/parent-alumni")).toBe(true);
    expect(canEnterDashboardPath("parent_alumni", "/dashboard/parent")).toBe(false);
    expect(canEnterDashboardPath("parent_alumni", "/dashboard/parent-directory")).toBe(true);
  });

  test("keeps the 16+ alumni environment behind alumni-capable roles", () => {
    expect(canEnterAlumniExperience("alumni")).toBe(true);
    expect(canEnterAlumniExperience("mentor")).toBe(true);
    expect(canEnterAlumniExperience("parent_alumni")).toBe(false);
    expect(canEnterAlumniExperience("child")).toBe(false);
    expect(canEnterDashboardPath("alumni", "/dashboard")).toBe(false);
  });

  test("allows only verified staff roles into safeguarding views", () => {
    expect(canEnterDashboardPath("teacher", "/dashboard/safeguarding")).toBe(true);
    expect(canEnterDashboardPath("school_admin", "/dashboard/safeguarding")).toBe(true);
    expect(canEnterDashboardPath("group_admin", "/dashboard/safeguarding")).toBe(true);
    expect(canEnterDashboardPath("parent", "/dashboard/safeguarding")).toBe(false);
  });

  test("limits invitation administration to verified issuers", () => {
    expect(canEnterDashboardPath("parent", "/dashboard/invitations")).toBe(true);
    expect(canEnterDashboardPath("school_admin", "/dashboard/invitations")).toBe(true);
    expect(canEnterDashboardPath("platform_admin", "/dashboard/invitations")).toBe(true);

    for (const role of ["child", "parent_alumni", "teacher", "group_admin", "organisation_admin", "alumni", "mentor"] as const) {
      expect(canEnterDashboardPath(role, "/dashboard/invitations")).toBe(false);
    }
  });
});

describe("adult child-experience preview", () => {
  const adultRoles: PlatformRole[] = [
    "parent",
    "parent_alumni",
    "teacher",
    "school_admin",
    "group_admin",
    "organisation_admin",
    "platform_admin",
  ];

  test("allows verified adult roles into the read-only preview", () => {
    for (const role of adultRoles) {
      expect(canEnterDashboardPath(role, "/dashboard/child-preview")).toBe(true);
    }
  });

  test("keeps child, alumni and mentor out of the adult preview", () => {
    for (const role of ["child", "alumni", "mentor"] as PlatformRole[]) {
      expect(canEnterDashboardPath(role, "/dashboard/child-preview")).toBe(false);
    }
  });

  test("does not broaden access to child-only routes", () => {
    for (const role of adultRoles) {
      expect(canEnterDashboardPath(role, "/dashboard/child")).toBe(false);
      expect(canEnterDashboardPath(role, "/dashboard/creator")).toBe(false);
    }
  });
});
