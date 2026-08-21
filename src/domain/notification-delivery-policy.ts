export type NotificationCategory =
  | "project_update"
  | "approval"
  | "deadline"
  | "achievement"
  | "club_update"
  | "security"
  | "safeguarding";

export type NotificationChannel = "in_app" | "push" | "email" | "sms";
export type RecipientKind = "child" | "parent" | "staff" | "alumni";

export const BLOCKED_ENGAGEMENT_PATTERNS = [
  "streak",
  "people miss you",
  "come back now",
  "trending among your friends",
  "most popular",
  "likes waiting",
] as const;

export const EXTERNAL_SAFE_COPY: Record<NotificationCategory, string> = {
  project_update: "Aurelia has a project update for you. Open the app securely to view it.",
  approval: "Aurelia has an approval that needs your attention. Sign in securely to review it.",
  deadline: "Aurelia has a deadline reminder. Open the app securely for details.",
  achievement: "There is a new achievement update in Aurelia. Open the app securely to view it.",
  club_update: "There is a new club update in Aurelia. Open the app securely to view it.",
  security: "Aurelia has an account security update. Sign in securely to review it.",
  safeguarding: "A safeguarding alert requires attention in Aurelia. Sign in securely to review it.",
};

export function channelAllowedForRecipient(channel: NotificationChannel, recipient: RecipientKind): boolean {
  if (recipient === "child" && channel === "sms") return false;
  if (recipient === "child" && channel === "email") return false;
  return true;
}

export function safeguardingDeliveryAllowed(recipient: RecipientKind): boolean {
  return recipient === "parent" || recipient === "staff";
}

export function mayBypassQuietHours(category: NotificationCategory, recipient: RecipientKind): boolean {
  if (recipient === "child") return false;
  return category === "safeguarding" || category === "security";
}

export function externalNotificationBody(category: NotificationCategory): string {
  return EXTERNAL_SAFE_COPY[category];
}

export function mayIncludeSensitiveDetailOutsideApp(): false {
  return false;
}

export function mayUseOpenOrClickTracking(recipient: RecipientKind): boolean {
  return recipient !== "child";
}

export function externalLinkMayContainSensitiveObjectId(): false {
  return false;
}

export function contentLooksLikeEngagementBait(content: string): boolean {
  const normalized = content.toLowerCase();
  return BLOCKED_ENGAGEMENT_PATTERNS.some((pattern) => normalized.includes(pattern));
}
