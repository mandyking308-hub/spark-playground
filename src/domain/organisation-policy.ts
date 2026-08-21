export type OrganisationStatus = "pending" | "verified" | "suspended" | "revoked";
export type OrganisationStaffRole = "programme_admin" | "content_editor" | "judge";

export interface OrganisationContext {
  organisationId: string;
  status: OrganisationStatus;
  programmeApproved: boolean;
  authorisedStaffUserIds: string[];
}

export interface PartnerActionContext {
  organisation: OrganisationContext;
  actorUserId: string;
  action: "create_content" | "create_challenge" | "view_aggregate_report" | "browse_children" | "direct_message_child" | "export_child_data";
}

export function canOrganisationAct(context: PartnerActionContext): boolean {
  if (context.organisation.status !== "verified") return false;
  if (!context.organisation.authorisedStaffUserIds.includes(context.actorUserId)) return false;
  if (!context.organisation.programmeApproved) return false;

  return ["create_content", "create_challenge", "view_aggregate_report"].includes(context.action);
}

export function organisationCanBrowseChildDirectory(): false {
  return false;
}

export function organisationCanDirectMessageChild(): false {
  return false;
}

export function organisationReportingMode(): "aggregate_only" {
  return "aggregate_only";
}

export function organisationAccessRevokedImmediately(status: OrganisationStatus): boolean {
  return status === "suspended" || status === "revoked";
}
