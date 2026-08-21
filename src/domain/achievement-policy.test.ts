import { describe, expect, test } from "bun:test";

import {
  buildPassportRecord,
  canVerifyAchievement,
  passportHasPopularityScore,
  teacherCanRankChildrenPublicly,
} from "./achievement-policy";

const context = {
  teacherUserId: "teacher-1",
  childUserId: "child-1",
  teacherAssignedChildIds: ["child-1", "child-2"],
  schoolId: "school-1",
  childSchoolId: "school-1",
  evidenceId: "project-1",
  issuerVerified: true,
};

describe("teacher achievement verification", () => {
  test("assigned verified teacher can verify evidence for their child", () => {
    expect(canVerifyAchievement(context)).toBe(true);
  });

  test("teacher cannot verify outside assigned cohort or school", () => {
    expect(canVerifyAchievement({ ...context, childUserId: "child-9" })).toBe(false);
    expect(canVerifyAchievement({ ...context, childSchoolId: "school-2" })).toBe(false);
  });

  test("verification requires evidence and verified issuer", () => {
    expect(canVerifyAchievement({ ...context, evidenceId: null })).toBe(false);
    expect(canVerifyAchievement({ ...context, issuerVerified: false })).toBe(false);
  });

  test("created passport record is evidence-backed and private by default", () => {
    const record = buildPassportRecord(context, "leadership", "Led a team project", "2026-08-21T09:00:00Z");
    expect(record?.evidenceId).toBe("project-1");
    expect(record?.issuerUserId).toBe("teacher-1");
    expect(record?.publicByDefault).toBe(false);
  });

  test("passport never becomes a popularity or public ranking system", () => {
    expect(passportHasPopularityScore()).toBe(false);
    expect(teacherCanRankChildrenPublicly()).toBe(false);
  });
});
