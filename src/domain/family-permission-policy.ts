export type PermissionDecision = "pending" | "approved" | "denied" | "not_required";

export type PermissionAction =
  | "publish_external"
  | "join_club"
  | "enter_challenge"
  | "share_portfolio"
  | "alumni_transfer";

export interface GuardianLinkContext {
  parentProfileId: string;
  childProfileId: string;
  status: "pending" | "verified" | "revoked";
}

export interface PermissionRequirements {
  guardianRequired: boolean;
  schoolRequired: boolean;
  safetyReviewRequired: boolean;
}

export interface FamilyPermissionContext {
  childProfileId: string;
  requestedByProfileId: string;
  action: PermissionAction;
  childWithdrew: boolean;
  guardianDecision: PermissionDecision;
  schoolDecision: PermissionDecision;
  safetyDecision: PermissionDecision;
  requirements: PermissionRequirements;
}

export function isChildInitiated(context: FamilyPermissionContext): boolean {
  return context.requestedByProfileId === context.childProfileId;
}

export function canGuardianDecideForChild(
  guardianProfileId: string,
  childProfileId: string,
  link: GuardianLinkContext,
): boolean {
  return (
    link.status === "verified" &&
    link.parentProfileId === guardianProfileId &&
    link.childProfileId === childProfileId
  );
}

function requirementSatisfied(required: boolean, decision: PermissionDecision): boolean {
  if (!required) return decision === "not_required" || decision === "approved";
  return decision === "approved";
}

export function canFinalizePermission(context: FamilyPermissionContext): boolean {
  if (!isChildInitiated(context) || context.childWithdrew) return false;
  if ([context.guardianDecision, context.schoolDecision, context.safetyDecision].includes("denied")) return false;

  return (
    requirementSatisfied(context.requirements.guardianRequired, context.guardianDecision) &&
    requirementSatisfied(context.requirements.schoolRequired, context.schoolDecision) &&
    requirementSatisfied(context.requirements.safetyReviewRequired, context.safetyDecision)
  );
}

export function parentCanInitiateChildPublication(): false {
  return false;
}

export function parentCanReadPrivateChildDraftByDefault(): false {
  return false;
}

export function childCanWithdrawPendingRequest(context: FamilyPermissionContext): boolean {
  return isChildInitiated(context) && !context.childWithdrew && !canFinalizePermission(context);
}
