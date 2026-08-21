import { describe, expect, test } from "bun:test";

import {
  canOrganisationAct,
  organisationAccessRevokedImmediately,
  organisationCanBrowseChildDirectory,
  organisationCanDirectMessageChild,
  organisationReportingMode,
} from "./organisation-policy";

const organisation = {
  organisationId: "org-1",
  status: "verified" as const,
  programmeApproved: true,
  authorisedStaffUserIds: ["staff-1"],
};

describe("approved organisation boundaries", () => {
  test("verified authorised staff can create approved content and view aggregate reporting", () => {
    expect(canOrganisationAct({ organisation, actorUserId: "staff-1", action: "create_content" })).toBe(true);
    expect(canOrganisationAct({ organisation, actorUserId: "staff-1", action: "create_challenge" })).toBe(true);
    expect(canOrganisationAct({ organisation, actorUserId: "staff-1", action: "view_aggregate_report" })).toBe(true);
  });

  test("child browsing messaging and data export are blocked", () => {
    expect(canOrganisationAct({ organisation, actorUserId: "staff-1", action: "browse_children" })).toBe(false);
    expect(canOrganisationAct({ organisation, actorUserId: "staff-1", action: "direct_message_child" })).toBe(false);
    expect(canOrganisationAct({ organisation, actorUserId: "staff-1", action: "export_child_data" })).toBe(false);
    expect(organisationCanBrowseChildDirectory()).toBe(false);
    expect(organisationCanDirectMessageChild()).toBe(false);
  });

  test("unverified staff or unapproved programmes cannot act", () => {
    expect(canOrganisationAct({ organisation, actorUserId: "staff-9", action: "create_content" })).toBe(false);
    expect(canOrganisationAct({ organisation: { ...organisation, programmeApproved: false }, actorUserId: "staff-1", action: "create_content" })).toBe(false);
    expect(canOrganisationAct({ organisation: { ...organisation, status: "pending" }, actorUserId: "staff-1", action: "create_content" })).toBe(false);
  });

  test("suspension or revocation cuts access and reporting remains aggregate only", () => {
    expect(organisationAccessRevokedImmediately("suspended")).toBe(true);
    expect(organisationAccessRevokedImmediately("revoked")).toBe(true);
    expect(organisationReportingMode()).toBe("aggregate_only");
  });
});
