export type ClubScope = "school" | "group" | "cross_school" | "approved_programme";
export type ClubRole = "child_member" | "staff_moderator" | "programme_facilitator";

export interface ClubAccessContext {
  age: number;
  clubMinAge: number;
  clubMaxAge: number;
  invitedOrEnrolled: boolean;
  guardianOrSchoolApproved: boolean;
  scope: ClubScope;
}

export interface CollaborationAction {
  actorRole: ClubRole;
  targetRole: ClubRole;
  kind: "club_post" | "project_comment" | "team_update" | "direct_message" | "contact_share";
  insideVerifiedClub: boolean;
}

export function canJoinClub(context: ClubAccessContext): boolean {
  return (
    context.age >= context.clubMinAge &&
    context.age <= context.clubMaxAge &&
    context.invitedOrEnrolled &&
    context.guardianOrSchoolApproved
  );
}

export function canPerformClubAction(action: CollaborationAction): boolean {
  if (!action.insideVerifiedClub) return false;
  if (action.kind === "direct_message" || action.kind === "contact_share") return false;

  if (action.actorRole === "child_member" && action.targetRole === "programme_facilitator") {
    return action.kind === "club_post" || action.kind === "project_comment" || action.kind === "team_update";
  }

  return true;
}

export function collaborationVisibility(): "club_members_and_moderators" {
  return "club_members_and_moderators";
}

export function childDirectoryEnabled(): false {
  return false;
}
