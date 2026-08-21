import { describe, expect, it } from "bun:test";

import {
  canCloseIncident,
  childExternalIncidentNoticeMayContainSensitiveDetail,
  containmentActionsFor,
  incidentLogMayContainRawSecret,
  incidentLogShouldEmbedRawChildContent,
  legalNotificationDeadlineMustComeFromVersionedJurisdictionPolicy,
} from "./incident-response-policy";

describe("incident response policy", () => {
  it("requires containment and completed monitoring before closure", () => {
    expect(canCloseIncident({ severity: "medium", contained: false, rootCauseDocumented: false, correctiveActionsDocumented: false, monitoringComplete: true, secondReviewerApproved: false })).toBe(false);
    expect(canCloseIncident({ severity: "medium", contained: true, rootCauseDocumented: false, correctiveActionsDocumented: false, monitoringComplete: true, secondReviewerApproved: false })).toBe(true);
  });

  it("requires root cause, corrective actions and a second reviewer for high/critical closure", () => {
    expect(canCloseIncident({ severity: "critical", contained: true, rootCauseDocumented: true, correctiveActionsDocumented: true, monitoringComplete: true, secondReviewerApproved: false })).toBe(false);
    expect(canCloseIncident({ severity: "critical", contained: true, rootCauseDocumented: true, correctiveActionsDocumented: true, monitoringComplete: true, secondReviewerApproved: true })).toBe(true);
  });

  it("maps incident types to immediate containment actions", () => {
    expect(containmentActionsFor("account_security")).toContain("revoke_sessions");
    expect(containmentActionsFor("partner_access")).toContain("suspend_partner_access");
    expect(containmentActionsFor("privacy_data")).toContain("quarantine_publication");
    expect(containmentActionsFor("service_integrity")).toContain("disable_integration");
  });

  it("keeps raw secrets and unnecessary child content out of incident logs", () => {
    expect(incidentLogMayContainRawSecret()).toBe(false);
    expect(incidentLogShouldEmbedRawChildContent()).toBe(false);
  });

  it("does not invent one global breach-notification deadline", () => {
    expect(legalNotificationDeadlineMustComeFromVersionedJurisdictionPolicy()).toBe(true);
  });

  it("keeps sensitive incident detail off child-facing external surfaces", () => {
    expect(childExternalIncidentNoticeMayContainSensitiveDetail()).toBe(false);
  });
});
