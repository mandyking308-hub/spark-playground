import { describe, expect, test } from "bun:test";

import {
  canAccessSchoolRecord,
  canAssignStaffRole,
  canCreateSchool,
  crossSchoolChildDirectoryEnabled,
  groupAnalyticsCanExposeChildRows,
  schoolRosterRequiresSchoolScope,
} from "./tenant-ops-policy";

const schoolOne = { tenantId: "group-1", schoolId: "school-1" };
const groupScope = { tenantId: "group-1", authorisedSchoolIds: ["school-1", "school-2"] };

describe("school and group tenant boundaries", () => {
  test("school admin stays inside their school", () => {
    expect(canAccessSchoolRecord("school_admin", "school-1", schoolOne, null)).toBe(true);
    expect(canAccessSchoolRecord("school_admin", "school-2", schoolOne, null)).toBe(false);
  });

  test("teacher cannot cross school boundary", () => {
    expect(canAccessSchoolRecord("teacher", "school-1", schoolOne, null)).toBe(true);
    expect(canAccessSchoolRecord("teacher", "school-2", schoolOne, null)).toBe(false);
  });

  test("group admin only sees specifically authorised schools", () => {
    expect(canAccessSchoolRecord("group_admin", "school-2", null, groupScope)).toBe(true);
    expect(canAccessSchoolRecord("group_admin", "school-9", null, groupScope)).toBe(false);
  });

  test("only group admins create schools", () => {
    expect(canCreateSchool("group_admin")).toBe(true);
    expect(canCreateSchool("school_admin")).toBe(false);
    expect(canCreateSchool("teacher")).toBe(false);
  });

  test("staff assignment respects actor scope", () => {
    expect(canAssignStaffRole("school_admin", "school-1", null, schoolOne)).toBe(true);
    expect(canAssignStaffRole("school_admin", "school-2", null, schoolOne)).toBe(false);
    expect(canAssignStaffRole("group_admin", "school-2", groupScope, null)).toBe(true);
  });

  test("group analytics never becomes a child-row browser", () => {
    expect(groupAnalyticsCanExposeChildRows()).toBe(false);
    expect(crossSchoolChildDirectoryEnabled()).toBe(false);
    expect(schoolRosterRequiresSchoolScope()).toBe(true);
  });
});
