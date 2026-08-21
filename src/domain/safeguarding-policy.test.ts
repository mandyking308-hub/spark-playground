import { describe, expect, test } from "bun:test";

import {
  aiMayCloseCaseWithoutHuman,
  canOpenSafeguardingCase,
  caseVisibleToGeneralSchoolStaff,
  groupReportingUsesAggregateOnly,
  requiresImmediateEscalation,
} from "./safeguarding-policy";

const safeguardingCase = {
  schoolId: "school-1",
  assignedReviewerUserIds: ["teacher-1"],
  severity: "high" as const,
  escalatedToGroup: false,
};

describe("safeguarding need-to-know access", () => {
  test("assigned teacher can open their case but unrelated teacher cannot", () => {
    expect(canOpenSafeguardingCase({ userId: "teacher-1", role: "teacher", schoolId: "school-1" }, safeguardingCase)).toBe(true);
    expect(canOpenSafeguardingCase({ userId: "teacher-9", role: "teacher", schoolId: "school-1" }, safeguardingCase)).toBe(false);
  });

  test("school safeguarding staff can open school cases but not another school", () => {
    expect(canOpenSafeguardingCase({ userId: "safe-1", role: "safeguarding_staff", schoolId: "school-1" }, safeguardingCase)).toBe(true);
    expect(canOpenSafeguardingCase({ userId: "safe-2", role: "safeguarding_staff", schoolId: "school-2" }, safeguardingCase)).toBe(false);
  });

  test("group safeguarding access requires explicit escalation and authorised school", () => {
    const groupStaff = { userId: "group-safe", role: "group_safeguarding_admin" as const, schoolId: "", authorisedSchoolIds: ["school-1"] };
    expect(canOpenSafeguardingCase(groupStaff, safeguardingCase)).toBe(false);
    expect(canOpenSafeguardingCase(groupStaff, { ...safeguardingCase, escalatedToGroup: true })).toBe(true);
  });

  test("critical cases require immediate escalation", () => {
    expect(requiresImmediateEscalation("critical")).toBe(true);
    expect(requiresImmediateEscalation("high")).toBe(false);
  });

  test("AI cannot close a case and general staff do not see the case queue", () => {
    expect(aiMayCloseCaseWithoutHuman()).toBe(false);
    expect(caseVisibleToGeneralSchoolStaff()).toBe(false);
    expect(groupReportingUsesAggregateOnly()).toBe(true);
  });
});
