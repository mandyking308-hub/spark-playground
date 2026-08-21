export type OfflineAction =
  | "save_private_local_draft"
  | "publish_external"
  | "submit_permission_decision"
  | "submit_safeguarding_report"
  | "submit_challenge_entry"
  | "send_feedback"
  | "send_community_post"
  | "change_staff_grant";

const NETWORK_AUTHORITATIVE_ACTIONS: readonly OfflineAction[] = [
  "publish_external",
  "submit_permission_decision",
  "submit_safeguarding_report",
  "submit_challenge_entry",
  "send_feedback",
  "send_community_post",
  "change_staff_grant",
];

export function canQueueActionForBackgroundReplay(action: OfflineAction): boolean {
  return !NETWORK_AUTHORITATIVE_ACTIONS.includes(action);
}

export function canCacheNavigationResponse(pathname: string): boolean {
  const protectedPrefixes = ["/dashboard", "/alumni", "/auth", "/api", "/storage"];
  return !protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function canCacheStaticAsset(pathname: string): boolean {
  return pathname.startsWith("/assets/") || ["/favicon.ico", "/manifest.webmanifest", "/offline.html"].includes(pathname);
}

export function shouldShowOfflineReadOnlyState(isOnline: boolean): boolean {
  return !isOnline;
}
