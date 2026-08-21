export type AbuseSurface =
  | "sign_in"
  | "password_reset"
  | "join_request"
  | "child_lookup"
  | "search"
  | "upload"
  | "feedback"
  | "challenge_submission"
  | "partner_api";

export type AbuseDecision = "allow" | "challenge" | "deny";

export interface AbuseContext {
  surface: AbuseSurface;
  attemptsInWindow: number;
  verifiedSession: boolean;
  suspiciousAutomation: boolean;
  accountEnumerationPattern: boolean;
  knownAbusiveSource: boolean;
}

const thresholds: Record<AbuseSurface, number> = {
  sign_in: 10,
  password_reset: 5,
  join_request: 5,
  child_lookup: 0,
  search: 60,
  upload: 30,
  feedback: 40,
  challenge_submission: 20,
  partner_api: 120,
};

export function abuseDecision(context: AbuseContext): AbuseDecision {
  if (context.surface === "child_lookup") return "deny";
  if (context.knownAbusiveSource || context.accountEnumerationPattern) return "deny";
  if (context.suspiciousAutomation) return "challenge";
  if (context.attemptsInWindow > thresholds[context.surface]) return "challenge";
  if (["upload", "feedback", "challenge_submission", "partner_api"].includes(context.surface) && !context.verifiedSession) return "deny";
  return "allow";
}

export function childAccountEnumerationAllowed(): false {
  return false;
}

export function rateLimitResponseMayRevealWhetherChildAccountExists(): false {
  return false;
}

export function botChallengeMayCollectBehaviouralAdvertisingData(): false {
  return false;
}

export function abuseLogsMayContainChildContent(): false {
  return false;
}

export function automatedBlockMayCloseSafeguardingCase(): false {
  return false;
}

export const ABUSE_PROTECTION_PRINCIPLES = [
  "There is no child-account lookup or public child-directory endpoint to rate limit in the first place.",
  "Authentication and recovery responses do not reveal whether a child account exists.",
  "Credential stuffing, enumeration, scraping and suspicious automation trigger challenge or denial.",
  "State-changing child actions require an authenticated verified session and bounded request rates.",
  "Bot protection cannot become behavioural advertising or cross-site child tracking.",
  "Abuse telemetry stores operational security signals, not child creative or safeguarding content.",
] as const;
