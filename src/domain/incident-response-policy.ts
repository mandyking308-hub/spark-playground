export type IncidentType =
  | "account_security"
  | "privacy_data"
  | "safeguarding_data"
  | "partner_access"
  | "service_integrity"
  | "provider_outage";

export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "open" | "contained" | "investigating" | "remediating" | "monitoring" | "closed";

export type ClosureInput = {
  severity: IncidentSeverity;
  contained: boolean;
  rootCauseDocumented: boolean;
  correctiveActionsDocumented: boolean;
  monitoringComplete: boolean;
  secondReviewerApproved: boolean;
};

export function canCloseIncident(input: ClosureInput): boolean {
  if (!input.contained || !input.monitoringComplete) return false;
  if (input.severity === "high" || input.severity === "critical") {
    return input.rootCauseDocumented && input.correctiveActionsDocumented && input.secondReviewerApproved;
  }
  return true;
}

export type ContainmentAction =
  | "revoke_sessions"
  | "suspend_partner_access"
  | "quarantine_publication"
  | "disable_integration"
  | "rotate_provider_credentials"
  | "preserve_evidence";

export function containmentActionsFor(type: IncidentType): readonly ContainmentAction[] {
  const common: ContainmentAction[] = ["preserve_evidence"];
  if (type === "account_security") return [...common, "revoke_sessions", "rotate_provider_credentials"];
  if (type === "partner_access") return [...common, "suspend_partner_access"];
  if (type === "privacy_data" || type === "safeguarding_data") return [...common, "revoke_sessions", "quarantine_publication"];
  if (type === "service_integrity") return [...common, "quarantine_publication", "disable_integration"];
  return common;
}

export function incidentLogMayContainRawSecret(): false {
  return false;
}

export function incidentLogShouldEmbedRawChildContent(): false {
  return false;
}

export function legalNotificationDeadlineMustComeFromVersionedJurisdictionPolicy(): true {
  return true;
}

export function childExternalIncidentNoticeMayContainSensitiveDetail(): false {
  return false;
}
